
import { useDropzone } from 'react-dropzone'
import { Button } from '../ui'
import { useFileAnalysis } from '../../hooks/useFileAnalysis'

interface FileUploadZoneProps {
  /** Opcja: czy nawigować do Dashboard po udanym uploadzie */
  navigateToDashboard?: boolean
  /** Callback wywoływany po udanym utworzeniu analizy */
  onSuccess?: (analysisId: string) => void
  /** Dodatkowe klasy CSS */
  className?: string
  /** Opis sekcji */
  description?: string
  /** Czy pokazać przycisk wyboru plików */
  showButton?: boolean
}

/**
 * Wspólny komponent do uploadu plików z pełną integracją
 * Używa hooka useFileAnalysis dla spójnej funkcjonalności
 */
export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  navigateToDashboard = false,
  onSuccess,
  className = '',
  description,
  showButton = true
}) => {
  const { 
    handleFileDrop, 
    isProcessing, 
    isEvaluating, 
    error,
    isLoaded,
    isSignedIn 
  } = useFileAnalysis()

  // Konfiguracja react-dropzone
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: (acceptedFiles) => handleFileDrop(acceptedFiles, {
      navigateToDashboard,
      onSuccess
    }),
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 5,
    multiple: true,
    disabled: isEvaluating || isProcessing || !isLoaded || !isSignedIn
  })

  // Show loading state
  if (!isLoaded) {
    return (
      <div className="border-2 border-dashed rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Ładowanie...</p>
      </div>
    )
  }

  // Show not signed in state
  if (!isSignedIn) {
    return (
      <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-50">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Musisz się zalogować</h3>
        <p className="text-gray-600">Zaloguj się aby dodawać i analizować pliki</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive && !isDragReject
            ? 'border-primary-500 bg-primary-50 text-primary-600'
            : isDragReject
            ? 'border-danger-500 bg-danger-50 text-danger-600'
            : 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'
          }
          ${(isEvaluating || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          {/* Ikona uploadu */}
          <div className="mx-auto w-16 h-16 text-neutral-400">
            {isProcessing || isEvaluating ? (
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
            ) : (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            )}
          </div>

          {/* Status przetwarzania */}
          {(isProcessing || isEvaluating) && (
            <div>
              <p className="text-lg font-medium text-primary-600">
                {isEvaluating ? 'Ocena produktów...' : 'Przetwarzanie plików...'}
              </p>
              <p className="text-sm text-neutral-600 mt-2">
                To może chwilę potrwać
              </p>
            </div>
          )}

          {/* Normalna instrukcja */}
          {!isProcessing && !isEvaluating && (
            <div>
              <p className="text-lg font-medium">
                {isDragActive
                  ? 'Upuść pliki tutaj...'
                  : 'Przeciągnij pliki tutaj lub kliknij aby wybrać'}
              </p>
              {description ? (
                <p className="text-sm text-neutral-600 mt-2">{description}</p>
              ) : (
                <>
                  <p className="text-sm text-neutral-600 mt-2">
                    Obsługiwane formaty: XLSX, XLS, CSV, PDF
                  </p>
                  <p className="text-sm text-neutral-500">
                    Maksymalny rozmiar: 10MB na plik • Automatyczna analiza po wskazaniu
                  </p>
                </>
              )}
            </div>
          )}

          {/* Przycisk wyboru plików */}
          {!isEvaluating && !isProcessing && showButton && (
            <Button variant="secondary" size="sm">
              Wybierz pliki
            </Button>
          )}
        </div>
      </div>

      {/* Błędy */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Błąd przetwarzania</h3>
              <div className="mt-2 text-sm text-red-700 whitespace-pre-line">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

