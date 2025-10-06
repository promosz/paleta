# AI Services - Pallet Analysis

## 🚀 **Quick Start**

### **Installation**
```bash
cd ai-services
pip install -r requirements.txt
python -m spacy download pl_core_news_sm
```

### **Running the Service**
```bash
python main.py
```

Service will be available at: `http://localhost:8000`

### **API Documentation**
Visit: `http://localhost:8000/docs` for interactive API documentation

## 📋 **API Endpoints**

### **Health Check**
```
GET /health
```

### **Product Normalization**
```
POST /ai/normalize-product
{
  "name": "iPhone 15 Pro Max 256GB Space Black",
  "description": "Najnowszy iPhone z zaawansowanymi funkcjami"
}
```

### **Palette Analysis**
```
POST /ai/analyze-palette
{
  "products": [
    "iPhone 15 Pro Max 256GB Space Black",
    "Samsung Galaxy S23 Ultra 512GB Phantom Black",
    "MacBook Air M2 13-inch 256GB Space Gray"
  ]
}
```

### **Available Categories**
```
GET /ai/categories
```

### **Available Brands**
```
GET /ai/brands
```

## 🧪 **Testing**

### **Run All Tests**
```bash
pytest tests/
```

### **Run Specific Test**
```bash
pytest tests/test_product_normalizer.py
pytest tests/test_profitability_analyzer.py
pytest tests/test_palette_analyzer.py
```

### **Test Coverage**
```bash
pytest --cov=services tests/
```

## 📊 **Features**

### **Product Recognition**
- ✅ Brand extraction (Apple, Samsung, Nike, etc.)
- ✅ Model identification (iPhone 15, Galaxy S23, etc.)
- ✅ Category classification (Electronics, Clothing, Beauty, etc.)
- ✅ Specification extraction (storage, color, size, etc.)
- ✅ Confidence scoring

### **Profitability Analysis**
- ✅ Category-based profitability scoring (0-100)
- ✅ Brand reputation assessment
- ✅ Risk level determination (LOW/MEDIUM/HIGH)
- ✅ Purchase recommendations (YES/CAUTION/NO)
- ✅ ROI estimation

### **Palette Analysis**
- ✅ Aggregate profitability assessment
- ✅ Risk distribution analysis
- ✅ Category diversification analysis
- ✅ Overall buy/sell recommendations
- ✅ Portfolio ROI estimation

## 🏗️ **Architecture**

```
ai-services/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── services/
│   ├── product_normalizer.py    # Product recognition & NLP
│   ├── profitability_analyzer.py # Business logic & scoring
│   └── palette_analyzer.py      # Portfolio analysis
├── tests/
│   ├── test_product_normalizer.py
│   ├── test_profitability_analyzer.py
│   └── test_palette_analyzer.py
└── data/
    └── test_products.json  # Test data & validation
```

## 📈 **Performance Metrics**

### **Target Performance**
- **Product Recognition Accuracy**: >80%
- **Profitability Assessment Accuracy**: >75%
- **API Response Time**: <2 seconds
- **Confidence Score Range**: 0.0-1.0

### **Supported Categories**
- Elektronika/Telefony
- Elektronika/Laptopy
- Elektronika/Słuchawki
- Elektronika/Telewizory
- Elektronika/Kamery
- Odzież/Męska
- Odzież/Damska
- Odzież/Obuwie
- Kosmetyki/Twarz
- Kosmetyki/Włosy
- Dom i Ogród
- Sport i Rekreacja

### **Supported Brands**
- **Electronics**: Apple, Samsung, Sony, LG, Huawei, Xiaomi, OnePlus
- **Clothing**: Nike, Adidas, Zara, H&M, Uniqlo
- **Beauty**: L'Oréal, Maybelline, Revlon, MAC
- **Generic/Unknown**: Handled with appropriate risk assessment

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Optional: Database connection
DATABASE_URL=postgresql://user:pass@localhost/db

# Optional: Redis cache
REDIS_URL=redis://localhost:6379

# Optional: Logging level
LOG_LEVEL=INFO
```

### **Model Configuration**
The system uses spaCy's Polish language model (`pl_core_news_sm`) for NLP processing. 
If unavailable, it falls back to English model (`en_core_web_sm`).

## 📝 **Development**

### **Code Style**
```bash
black services/ tests/
flake8 services/ tests/
```

### **Adding New Categories**
Edit `services/profitability_analyzer.py`:
```python
"Nowa/Kategoria": {
    "base_score": 75,
    "market_demand": "high",
    "price_stability": "medium",
    "competition": "medium",
    "seasonal_factor": 1.0,
    "risk_factors": ["custom_risk"]
}
```

### **Adding New Brands**
Edit `services/product_normalizer.py`:
```python
"NowaMarka": ["keyword1", "keyword2", "keyword3"]
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **spaCy Model Not Found**
   ```bash
   python -m spacy download pl_core_news_sm
   ```

2. **Import Errors**
   ```bash
   pip install -r requirements.txt
   ```

3. **Port Already in Use**
   ```bash
   # Change port in main.py
   uvicorn.run(app, host="0.0.0.0", port=8001)
   ```

### **Logs**
Check console output for detailed logging with structured JSON format.

## 📞 **Support**

For issues or questions:
1. Check the test files for usage examples
2. Review the API documentation at `/docs`
3. Check the logs for detailed error information

