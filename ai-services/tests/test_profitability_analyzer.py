"""
Tests for Profitability Analyzer Service
"""

import pytest
import sys
from pathlib import Path

# Add the parent directory to the path so we can import our modules
sys.path.append(str(Path(__file__).parent.parent))

from services.profitability_analyzer import ProfitabilityAnalyzer

class TestProfitabilityAnalyzer:
    """Test cases for ProfitabilityAnalyzer"""
    
    def setup_method(self):
        """Set up test fixtures"""
        self.analyzer = ProfitabilityAnalyzer()
    
    def test_apple_iphone_analysis(self):
        """Test Apple iPhone profitability analysis"""
        result = self.analyzer.analyze_product("Apple", "Elektronika/Telefony", "iPhone 15 Pro")
        
        assert result["score"] >= 80  # Apple + Electronics should be high
        assert result["risk_level"] == "low"
        assert result["recommendation"] == "YES"
        assert result["estimated_roi"] >= 15
    
    def test_generic_product_analysis(self):
        """Test generic/unknown product analysis"""
        result = self.analyzer.analyze_product("Generic", "Inne/Inne", "Unknown Product")
        
        assert result["score"] <= 60  # Generic should be lower
        assert result["risk_level"] in ["medium", "high"]
        assert result["recommendation"] in ["CAUTION", "NO"]
    
    def test_samsung_electronics_analysis(self):
        """Test Samsung electronics analysis"""
        result = self.analyzer.analyze_product("Samsung", "Elektronika/Telefony", "Galaxy S23")
        
        assert result["score"] >= 75  # Samsung + Electronics should be high
        assert result["risk_level"] == "low"
        assert result["recommendation"] == "YES"
    
    def test_nike_clothing_analysis(self):
        """Test Nike clothing analysis"""
        result = self.analyzer.analyze_product("Nike", "Odzież/Obuwie", "Air Max")
        
        assert result["score"] >= 80  # Nike + Shoes should be high
        assert result["risk_level"] == "low"
        assert result["recommendation"] == "YES"
    
    def test_loreal_cosmetics_analysis(self):
        """Test L'Oréal cosmetics analysis"""
        result = self.analyzer.analyze_product("L'Oréal", "Kosmetyki/Twarz", "Foundation")
        
        assert result["score"] >= 80  # L'Oréal + Cosmetics should be high
        assert result["risk_level"] == "low"
        assert result["recommendation"] == "YES"
    
    def test_unknown_brand_analysis(self):
        """Test unknown brand analysis"""
        result = self.analyzer.analyze_product("Unknown", "Elektronika/Telefony", "Unknown Model")
        
        assert result["score"] <= 70  # Unknown brand should be lower
        assert result["risk_level"] == "high"
        assert result["recommendation"] in ["CAUTION", "NO"]
    
    def test_risk_level_determination(self):
        """Test risk level determination logic"""
        # High score + known brand + stable category = low risk
        result1 = self.analyzer.analyze_product("Apple", "Elektronika/Telefony", "iPhone")
        assert result1["risk_level"] == "low"
        
        # Medium score + unknown brand = high risk
        result2 = self.analyzer.analyze_product("Unknown", "Elektronika/Telefony", "Unknown")
        assert result2["risk_level"] == "high"
        
        # Low score = high risk regardless of brand
        result3 = self.analyzer.analyze_product("Apple", "Inne/Inne", "Unknown")
        assert result3["risk_level"] in ["medium", "high"]
    
    def test_recommendation_generation(self):
        """Test recommendation generation logic"""
        # High score + low risk = YES
        result1 = self.analyzer.analyze_product("Apple", "Elektronika/Telefony", "iPhone")
        assert result1["recommendation"] == "YES"
        
        # Medium score + low risk = YES
        result2 = self.analyzer.analyze_product("Samsung", "Elektronika/Telefony", "Galaxy")
        assert result2["recommendation"] == "YES"
        
        # Medium score + medium risk = CAUTION
        result3 = self.analyzer.analyze_product("LG", "Elektronika/Telefony", "G Series")
        assert result3["recommendation"] in ["YES", "CAUTION"]
        
        # Low score = NO
        result4 = self.analyzer.analyze_product("Unknown", "Inne/Inne", "Unknown")
        assert result4["recommendation"] == "NO"
    
    def test_roi_calculation(self):
        """Test ROI calculation"""
        # High profitability should have good ROI
        result = self.analyzer.analyze_product("Apple", "Elektronika/Telefony", "iPhone")
        assert result["estimated_roi"] >= 15
        
        # Low profitability should have poor ROI
        result2 = self.analyzer.analyze_product("Unknown", "Inne/Inne", "Unknown")
        assert result2["estimated_roi"] <= 10
    
    def test_category_profitability_data(self):
        """Test category profitability data access"""
        electronics_data = self.analyzer.get_category_profitability_data("Elektronika/Telefony")
        assert electronics_data["base_score"] >= 80
        assert electronics_data["market_demand"] == "high"
        
        unknown_data = self.analyzer.get_category_profitability_data("Inne/Inne")
        assert unknown_data["base_score"] <= 60
    
    def test_brand_reputation_data(self):
        """Test brand reputation data access"""
        apple_data = self.analyzer.get_brand_reputation_data("Apple")
        assert apple_data["reputation_score"] >= 90
        assert apple_data["risk_level"] == "low"
        
        unknown_data = self.analyzer.get_brand_reputation_data("Unknown")
        assert unknown_data["reputation_score"] <= 40
        assert unknown_data["risk_level"] == "high"
    
    def test_available_categories(self):
        """Test getting available categories"""
        categories = self.analyzer.get_available_categories()
        assert isinstance(categories, list)
        assert "Elektronika/Telefony" in categories
        assert "Odzież/Obuwie" in categories
        assert "Kosmetyki/Twarz" in categories
    
    def test_score_bounds(self):
        """Test that scores are within valid bounds"""
        test_cases = [
            ("Apple", "Elektronika/Telefony", "iPhone"),
            ("Samsung", "Elektronika/Telefony", "Galaxy"),
            ("Nike", "Odzież/Obuwie", "Air Max"),
            ("Unknown", "Inne/Inne", "Unknown"),
            ("Generic", "Inne/Inne", "Generic")
        ]
        
        for brand, category, model in test_cases:
            result = self.analyzer.analyze_product(brand, category, model)
            assert 0 <= result["score"] <= 100
            assert 0 <= result["estimated_roi"] <= 50

if __name__ == "__main__":
    pytest.main([__file__])
