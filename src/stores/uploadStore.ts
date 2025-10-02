import { create } from 'zustand'
import type { ParseResult, ParsedProduct } from '../types/parser'

// Definicja typu dla pliku w uploadzie
export interface UploadFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
  uploadedAt?: Date
  parseResult?: ParseResult
}

// Definicja typu dla stanu uploadu
interface UploadState {
  files: UploadFile[]
  isUploading: boolean
  uploadProgress: number
  isParsing: boolean
  parsedProducts: ParsedProduct[]
  
  // Akcje
  addFiles: (files: File[]) => void
  removeFile: (id: string) => void
  updateFileStatus: (id: string, status: UploadFile['status'], progress?: number, error?: string) => void
  clearFiles: () => void
  setUploading: (isUploading: boolean) => void
  setUploadProgress: (progress: number) => void
  setParsing: (isParsing: boolean) => void
  setParseResult: (fileId: string, result: ParseResult) => void
  clearParsedProducts: () => void
  getAllParsedProducts: () => ParsedProduct[]
}

// Tworzenie store z Zustand
export const useUploadStore = create<UploadState>((set, get) => ({
  // Stan początkowy
  files: [],
  isUploading: false,
  uploadProgress: 0,
  isParsing: false,
  parsedProducts: [],

  // Dodawanie plików do uploadu
  addFiles: (newFiles: File[]) => {
    const currentFiles = get().files
    
    // Filtrujemy duplikaty (po nazwie i rozmiarze)
    const existingFileIds = new Set(
      currentFiles.map(f => `${f.name}-${f.size}`)
    )
    
    const uniqueFiles = newFiles.filter(
      file => !existingFileIds.has(`${file.name}-${file.size}`)
    )
    
    // Tworzymy obiekty UploadFile z unikalnymi ID
    const uploadFiles: UploadFile[] = uniqueFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      progress: 0
    }))
    
    set(state => ({
      files: [...state.files, ...uploadFiles]
    }))
  },

  // Usuwanie pliku z uploadu
  removeFile: (id: string) => {
    set(state => ({
      files: state.files.filter(file => file.id !== id)
    }))
  },

  // Aktualizacja statusu pliku
  updateFileStatus: (id: string, status: UploadFile['status'], progress = 0, error?: string) => {
    set(state => ({
      files: state.files.map(file =>
        file.id === id
          ? {
              ...file,
              status,
              progress,
              error,
              uploadedAt: status === 'success' ? new Date() : file.uploadedAt
            }
          : file
      )
    }))
  },

  // Czyszczenie wszystkich plików
  clearFiles: () => {
    set({
      files: [],
      isUploading: false,
      uploadProgress: 0,
      isParsing: false,
      parsedProducts: []
    })
  },

  // Ustawianie statusu uploadu
  setUploading: (isUploading: boolean) => {
    set({ isUploading })
  },

  // Ustawianie postępu uploadu
  setUploadProgress: (progress: number) => {
    set({ uploadProgress: progress })
  },

  // Ustawianie statusu parsowania
  setParsing: (isParsing: boolean) => {
    set({ isParsing })
  },

  // Ustawianie wyniku parsowania
  setParseResult: (fileId: string, result: ParseResult) => {
    set(state => ({
      files: state.files.map(file =>
        file.id === fileId
          ? { ...file, parseResult: result }
          : file
      ),
      parsedProducts: [...state.parsedProducts, ...result.products]
    }))
  },

  // Czyszczenie sparsowanych produktów
  clearParsedProducts: () => {
    set({ parsedProducts: [] })
  },

  // Pobieranie wszystkich sparsowanych produktów
  getAllParsedProducts: () => {
    return get().parsedProducts
  }
}))

// Funkcje pomocnicze do walidacji plików
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Sprawdzanie rozmiaru pliku (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `Plik jest za duży. Maksymalny rozmiar: ${maxSize / (1024 * 1024)}MB`
    }
  }

  // Sprawdzanie typu pliku
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv', // .csv
    'application/pdf' // .pdf
  ]
  
  const allowedExtensions = ['.xlsx', '.xls', '.csv', '.pdf']
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  
  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: 'Nieobsługiwany format pliku. Dozwolone: XLSX, XLS, CSV, PDF'
    }
  }

  return { isValid: true }
}

// Funkcja do formatowania rozmiaru pliku
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
