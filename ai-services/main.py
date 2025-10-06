"""
AI Services - Main FastAPI application
Provides product recognition and profitability analysis
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import logging
import structlog

from services.product_normalizer import ProductNormalizer
from services.profitability_analyzer import ProfitabilityAnalyzer
from services.palette_analyzer import PaletteAnalyzer

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Initialize FastAPI app
app = FastAPI(
    title="Pallet Analysis AI Services",
    description="AI services for product recognition and profitability analysis",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3003"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI services
product_normalizer = ProductNormalizer()
profitability_analyzer = ProfitabilityAnalyzer()
palette_analyzer = PaletteAnalyzer()

# Pydantic models
class ProductRequest(BaseModel):
    name: str
    description: str = ""

class ProductResponse(BaseModel):
    original_name: str
    normalized_name: str
    brand: str
    model: str
    category: str
    profitability_score: int
    risk_level: str
    confidence: float
    recommendation: str

class PaletteRequest(BaseModel):
    products: List[str]

class PaletteResponse(BaseModel):
    average_profitability: float
    high_risk_count: int
    recommended_categories: List[str]
    buy_recommendation: str
    risk_assessment: str
    estimated_roi: float
    product_analyses: List[ProductResponse]

# API Endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ai-services", "version": "1.0.0"}

@app.post("/ai/normalize-product", response_model=ProductResponse)
async def normalize_product(request: ProductRequest):
    """
    Normalize product name and analyze profitability
    """
    try:
        logger.info("Normalizing product", product_name=request.name)
        
        # Normalize product
        normalized = product_normalizer.normalize_product(request.name, request.description)
        
        # Analyze profitability
        profitability = profitability_analyzer.analyze_product(
            normalized["brand"],
            normalized["category"],
            normalized["model"]
        )
        
        response = ProductResponse(
            original_name=request.name,
            normalized_name=normalized["normalized_name"],
            brand=normalized["brand"],
            model=normalized["model"],
            category=normalized["category"],
            profitability_score=profitability["score"],
            risk_level=profitability["risk_level"],
            confidence=normalized["confidence"],
            recommendation=profitability["recommendation"]
        )
        
        logger.info("Product normalized successfully", 
                   original_name=request.name,
                   normalized_name=normalized["normalized_name"],
                   profitability_score=profitability["score"])
        
        return response
        
    except Exception as e:
        logger.error("Error normalizing product", 
                    product_name=request.name, 
                    error=str(e))
        raise HTTPException(status_code=500, detail=f"Error processing product: {str(e)}")

@app.post("/ai/analyze-palette", response_model=PaletteResponse)
async def analyze_palette(request: PaletteRequest, background_tasks: BackgroundTasks):
    """
    Analyze entire palette for profitability and risk
    """
    try:
        logger.info("Analyzing palette", product_count=len(request.products))
        
        # Analyze each product
        product_analyses = []
        for product_name in request.products:
            try:
                normalized = product_normalizer.normalize_product(product_name)
                profitability = profitability_analyzer.analyze_product(
                    normalized["brand"],
                    normalized["category"],
                    normalized["model"]
                )
                
                product_analyses.append(ProductResponse(
                    original_name=product_name,
                    normalized_name=normalized["normalized_name"],
                    brand=normalized["brand"],
                    model=normalized["model"],
                    category=normalized["category"],
                    profitability_score=profitability["score"],
                    risk_level=profitability["risk_level"],
                    confidence=normalized["confidence"],
                    recommendation=profitability["recommendation"]
                ))
            except Exception as e:
                logger.warning("Error analyzing product in palette", 
                              product_name=product_name, 
                              error=str(e))
                # Continue with other products
        
        # Analyze entire palette
        palette_analysis = palette_analyzer.analyze_palette(product_analyses)
        
        response = PaletteResponse(
            average_profitability=palette_analysis["average_profitability"],
            high_risk_count=palette_analysis["high_risk_count"],
            recommended_categories=palette_analysis["recommended_categories"],
            buy_recommendation=palette_analysis["buy_recommendation"],
            risk_assessment=palette_analysis["risk_assessment"],
            estimated_roi=palette_analysis["estimated_roi"],
            product_analyses=product_analyses
        )
        
        # Log analysis in background for learning
        background_tasks.add_task(
            palette_analyzer.log_analysis_results,
            request.products,
            product_analyses,
            palette_analysis
        )
        
        logger.info("Palette analysis completed", 
                   product_count=len(request.products),
                   average_profitability=palette_analysis["average_profitability"],
                   recommendation=palette_analysis["buy_recommendation"])
        
        return response
        
    except Exception as e:
        logger.error("Error analyzing palette", 
                    product_count=len(request.products), 
                    error=str(e))
        raise HTTPException(status_code=500, detail=f"Error analyzing palette: {str(e)}")

@app.get("/ai/categories")
async def get_categories():
    """Get available product categories"""
    try:
        categories = profitability_analyzer.get_available_categories()
        return {"categories": categories}
    except Exception as e:
        logger.error("Error getting categories", error=str(e))
        raise HTTPException(status_code=500, detail=f"Error getting categories: {str(e)}")

@app.get("/ai/brands")
async def get_brands():
    """Get available brands"""
    try:
        brands = product_normalizer.get_available_brands()
        return {"brands": brands}
    except Exception as e:
        logger.error("Error getting brands", error=str(e))
        raise HTTPException(status_code=500, detail=f"Error getting brands: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
