import React, { useState, useEffect } from 'react'
import { FileUploadZone } from '../components/upload'
import AnalysisList from '../components/AnalysisList'
import { AIService } from '../services/aiService'
import { hybridAIService } from '../services/hybridAIService'
import { Brain, Zap, TrendingUp } from 'lucide-react'
import { useAnalysisStore } from '../stores/analysisStoreSupabase'
import { useCurrentUser } from '../hooks/useCurrentUser'

const HomePage: React.FC = () => {
  const { supabaseUserId } = useCurrentUser()
  const { analyses, loadAnalyses } = useAnalysisStore()

  // AI status
  const [aiServiceStatus, setAiServiceStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [hybridAIStatus, setHybridAIStatus] = useState<any>({
    active: 'none',
    cloud: 'checking',
    browser: 'checking',
    docker: 'checking'
  })
  const aiService = AIService.getInstance()

  useEffect(() => {
    // Check AI service health on component mount
    checkAIServiceHealth()
    checkHybridAIHealth()
  }, [])

  useEffect(() => {
    // Load analyses from Supabase
    if (supabaseUserId) {
      loadAnalyses(supabaseUserId)
    }
  }, [supabaseUserId, loadAnalyses])

  const checkHybridAIHealth = async () => {
    try {
      const status = await hybridAIService.checkAllServices()
      setHybridAIStatus(status)
    } catch (error) {
      console.error('Hybrid AI health check failed:', error)
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Analizator palet
        </h2>
        <div className="w-full">
          <p className="text-base text-gray-600 text-center">
            Prześlij dokument Excel z zestawami produktów, aby przeprowadzić analizę rentowności
            i sprawdzić zgodność z ustalonymi regułami.
          </p>
        </div>
        
        {/* AI Status Indicator */}
        <div className="mt-4 flex items-center justify-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span className="text-sm text-gray-600">AI Services:</span>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            hybridAIStatus.active !== 'none'
              ? 'bg-green-100 text-green-800' 
              : aiServiceStatus === 'online'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {hybridAIStatus.active !== 'none' && <Zap className="h-3 w-3" />}
            {hybridAIStatus.active === 'none' && aiServiceStatus === 'online' && <Brain className="h-3 w-3" />}
            {hybridAIStatus.active === 'none' && aiServiceStatus === 'offline' && <TrendingUp className="h-3 w-3" />}
            <span>
              {hybridAIStatus.active !== 'none' 
                ? `HYBRID ${hybridAIStatus.active.toUpperCase()}`
                : aiServiceStatus.toUpperCase()
              }
            </span>
          </div>
        </div>
      </div>

      {/* Upload Section - używa wspólnego komponentu */}
      <div className="card">
        <div className="text-center">
          <FileUploadZone 
            navigateToDashboard={true}
            description="Prześlij dokument Excel (.xlsx, .xls) lub CSV (.csv) z zestawami produktów"
          />
        </div>
      </div>

      {/* Analysis List - dane z Supabase */}
      {analyses.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Ostatnie analizy ({analyses.length})
          </h3>
          <AnalysisList analyses={analyses} />
        </div>
      )}
    </div>
  )
}

export default HomePage