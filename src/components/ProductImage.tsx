import React, { useState } from 'react'
import { Image, Eye, X, ExternalLink } from 'lucide-react'

interface ProductImageProps {
  foto: string
  nazwa: string
  className?: string
}

const ProductImage: React.FC<ProductImageProps> = ({ foto, nazwa, className = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Sprawdź czy foto to link czy tekst "FOTO"
  const isImageLink = foto && foto !== 'FOTO' && foto.startsWith('http')
  
  const handleImageClick = () => {
    if (isImageLink) {
      setIsModalOpen(true)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const openExternalLink = () => {
    if (isImageLink) {
      window.open(foto, '_blank')
    }
  }

  if (!isImageLink || imageError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-4">
          <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500">
            {foto === 'FOTO' ? 'Zdjęcie dostępne' : 'Brak zdjęcia'}
          </p>
        </div>
      </div>
    )
  }

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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>
            
            <div className="bg-white rounded-lg p-4">
              <img
                src={foto}
                alt={nazwa}
                className="max-w-full max-h-[80vh] object-contain rounded"
              />
              
              <div className="mt-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">
                  {nazwa}
                </h3>
                <button
                  onClick={openExternalLink}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Otwórz w nowej karcie</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductImage


