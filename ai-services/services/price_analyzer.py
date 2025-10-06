"""
Price Analyzer Service
Analyzes collected price data and provides market insights
"""

import statistics
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from datetime import datetime, timedelta
import structlog

from .price_collector import PriceData

logger = structlog.get_logger()

@dataclass
class MarketInsight:
    """Market insight data structure"""
    product_name: str
    median_price: float
    average_price: float
    price_range: float
    market_volatility: float
    best_deal_ratio: float
    market_trend: str  # "stable", "rising", "falling"
    confidence_score: float
    data_quality: str  # "excellent", "good", "fair", "poor"
    recommendations: List[str]
    last_updated: datetime

class PriceAnalyzer:
    """Analyzes price data and provides market insights"""
    
    def __init__(self):
        """Initialize the price analyzer"""
        self.logger = logger.bind(service="price_analyzer")
        
        # Configuration
        self.min_price_samples = 3  # Minimum samples for reliable analysis
        self.outlier_threshold = 2.0  # Standard deviations for outlier detection
        self.volatility_thresholds = {
            "low": 0.1,      # < 10% volatility
            "medium": 0.25,  # 10-25% volatility
            "high": 0.5      # > 25% volatility
        }
        
        self.logger.info("Price analyzer initialized")
    
    def analyze_product_prices(self, product_name: str, prices: List[PriceData]) -> Optional[MarketInsight]:
        """
        Analyze prices for a single product
        
        Args:
            product_name: Name of the product
            prices: List of price data
            
        Returns:
            MarketInsight object or None if insufficient data
        """
        if len(prices) < self.min_price_samples:
            self.logger.warning("Insufficient price data", 
                              product=product_name,
                              price_count=len(prices))
            return None
        
        self.logger.info("Analyzing product prices", 
                        product=product_name,
                        price_count=len(prices))
        
        # Extract price values
        price_values = [p.price for p in prices]
        
        # Calculate basic statistics
        median_price = statistics.median(price_values)
        average_price = statistics.mean(price_values)
        min_price = min(price_values)
        max_price = max(price_values)
        price_range = max_price - min_price
        
        # Calculate market volatility (coefficient of variation)
        if average_price > 0:
            volatility = statistics.stdev(price_values) / average_price
        else:
            volatility = 0
        
        # Calculate best deal ratio (how much below median the best price is)
        best_deal_ratio = (median_price - min_price) / median_price if median_price > 0 else 0
        
        # Determine market trend (simplified)
        market_trend = self._determine_market_trend(prices)
        
        # Calculate confidence score
        confidence_score = self._calculate_confidence_score(prices, volatility)
        
        # Assess data quality
        data_quality = self._assess_data_quality(prices, volatility)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            median_price, volatility, best_deal_ratio, data_quality
        )
        
        insight = MarketInsight(
            product_name=product_name,
            median_price=median_price,
            average_price=average_price,
            price_range=price_range,
            market_volatility=volatility,
            best_deal_ratio=best_deal_ratio,
            market_trend=market_trend,
            confidence_score=confidence_score,
            data_quality=data_quality,
            recommendations=recommendations,
            last_updated=datetime.now()
        )
        
        self.logger.info("Price analysis completed", 
                        product=product_name,
                        median_price=median_price,
                        volatility=volatility,
                        confidence=confidence_score)
        
        return insight
    
    def _determine_market_trend(self, prices: List[PriceData]) -> str:
        """Determine market trend based on price data"""
        if len(prices) < 2:
            return "stable"
        
        # Sort by timestamp
        sorted_prices = sorted(prices, key=lambda x: x.timestamp)
        
        # Simple trend analysis based on price changes
        recent_prices = sorted_prices[-min(5, len(sorted_prices)):]
        older_prices = sorted_prices[:min(5, len(sorted_prices))]
        
        if len(recent_prices) >= 2 and len(older_prices) >= 2:
            recent_avg = statistics.mean([p.price for p in recent_prices])
            older_avg = statistics.mean([p.price for p in older_prices])
            
            change_ratio = (recent_avg - older_avg) / older_avg if older_avg > 0 else 0
            
            if change_ratio > 0.05:  # 5% increase
                return "rising"
            elif change_ratio < -0.05:  # 5% decrease
                return "falling"
        
        return "stable"
    
    def _calculate_confidence_score(self, prices: List[PriceData], volatility: float) -> float:
        """Calculate confidence score for the analysis"""
        # Base score from number of samples
        sample_score = min(len(prices) / 10, 1.0)  # Max score at 10+ samples
        
        # Volatility penalty
        volatility_penalty = min(volatility, 0.5)  # Max penalty at 50% volatility
        
        # Source diversity bonus
        unique_sources = len(set(p.source for p in prices))
        source_bonus = min(unique_sources / 3, 0.2)  # Max bonus for 3+ sources
        
        # Data freshness bonus
        now = datetime.now()
        recent_prices = [p for p in prices if (now - p.timestamp).days <= 7]
        freshness_bonus = len(recent_prices) / len(prices) * 0.3
        
        # Calculate final score
        confidence = sample_score - volatility_penalty + source_bonus + freshness_bonus
        
        return max(0, min(1, confidence))  # Clamp between 0 and 1
    
    def _assess_data_quality(self, prices: List[PriceData], volatility: float) -> str:
        """Assess the quality of price data"""
        score = self._calculate_confidence_score(prices, volatility)
        
        if score >= 0.8:
            return "excellent"
        elif score >= 0.6:
            return "good"
        elif score >= 0.4:
            return "fair"
        else:
            return "poor"
    
    def _generate_recommendations(self, median_price: float, volatility: float, 
                                best_deal_ratio: float, data_quality: str) -> List[str]:
        """Generate market recommendations based on analysis"""
        recommendations = []
        
        # Volatility-based recommendations
        if volatility > self.volatility_thresholds["high"]:
            recommendations.append("Wysoka zmienność cen - rozważ czekanie na lepszą okazję")
        elif volatility < self.volatility_thresholds["low"]:
            recommendations.append("Stabilne ceny - dobry czas na zakup")
        
        # Deal ratio recommendations
        if best_deal_ratio > 0.3:
            recommendations.append("Dostępne są bardzo dobre oferty - sprawdź najtańsze opcje")
        elif best_deal_ratio < 0.1:
            recommendations.append("Mała różnica w cenach - wybierz sprawdzonego sprzedawcę")
        
        # Data quality recommendations
        if data_quality == "poor":
            recommendations.append("Ograniczone dane cenowe - rozważ dodatkowe źródła")
        elif data_quality == "excellent":
            recommendations.append("Wysokiej jakości dane cenowe - analiza wiarygodna")
        
        # Price level recommendations
        if median_price > 1000:
            recommendations.append("Wysoka wartość produktu - dokładnie sprawdź sprzedawcę")
        elif median_price < 100:
            recommendations.append("Niska wartość - skup się na dostępności i szybkości dostawy")
        
        return recommendations
    
    def analyze_multiple_products(self, price_data: Dict[str, List[PriceData]]) -> Dict[str, MarketInsight]:
        """
        Analyze prices for multiple products
        
        Args:
            price_data: Dictionary mapping product names to price lists
            
        Returns:
            Dictionary mapping product names to MarketInsight objects
        """
        self.logger.info("Starting batch price analysis", 
                        product_count=len(price_data))
        
        insights = {}
        
        for product_name, prices in price_data.items():
            insight = self.analyze_product_prices(product_name, prices)
            if insight:
                insights[product_name] = insight
        
        self.logger.info("Batch price analysis completed", 
                        insights_generated=len(insights))
        
        return insights
    
    def get_market_summary(self, insights: Dict[str, MarketInsight]) -> Dict[str, Any]:
        """Generate market summary from multiple product insights"""
        if not insights:
            return {"message": "No market insights available"}
        
        # Aggregate statistics
        all_volatilities = [insight.market_volatility for insight in insights.values()]
        all_confidences = [insight.confidence_score for insight in insights.values()]
        all_deal_ratios = [insight.best_deal_ratio for insight in insights.values()]
        
        # Market trends
        trends = [insight.market_trend for insight in insights.values()]
        trend_counts = {trend: trends.count(trend) for trend in set(trends)}
        
        # Data quality
        qualities = [insight.data_quality for insight in insights.values()]
        quality_counts = {quality: qualities.count(quality) for quality in set(qualities)}
        
        # Top opportunities (highest deal ratios)
        opportunities = sorted(insights.items(), 
                             key=lambda x: x[1].best_deal_ratio, 
                             reverse=True)[:5]
        
        # High volatility products
        high_volatility = [(name, insight) for name, insight in insights.items() 
                          if insight.market_volatility > self.volatility_thresholds["high"]]
        
        return {
            "total_products_analyzed": len(insights),
            "average_volatility": statistics.mean(all_volatilities) if all_volatilities else 0,
            "average_confidence": statistics.mean(all_confidences) if all_confidences else 0,
            "average_deal_ratio": statistics.mean(all_deal_ratios) if all_deal_ratios else 0,
            "market_trends": trend_counts,
            "data_quality_distribution": quality_counts,
            "top_opportunities": [
                {
                    "product": name,
                    "deal_ratio": insight.best_deal_ratio,
                    "median_price": insight.median_price
                }
                for name, insight in opportunities
            ],
            "high_volatility_products": [
                {
                    "product": name,
                    "volatility": insight.market_volatility,
                    "trend": insight.market_trend
                }
                for name, insight in high_volatility
            ],
            "analysis_timestamp": datetime.now().isoformat()
        }
    
    def compare_prices(self, prices1: List[PriceData], prices2: List[PriceData]) -> Dict[str, Any]:
        """Compare two sets of prices (e.g., different time periods)"""
        if not prices1 or not prices2:
            return {"error": "Insufficient data for comparison"}
        
        median1 = statistics.median([p.price for p in prices1])
        median2 = statistics.median([p.price for p in prices2])
        
        price_change = median2 - median1
        price_change_percent = (price_change / median1) * 100 if median1 > 0 else 0
        
        return {
            "period1_median": median1,
            "period2_median": median2,
            "price_change": price_change,
            "price_change_percent": price_change_percent,
            "trend": "rising" if price_change > 0 else "falling" if price_change < 0 else "stable",
            "period1_count": len(prices1),
            "period2_count": len(prices2)
        }
