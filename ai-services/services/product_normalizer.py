"""
Product Normalizer Service
Handles product name recognition and normalization using NLP
"""

import spacy
import re
import json
from typing import Dict, List, Any, Optional
from pathlib import Path
import structlog

logger = structlog.get_logger()

class ProductNormalizer:
    def __init__(self):
        """Initialize the product normalizer with NLP model and data"""
        self.logger = logger.bind(service="product_normalizer")
        
        # Load Polish language model
        try:
            self.nlp = spacy.load("pl_core_news_sm")
            self.logger.info("Polish language model loaded successfully")
        except OSError:
            self.logger.error("Polish model not found. Please install: python -m spacy download pl_core_news_sm")
            # Fallback to English model
            self.nlp = spacy.load("en_core_web_sm")
            self.logger.warning("Using English model as fallback")
        
        # Load brand and category data
        self.brands = self._load_brands()
        self.categories = self._load_categories()
        self.specifications = self._load_specifications()
        
        self.logger.info("Product normalizer initialized", 
                        brands_count=len(self.brands),
                        categories_count=len(self.categories))
    
    def _load_brands(self) -> Dict[str, List[str]]:
        """Load brand recognition data"""
        brands_data = {
            # Electronics brands
            "Apple": ["apple", "iphone", "ipad", "macbook", "airpods", "watch"],
            "Samsung": ["samsung", "galaxy", "note", "s series"],
            "Sony": ["sony", "playstation", "ps4", "ps5", "xperia"],
            "LG": ["lg", "g series", "v series"],
            "Huawei": ["huawei", "p series", "mate"],
            "Xiaomi": ["xiaomi", "mi ", "redmi", "poco"],
            "OnePlus": ["oneplus", "one plus"],
            
            # Clothing brands
            "Nike": ["nike", "air max", "jordan"],
            "Adidas": ["adidas", "yeezy", "stan smith"],
            "Zara": ["zara"],
            "H&M": ["h&m", "hm"],
            "Uniqlo": ["uniqlo"],
            
            # Beauty brands
            "L'Oréal": ["loreal", "l'oréal", "l'oreal"],
            "Maybelline": ["maybelline"],
            "Revlon": ["revlon"],
            "MAC": ["mac cosmetics", "mac "],
            
            # Generic/Unknown
            "Generic": ["generic", "unbranded", "no brand"]
        }
        return brands_data
    
    def _load_categories(self) -> Dict[str, List[str]]:
        """Load category classification data"""
        categories_data = {
            "Elektronika/Telefony": [
                "telefon", "smartphone", "iphone", "galaxy", "xiaomi", "huawei",
                "samsung", "apple", "android", "mobile", "komórka"
            ],
            "Elektronika/Laptopy": [
                "laptop", "notebook", "macbook", "thinkpad", "asus", "dell",
                "hp", "lenovo", "acer", "msi"
            ],
            "Elektronika/Słuchawki": [
                "słuchawki", "headphones", "airpods", "earbuds", "wireless",
                "bluetooth", "audio", "dźwięk"
            ],
            "Elektronika/Telewizory": [
                "telewizor", "tv", "television", "smart tv", "led", "oled",
                "samsung tv", "lg tv"
            ],
            "Elektronika/Kamery": [
                "kamera", "camera", "canon", "nikon", "sony", "dslr",
                "mirrorless", "foto", "zdjęcia"
            ],
            "Odzież/Męska": [
                "koszula", "spodnie", "męskie", "shirt", "pants", "jeans",
                "t-shirt", "tshirt", "bluza", "hoodie"
            ],
            "Odzież/Damska": [
                "sukienka", "damskie", "dress", "spódnica", "bluzka",
                "top", "spodenki", "shorts"
            ],
            "Odzież/Obuwie": [
                "buty", "shoes", "sneakers", "boots", "sandals", "nike",
                "adidas", "converse", "vans"
            ],
            "Kosmetyki/Twarz": [
                "krem", "foundation", "podkład", "concealer", "puder",
                "makeup", "kosmetyki", "beauty"
            ],
            "Kosmetyki/Włosy": [
                "szampon", "shampoo", "odżywka", "conditioner", "włosy",
                "hair", "fryzjer"
            ],
            "Dom i Ogród": [
                "meble", "furniture", "krzesło", "stół", "łóżko", "sofa",
                "dywan", "lampa", "oświetlenie"
            ],
            "Sport i Rekreacja": [
                "sport", "fitness", "gym", "piłka", "ball", "rower",
                "bike", "bieganie", "running"
            ]
        }
        return categories_data
    
    def _load_specifications(self) -> Dict[str, str]:
        """Load specification extraction patterns"""
        return {
            "storage": r"(\d+)\s*(gb|tb|mb)",
            "color": r"(black|white|blue|red|green|yellow|pink|silver|gold|czarny|biały|niebieski|czerwony|zielony|żółty|różowy|srebrny|złoty)",
            "size": r"(\d+)\s*(mm|cm|inch|in|\")",
            "weight": r"(\d+)\s*(g|kg|gram|kilogram)",
            "resolution": r"(\d+x\d+)",
            "ram": r"(\d+)\s*(gb|mb)\s*ram",
            "battery": r"(\d+)\s*(mah|wh)"
        }
    
    def normalize_product(self, product_name: str, description: str = "") -> Dict[str, Any]:
        """
        Normalize product name and extract key information
        
        Args:
            product_name: Original product name
            description: Optional product description
            
        Returns:
            Dict with normalized product data
        """
        self.logger.info("Normalizing product", product_name=product_name)
        
        # Clean and prepare text
        text = f"{product_name} {description}".lower().strip()
        
        # Process with spaCy
        doc = self.nlp(text)
        
        # Extract brand
        brand = self._extract_brand(text, doc)
        
        # Extract model
        model = self._extract_model(text, doc)
        
        # Classify category
        category = self._classify_category(text, doc)
        
        # Extract specifications
        specifications = self._extract_specifications(text)
        
        # Calculate confidence
        confidence = self._calculate_confidence(brand, model, category, specifications)
        
        # Generate normalized name
        normalized_name = self._generate_normalized_name(brand, model, specifications)
        
        result = {
            "original_name": product_name,
            "normalized_name": normalized_name,
            "brand": brand,
            "model": model,
            "category": category,
            "specifications": specifications,
            "confidence": confidence,
            "processed_text": text
        }
        
        self.logger.info("Product normalized", 
                        original_name=product_name,
                        normalized_name=normalized_name,
                        brand=brand,
                        category=category,
                        confidence=confidence)
        
        return result
    
    def _extract_brand(self, text: str, doc) -> str:
        """Extract brand from product text"""
        text_lower = text.lower()
        
        # Check for exact brand matches
        for brand, keywords in self.brands.items():
            for keyword in keywords:
                if keyword.lower() in text_lower:
                    return brand
        
        # Try to extract brand from capitalized words
        for token in doc:
            if token.is_alpha and token.is_title and len(token.text) > 2:
                # Check if this looks like a brand name
                if any(keyword in token.text.lower() for brand_keywords in self.brands.values() 
                      for keyword in brand_keywords):
                    return token.text.title()
        
        return "Unknown"
    
    def _extract_model(self, text: str, doc) -> str:
        """Extract model from product text"""
        # Look for model patterns like "iPhone 15", "Galaxy S23", etc.
        model_patterns = [
            r"(\w+)\s*(\d+)",  # Word + number
            r"(\w+)\s*(\w+)\s*(\d+)",  # Word + word + number
        ]
        
        for pattern in model_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                # Return the most likely model match
                for match in matches:
                    if isinstance(match, tuple):
                        model = " ".join(match).title()
                    else:
                        model = match.title()
                    
                    # Filter out common words that aren't models
                    if not any(word in model.lower() for word in ["the", "and", "or", "for", "with"]):
                        return model
        
        return "Unknown"
    
    def _classify_category(self, text: str, doc) -> str:
        """Classify product category based on text content"""
        text_lower = text.lower()
        
        # Score each category based on keyword matches
        category_scores = {}
        
        for category, keywords in self.categories.items():
            score = 0
            for keyword in keywords:
                if keyword.lower() in text_lower:
                    # Give more weight to exact matches
                    if keyword.lower() in text.split():
                        score += 2
                    else:
                        score += 1
            
            if score > 0:
                category_scores[category] = score
        
        # Return category with highest score
        if category_scores:
            best_category = max(category_scores, key=category_scores.get)
            if category_scores[best_category] >= 2:  # Minimum confidence threshold
                return best_category
        
        return "Inne/Inne"
    
    def _extract_specifications(self, text: str) -> Dict[str, str]:
        """Extract product specifications"""
        specifications = {}
        
        for spec_type, pattern in self.specifications.items():
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                specifications[spec_type] = matches[0] if matches else ""
        
        return specifications
    
    def _calculate_confidence(self, brand: str, model: str, category: str, specifications: Dict) -> float:
        """Calculate confidence score for the normalization"""
        confidence = 0.0
        
        # Brand confidence
        if brand != "Unknown":
            confidence += 0.3
        elif brand == "Generic":
            confidence += 0.1
        
        # Model confidence
        if model != "Unknown":
            confidence += 0.3
            # Extra points for model with numbers
            if re.search(r'\d+', model):
                confidence += 0.1
        
        # Category confidence
        if category != "Inne/Inne":
            confidence += 0.2
        
        # Specifications confidence
        if specifications:
            confidence += 0.1 * len(specifications)
        
        return min(confidence, 1.0)
    
    def _generate_normalized_name(self, brand: str, model: str, specifications: Dict) -> str:
        """Generate normalized product name"""
        parts = []
        
        if brand != "Unknown":
            parts.append(brand)
        
        if model != "Unknown":
            parts.append(model)
        
        # Add key specifications
        if "storage" in specifications:
            parts.append(f"{specifications['storage']}GB")
        
        if "color" in specifications:
            parts.append(specifications["color"].title())
        
        return " ".join(parts) if parts else "Unknown Product"
    
    def get_available_brands(self) -> List[str]:
        """Get list of available brands"""
        return list(self.brands.keys())
    
    def get_available_categories(self) -> List[str]:
        """Get list of available categories"""
        return list(self.categories.keys())
