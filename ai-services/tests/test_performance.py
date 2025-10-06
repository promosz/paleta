"""
Performance Tests for AI Services
Tests caching, response times, and accuracy improvements
"""

import pytest
import time
import sys
from pathlib import Path
import json

# Add the parent directory to the path so we can import our modules
sys.path.append(str(Path(__file__).parent.parent))

from services.product_normalizer import ProductNormalizer
from services.profitability_analyzer import ProfitabilityAnalyzer
from services.palette_analyzer import PaletteAnalyzer
from services.cache_manager import cache_manager

class TestPerformance:
    """Performance test cases for AI services"""
    
    def setup_method(self):
        """Set up test fixtures"""
        self.normalizer = ProductNormalizer()
        self.profitability_analyzer = ProfitabilityAnalyzer()
        self.palette_analyzer = PaletteAnalyzer()
        
        # Clear cache before each test
        cache_manager.clear()
        
        # Load extended test data
        with open(Path(__file__).parent.parent / "data" / "extended_test_products.json", "r") as f:
            self.test_data = json.load(f)
    
    def test_brand_recognition_accuracy(self):
        """Test brand recognition accuracy with improved algorithms"""
        test_cases = [
            ("iphone 15 pro max", "Apple"),
            ("galaxy s23 ultra", "Samsung"),
            ("nike air max", "Nike"),
            ("sony playstation", "Sony"),
            ("loreal foundation", "L'Oréal"),
            ("adidas ultraboost", "Adidas"),
            ("lg oled tv", "LG"),
            ("huawei p50", "Huawei"),
            ("xiaomi redmi", "Xiaomi"),
            ("oneplus 11", "OnePlus")
        ]
        
        correct_predictions = 0
        total_predictions = len(test_cases)
        
        for product_name, expected_brand in test_cases:
            result = self.normalizer.normalize_product(product_name)
            if result["brand"] == expected_brand:
                correct_predictions += 1
        
        accuracy = (correct_predictions / total_predictions) * 100
        assert accuracy >= 80, f"Brand recognition accuracy {accuracy}% is below target 80%"
        
        print(f"✅ Brand recognition accuracy: {accuracy}%")
    
    def test_category_classification_accuracy(self):
        """Test category classification accuracy"""
        test_cases = [
            ("smartphone iphone", "Elektronika/Telefony"),
            ("laptop macbook", "Elektronika/Laptopy"),
            ("headphones sony", "Elektronika/Słuchawki"),
            ("shoes nike", "Odzież/Obuwie"),
            ("foundation makeup", "Kosmetyki/Twarz"),
            ("t-shirt cotton", "Odzież/Męska"),
            ("tv oled", "Elektronika/Telewizory"),
            ("camera canon", "Elektronika/Kamery")
        ]
        
        correct_predictions = 0
        total_predictions = len(test_cases)
        
        for product_name, expected_category in test_cases:
            result = self.normalizer.normalize_product(product_name)
            if result["category"] == expected_category:
                correct_predictions += 1
        
        accuracy = (correct_predictions / total_predictions) * 100
        assert accuracy >= 75, f"Category classification accuracy {accuracy}% is below target 75%"
        
        print(f"✅ Category classification accuracy: {accuracy}%")
    
    def test_caching_performance(self):
        """Test caching performance and hit rates"""
        # Test product normalization caching
        product_name = "iPhone 15 Pro Max 256GB Space Black"
        
        # First call - should be slow (no cache)
        start_time = time.time()
        result1 = self.normalizer.normalize_product(product_name)
        first_call_time = time.time() - start_time
        
        # Second call - should be fast (cached)
        start_time = time.time()
        result2 = self.normalizer.normalize_product(product_name)
        second_call_time = time.time() - start_time
        
        # Results should be identical
        assert result1 == result2, "Cached result differs from original"
        
        # Second call should be significantly faster
        speedup = first_call_time / second_call_time if second_call_time > 0 else float('inf')
        assert speedup >= 5, f"Cache speedup {speedup}x is below target 5x"
        
        print(f"✅ Cache speedup: {speedup:.1f}x faster")
    
    def test_palette_analysis_performance(self):
        """Test palette analysis performance with caching"""
        products = [
            "iPhone 15 Pro Max 256GB Space Black",
            "Samsung Galaxy S23 Ultra 512GB Phantom Black",
            "MacBook Air M2 13-inch 256GB Space Gray",
            "Sony WH-1000XM5 Wireless Headphones Black",
            "Nike Air Max 270 React White Black"
        ]
        
        # First analysis - should be slower
        start_time = time.time()
        result1 = self.palette_analyzer.analyze_palette([
            self.normalizer.normalize_product(product) for product in products
        ])
        first_analysis_time = time.time() - start_time
        
        # Second analysis - should be faster (cached)
        start_time = time.time()
        result2 = self.palette_analyzer.analyze_palette([
            self.normalizer.normalize_product(product) for product in products
        ])
        second_analysis_time = time.time() - start_time
        
        # Results should be identical
        assert result1 == result2, "Cached palette analysis differs from original"
        
        # Second analysis should be faster
        speedup = first_analysis_time / second_analysis_time if second_analysis_time > 0 else float('inf')
        assert speedup >= 2, f"Palette cache speedup {speedup}x is below target 2x"
        
        print(f"✅ Palette cache speedup: {speedup:.1f}x faster")
    
    def test_response_time_requirements(self):
        """Test that response times meet requirements"""
        test_products = [
            "iPhone 15 Pro Max 256GB Space Black",
            "Samsung Galaxy S23 Ultra 512GB Phantom Black",
            "Nike Air Max 270 React White Black"
        ]
        
        # Test individual product analysis
        for product in test_products:
            start_time = time.time()
            result = self.normalizer.normalize_product(product)
            response_time = time.time() - start_time
            
            assert response_time < 2.0, f"Product analysis took {response_time:.2f}s, exceeds 2s limit"
            assert result["confidence"] > 0.5, f"Confidence {result['confidence']} is too low"
        
        # Test palette analysis
        product_analyses = [self.normalizer.normalize_product(product) for product in test_products]
        
        start_time = time.time()
        palette_result = self.palette_analyzer.analyze_palette(product_analyses)
        response_time = time.time() - start_time
        
        assert response_time < 5.0, f"Palette analysis took {response_time:.2f}s, exceeds 5s limit"
        
        print(f"✅ Response times meet requirements (< 2s for products, < 5s for palettes)")
    
    def test_profitability_accuracy(self):
        """Test profitability analysis accuracy"""
        test_cases = [
            ("Apple", "Elektronika/Telefony", 85),  # Should be high
            ("Samsung", "Elektronika/Telefony", 85),  # Should be high
            ("Nike", "Odzież/Obuwie", 85),  # Should be high
            ("L'Oréal", "Kosmetyki/Twarz", 85),  # Should be high
            ("Unknown", "Inne/Inne", 50),  # Should be low
            ("Generic", "Inne/Inne", 45),  # Should be low
        ]
        
        correct_predictions = 0
        total_predictions = len(test_cases)
        
        for brand, category, expected_score in test_cases:
            result = self.profitability_analyzer.analyze_product(brand, category)
            predicted_score = result["score"]
            
            # Allow ±10 points tolerance
            if abs(predicted_score - expected_score) <= 10:
                correct_predictions += 1
        
        accuracy = (correct_predictions / total_predictions) * 100
        assert accuracy >= 75, f"Profitability accuracy {accuracy}% is below target 75%"
        
        print(f"✅ Profitability analysis accuracy: {accuracy}%")
    
    def test_cache_statistics(self):
        """Test cache statistics and management"""
        # Clear cache
        cache_manager.clear()
        
        # Add some items to cache
        test_products = [
            "iPhone 15 Pro Max 256GB Space Black",
            "Samsung Galaxy S23 Ultra 512GB Phantom Black",
            "Nike Air Max 270 React White Black"
        ]
        
        for product in test_products:
            self.normalizer.normalize_product(product)
        
        # Check cache stats
        stats = cache_manager.get_stats()
        
        assert stats["total_entries"] >= 3, "Cache should contain at least 3 entries"
        assert stats["active_entries"] >= 3, "All entries should be active"
        assert stats["usage_percentage"] > 0, "Cache usage should be greater than 0%"
        
        print(f"✅ Cache statistics: {stats['total_entries']} entries, {stats['usage_percentage']:.1f}% usage")
    
    def test_misspelling_handling(self):
        """Test handling of common misspellings and variations"""
        misspelling_cases = [
            ("iphone", "iPhone"),
            ("samsung", "Samsung"),
            ("nike", "Nike"),
            ("sony", "Sony"),
            ("loreal", "L'Oréal"),
            ("adidas", "Adidas")
        ]
        
        for misspelled, expected in misspelling_cases:
            result = self.normalizer.normalize_product(f"{misspelled} product test")
            # The brand should be recognized despite misspelling
            assert result["brand"] == expected, f"Misspelling '{misspelled}' not corrected to '{expected}'"
        
        print("✅ Misspelling handling works correctly")
    
    def test_model_extraction_improvements(self):
        """Test improved model extraction patterns"""
        test_cases = [
            ("iPhone 15 Pro Max", "iPhone 15 Pro Max"),
            ("Galaxy S23 Ultra", "Galaxy S23 Ultra"),
            ("Air Max 270 React", "Air Max 270 React"),
            ("WH-1000XM5", "WH-1000XM5"),
            ("MacBook Air M2", "MacBook Air M2")
        ]
        
        correct_extractions = 0
        total_extractions = len(test_cases)
        
        for product_name, expected_model in test_cases:
            result = self.normalizer.normalize_product(product_name)
            if expected_model.lower() in result["model"].lower():
                correct_extractions += 1
        
        accuracy = (correct_extractions / total_extractions) * 100
        assert accuracy >= 70, f"Model extraction accuracy {accuracy}% is below target 70%"
        
        print(f"✅ Model extraction accuracy: {accuracy}%")

if __name__ == "__main__":
    pytest.main([__file__, "-v"])

