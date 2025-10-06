import React, { useState, useEffect } from 'react'
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3, 
  RefreshCw,
  Zap,
  Database,
  Activity
} from 'lucide-react'
import { AIService, CacheStats } from '../services/aiService'

interface AIAnalyticsProps {
  onClose: () => void
}

const AIAnalytics: React.FC<AIAnalyticsProps> = ({ onClose }) => {
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [aiServiceStatus, setAiServiceStatus] = useState<'online' | 'offline' | 'checking'>('checking')

  const aiService = AIService.getInstance()

  useEffect(() => {
    loadCacheStats()
    checkAIServiceHealth()
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadCacheStats()
      checkAIServiceHealth()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const loadCacheStats = async () => {
    try {
      const stats = await aiService.getCacheStats()
      setCacheStats(stats)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading cache stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkAIServiceHealth = async () => {
    try {
      const isHealthy = await aiService.checkHealth()
      setAiServiceStatus(isHealthy ? 'online' : 'offline')
    } catch (error) {
      setAiServiceStatus('offline')
    }
  }

  const handleClearCache = async () => {
    try {
      await aiService.clearCache()
      await loadCacheStats()
    } catch (error) {
      console.error('Error clearing cache:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600'
      case 'offline': return 'text-red-600'
      case 'checking': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'offline': return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'checking': return <RefreshCw className="h-5 w-5 text-yellow-600 animate-spin" />
      default: return <AlertTriangle className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Analytics Dashboard</h2>
              <p className="text-sm text-gray-600">Real-time AI services monitoring</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* AI Service Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                AI Service Status
              </h3>
              <button
                onClick={checkAIServiceHealth}
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusIcon(aiServiceStatus)}
              <span className={`font-medium ${getStatusColor(aiServiceStatus)}`}>
                {aiServiceStatus.toUpperCase()}
              </span>
              <span className="text-sm text-gray-600">
                Last checked: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Cache Statistics */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-gray-600">Loading cache statistics...</span>
            </div>
          ) : cacheStats ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Cache Performance
                </h3>
                <button
                  onClick={handleClearCache}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  <Zap className="h-4 w-4" />
                  <span>Clear Cache</span>
                </button>
              </div>

              {/* Cache Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Entries</p>
                      <p className="text-2xl font-bold text-blue-800">
                        {cacheStats.cache_stats.total_entries}
                      </p>
                    </div>
                    <Database className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    {cacheStats.cache_stats.active_entries} active
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Cache Usage</p>
                      <p className="text-2xl font-bold text-green-800">
                        {cacheStats.cache_stats.usage_percentage.toFixed(1)}%
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Max: {cacheStats.cache_stats.max_size}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Avg Age</p>
                      <p className="text-2xl font-bold text-purple-800">
                        {(cacheStats.cache_stats.average_age_seconds / 60).toFixed(1)}m
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-xs text-purple-600 mt-1">
                    {cacheStats.cache_stats.expired_entries} expired
                  </p>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Performance Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Cache Hit Rate</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {cacheStats.performance.cache_hit_rate}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Avg Response Time</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {cacheStats.performance.average_response_time}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Requests</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {cacheStats.performance.total_requests}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <p className="text-gray-600">Unable to load cache statistics</p>
              <p className="text-sm text-gray-500">AI service may be offline</p>
            </div>
          )}

          {/* Local Cache Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Local Cache</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Local cache size: {aiService.getLocalCacheStats().size} entries
                </p>
                <p className="text-xs text-gray-500">
                  TTL: 5 minutes
                </p>
              </div>
              <button
                onClick={() => aiService.clearLocalCache()}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
              >
                Clear Local
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIAnalytics
