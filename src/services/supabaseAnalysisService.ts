import { supabase } from '../lib/supabase'
import type { Analysis, AnalysisFile } from '../types/analysis'
import type { Database } from '../types/supabase'

type AnalysisRow = Database['public']['Tables']['analyses']['Row']
type AnalysisInsert = Database['public']['Tables']['analyses']['Insert']
type AnalysisUpdate = Database['public']['Tables']['analyses']['Update']
type AnalysisFileRow = Database['public']['Tables']['analysis_files']['Row']
type AnalysisFileInsert = Database['public']['Tables']['analysis_files']['Insert']

export class SupabaseAnalysisService {
  public supabase = supabase

  private async getClient() {
    // TODO: W przyszłości pobierać token z Clerk
    return supabase
  }

  // Pobieranie wszystkich analiz użytkownika
  async getAnalyses(userId: string): Promise<Analysis[]> {
    const client = await this.getClient()
    
        const { data, error } = await client
          .from('analyses')
          .select(`
            *,
            analysis_files (*)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching analyses:', error)
      throw new Error(`Failed to fetch analyses: ${error.message}`)
    }

    return this.mapRowsToAnalyses(data || [])
  }

  // Pobieranie pojedynczej analizy
  async getAnalysis(id: string, userId: string): Promise<Analysis | null> {
    const client = await this.getClient()
    
        const { data, error } = await client
          .from('analyses')
          .select(`
            *,
            analysis_files (*)
          `)
          .eq('id', id)
          .eq('user_id', userId)
          .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      console.error('Error fetching analysis:', error)
      throw new Error(`Failed to fetch analysis: ${error.message}`)
    }

    return this.mapRowToAnalysis(data)
  }

  // Tworzenie nowej analizy
  async createAnalysis(analysis: Omit<Analysis, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<Analysis> {
    const client = await this.getClient()
    
    const analysisData: AnalysisInsert = {
      user_id: userId,
      name: analysis.name,
      description: analysis.description || null,
      type: analysis.type,
      status: analysis.status,
      total_products: analysis.totalProducts,
      valid_products: analysis.validProducts,
      invalid_products: analysis.invalidProducts,
      average_score: analysis.averageScore,
      stats: analysis.stats as any,
      metadata: analysis.metadata as any,
      completed_at: analysis.completedAt?.toISOString() || null,
    }

    const { data, error } = await client
      .from('analyses')
      .insert(analysisData)
      .select()
      .single()

    if (error) {
      console.error('Error creating analysis:', error)
      throw new Error(`Failed to create analysis: ${error.message}`)
    }

    // Tworzenie plików jeśli istnieją
    if (analysis.files && analysis.files.length > 0) {
      console.log('📁 Dodawanie plików do analizy:', analysis.files.length)
      await this.addFilesToAnalysis(data.id, analysis.files, userId)
      console.log('✅ Pliki dodane do analizy')
    } else {
      console.log('⚠️ Brak plików do dodania')
    }

    return this.mapRowToAnalysis(data)
  }

  // Aktualizacja analizy
  async updateAnalysis(id: string, updates: Partial<Analysis>, userId: string): Promise<void> {
    const client = await this.getClient()
    
    const updateData: AnalysisUpdate = {
      name: updates.name,
      description: updates.description || null,
      status: updates.status,
      total_products: updates.totalProducts,
      valid_products: updates.validProducts,
      invalid_products: updates.invalidProducts,
      average_score: updates.averageScore,
      stats: updates.stats as any,
      metadata: updates.metadata as any,
      completed_at: updates.completedAt?.toISOString() || null,
      updated_at: new Date().toISOString(),
    }

    // Usuwanie null/undefined wartości
    const cleanedData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined && value !== null)
    )

    const { error } = await client
      .from('analyses')
      .update(cleanedData)
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating analysis:', error)
      throw new Error(`Failed to update analysis: ${error.message}`)
    }
  }

  // Usuwanie analizy (hard delete)
  async deleteAnalysis(id: string, userId: string): Promise<void> {
    const client = await this.getClient()
    
    const { error } = await client
      .from('analyses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting analysis:', error)
      throw new Error(`Failed to delete analysis: ${error.message}`)
    }
  }

  // Dodawanie plików do analizy
  async addFilesToAnalysis(analysisId: string, files: AnalysisFile[], userId: string): Promise<void> {
    const client = await this.getClient()
    
    const fileData: AnalysisFileInsert[] = files.map(file => ({
      analysis_id: analysisId,
      user_id: userId,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      status: file.status,
      product_count: file.productCount,
      error_message: file.error || null,
      uploaded_at: file.uploadedAt.toISOString(),
      storage_path: '', // TODO: Implementować storage
    }))

    console.log('💾 Zapisywanie plików do bazy:', fileData.length)
    const { error } = await client
      .from('analysis_files')
      .insert(fileData)

    if (error) {
      console.error('❌ Error adding files to analysis:', error)
      throw new Error(`Failed to add files to analysis: ${error.message}`)
    }
    
    console.log('✅ Pliki zapisane do bazy danych')
  }

  // Usuwanie pliku z analizy
  async removeFileFromAnalysis(analysisId: string, fileId: string, userId: string): Promise<void> {
    const client = await this.getClient()
    
    // Sprawdzenie czy analiza należy do użytkownika
    const { error: checkError } = await client
      .from('analyses')
      .select('id')
      .eq('id', analysisId)
      .eq('user_id', userId)
      .single()

    if (checkError) {
      throw new Error('Analysis not found or access denied')
    }

    const { error } = await client
      .from('analysis_files')
      .delete()
      .eq('id', fileId)
      .eq('analysis_id', analysisId)

    if (error) {
      console.error('Error removing file from analysis:', error)
      throw new Error(`Failed to remove file from analysis: ${error.message}`)
    }
  }

  // Aktualizacja statusu pliku
  async updateFileStatus(analysisId: string, fileId: string, status: AnalysisFile['status'], errorMessage?: string, userId?: string): Promise<void> {
    const client = await this.getClient()
    
    // Sprawdzenie czy analiza należy do użytkownika (jeśli userId podane)
    if (userId) {
      const { error: checkError } = await client
        .from('analyses')
        .select('id')
        .eq('id', analysisId)
        .eq('user_id', userId)
        .single()

      if (checkError) {
        throw new Error('Analysis not found or access denied')
      }
    }

    const { error } = await client
      .from('analysis_files')
      .update({
        status,
        error_message: errorMessage || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', fileId)
      .eq('analysis_id', analysisId)

    if (error) {
      console.error('Error updating file status:', error)
      throw new Error(`Failed to update file status: ${error.message}`)
    }
  }

  // Mapowanie wierszy bazy danych na obiekty Analysis
  private mapRowsToAnalyses(rows: (AnalysisRow & { analysis_files: AnalysisFileRow[] })[]): Analysis[] {
    return rows.map(row => this.mapRowToAnalysis(row))
  }

  private mapRowToAnalysis(row: AnalysisRow & { analysis_files?: AnalysisFileRow[] }): Analysis {
    return {
      id: row.id,
      name: row.name,
      description: row.description || undefined,
      type: row.type as any,
      status: row.status as any,
      createdAt: new Date(row.created_at || new Date()),
      updatedAt: new Date(row.updated_at || new Date()),
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
      files: (row.analysis_files || []).map(file => this.mapFileRowToAnalysisFile(file)),
      products: [], // TODO: Implementować pobieranie produktów
      totalProducts: row.total_products || 0,
      validProducts: row.valid_products || 0,
      invalidProducts: row.invalid_products || 0,
      evaluations: [], // TODO: Implementować pobieranie ocen
      averageScore: row.average_score || 0,
      stats: row.stats as any,
      metadata: row.metadata as any,
    }
  }

  private mapFileRowToAnalysisFile(row: AnalysisFileRow): AnalysisFile {
    return {
      id: row.id,
      name: row.file_name,
      size: row.file_size,
      type: row.file_type,
      status: row.status as any,
      productCount: row.product_count || 0,
      error: row.error_message || undefined,
      uploadedAt: new Date(row.uploaded_at || new Date()),
    }
  }
}

export const supabaseAnalysisService = new SupabaseAnalysisService()
