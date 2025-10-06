"""
Tests for Product Normalizer Service
"""

import pytest
import sys
from pathlib import Path

# Add the parent directory to the path so we can import our modules
sys.path.append(str(Path(__file__).parent.parent))

from services.product_normalizer import ProductNormalizer

class TestProductNormalizer:
    """Test cases for ProductNormalizer"""
    
    def setup_method(self):
        """Set up test fixtures"""
        self.normalizer = ProductNormalizer()
    
    def test_apple_iphone_normalization(self):
        """Test iPhone normalization"""
        result = self.normalizer.normalize_product("iPhone 15 Pro Max 256GB Space Black")
        
        assert result["brand"] == "Apple"
        assert "iPhone" in result["model"]
        assert result["category"] == "Elektronika/Telefony"
        assert result["confidence"] > 0.7
        assert "256GB" in result["specifications"].get("storage", "")
    
    def test_samsung_galaxy_normalization(self):
        """Test Samsung Galaxy normalization"""
        result = self.normalizer.normalize_product("Samsung Galaxy S23 Ultra 512GB Phantom Black")
        
        assert result["brand"] == "Samsung"
        assert "Galaxy" in result["model"]
        assert result["category"] == "Elektronika/Telefony"
        assert result["confidence"] > 0.7
    
    def test_nike_shoes_normalization(self):
        """Test Nike shoes normalization"""
        result = self.normalizer.normalize_product("Nike Air Max 270 React White Black")
        
        assert result["brand"] == "Nike"
        assert "Air Max" in result["model"]
        assert result["category"] == "Odzież/Obuwie"
        assert result["confidence"] > 0.6
    
    def test_loreal_cosmetics_normalization(self):
        """Test L'Oréal cosmetics normalization"""
        result = self.normalizer.normalize_product("L'Oréal Paris True Match Foundation 30ml")
        
        assert result["brand"] == "L'Oréal"
        assert result["category"] == "Kosmetyki/Twarz"
        assert result["confidence"] > 0.6
    
    def test_unknown_brand_handling(self):
        """Test handling of unknown brands"""
        result = self.normalizer.normalize_product("Generic Smartwatch Fitness Tracker Black")
        
        assert result["brand"] == "Generic"
        assert result["confidence"] < 0.8  # Lower confidence for unknown brands
    
    def test_specification_extraction(self):
        """Test specification extraction"""
        result = self.normalizer.normalize_product("iPhone 15 Pro Max 256GB Space Black")
        
        specs = result["specifications"]
        assert "storage" in specs
        assert "256" in specs["storage"]
        assert "color" in specs
        assert "black" in specs["color"].lower()
    
    def test_category_classification(self):
        """Test category classification"""
        test_cases = [
            ("iPhone 15 Pro", "Elektronika/Telefony"),
            ("MacBook Air M2", "Elektronika/Laptopy"),
            ("Sony Headphones", "Elektronika/Słuchawki"),
            ("Nike Shoes", "Odzież/Obuwie"),
            ("L'Oréal Foundation", "Kosmetyki/Twarz"),
        ]
        
        for product_name, expected_category in test_cases:
            result = self.normalizer.normalize_product(product_name)
            assert result["category"] == expected_category, f"Failed for {product_name}"
    
    def test_confidence_calculation(self):
        """Test confidence score calculation"""
        # High confidence case
        high_confidence = self.normalizer.normalize_product("iPhone 15 Pro Max 256GB Space Black")
        assert high_confidence["confidence"] > 0.8
        
        # Low confidence case
        low_confidence = self.normalizer.normalize_product("Random Product Name")
        assert low_confidence["confidence"] < 0.5
    
    def test_normalized_name_generation(self):
        """Test normalized name generation"""
        result = self.normalizer.normalize_product("iPhone 15 Pro Max 256GB Space Black")
        
        normalized_name = result["normalized_name"]
        assert "Apple" in normalized_name
        assert "iPhone" in normalized_name
        assert "256GB" in normalized_name
    
    def test_get_available_brands(self):
        """Test getting available brands"""
        brands = self.normalizer.get_available_brands()
        assert isinstance(brands, list)
        assert "Apple" in brands
        assert "Samsung" in brands
        assert "Nike" in brands
    
    def test_get_available_categories(self):
        """Test getting available categories"""
        categories = self.normalizer.get_available_categories()
        assert isinstance(categories, list)
        assert "Elektronika/Telefony" in categories
        assert "Odzież/Obuwie" in categories
        assert "Kosmetyki/Twarz" in categories

if __name__ == "__main__":
    pytest.main([__file__])

