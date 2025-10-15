import React, { useState, useEffect } from 'react'
import { Image, Eye, X, ExternalLink } from 'lucide-react'
import { imageService, ImageSearchResult } from '../services/imageService'

interface ProductImageProps {
  foto: string
  nazwa: string
  className?: string
}

const ProductImage: React.FC<ProductImageProps> = ({ foto, nazwa, className = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [productImages, setProductImages] = useState<ImageSearchResult[]>([])
  const [isLoadingImages, setIsLoadingImages] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Debug logging
  console.log('ProductImage render:', { foto, nazwa, className })

  // Sprawdź czy foto to link Google czy zwykły link
  const isGoogleSearchLink = foto && foto.includes('google.com/search')
  const isImageLink = foto && foto !== 'FOTO' && foto.startsWith('http') && !isGoogleSearchLink
  
  console.log('isGoogleSearchLink:', isGoogleSearchLink)
  console.log('isImageLink:', isImageLink)

  // Obsługa klawiatury
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isModalOpen) return
      
      switch (event.key) {
        case 'Escape':
          setIsModalOpen(false)
          break
        case 'ArrowLeft':
          if (productImages.length > 1) {
            prevImage()
          }
          break
        case 'ArrowRight':
          if (productImages.length > 1) {
            nextImage()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, productImages.length])

  // Pobierz zdjęcia gdy komponent się montuje
  useEffect(() => {
    if (nazwa && nazwa.trim() !== '') {
      fetchProductImages(nazwa)
    }
  }, [nazwa])

  const fetchProductImages = async (productName: string) => {
    try {
      const images = await imageService.searchProductImages(productName)
      setProductImages(images)
      console.log(`Found ${images.length} images for product: ${productName}`)
    } catch (error) {
      console.error('Error fetching product images:', error)
      setProductImages([])
    } finally {
      setIsLoadingImages(false)
    }
  }

  const handleImageClick = () => {
    if (isImageLink) {
      setIsModalOpen(true)
    } else if (productImages.length > 0) {
      setIsModalOpen(true)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  // Jeśli mamy zdjęcia produktu (z wyszukiwania)
  if (productImages.length > 0) {
    return (
      <>
        <div 
          className={`relative cursor-pointer group ${className}`}
          onClick={handleImageClick}
        >
          <img
            src={productImages[0].url}
            alt={productImages[0].title}
            className="w-full h-full object-cover rounded-lg"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
            <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
          <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded">
            {productImages.length}
          </div>
        </div>

        {/* Modal z galerią zdjęć - poprawiony */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <div 
              className="relative max-w-6xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Przycisk zamykania */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="bg-white rounded-lg overflow-hidden">
                {/* Zdjęcie zajmuje cały lightbox */}
                <div className="relative">
                  <img
                    src={productImages[currentImageIndex].url}
                    alt={productImages[currentImageIndex].title}
                    className="w-full h-[70vh] object-contain bg-gray-100"
                  />
                  
                  {/* Nawigacja między zdjęciami */}
                  {productImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>
                
                {/* Informacje o zdjęciu */}
                <div className="p-4 bg-white border-t">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {nazwa}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Źródło: {productImages[currentImageIndex].source}
                      </p>
                      {productImages.length > 1 && (
                        <p className="text-sm text-gray-500">
                          {currentImageIndex + 1} z {productImages.length}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {foto && foto.includes('google.com/search') && (
                        <button
                          onClick={() => window.open(foto, '_blank')}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Otwórz w Google</span>
                        </button>
                      )}
                      <button
                        onClick={() => window.open(productImages[currentImageIndex].url, '_blank')}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Otwórz zdjęcie</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Jeśli to zwykły link do zdjęcia
  if (isImageLink && !imageError) {
    return (
      <>
        <div 
          className={`relative cursor-pointer group ${className}`}
          onClick={handleImageClick}
        >
          <img
            src={foto}
            alt={nazwa}
            className="w-full h-full object-cover rounded-lg"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
            <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        </div>

        {/* Modal - poprawiony */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <div 
              className="relative max-w-6xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Przycisk zamykania */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="bg-white rounded-lg overflow-hidden">
                {/* Zdjęcie zajmuje cały lightbox */}
                <div className="relative">
                  <img
                    src={foto}
                    alt={nazwa}
                    className="w-full h-[70vh] object-contain bg-gray-100"
                  />
                </div>
                
                {/* Informacje o zdjęciu */}
                <div className="p-4 bg-white border-t">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {nazwa}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Źródło: Oryginalny link
                      </p>
                    </div>
                    <button
                      onClick={() => window.open(foto, '_blank')}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Otwórz w nowej karcie</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Placeholder dla brakujących zdjęć
  return (
    <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
      <div className="text-center p-4">
        {isLoadingImages ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        ) : (
          <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        )}
        <p className="text-xs text-gray-500 mb-2">
          {isLoadingImages ? 'Ładowanie zdjęć...' : 'Brak zdjęcia'}
        </p>
        {foto && foto !== 'FOTO' && foto.trim() !== '' && (
          <button
            onClick={() => {
              console.log('Opening link:', foto)
              window.open(foto, '_blank')
            }}
            className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer transition-colors bg-white px-2 py-1 rounded border"
            title="Kliknij aby otworzyć link w nowym oknie"
          >
            Otwórz link
          </button>
        )}
        {(!foto || foto === 'FOTO' || foto.trim() === '') && (
          <p className="text-xs text-gray-400">
            Brak linku do otwarcia
          </p>
        )}
      </div>
    </div>
  )
}

export default ProductImage


