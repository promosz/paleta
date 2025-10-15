// Serwis do pobierania zdjęć produktów z różnych źródeł

export interface ImageSearchResult {
  url: string
  title: string
  source: string
}

export class ImageService {
  private static instance: ImageService
  private cache: Map<string, ImageSearchResult[]> = new Map()

  static getInstance(): ImageService {
    if (!ImageService.instance) {
      ImageService.instance = new ImageService()
    }
    return ImageService.instance
  }

  // Pobierz zdjęcia na podstawie nazwy produktu
  async searchProductImages(productName: string): Promise<ImageSearchResult[]> {
    // Sprawdź cache
    const cacheKey = productName.toLowerCase().trim()
    const cached = this.cache.get(cacheKey)
    if (cached) {
      return cached
    }

    try {
      // Spróbuj różnych źródeł
      const images = await this.fetchFromMultipleSources(productName)
      
      // Zapisz w cache
      this.cache.set(cacheKey, images)
      
      return images
    } catch (error) {
      console.error('Error fetching product images:', error)
      return this.getFallbackImages(productName)
    }
  }

  private async fetchFromMultipleSources(productName: string): Promise<ImageSearchResult[]> {
    const images: ImageSearchResult[] = []
    
    // 1. Spróbuj Unsplash (darmowe, wysokiej jakości)
    try {
      const unsplashImages = await this.fetchFromUnsplash(productName)
      images.push(...unsplashImages)
    } catch (error) {
      console.log('Unsplash API failed:', error)
    }

    // 2. Spróbuj Pixabay (darmowe)
    try {
      const pixabayImages = await this.fetchFromPixabay(productName)
      images.push(...pixabayImages)
    } catch (error) {
      console.log('Pixabay API failed:', error)
    }

    // 3. Spróbuj Lorem Picsum (placeholder images)
    try {
      const picsumImages = await this.fetchFromLoremPicsum(productName)
      images.push(...picsumImages)
    } catch (error) {
      console.log('Lorem Picsum failed:', error)
    }

    // 4. Jeśli nie ma zdjęć, użyj fallback
    if (images.length === 0) {
      return this.getFallbackImages(productName)
    }

    return images.slice(0, 5) // Maksymalnie 5 zdjęć
  }

  private async fetchFromLoremPicsum(productName: string): Promise<ImageSearchResult[]> {
    // Lorem Picsum - darmowe placeholder images
    const images: ImageSearchResult[] = []
    
    // Generuj różne rozmiary i style
    const sizes = [
      { width: 400, height: 300 },
      { width: 500, height: 400 },
      { width: 600, height: 400 }
    ]
    
    sizes.forEach((size, index) => {
      images.push({
        url: `https://picsum.photos/${size.width}/${size.height}?random=${Date.now() + index}`,
        title: productName,
        source: 'Lorem Picsum'
      })
    })
    
    return images
  }

  private async fetchFromUnsplash(productName: string): Promise<ImageSearchResult[]> {
    // Unsplash API - wymaga klucza API
    const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY || 'demo'
    
    if (accessKey === 'demo') {
      // Demo mode - zwróć przykładowe zdjęcia
      return [
        {
          url: `https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=${encodeURIComponent(productName.substring(0, 15))}`,
          title: productName,
          source: 'Demo'
        },
        {
          url: `https://via.placeholder.com/400x300/059669/FFFFFF?text=Product+Image`,
          title: 'Product Image',
          source: 'Demo'
        }
      ]
    }

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(productName)}&per_page=5&client_id=${accessKey}`
    )

    if (!response.ok) {
      throw new Error('Unsplash API error')
    }

    const data = await response.json()
    return data.results.map((photo: any) => ({
      url: photo.urls.regular,
      title: photo.alt_description || productName,
      source: 'Unsplash'
    }))
  }

  private async fetchFromPixabay(productName: string): Promise<ImageSearchResult[]> {
    // Pixabay API - wymaga klucza API
    const apiKey = process.env.REACT_APP_PIXABAY_API_KEY || 'demo'
    
    if (apiKey === 'demo') {
      return []
    }

    const response = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(productName)}&image_type=photo&per_page=5`
    )

    if (!response.ok) {
      throw new Error('Pixabay API error')
    }

    const data = await response.json()
    return data.hits.map((hit: any) => ({
      url: hit.webformatURL,
      title: hit.tags || productName,
      source: 'Pixabay'
    }))
  }

  private getFallbackImages(productName: string): ImageSearchResult[] {
    // Fallback - placeholder images z nazwą produktu
    return [
      {
        url: `https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=${encodeURIComponent(productName.substring(0, 15))}`,
        title: productName,
        source: 'Placeholder'
      },
      {
        url: `https://via.placeholder.com/400x300/059669/FFFFFF?text=Product+Image`,
        title: 'Product Image',
        source: 'Placeholder'
      },
      {
        url: `https://via.placeholder.com/400x300/DC2626/FFFFFF?text=Sample+Photo`,
        title: 'Sample Photo',
        source: 'Placeholder'
      }
    ]
  }

  // Wyczyść cache
  clearCache(): void {
    this.cache.clear()
  }

  // Pobierz statystyki cache
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

export const imageService = ImageService.getInstance()
