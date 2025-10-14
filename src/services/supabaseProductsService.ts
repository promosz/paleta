import { supabase } from '../lib/supabase'
import type { Product } from '../types/analysis'
import type { ParsedProduct } from '../types/parser'
import type { ProductEvaluation } from '../types/rules'
import type { Database } from '../types/supabase'

type ProductRow = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']

export class SupabaseProductsService {
  private supabase = supabase

  /**
   * Konwersja ParsedProduct na ProductInsert
   * @param parsedProduct - Produkt z parsera
   * @param analysisId - ID analizy
   * @param userId - ID użytkownika
   * @param evaluation - Opcjonalna ocena produktu
   */
  private mapParsedProductToInsert(
    parsedProduct: ParsedProduct,
    analysisId: string,
    userId: string,
    evaluation?: ProductEvaluation
  ): ProductInsert {
    return {
      analysis_id: analysisId,
      user_id: userId,
      
      // Dane podstawowe
      name: parsedProduct.name,
      category: parsedProduct.category || null,
      description: parsedProduct.description || null,
      
      // Ceny i ilości
      price: parsedProduct.price || null,
      quantity: parsedProduct.quantity || null,
      unit: parsedProduct.unit || null,
      
      // Identyfikatory
      ean: parsedProduct.ean || null,
      sku: parsedProduct.sku || null,
      brand: parsedProduct.brand || null,
      
      // Pola specyficzne dla palet
      paleta_id: parsedProduct.paletaId || null,
      foto: parsedProduct.foto || null,
      code1: parsedProduct.code1 || null,
      code2: parsedProduct.code2 || null,
      pack_id: parsedProduct.packId || null,
      fc_sku: parsedProduct.fcSku || null,
      link: parsedProduct.link || null,
      currency: parsedProduct.currency || 'PLN',
      price_gross: parsedProduct.priceGross || null,
      price_net: parsedProduct.priceNet || null,
      
      // Ocena (z reguł jeśli dostępna)
      score: evaluation?.score || 0,
      status: evaluation?.status || 'pending',
      evaluation_data: evaluation ? {
        compliance: evaluation.compliance || 0,
        recommendations: evaluation.recommendations,
        warnings: evaluation.warnings,
        blocks: evaluation.blocks,
        reason: evaluation.reason || ''
      } : null,
      
      // Metadane
      source: parsedProduct.source || null,
      row_index: parsedProduct.rowIndex || null,
      raw_data: parsedProduct.rawData ? parsedProduct.rawData as any : null,
    }
  }

  /**
   * Konwersja ProductRow na Product
   */
  private mapRowToProduct(row: ProductRow): Product {
    return {
      id: row.id,
      analysisId: row.analysis_id,
      userId: row.user_id,
      
      // Dane podstawowe
      name: row.name,
      category: row.category || undefined,
      description: row.description || undefined,
      
      // Ceny i ilości
      price: row.price || undefined,
      quantity: row.quantity || undefined,
      unit: row.unit || undefined,
      
      // Identyfikatory
      ean: row.ean || undefined,
      sku: row.sku || undefined,
      brand: row.brand || undefined,
      
      // Pola specyficzne dla palet
      paletaId: row.paleta_id || undefined,
      foto: row.foto || undefined,
      code1: row.code1 || undefined,
      code2: row.code2 || undefined,
      packId: row.pack_id || undefined,
      fcSku: row.fc_sku || undefined,
      link: row.link || undefined,
      currency: row.currency || undefined,
      priceGross: row.price_gross || undefined,
      priceNet: row.price_net || undefined,
      
      // Ocena
      score: row.score || 0,
      status: row.status as any,
      evaluationData: row.evaluation_data as any,
      
      // Metadane
      source: row.source || undefined,
      rowIndex: row.row_index || undefined,
      rawData: row.raw_data as any,
      
      // Daty
      createdAt: new Date(row.created_at || new Date()),
      updatedAt: new Date(row.updated_at || new Date()),
    }
  }

  /**
   * Dodanie pojedynczego produktu
   */
  async addProduct(
    parsedProduct: ParsedProduct,
    analysisId: string,
    userId: string,
    evaluation?: ProductEvaluation
  ): Promise<Product> {
    const productData = this.mapParsedProductToInsert(parsedProduct, analysisId, userId, evaluation)
    
    const { data, error } = await this.supabase
      .from('products')
      .insert(productData)
      .select()
      .single()

    if (error) {
      console.error('Error adding product:', error)
      throw new Error(`Failed to add product: ${error.message}`)
    }

    return this.mapRowToProduct(data)
  }

