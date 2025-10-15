import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useUploadStore, validateFile, formatFileSize, type UploadFile } from '../../stores/uploadStore'
import { Button, Card, CardBody, StatusBadge } from '../ui'
import { parserService } from '../../utils/parserService'

interface FileUploadProps {
  onUploadComplete?: (files: UploadFile[]) => void
  maxFiles?: number
  className?: string
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  maxFiles = 10,
  className = ''
}) => {
  const { files, addFiles, removeFile, isUploading, isParsing, setParsing, setParseResult } = useUploadStore()

  // Funkcja obsługująca dodawanie plików
  const handleFiles = useCallback((acceptedFiles: File[]) => {
    // Walidacja każdego pliku
    const validFiles: File[] = []
    const errors: string[] = []

    acceptedFiles.forEach(file => {
      const validation = validateFile(file)
      if (validation.isValid) {
        validFiles.push(file)
      } else {
        errors.push(`${file.name}: ${validation.error}`)
      }
    })

    // Wyświetlanie błędów walidacji
    if (errors.length > 0) {
      console.warn('Błędy walidacji plików:', errors)
      // TODO: Dodać toast notifications
    }

    // Dodawanie tylko poprawnych plików
    if (validFiles.length > 0) {
      addFiles(validFiles)
    }
  }, [addFiles])

  // Konfiguracja react-dropzone
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: handleFiles,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf']
    },
    maxFiles,
    multiple: true,
    disabled: isUploading,
  })

  // Funkcja usuwania pliku
  const handleRemoveFile = (fileId: string) => {
    removeFile(fileId)
  }

  // Funkcja czyszczenia wszystkich plików
  const handleClearAll = () => {
    useUploadStore.getState().clearFiles()
  }

  // Funkcja rozpoczęcia uploadu i parsowania
  const handleStartUpload = async () => {
    if (files.length === 0) return
    
    // Rozpoczęcie uploadu
    useUploadStore.getState().setUploading(true)
    
    // Symulacja uploadu plików
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      useUploadStore.getState().updateFileStatus(file.id, 'uploading', 0)
      
      // Symulacja postępu uploadu
      await new Promise(resolve => {
        let currentProgress = 0
        const progressInterval = setInterval(() => {
          currentProgress += Math.random() * 15 + 5 // Dodaje 5-20%
          currentProgress = Math.min(currentProgress, 100)
          useUploadStore.getState().updateFileStatus(file.id, 'uploading', currentProgress)
          
          if (currentProgress >= 100) {
            clearInterval(progressInterval)
            useUploadStore.getState().updateFileStatus(file.id, 'success', 100)
            resolve(undefined)
          }
        }, 200)
      })
    }
    
    // Zakończenie uploadu
    useUploadStore.getState().setUploading(false)
    
    // Rozpoczęcie parsowania
    setParsing(true)
    
    try {
      console.log('FileUpload: Rozpoczynanie parsowania plików:', files.length)
      
      // Parsowanie każdego pliku
      for (const file of files) {
        console.log('FileUpload: Sprawdzanie pliku:', file.name, file.status)
        
        if (file.status === 'success') {
          console.log('FileUpload: Parsowanie pliku:', file.name)
          
          const result = await parserService.parseFile(
            file.file,
            (progress, status) => {
              console.log(`FileUpload: Parsowanie ${file.name}: ${progress}% - ${status}`)
            }
          )
          
          console.log('FileUpload: Wynik parsowania:', result.status, result.products.length, 'produktów')
          
          // Zapisanie wyniku parsowania
          setParseResult(file.id, result)
        } else {
          console.log('FileUpload: Pomijanie pliku (status nie success):', file.name, file.status)
        }
      }
      
      // Zakończenie parsowania
      console.log('FileUpload: Zakończenie parsowania')
      setParsing(false)
      
      // Wywołanie callback
      const allFiles = useUploadStore.getState().files
      console.log('FileUpload: Wywołanie callback onUploadComplete z plikami:', allFiles.length)
      onUploadComplete?.(allFiles)
      
    } catch (error) {
      console.error('FileUpload: Błąd parsowania:', error)
      setParsing(false)
      
      // Oznaczenie błędów
      files.forEach(file => {
        if (file.status === 'success') {
          useUploadStore.getState().updateFileStatus(
            file.id, 
            'error', 
            0, 
            error instanceof Error ? error.message : 'Błąd parsowania'
          )
        }
      })
    }
  }

  // Renderowanie statusu pliku
  const renderFileStatus = (file: UploadFile) => {
    if (isParsing && file.status === 'success') {
      return <StatusBadge status="warning">Parsowanie...</StatusBadge>
    }
    
    if (file.parseResult) {
      if (file.parseResult.status === 'success') {
        return (
          <div className="flex flex-col space-y-1">
            <StatusBadge status="success">Sparsowany</StatusBadge>
            <span className="text-xs text-neutral-500">
              {file.parseResult.products.length} produktów
            </span>
          </div>
        )
      } else if (file.parseResult.status === 'error') {
        return <StatusBadge status="danger">Błąd parsowania</StatusBadge>
      }
    }
    
    switch (file.status) {
      case 'pending':
        return <StatusBadge status="info">Oczekuje</StatusBadge>
      case 'uploading':
        return <StatusBadge status="warning">W toku ({file.progress}%)</StatusBadge>
      case 'success':
        return <StatusBadge status="success">Załadowany</StatusBadge>
      case 'error':
        return <StatusBadge status="danger">Błąd</StatusBadge>
      default:
        return <StatusBadge status="info">Nieznany</StatusBadge>
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Dropzone */}
      <Card>
        <CardBody>
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
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            <div className="space-y-4">
              {/* Ikona uploadu */}
              <div className="mx-auto w-16 h-16 text-neutral-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>

              {/* Tekst instrukcji */}
              <div>
                <p className="text-lg font-medium">
                  {isDragActive
                    ? 'Upuść pliki tutaj...'
                    : 'Przeciągnij pliki tutaj lub kliknij aby wybrać'}
                </p>
                <p className="text-sm text-neutral-600 mt-2">
                  Obsługiwane formaty: XLSX, XLS, CSV, PDF
                </p>
                <p className="text-sm text-neutral-500">
                  Maksymalny rozmiar: 10MB na plik
                </p>
              </div>

              {/* Przycisk wyboru plików */}
              {!isUploading && (
                <Button variant="secondary" size="sm">
                  Wybierz pliki
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Lista plików */}
      {files.length > 0 && (
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Pliki do uploadu ({files.length})
              </h3>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={isUploading}
                >
                  Wyczyść wszystkie
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleStartUpload}
                  disabled={isUploading || isParsing || files.length === 0}
                >
                  {isUploading ? 'Upload w toku...' : 
                   isParsing ? 'Parsowanie...' : 
                   'Rozpocznij upload i parsowanie'}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {/* Ikona pliku */}
                    <div className="w-8 h-8 text-neutral-500">
                      {file.type.includes('pdf') ? (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      ) : (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>

                    {/* Informacje o pliku */}
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-neutral-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Status pliku */}
                    {renderFileStatus(file)}

                    {/* Progress bar dla uploadu */}
                    {file.status === 'uploading' && (
                      <div className="w-20">
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Przycisk usuwania */}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveFile(file.id)}
                      disabled={file.status === 'uploading'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
