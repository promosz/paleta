"""
Cache Manager Service
Handles caching for AI services to improve performance
"""

import json
import hashlib
from typing import Any, Optional, Dict
import structlog
from datetime import datetime, timedelta

logger = structlog.get_logger()

class CacheManager:
    def __init__(self):
        """Initialize cache manager"""
        self.logger = logger.bind(service="cache_manager")
        
        # In-memory cache (in production, use Redis)
        self.cache: Dict[str, Dict[str, Any]] = {}
        
        # Cache configuration
        self.default_ttl = 3600  # 1 hour
        self.max_cache_size = 10000  # Maximum number of cached items
        
        self.logger.info("Cache manager initialized")
    
    def _generate_key(self, data: Any) -> str:
        """Generate cache key from data"""
        # Create a hash of the data for the cache key
        data_str = json.dumps(data, sort_keys=True, default=str)
        return hashlib.md5(data_str.encode()).hexdigest()
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if key not in self.cache:
            return None
        
        cache_entry = self.cache[key]
        
        # Check if expired
        if datetime.now() > cache_entry['expires_at']:
            del self.cache[key]
            return None
        
        # Update access time
        cache_entry['last_accessed'] = datetime.now()
        
        self.logger.debug("Cache hit", key=key[:8] + "...")
        return cache_entry['value']
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set value in cache"""
        if ttl is None:
            ttl = self.default_ttl
        
        # Clean up cache if it's getting too large
        self._cleanup_cache()
        
        expires_at = datetime.now() + timedelta(seconds=ttl)
        
        self.cache[key] = {
            'value': value,
            'expires_at': expires_at,
            'created_at': datetime.now(),
            'last_accessed': datetime.now()
        }
        
        self.logger.debug("Cache set", key=key[:8] + "...", ttl=ttl)
    
    def delete(self, key: str) -> None:
        """Delete value from cache"""
        if key in self.cache:
            del self.cache[key]
            self.logger.debug("Cache deleted", key=key[:8] + "...")
    
    def clear(self) -> None:
        """Clear all cache"""
        self.cache.clear()
        self.logger.info("Cache cleared")
    
    def _cleanup_cache(self) -> None:
        """Clean up expired entries and enforce size limit"""
        current_time = datetime.now()
        
        # Remove expired entries
        expired_keys = [
            key for key, entry in self.cache.items()
            if current_time > entry['expires_at']
        ]
        
        for key in expired_keys:
            del self.cache[key]
        
        # If still too large, remove least recently accessed
        if len(self.cache) > self.max_cache_size:
            # Sort by last accessed time
            sorted_items = sorted(
                self.cache.items(),
                key=lambda x: x[1]['last_accessed']
            )
            
            # Remove oldest entries
            entries_to_remove = len(self.cache) - self.max_cache_size + 100  # Remove extra to avoid frequent cleanup
            for key, _ in sorted_items[:entries_to_remove]:
                del self.cache[key]
        
        if expired_keys or len(self.cache) > self.max_cache_size:
            self.logger.debug("Cache cleaned up", 
                            expired_removed=len(expired_keys),
                            current_size=len(self.cache))
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        current_time = datetime.now()
        
        # Count expired entries
        expired_count = sum(
            1 for entry in self.cache.values()
            if current_time > entry['expires_at']
        )
        
        # Calculate average age
        total_age = sum(
            (current_time - entry['created_at']).total_seconds()
            for entry in self.cache.values()
        )
        avg_age = total_age / len(self.cache) if self.cache else 0
        
        return {
            'total_entries': len(self.cache),
            'expired_entries': expired_count,
            'active_entries': len(self.cache) - expired_count,
            'average_age_seconds': avg_age,
            'max_size': self.max_cache_size,
            'usage_percentage': (len(self.cache) / self.max_cache_size) * 100
        }
    
    def cache_product_analysis(self, product_name: str, description: str, result: Any) -> None:
        """Cache product analysis result"""
        key_data = {
            'type': 'product_analysis',
            'product_name': product_name,
            'description': description
        }
        key = self._generate_key(key_data)
        
        # Cache for 2 hours (product analysis results don't change often)
        self.set(key, result, ttl=7200)
    
    def get_cached_product_analysis(self, product_name: str, description: str) -> Optional[Any]:
        """Get cached product analysis result"""
        key_data = {
            'type': 'product_analysis',
            'product_name': product_name,
            'description': description
        }
        key = self._generate_key(key_data)
        
        return self.get(key)
    
    def cache_palette_analysis(self, products: list, result: Any) -> None:
        """Cache palette analysis result"""
        key_data = {
            'type': 'palette_analysis',
            'products': sorted(products)  # Sort for consistent key generation
        }
        key = self._generate_key(key_data)
        
        # Cache for 1 hour (palette analysis might change more frequently)
        self.set(key, result, ttl=3600)
    
    def get_cached_palette_analysis(self, products: list) -> Optional[Any]:
        """Get cached palette analysis result"""
        key_data = {
            'type': 'palette_analysis',
            'products': sorted(products)
        }
        key = self._generate_key(key_data)
        
        return self.get(key)

# Global cache instance
cache_manager = CacheManager()

