"""
Profitability Analyzer Service
Analyzes product profitability and risk based on category and brand
"""

import json
from typing import Dict, List, Any, Optional
from pathlib import Path
import structlog

logger = structlog.get_logger()

class ProfitabilityAnalyzer:
    def __init__(self):
        """Initialize the profitability analyzer with business data"""
        self.logger = logger.bind(service="profitability_analyzer")
        
        # Load profitability data
        self.category_profitability = self._load_category_profitability()
        self.brand_reputation = self._load_brand_reputation()
        self.seasonal_factors = self._load_seasonal_factors()
        self.risk_factors = self._load_risk_factors()
        
        self.logger.info("Profitability analyzer initialized",
                        categories_count=len(self.category_profitability),
                        brands_count=len(self.brand_reputation))
    
    def _load_category_profitability(self) -> Dict[str, Dict[str, Any]]:
        """Load profitability data by category"""
        return {
            "Elektronika/Telefony": {
                "base_score": 85,
                "market_demand": "high",
                "price_stability": "medium",
                "competition": "high",
                "seasonal_factor": 1.1,  # Higher demand during holidays
                "risk_factors": ["technology_change", "price_drops"]
            },
            "Elektronika/Laptopy": {
                "base_score": 80,
                "market_demand": "high",
                "price_stability": "medium",
                "competition": "high",
                "seasonal_factor": 1.2,
                "risk_factors": ["technology_change", "long_sales_cycle"]
            },
            "Elektronika/Słuchawki": {
                "base_score": 75,
                "market_demand": "medium",
                "price_stability": "high",
                "competition": "medium",
                "seasonal_factor": 1.0,
                "risk_factors": ["brand_dependency"]
            },
            "Elektronika/Telewizory": {
                "base_score": 70,
                "market_demand": "medium",
                "price_stability": "low",
                "competition": "high",
                "seasonal_factor": 1.3,
                "risk_factors": ["large_inventory", "price_drops"]
            },
            "Elektronika/Kamery": {
                "base_score": 65,
                "market_demand": "low",
                "price_stability": "medium",
                "competition": "medium",
                "seasonal_factor": 0.9,
                "risk_factors": ["niche_market", "technology_change"]
            },
            "Odzież/Męska": {
                "base_score": 70,
                "market_demand": "high",
                "price_stability": "high",
                "competition": "high",
                "seasonal_factor": 1.0,
                "risk_factors": ["seasonal", "size_variations"]
            },
            "Odzież/Damska": {
                "base_score": 75,
                "market_demand": "high",
                "price_stability": "medium",
                "competition": "high",
                "seasonal_factor": 1.1,
                "risk_factors": ["fashion_trends", "seasonal"]
            },
            "Odzież/Obuwie": {
                "base_score": 80,
                "market_demand": "high",
                "price_stability": "high",
                "competition": "medium",
                "seasonal_factor": 1.0,
                "risk_factors": ["size_variations", "seasonal"]
            },
            "Kosmetyki/Twarz": {
                "base_score": 85,
                "market_demand": "high",
                "price_stability": "high",
                "competition": "medium",
                "seasonal_factor": 1.0,
                "risk_factors": ["expiration_dates", "skin_sensitivity"]
            },
            "Kosmetyki/Włosy": {
                "base_score": 80,
                "market_demand": "high",
                "price_stability": "high",
                "competition": "medium",
                "seasonal_factor": 1.0,
                "risk_factors": ["expiration_dates"]
            },
            "Dom i Ogród": {
                "base_score": 60,
                "market_demand": "medium",
                "price_stability": "high",
                "competition": "low",
                "seasonal_factor": 0.8,
                "risk_factors": ["large_items", "shipping_costs"]
            },
            "Sport i Rekreacja": {
                "base_score": 70,
                "market_demand": "medium",
                "price_stability": "medium",
                "competition": "medium",
                "seasonal_factor": 1.2,
                "risk_factors": ["seasonal", "size_variations"]
            },
            "Inne/Inne": {
                "base_score": 50,
                "market_demand": "unknown",
                "price_stability": "unknown",
                "competition": "unknown",
                "seasonal_factor": 1.0,
                "risk_factors": ["unknown_category"]
            }
        }
    
    def _load_brand_reputation(self) -> Dict[str, Dict[str, Any]]:
        """Load brand reputation and reliability data"""
        return {
            "Apple": {
                "reputation_score": 95,
                "market_demand": "very_high",
                "price_stability": "very_high",
                "resale_value": "very_high",
                "risk_level": "low"
            },
            "Samsung": {
                "reputation_score": 90,
                "market_demand": "high",
                "price_stability": "high",
                "resale_value": "high",
                "risk_level": "low"
            },
            "Sony": {
                "reputation_score": 85,
                "market_demand": "high",
                "price_stability": "high",
                "resale_value": "high",
                "risk_level": "low"
            },
            "LG": {
                "reputation_score": 80,
                "market_demand": "medium",
                "price_stability": "medium",
                "resale_value": "medium",
                "risk_level": "medium"
            },
            "Huawei": {
                "reputation_score": 75,
                "market_demand": "medium",
                "price_stability": "medium",
                "resale_value": "medium",
                "risk_level": "medium"
            },
            "Xiaomi": {
                "reputation_score": 70,
                "market_demand": "high",
                "price_stability": "low",
                "resale_value": "low",
                "risk_level": "medium"
            },
            "OnePlus": {
                "reputation_score": 75,
                "market_demand": "medium",
                "price_stability": "medium",
                "resale_value": "medium",
                "risk_level": "medium"
            },
            "Nike": {
                "reputation_score": 90,
                "market_demand": "very_high",
                "price_stability": "high",
                "resale_value": "high",
                "risk_level": "low"
            },
            "Adidas": {
                "reputation_score": 85,
                "market_demand": "high",
                "price_stability": "high",
                "resale_value": "high",
                "risk_level": "low"
            },
            "Zara": {
                "reputation_score": 80,
                "market_demand": "high",
                "price_stability": "medium",
                "resale_value": "low",
                "risk_level": "medium"
            },
            "H&M": {
                "reputation_score": 75,
                "market_demand": "high",
                "price_stability": "low",
                "resale_value": "low",
                "risk_level": "medium"
            },
            "L'Oréal": {
                "reputation_score": 85,
                "market_demand": "high",
                "price_stability": "high",
                "resale_value": "medium",
                "risk_level": "low"
            },
            "Maybelline": {
                "reputation_score": 80,
                "market_demand": "high",
                "price_stability": "high",
                "resale_value": "medium",
                "risk_level": "low"
            },
            "Generic": {
                "reputation_score": 40,
                "market_demand": "unknown",
                "price_stability": "unknown",
                "resale_value": "low",
                "risk_level": "high"
            },
            "Unknown": {
                "reputation_score": 30,
                "market_demand": "unknown",
                "price_stability": "unknown",
                "resale_value": "low",
                "risk_level": "high"
            }
        }
    
    def _load_seasonal_factors(self) -> Dict[str, float]:
        """Load seasonal demand factors"""
        return {
            "holiday_season": 1.3,  # December
            "back_to_school": 1.2,  # September
            "summer": 1.1,  # June-August
            "winter": 0.9,  # January-March
            "spring": 1.0,  # April-May
            "fall": 1.0   # October-November
        }
    
    def _load_risk_factors(self) -> Dict[str, Dict[str, Any]]:
        """Load risk factor definitions"""
        return {
            "technology_change": {
                "impact": "high",
                "description": "Product may become obsolete quickly"
            },
            "price_drops": {
                "impact": "high",
                "description": "Prices may decrease significantly"
            },
            "competition": {
                "impact": "medium",
                "description": "High competition affects margins"
            },
            "seasonal": {
                "impact": "medium",
                "description": "Demand varies by season"
            },
            "size_variations": {
                "impact": "medium",
                "description": "Multiple sizes increase inventory risk"
            },
            "expiration_dates": {
                "impact": "high",
                "description": "Products may expire before sale"
            },
            "fashion_trends": {
                "impact": "high",
                "description": "Trends change quickly"
            },
            "unknown_category": {
                "impact": "high",
                "description": "Unknown market characteristics"
            },
            "unknown_brand": {
                "impact": "high",
                "description": "Unknown brand reputation"
            }
        }
    
    def analyze_product(self, brand: str, category: str, model: str = "") -> Dict[str, Any]:
        """
        Analyze product profitability and risk
        
        Args:
            brand: Product brand
            category: Product category
            model: Product model (optional)
            
        Returns:
            Dict with profitability analysis
        """
        self.logger.info("Analyzing product profitability",
                        brand=brand, category=category, model=model)
        
        # Get category data
        category_data = self.category_profitability.get(category, 
                                                       self.category_profitability["Inne/Inne"])
        
        # Get brand data
        brand_data = self.brand_reputation.get(brand, 
                                             self.brand_reputation["Unknown"])
        
        # Calculate base profitability score
        base_score = category_data["base_score"]
        brand_score = brand_data["reputation_score"]
        
        # Calculate weighted score (70% category, 30% brand)
        profitability_score = int((base_score * 0.7) + (brand_score * 0.3))
        
        # Apply seasonal factor (simplified - could be more sophisticated)
        seasonal_factor = category_data.get("seasonal_factor", 1.0)
        profitability_score = int(profitability_score * seasonal_factor)
        
        # Ensure score is within bounds
        profitability_score = max(0, min(100, profitability_score))
        
        # Determine risk level
        risk_level = self._determine_risk_level(brand, category, profitability_score)
        
        # Generate recommendation
        recommendation = self._generate_recommendation(profitability_score, risk_level)
        
        # Calculate estimated ROI
        estimated_roi = self._calculate_estimated_roi(profitability_score, category)
        
        result = {
            "score": profitability_score,
            "risk_level": risk_level,
            "recommendation": recommendation,
            "estimated_roi": estimated_roi,
            "category_score": base_score,
            "brand_score": brand_score,
            "risk_factors": category_data.get("risk_factors", []),
            "market_demand": brand_data.get("market_demand", "unknown"),
            "price_stability": brand_data.get("price_stability", "unknown")
        }
        
        self.logger.info("Product profitability analyzed",
                        brand=brand, category=category,
                        score=profitability_score, risk_level=risk_level,
                        recommendation=recommendation)
        
        return result
    
    def _determine_risk_level(self, brand: str, category: str, score: int) -> str:
        """Determine risk level based on brand, category and score"""
        # Base risk from brand
        brand_risk = self.brand_reputation.get(brand, self.brand_reputation["Unknown"])["risk_level"]
        
        # Base risk from category
        category_risk_factors = self.category_profitability.get(category, {}).get("risk_factors", [])
        high_risk_factors = ["technology_change", "price_drops", "fashion_trends", "unknown_category"]
        
        category_risk = "low"
        if any(factor in high_risk_factors for factor in category_risk_factors):
            category_risk = "high"
        elif len(category_risk_factors) > 2:
            category_risk = "medium"
        
        # Score-based risk
        if score >= 80:
            score_risk = "low"
        elif score >= 60:
            score_risk = "medium"
        else:
            score_risk = "high"
        
        # Combine risks (highest risk wins)
        risks = [brand_risk, category_risk, score_risk]
        if "high" in risks:
            return "high"
        elif "medium" in risks:
            return "medium"
        else:
            return "low"
    
    def _generate_recommendation(self, score: int, risk_level: str) -> str:
        """Generate purchase recommendation"""
        if score >= 80 and risk_level == "low":
            return "YES"
        elif score >= 70 and risk_level in ["low", "medium"]:
            return "YES"
        elif score >= 60 and risk_level == "low":
            return "CAUTION"
        elif score >= 50 and risk_level in ["low", "medium"]:
            return "CAUTION"
        else:
            return "NO"
    
    def _calculate_estimated_roi(self, score: int, category: str) -> float:
        """Calculate estimated ROI percentage"""
        # Base ROI from score
        base_roi = (score - 50) * 0.5  # 0-25% range
        
        # Category adjustments
        category_data = self.category_profitability.get(category, {})
        if category_data.get("market_demand") == "very_high":
            base_roi += 5
        elif category_data.get("market_demand") == "high":
            base_roi += 2
        elif category_data.get("market_demand") == "low":
            base_roi -= 5
        
        # Price stability adjustments
        if category_data.get("price_stability") == "very_high":
            base_roi += 3
        elif category_data.get("price_stability") == "low":
            base_roi -= 3
        
        return max(0, min(50, base_roi))  # Cap between 0-50%
    
    def get_available_categories(self) -> List[str]:
        """Get list of available categories"""
        return list(self.category_profitability.keys())
    
    def get_category_profitability_data(self, category: str) -> Dict[str, Any]:
        """Get profitability data for specific category"""
        return self.category_profitability.get(category, {})
    
    def get_brand_reputation_data(self, brand: str) -> Dict[str, Any]:
        """Get reputation data for specific brand"""
        return self.brand_reputation.get(brand, {})
