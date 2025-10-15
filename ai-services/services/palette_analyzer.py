"""
Palette Analyzer Service
Analyzes entire palettes for profitability and risk assessment
"""

from typing import Dict, List, Any
import statistics
import structlog
from .cache_manager import cache_manager

logger = structlog.get_logger()

class PaletteAnalyzer:
    def __init__(self):
        """Initialize the palette analyzer"""
        self.logger = logger.bind(service="palette_analyzer")
        self.logger.info("Palette analyzer initialized")
    
    def analyze_palette(self, product_analyses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze entire palette for profitability and risk with caching
        
        Args:
            product_analyses: List of product analysis results
            
        Returns:
            Dict with palette analysis
        """
        self.logger.info("Analyzing palette", product_count=len(product_analyses))
        
        if not product_analyses:
            return self._empty_analysis()
        
        # Create cache key from product list
        product_names = [p.get("original_name", "") for p in product_analyses]
        
        # Check cache first
        cached_result = cache_manager.get_cached_palette_analysis(product_names)
        if cached_result:
            self.logger.info("Palette analysis served from cache", product_count=len(product_analyses))
            return cached_result
        
        # Calculate aggregate metrics
        profitability_scores = [p.get("profitability_score", 0) for p in product_analyses]
        risk_levels = [p.get("risk_level", "unknown") for p in product_analyses]
        recommendations = [p.get("recommendation", "NO") for p in product_analyses]
        
        # Calculate averages and counts
        average_profitability = statistics.mean(profitability_scores) if profitability_scores else 0
        high_risk_count = risk_levels.count("high")
        medium_risk_count = risk_levels.count("medium")
        low_risk_count = risk_levels.count("low")
        
        # Analyze categories
        categories = [p.get("category", "Unknown") for p in product_analyses]
        category_distribution = self._analyze_categories(categories, profitability_scores)
        recommended_categories = self._get_recommended_categories(category_distribution)
        
        # Generate overall recommendation
        buy_recommendation = self._generate_palette_recommendation(
            average_profitability, high_risk_count, len(product_analyses)
        )
        
        # Assess overall risk
        risk_assessment = self._assess_palette_risk(
            high_risk_count, medium_risk_count, len(product_analyses)
        )
        
        # Calculate estimated ROI for entire palette
        estimated_roi = self._calculate_palette_roi(
            average_profitability, risk_assessment, category_distribution
        )
        
        result = {
            "average_profitability": round(average_profitability, 1),
            "high_risk_count": high_risk_count,
            "medium_risk_count": medium_risk_count,
            "low_risk_count": low_risk_count,
            "recommended_categories": recommended_categories,
            "buy_recommendation": buy_recommendation,
            "risk_assessment": risk_assessment,
            "estimated_roi": round(estimated_roi, 1),
            "category_distribution": category_distribution,
            "total_products": len(product_analyses),
            "profitability_distribution": self._analyze_profitability_distribution(profitability_scores)
        }
        
        # Cache the result
        cache_manager.cache_palette_analysis(product_names, result)
        
        self.logger.info("Palette analysis completed",
                        average_profitability=average_profitability,
                        high_risk_count=high_risk_count,
                        recommendation=buy_recommendation,
                        estimated_roi=estimated_roi)
        
        return result
    
    def _analyze_categories(self, categories: List[str], scores: List[int]) -> Dict[str, Dict[str, Any]]:
        """Analyze category distribution and performance"""
        category_stats = {}
        
        for category, score in zip(categories, scores):
            if category not in category_stats:
                category_stats[category] = {
                    "count": 0,
                    "total_score": 0,
                    "scores": []
                }
            
            category_stats[category]["count"] += 1
            category_stats[category]["total_score"] += score
            category_stats[category]["scores"].append(score)
        
        # Calculate averages
        for category, stats in category_stats.items():
            stats["average_score"] = round(stats["total_score"] / stats["count"], 1)
            stats["percentage"] = round((stats["count"] / len(categories)) * 100, 1)
        
        return category_stats
    
    def _get_recommended_categories(self, category_distribution: Dict[str, Dict[str, Any]]) -> List[str]:
        """Get categories with high profitability"""
        recommended = []
        
        for category, stats in category_distribution.items():
            # Recommend categories with high average score and significant presence
            if (stats["average_score"] >= 75 and 
                stats["percentage"] >= 10):  # At least 10% of palette
                recommended.append(category)
        
        return recommended
    
    def _generate_palette_recommendation(self, avg_score: float, high_risk_count: int, total_count: int) -> str:
        """Generate overall palette recommendation"""
        high_risk_percentage = (high_risk_count / total_count) * 100 if total_count > 0 else 0
        
        # Strong buy conditions
        if avg_score >= 80 and high_risk_percentage <= 10:
            return "YES"
        
        # Buy conditions
        if avg_score >= 70 and high_risk_percentage <= 20:
            return "YES"
        
        # Caution conditions
        if avg_score >= 60 and high_risk_percentage <= 30:
            return "CAUTION"
        
        # No buy conditions
        return "NO"
    
    def _assess_palette_risk(self, high_risk: int, medium_risk: int, total: int) -> str:
        """Assess overall palette risk level"""
        if total == 0:
            return "unknown"
        
        high_risk_percentage = (high_risk / total) * 100
        medium_risk_percentage = (medium_risk / total) * 100
        
        if high_risk_percentage >= 30:
            return "HIGH"
        elif high_risk_percentage >= 15 or medium_risk_percentage >= 50:
            return "MEDIUM"
        else:
            return "LOW"
    
    def _calculate_palette_roi(self, avg_score: float, risk_assessment: str, 
                              category_distribution: Dict[str, Dict[str, Any]]) -> float:
        """Calculate estimated ROI for entire palette"""
        # Base ROI from average score
        base_roi = (avg_score - 50) * 0.4  # 0-20% range
        
        # Risk adjustments
        if risk_assessment == "HIGH":
            base_roi -= 8
        elif risk_assessment == "MEDIUM":
            base_roi -= 3
        # LOW risk gets no penalty
        
        # Category diversification bonus
        category_count = len(category_distribution)
        if category_count >= 5:
            base_roi += 3  # Diversification bonus
        elif category_count >= 3:
            base_roi += 1
        
        # High-performing category bonus
        high_performing_categories = sum(1 for stats in category_distribution.values() 
                                       if stats["average_score"] >= 80 and stats["percentage"] >= 20)
        base_roi += high_performing_categories * 2
        
        return max(0, min(40, base_roi))  # Cap between 0-40%
    
    def _analyze_profitability_distribution(self, scores: List[int]) -> Dict[str, int]:
        """Analyze distribution of profitability scores"""
        if not scores:
            return {}
        
        excellent = sum(1 for score in scores if score >= 85)
        good = sum(1 for score in scores if 70 <= score < 85)
        average = sum(1 for score in scores if 55 <= score < 70)
        poor = sum(1 for score in scores if score < 55)
        
        return {
            "excellent": excellent,
            "good": good,
            "average": average,
            "poor": poor
        }
    
    def _empty_analysis(self) -> Dict[str, Any]:
        """Return empty analysis for empty palette"""
        return {
            "average_profitability": 0,
            "high_risk_count": 0,
            "medium_risk_count": 0,
            "low_risk_count": 0,
            "recommended_categories": [],
            "buy_recommendation": "NO",
            "risk_assessment": "UNKNOWN",
            "estimated_roi": 0,
            "category_distribution": {},
            "total_products": 0,
            "profitability_distribution": {}
        }
    
    def log_analysis_results(self, original_products: List[str], 
                           product_analyses: List[Dict[str, Any]], 
                           palette_analysis: Dict[str, Any]):
        """Log analysis results for learning (background task)"""
        try:
            self.logger.info("Logging palette analysis for learning",
                           original_products_count=len(original_products),
                           average_profitability=palette_analysis["average_profitability"],
                           recommendation=palette_analysis["buy_recommendation"])
            
            # Here you would typically save to database for learning
            # For now, just log the results
            learning_data = {
                "timestamp": "2025-01-01T00:00:00Z",  # Would use actual timestamp
                "original_products": original_products,
                "product_analyses": product_analyses,
                "palette_analysis": palette_analysis
            }
            
            # TODO: Save to database for future model training
            self.logger.info("Analysis logged for learning", data_size=len(str(learning_data)))
            
        except Exception as e:
            self.logger.error("Error logging analysis results", error=str(e))
    
    def get_palette_summary(self, palette_analysis: Dict[str, Any]) -> str:
        """Generate human-readable palette summary"""
        avg_score = palette_analysis["average_profitability"]
        recommendation = palette_analysis["buy_recommendation"]
        risk = palette_analysis["risk_assessment"]
        roi = palette_analysis["estimated_roi"]
        high_risk_count = palette_analysis["high_risk_count"]
        total = palette_analysis["total_products"]
        
        summary_parts = [
            f"Średnia rentowność: {avg_score}/100",
            f"Rekomendacja: {recommendation}",
            f"Poziom ryzyka: {risk}",
            f"Szacowany ROI: {roi}%"
        ]
        
        if high_risk_count > 0:
            summary_parts.append(f"Produkty wysokiego ryzyka: {high_risk_count}/{total}")
        
        return " | ".join(summary_parts)
