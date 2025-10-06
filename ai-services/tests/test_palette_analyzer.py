"""
Tests for Palette Analyzer Service
"""

import pytest
import sys
from pathlib import Path

# Add the parent directory to the path so we can import our modules
sys.path.append(str(Path(__file__).parent.parent))

from services.palette_analyzer import PaletteAnalyzer

class TestPaletteAnalyzer:
    """Test cases for PaletteAnalyzer"""
    
    def setup_method(self):
        """Set up test fixtures"""
        self.analyzer = PaletteAnalyzer()
    
    def create_sample_product_analysis(self, score: int, risk_level: str, recommendation: str, 
                                     brand: str = "TestBrand", category: str = "TestCategory"):
        """Helper method to create sample product analysis"""
        return {
            "original_name": f"Test Product {score}",
            "normalized_name": f"{brand} Test Model",
            "brand": brand,
            "model": "Test Model",
            "category": category,
            "profitability_score": score,
            "risk_level": risk_level,
            "confidence": 0.8,
            "recommendation": recommendation
        }
    
    def test_high_quality_palette_analysis(self):
        """Test analysis of high-quality palette"""
        products = [
            self.create_sample_product_analysis(90, "low", "YES", "Apple", "Elektronika/Telefony"),
            self.create_sample_product_analysis(85, "low", "YES", "Samsung", "Elektronika/Telefony"),
            self.create_sample_product_analysis(80, "medium", "YES", "Nike", "Odzież/Obuwie"),
            self.create_sample_product_analysis(88, "low", "YES", "L'Oréal", "Kosmetyki/Twarz"),
        ]
        
        result = self.analyzer.analyze_palette(products)
        
        assert result["average_profitability"] >= 80
        assert result["high_risk_count"] == 0
        assert result["buy_recommendation"] == "YES"
        assert result["risk_assessment"] == "LOW"
        assert result["estimated_roi"] >= 15
        assert result["total_products"] == 4
    
    def test_mixed_risk_palette_analysis(self):
        """Test analysis of mixed risk palette"""
        products = [
            self.create_sample_product_analysis(75, "low", "YES", "Samsung", "Elektronika/Telefony"),
            self.create_sample_product_analysis(65, "medium", "CAUTION", "LG", "Elektronika/Telefony"),
            self.create_sample_product_analysis(55, "high", "NO", "Unknown", "Inne/Inne"),
            self.create_sample_product_analysis(70, "low", "YES", "Nike", "Odzież/Obuwie"),
        ]
        
        result = self.analyzer.analyze_palette(products)
        
        assert 60 <= result["average_profitability"] <= 75
        assert result["high_risk_count"] == 1
        assert result["buy_recommendation"] in ["YES", "CAUTION"]
        assert result["risk_assessment"] in ["LOW", "MEDIUM"]
        assert result["total_products"] == 4
    
    def test_high_risk_palette_analysis(self):
        """Test analysis of high-risk palette"""
        products = [
            self.create_sample_product_analysis(40, "high", "NO", "Unknown", "Inne/Inne"),
            self.create_sample_product_analysis(35, "high", "NO", "Generic", "Inne/Inne"),
            self.create_sample_product_analysis(45, "high", "NO", "Unknown", "Inne/Inne"),
        ]
        
        result = self.analyzer.analyze_palette(products)
        
        assert result["average_profitability"] <= 50
        assert result["high_risk_count"] == 3
        assert result["buy_recommendation"] == "NO"
        assert result["risk_assessment"] == "HIGH"
        assert result["estimated_roi"] <= 10
        assert result["total_products"] == 3
    
    def test_empty_palette_analysis(self):
        """Test analysis of empty palette"""
        result = self.analyzer.analyze_palette([])
        
        assert result["average_profitability"] == 0
        assert result["high_risk_count"] == 0
        assert result["buy_recommendation"] == "NO"
        assert result["risk_assessment"] == "UNKNOWN"
        assert result["estimated_roi"] == 0
        assert result["total_products"] == 0
    
    def test_category_distribution_analysis(self):
        """Test category distribution analysis"""
        products = [
            self.create_sample_product_analysis(80, "low", "YES", "Apple", "Elektronika/Telefony"),
            self.create_sample_product_analysis(85, "low", "YES", "Samsung", "Elektronika/Telefony"),
            self.create_sample_product_analysis(75, "low", "YES", "Nike", "Odzież/Obuwie"),
        ]
        
        result = self.analyzer.analyze_palette(products)
        
        category_dist = result["category_distribution"]
        assert "Elektronika/Telefony" in category_dist
        assert "Odzież/Obuwie" in category_dist
        assert category_dist["Elektronika/Telefony"]["count"] == 2
        assert category_dist["Odzież/Obuwie"]["count"] == 1
        assert category_dist["Elektronika/Telefony"]["percentage"] == 66.7
        assert category_dist["Odzież/Obuwie"]["percentage"] == 33.3
    
    def test_recommended_categories(self):
        """Test recommended categories identification"""
        products = [
            self.create_sample_product_analysis(85, "low", "YES", "Apple", "Elektronika/Telefony"),
            self.create_sample_product_analysis(88, "low", "YES", "Samsung", "Elektronika/Telefony"),
            self.create_sample_product_analysis(75, "low", "YES", "Nike", "Odzież/Obuwie"),
            self.create_sample_product_analysis(90, "low", "YES", "L'Oréal", "Kosmetyki/Twarz"),
        ]
        
        result = self.analyzer.analyze_palette(products)
        
        recommended = result["recommended_categories"]
        assert "Elektronika/Telefony" in recommended  # 2 products, 82.5 avg score
        assert "Kosmetyki/Twarz" in recommended  # 1 product, 90 score
    
    def test_profitability_distribution(self):
        """Test profitability distribution analysis"""
        products = [
            self.create_sample_product_analysis(90, "low", "YES"),  # excellent
            self.create_sample_product_analysis(85, "low", "YES"),  # excellent
            self.create_sample_product_analysis(75, "low", "YES"),  # good
            self.create_sample_product_analysis(65, "medium", "CAUTION"),  # average
            self.create_sample_product_analysis(45, "high", "NO"),  # poor
        ]
        
        result = self.analyzer.analyze_palette(products)
        
        distribution = result["profitability_distribution"]
        assert distribution["excellent"] == 2  # >= 85
        assert distribution["good"] == 1  # 70-84
        assert distribution["average"] == 1  # 55-69
        assert distribution["poor"] == 1  # < 55
    
    def test_risk_assessment_logic(self):
        """Test risk assessment logic"""
        # Low risk palette
        low_risk_products = [
            self.create_sample_product_analysis(80, "low", "YES"),
            self.create_sample_product_analysis(85, "low", "YES"),
            self.create_sample_product_analysis(75, "low", "YES"),
        ]
        
        result1 = self.analyzer.analyze_palette(low_risk_products)
        assert result1["risk_assessment"] == "LOW"
        
        # Medium risk palette
        medium_risk_products = [
            self.create_sample_product_analysis(70, "low", "YES"),
            self.create_sample_product_analysis(65, "medium", "CAUTION"),
            self.create_sample_product_analysis(60, "medium", "CAUTION"),
        ]
        
        result2 = self.analyzer.analyze_palette(medium_risk_products)
        assert result2["risk_assessment"] == "MEDIUM"
        
        # High risk palette
        high_risk_products = [
            self.create_sample_product_analysis(50, "high", "NO"),
            self.create_sample_product_analysis(45, "high", "NO"),
            self.create_sample_product_analysis(40, "high", "NO"),
        ]
        
        result3 = self.analyzer.analyze_palette(high_risk_products)
        assert result3["risk_assessment"] == "HIGH"
    
    def test_roi_calculation(self):
        """Test ROI calculation"""
        # High ROI palette
        high_roi_products = [
            self.create_sample_product_analysis(85, "low", "YES"),
            self.create_sample_product_analysis(90, "low", "YES"),
            self.create_sample_product_analysis(80, "low", "YES"),
        ]
        
        result1 = self.analyzer.analyze_palette(high_roi_products)
        assert result1["estimated_roi"] >= 15
        
        # Low ROI palette
        low_roi_products = [
            self.create_sample_product_analysis(40, "high", "NO"),
            self.create_sample_product_analysis(35, "high", "NO"),
        ]
        
        result2 = self.analyzer.analyze_palette(low_roi_products)
        assert result2["estimated_roi"] <= 10
    
    def test_palette_summary_generation(self):
        """Test palette summary generation"""
        products = [
            self.create_sample_product_analysis(80, "low", "YES"),
            self.create_sample_product_analysis(75, "medium", "CAUTION"),
        ]
        
        result = self.analyzer.analyze_palette(products)
        summary = self.analyzer.get_palette_summary(result)
        
        assert "Średnia rentowność" in summary
        assert "Rekomendacja" in summary
        assert "Poziom ryzyka" in summary
        assert "Szacowany ROI" in summary
    
    def test_log_analysis_results(self):
        """Test logging analysis results"""
        products = [self.create_sample_product_analysis(80, "low", "YES")]
        palette_analysis = self.analyzer.analyze_palette(products)
        
        # Should not raise exception
        self.analyzer.log_analysis_results(
            ["Test Product"], products, palette_analysis
        )

if __name__ == "__main__":
    pytest.main([__file__])