  /**
   * Dodanie wielu produktów (bulk insert)
   */
  async addProducts(
    parsedProducts: ParsedProduct[],
    analysisId: string,
    userId: string,
    evaluations?: ProductEvaluation[]
  ): Promise<Product[]> {
    console.log(`📦 Dodawanie ${parsedProducts.length} produktów do bazy...`)
    
    // Mapowanie produktów z ocenami
    const productsData = parsedProducts.map((product) => {
      const evaluation = evaluations?.find(e => e.productId === product.id)
      return this.mapParsedProductToInsert(product, analysisId, userId, evaluation)
    })

    // Bulk insert (Supabase obsługuje max ~1000 rekordów na raz)
    const batchSize = 500
    const batches: ProductInsert[][] = []
    
    for (let i = 0; i < productsData.length; i += batchSize) {
      batches.push(productsData.slice(i, i + batchSize))
    }

    console.log(`📊 Zapisuję w ${batches.length} partiach (${batchSize} produktów/partia)`)

    const allProducts: Product[] = []

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      console.log(`  Partia ${i + 1}/${batches.length}: ${batch.length} produktów...`)
      
      const { data, error } = await this.supabase
        .from('products')
        .insert(batch)
        .select()

      if (error) {
        console.error(`❌ Error in batch ${i + 1}:`, error)
        throw new Error(`Failed to add products batch ${i + 1}: ${error.message}`)
      }

      const products = data.map(row => this.mapRowToProduct(row))
      allProducts.push(...products)
      console.log(`  ✅ Partia ${i + 1} zapisana (${products.length} produktów)`)
    }

    console.log(`✅ Wszystkie produkty zapisane: ${allProducts.length}`)
    return allProducts
  }

  /**
   * Pobieranie produktów dla analizy
   */
  async getProductsForAnalysis(analysisId: string, userId: string): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('analysis_id', analysisId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching products:', error)
      throw new Error(`Failed to fetch products: ${error.message}`)
    }

    return (data || []).map(row => this.mapRowToProduct(row))
  }

  /**
   * Pobieranie pojedynczego produktu
   */
  async getProduct(productId: string, userId: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      console.error('Error fetching product:', error)
      throw new Error(`Failed to fetch product: ${error.message}`)
    }

    return this.mapRowToProduct(data)
  }

  /**
   * Aktualizacja produktu
   */
  async updateProduct(
    productId: string,
    updates: Partial<Product>,
    userId: string
  ): Promise<void> {
    const updateData: ProductUpdate = {
      name: updates.name,
      category: updates.category || null,
      description: updates.description || null,
      price: updates.price || null,
      quantity: updates.quantity || null,
      score: updates.score,
      status: updates.status,
      evaluation_data: updates.evaluationData as any,
    }

    // Usuwanie undefined wartości
    const cleanedData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    )

    const { error } = await this.supabase
      .from('products')
      .update(cleanedData)
      .eq('id', productId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating product:', error)
      throw new Error(`Failed to update product: ${error.message}`)
    }
  }

  /**
   * Usuwanie produktu
   */
  async deleteProduct(productId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting product:', error)
      throw new Error(`Failed to delete product: ${error.message}`)
    }
  }

  /**
   * Usuwanie wszystkich produktów analizy
   */
  async deleteProductsForAnalysis(analysisId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('products')
      .delete()
      .eq('analysis_id', analysisId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting products:', error)
      throw new Error(`Failed to delete products: ${error.message}`)
    }
  }

  /**
   * Pobieranie statystyk produktów
   */
  async getProductStats(analysisId: string, userId: string) {
    const products = await this.getProductsForAnalysis(analysisId, userId)

    return {
      total: products.length,
      ok: products.filter(p => p.status === 'ok').length,
      warning: products.filter(p => p.status === 'warning').length,
      blocked: products.filter(p => p.status === 'blocked').length,
      pending: products.filter(p => p.status === 'pending').length,
      averageScore: products.reduce((acc, p) => acc + p.score, 0) / products.length || 0,
      categories: [...new Set(products.map(p => p.category).filter(Boolean))],
      totalValue: products.reduce((acc, p) => acc + ((p.price || 0) * (p.quantity || 1)), 0),
    }
  }
}

export const supabaseProductsService = new SupabaseProductsService()





