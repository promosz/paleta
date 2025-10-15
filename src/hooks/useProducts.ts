import { useState, useEffect } from 'react'
import { supabaseProductsService } from '../services/supabaseProductsService'
import type { Product } from '../types/analysis'

/**
 * Hook do pobierania produktów dla analizy
 */
export function useProducts(analysisId: string | null, userId: string | null) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!analysisId || !userId) {
      setProducts([])
      return
    }

    const loadProducts = async () => {
      setLoading(true)
      setError(null)
      
      try {
        console.log('🔄 Pobieranie produktów dla analizy:', analysisId)
        const fetchedProducts = await supabaseProductsService.getProductsForAnalysis(
          analysisId,
          userId
        )
        console.log('✅ Pobrano produkty:', fetchedProducts.length)
        setProducts(fetchedProducts)
      } catch (err) {
        console.error('❌ Błąd pobierania produktów:', err)
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [analysisId, userId])

  return { products, loading, error }
}

/**
 * Hook do pobierania statystyk produktów
 */
export function useProductStats(analysisId: string | null, userId: string | null) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!analysisId || !userId) {
      setStats(null)
      return
    }

    const loadStats = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const fetchedStats = await supabaseProductsService.getProductStats(
          analysisId,
          userId
        )
        setStats(fetchedStats)
      } catch (err) {
        console.error('❌ Błąd pobierania statystyk:', err)
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setStats(null)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [analysisId, userId])

  return { stats, loading, error }
}






