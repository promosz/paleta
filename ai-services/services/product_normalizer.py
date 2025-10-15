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
from .cache_manager import cache_manager

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
        
        # Load fuzzy matching patterns for better brand recognition
        self.brand_patterns = self._load_brand_patterns()
        
        # Load model patterns for better model extraction
        self.model_patterns = self._load_model_patterns()
        
        # Load common misspellings and variations
        self.variations = self._load_variations()
        
        self.logger.info("Product normalizer initialized", 
                        brands_count=len(self.brands),
                        categories_count=len(self.categories),
                        brand_patterns_count=len(self.brand_patterns))
    
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
    
    def _load_brand_patterns(self) -> Dict[str, List[str]]:
        """Load advanced brand recognition patterns"""
        return {
            "Apple": [
                r"iphone\s*\d+", r"ipad\s*\w*", r"macbook\s*\w*", r"airpods\s*\w*",
                r"apple\s*watch", r"imac\s*\w*", r"mac\s*mini", r"apple\s*tv"
            ],
            "Samsung": [
                r"galaxy\s*s\d+", r"galaxy\s*note\s*\d+", r"samsung\s*tv", 
                r"galaxy\s*buds", r"galaxy\s*watch", r"samsung\s*refrigerator"
            ],
            "Sony": [
                r"playstation\s*\d+", r"ps\d+", r"sony\s*wh-\d+", r"sony\s*wf-\d+",
                r"xperia\s*\w*", r"sony\s*tv", r"sony\s*camera"
            ],
            "Nike": [
                r"air\s*max\s*\d+", r"jordan\s*\d+", r"nike\s*react", r"nike\s*zoom",
                r"nike\s*dunk", r"nike\s*blazer", r"nike\s*air\s*force"
            ],
            "Adidas": [
                r"ultraboost\s*\d*", r"stan\s*smith", r"yeezy\s*\w*", r"adidas\s*nmd",
                r"adidas\s*continental", r"adidas\s*ozweego"
            ]
        }
    
    def _load_model_patterns(self) -> Dict[str, str]:
        """Load model extraction patterns"""
        return {
            "phone_models": r"(iphone|galaxy|pixel|oneplus|xiaomi|huawei)\s*([a-z0-9\s]+)",
            "laptop_models": r"(macbook|thinkpad|pavilion|inspiron|zenbook|vivobook)\s*([a-z0-9\s]+)",
            "shoe_models": r"(air\s*max|ultraboost|stan\s*smith|jordan|yeezy|dunk)\s*([a-z0-9\s]+)",
            "headphone_models": r"(wh-\d+|wf-\d+|airpods|buds|studio)\s*([a-z0-9\s]+)",
            "tv_models": r"(\d+\")?\s*(oled|led|qled|4k|8k)\s*([a-z0-9\s]+)"
        }
    
    def _load_variations(self) -> Dict[str, str]:
        """Load common misspellings and variations"""
        return {
            # Common misspellings
            "iphone": "iPhone",
            "samsung": "Samsung", 
            "nike": "Nike",
            "adidas": "Adidas",
            "sony": "Sony",
            "lg": "LG",
            "huawei": "Huawei",
            "xiaomi": "Xiaomi",
            
            # Common abbreviations
            "mbp": "MacBook Pro",
            "airpods": "AirPods",
            "ps5": "PlayStation 5",
            "ps4": "PlayStation 4",
            "galaxy s": "Galaxy S",
            
            # Polish variations
            "telefon": "smartphone",
            "laptop": "notebook",
            "słuchawki": "headphones",
            "telewizor": "television",
            "buty": "shoes"
        }
    
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
        Normalize product name and extract key information with caching
        
        Args:
            product_name: Original product name
            description: Optional product description
            
        Returns:
            Dict with normalized product data
        """
        self.logger.info("Normalizing product", product_name=product_name)
        
        # Check cache first
        cached_result = cache_manager.get_cached_product_analysis(product_name, description)
        if cached_result:
            self.logger.info("Product analysis served from cache", product_name=product_name)
            return cached_result
        
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
        
        # Cache the result
        cache_manager.cache_product_analysis(product_name, description, result)
        
        self.logger.info("Product normalized", 
                        original_name=product_name,
                        normalized_name=normalized_name,
                        brand=brand,
                        category=category,
                        confidence=confidence)
        
        return result
    
    def _extract_brand(self, text: str, doc) -> str:
        """Extract brand from product text with improved accuracy"""
        text_lower = text.lower()
        
        # Apply variations first
        normalized_text = self._apply_variations(text_lower)
        
        # Check for exact brand matches
        for brand, keywords in self.brands.items():
            for keyword in keywords:
                if keyword.lower() in normalized_text:
                    return brand
        
        # Check for regex patterns
        for brand, patterns in self.brand_patterns.items():
            for pattern in patterns:
                if re.search(pattern, normalized_text, re.IGNORECASE):
                    return brand
        
        # Try to extract brand from capitalized words
        for token in doc:
            if token.is_alpha and token.is_title and len(token.text) > 2:
                token_lower = token.text.lower()
                # Check if this looks like a brand name
                if any(keyword in token_lower for brand_keywords in self.brands.values() 
                      for keyword in brand_keywords):
                    return token.text.title()
        
        # Fuzzy matching for common misspellings
        for variation, correct in self.variations.items():
            if variation in normalized_text:
                # Check if this variation matches a known brand
                for brand in self.brands.keys():
                    if correct.lower() in brand.lower():
                        return brand
        
        return "Unknown"
    
    def _extract_model(self, text: str, doc) -> str:
        """Extract model from product text with improved patterns"""
        text_lower = text.lower()
        
        # Apply variations first
        normalized_text = self._apply_variations(text_lower)
        
        # Try specific model patterns first
        for pattern_name, pattern in self.model_patterns.items():
            matches = re.findall(pattern, normalized_text, re.IGNORECASE)
            if matches:
                for match in matches:
                    if isinstance(match, tuple):
                        model = " ".join(match).title()
                    else:
                        model = match.title()
                    
                    # Filter out common words that aren't models
                    if not any(word in model.lower() for word in ["the", "and", "or", "for", "with", "pro", "max"]):
                        return model
        
        # Fallback to general patterns
        general_patterns = [
            r"(\w+)\s*(\d+)",  # Word + number
            r"(\w+)\s*(\w+)\s*(\d+)",  # Word + word + number
            r"(\w+)\s*(\w+)\s*(\w+)\s*(\d+)",  # Word + word + word + number
        ]
        
        for pattern in general_patterns:
            matches = re.findall(pattern, normalized_text, re.IGNORECASE)
            if matches:
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
    
    def _apply_variations(self, text: str) -> str:
        """Apply common variations and misspellings to text"""
        normalized_text = text
        
        for variation, correct in self.variations.items():
            # Replace variation with correct form
            normalized_text = re.sub(r'\b' + re.escape(variation) + r'\b', correct, normalized_text, flags=re.IGNORECASE)
        
        return normalized_text
    
    def get_available_brands(self) -> List[str]:
        """Get list of available brands"""
        return list(self.brands.keys())
    
    def get_available_categories(self) -> List[str]:
        """Get list of available categories"""
        return list(self.categories.keys())
