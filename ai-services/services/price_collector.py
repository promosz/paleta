"""
Price Collector Service
Handles market price data collection from various sources
"""

import asyncio
import aiohttp
import json
import time
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from datetime import datetime, timedelta
import structlog
import re
from urllib.parse import quote_plus

logger = structlog.get_logger()

@dataclass
class PriceData:
    """Price data structure"""
    product_name: str
    price: float
    currency: str
    source: str
    url: str
    timestamp: datetime
    condition: str = "new"  # new, used, refurbished
    seller_rating: Optional[float] = None
    availability: bool = True

class PriceCollector:
    """Collects price data from various market sources"""
    
    def __init__(self):
        """Initialize the price collector"""
        self.logger = logger.bind(service="price_collector")
        
        # Configuration
        self.max_concurrent_requests = 5
        self.request_delay = 0.5  # seconds between requests
        self.timeout = 10  # seconds
        
        # User agents for web scraping
        self.user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        ]
        
        # Price patterns for extraction
        self.price_patterns = [
            r'(\d+(?:\s?\d{3})*(?:[,.]\d{2})?)\s*PLN',
            r'(\d+(?:\s?\d{3})*(?:[,.]\d{2})?)\s*zł',
            r'(\d+(?:\s?\d{3})*(?:[,.]\d{2})?)\s*€',
            r'(\d+(?:\s?\d{3})*(?:[,.]\d{2})?)\s*\$',
            r'(\d+(?:\s?\d{3})*(?:[,.]\d{2})?)'
        ]
        
        self.logger.info("Price collector initialized")
    
    async def collect_prices_for_product(self, product_name: str, max_results: int = 10) -> List[PriceData]:
        """
        Collect prices for a single product from multiple sources
        
        Args:
            product_name: Name of the product to search for
            max_results: Maximum number of price results to collect
            
        Returns:
            List of PriceData objects
        """
        self.logger.info("Starting price collection", product=product_name)
        
        # Prepare search queries
        search_queries = self._prepare_search_queries(product_name)
        
        # Collect from different sources concurrently
        tasks = []
        
        # Allegro search
        tasks.append(self._search_allegro(search_queries, max_results))
        
        # Ceneo search (if available)
        tasks.append(self._search_ceneo(search_queries, max_results))
        
        # Generic web search fallback
        tasks.append(self._search_generic(search_queries, max_results))
        
        # Execute all searches concurrently
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Flatten and deduplicate results
        all_prices = []
        for result in results:
            if isinstance(result, list):
                all_prices.extend(result)
            elif isinstance(result, Exception):
                self.logger.error("Price collection error", error=str(result))
        
        # Remove duplicates and sort by price
        unique_prices = self._deduplicate_prices(all_prices)
        unique_prices.sort(key=lambda x: x.price)
        
        self.logger.info("Price collection completed", 
                        product=product_name,
                        total_prices=len(unique_prices))
        
        return unique_prices[:max_results]
    
    def _prepare_search_queries(self, product_name: str) -> List[str]:
        """Prepare optimized search queries for different sources"""
        # Clean and optimize product name
        cleaned_name = re.sub(r'[^\w\s]', ' ', product_name.lower())
        cleaned_name = re.sub(r'\s+', ' ', cleaned_name).strip()
        
        # Extract key terms
        words = cleaned_name.split()
        key_words = [w for w in words if len(w) > 2 and w not in ['the', 'and', 'or', 'for', 'with']]
        
        # Create different query variations
        queries = [
            product_name,  # Original name
            ' '.join(key_words[:5]),  # First 5 key words
            ' '.join(key_words[:3]),  # First 3 key words
        ]
        
        # Add brand-specific queries if we can extract brand
        if len(key_words) > 0:
            # Assume first word might be brand
            brand_query = f"{key_words[0]} {' '.join(key_words[1:3])}"
            queries.append(brand_query)
        
        return list(set(queries))  # Remove duplicates
    
    async def _search_allegro(self, queries: List[str], max_results: int) -> List[PriceData]:
        """Search Allegro for prices"""
        prices = []
        
        try:
            for query in queries[:2]:  # Limit to first 2 queries for Allegro
                query_prices = await self._scrape_allegro_search(query, max_results // len(queries))
                prices.extend(query_prices)
                
                # Add delay between requests
                await asyncio.sleep(self.request_delay)
                
        except Exception as e:
            self.logger.error("Allegro search failed", error=str(e))
        
        return prices
    
    async def _scrape_allegro_search(self, query: str, max_results: int) -> List[PriceData]:
        """Scrape Allegro search results"""
        prices = []
        
        try:
            # Encode query for URL
            encoded_query = quote_plus(query)
            url = f"https://allegro.pl/listing?string={encoded_query}&order=m&bmatch=baseline-al-product-eyesa2-uni-1-5-0327"
            
            headers = {
                'User-Agent': self.user_agents[0],
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'pl-PL,pl;q=0.9,en;q=0.8',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
            }
            
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=self.timeout)) as session:
                async with session.get(url, headers=headers) as response:
                    if response.status == 200:
                        html = await response.text()
                        prices = self._parse_allegro_html(html, query)
                    else:
                        self.logger.warning("Allegro request failed", 
                                          status=response.status,
                                          query=query)
                        
        except Exception as e:
            self.logger.error("Allegro scraping error", error=str(e), query=query)
        
        return prices[:max_results]
    
    def _parse_allegro_html(self, html: str, query: str) -> List[PriceData]:
        """Parse Allegro HTML to extract price data"""
        prices = []
        
        try:
            # This is a simplified parser - in production, you'd use BeautifulSoup or similar
            # Look for price patterns in the HTML
            
            # Extract prices using regex patterns
            for pattern in self.price_patterns:
                matches = re.findall(pattern, html)
                for match in matches:
                    try:
                        # Clean and convert price
                        price_str = match.replace(' ', '').replace(',', '.')
                        price = float(price_str)
                        
                        # Basic validation
                        if 1 <= price <= 100000:  # Reasonable price range
                            price_data = PriceData(
                                product_name=query,
                                price=price,
                                currency="PLN",
                                source="Allegro",
                                url="https://allegro.pl",
                                timestamp=datetime.now(),
                                condition="new"
                            )
                            prices.append(price_data)
                            
                    except (ValueError, TypeError):
                        continue
            
            self.logger.info("Parsed Allegro prices", 
                           query=query,
                           prices_found=len(prices))
            
        except Exception as e:
            self.logger.error("Allegro HTML parsing error", error=str(e))
        
        return prices
    
    async def _search_ceneo(self, queries: List[str], max_results: int) -> List[PriceData]:
        """Search Ceneo for prices (placeholder implementation)"""
        prices = []
        
        try:
            # Ceneo API or scraping implementation would go here
            # For now, return mock data
            self.logger.info("Ceneo search not implemented yet")
            
        except Exception as e:
            self.logger.error("Ceneo search failed", error=str(e))
        
        return prices
    
    async def _search_generic(self, queries: List[str], max_results: int) -> List[PriceData]:
        """Generic web search for prices (fallback)"""
        prices = []
        
        try:
            # Generic price search implementation
            # This could integrate with Google Shopping API or similar
            self.logger.info("Generic search not implemented yet")
            
        except Exception as e:
            self.logger.error("Generic search failed", error=str(e))
        
        return prices
    
    def _deduplicate_prices(self, prices: List[PriceData]) -> List[PriceData]:
        """Remove duplicate prices based on URL and price"""
        seen = set()
        unique_prices = []
        
        for price in prices:
            # Create a key for deduplication
            key = (price.url, round(price.price, 2), price.source)
            
            if key not in seen:
                seen.add(key)
                unique_prices.append(price)
        
        return unique_prices
    
    async def collect_prices_for_products(self, product_names: List[str], max_results_per_product: int = 5) -> Dict[str, List[PriceData]]:
        """
        Collect prices for multiple products
        
        Args:
            product_names: List of product names
            max_results_per_product: Maximum results per product
            
        Returns:
            Dictionary mapping product names to price lists
        """
        self.logger.info("Starting batch price collection", 
                        product_count=len(product_names))
        
        # Create semaphore to limit concurrent requests
        semaphore = asyncio.Semaphore(self.max_concurrent_requests)
        
        async def collect_single_product(product_name: str) -> tuple:
            async with semaphore:
                prices = await self.collect_prices_for_product(product_name, max_results_per_product)
                return product_name, prices
        
        # Collect prices for all products concurrently
        tasks = [collect_single_product(name) for name in product_names]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Organize results
        price_data = {}
        for result in results:
            if isinstance(result, tuple):
                product_name, prices = result
                price_data[product_name] = prices
            elif isinstance(result, Exception):
                self.logger.error("Batch collection error", error=str(result))
        
        self.logger.info("Batch price collection completed", 
                        products_processed=len(price_data))
        
        return price_data
    
    def get_price_statistics(self, prices: List[PriceData]) -> Dict[str, Any]:
        """Calculate price statistics from collected data"""
        if not prices:
            return {
                "count": 0,
                "min_price": 0,
                "max_price": 0,
                "median_price": 0,
                "average_price": 0,
                "price_range": 0
            }
        
        price_values = [p.price for p in prices]
        price_values.sort()
        
        count = len(price_values)
        min_price = min(price_values)
        max_price = max(price_values)
        median_price = price_values[count // 2] if count > 0 else 0
        average_price = sum(price_values) / count if count > 0 else 0
        price_range = max_price - min_price
        
        return {
            "count": count,
            "min_price": min_price,
            "max_price": max_price,
            "median_price": median_price,
            "average_price": average_price,
            "price_range": price_range,
            "sources": list(set(p.source for p in prices)),
            "latest_update": max(p.timestamp for p in prices).isoformat()
        }





















