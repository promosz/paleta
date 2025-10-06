# FileUpload Component - Dokumentacja

> Komponent do uploadu plików z drag & drop, walidacją i progress tracking

## 🎯 Przegląd

Komponent `FileUpload` umożliwia użytkownikom upload plików XLSX, PDF, CSV z zaawansowanymi funkcjami:
- Drag & drop interface
- Walidacja formatów i rozmiarów
- Progress tracking
- Error handling
- File preview

## 📦 Instalacja

Komponent wymaga następujących zależności:

```bash
npm install react-dropzone react-hook-form zustand
```

## 🔧 Użycie

### Podstawowe użycie

```tsx
import { FileUpload } from '../components/upload'

function MyComponent() {
  const handleUploadComplete = (files) => {
    console.log('Upload zakończony:', files)
  }

  return (
    <FileUpload
      onUploadComplete={handleUploadComplete}
      maxFiles={5}
    />
  )
}
```

### Zaawansowane użycie

```tsx
import { FileUpload } from '../components/upload'
import { useUploadStore } from '../stores/uploadStore'

function AnalysisPage() {
  const { files, clearFiles } = useUploadStore()

  const handleUploadComplete = (uploadedFiles) => {
    // Przetwarzanie załadowanych plików
    uploadedFiles.forEach(file => {
      console.log(`Plik ${file.name} został załadowany`)
    })
  }

  return (
    <div>
      <FileUpload
        onUploadComplete={handleUploadComplete}
        maxFiles={10}
        className="mb-6"
      />
      
      {files.length > 0 && (
        <button onClick={clearFiles}>
          Wyczyść wszystkie pliki
        </button>
      )}
    </div>
  )
}
```

## 🎨 Props

### FileUploadProps

| Prop | Typ | Domyślna wartość | Opis |
|------|-----|------------------|------|
| `onUploadComplete` | `(files: UploadFile[]) => void` | `undefined` | Callback wywoływany po zakończeniu uploadu |
| `maxFiles` | `number` | `10` | Maksymalna liczba plików |
| `className` | `string` | `''` | Dodatkowe klasy CSS |

## 🏗️ Architektura

### Store (Zustand)

Komponent używa Zustand store do zarządzania stanem:

```typescript
interface UploadState {
  files: UploadFile[]
  isUploading: boolean
  uploadProgress: number
  
  // Akcje
  addFiles: (files: File[]) => void
  removeFile: (id: string) => void
  updateFileStatus: (id: string, status: UploadFile['status'], progress?: number, error?: string) => void
  clearFiles: () => void
  setUploading: (isUploading: boolean) => void
  setUploadProgress: (progress: number) => void
}
```

### UploadFile Interface

```typescript
interface UploadFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
  uploadedAt?: Date
}
```

## 🔍 Funkcjonalności

### 1. Drag & Drop Interface

- **React Dropzone**: Biblioteka do obsługi drag & drop
- **Wizualne feedback**: Zmiana kolorów podczas przeciągania
- **Multiple files**: Obsługa wielu plików jednocześnie
- **File types**: Ograniczenie do XLSX, XLS, CSV, PDF

```tsx
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
  disabled: isUploading
})
```

### 2. Walidacja Plików

- **Format**: Sprawdzanie typu MIME i rozszerzenia
- **Rozmiar**: Maksymalny rozmiar 10MB
- **Integralność**: Podstawowe sprawdzenie pliku

```typescript
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Sprawdzanie rozmiaru
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `Plik jest za duży. Maksymalny rozmiar: ${maxSize / (1024 * 1024)}MB`
    }
  }

  // Sprawdzanie typu
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
    'application/pdf'
  ]
  
  // ... reszta walidacji
}
```

### 3. Progress Tracking

- **Status pliku**: pending, uploading, success, error
- **Progress bar**: Wizualny postęp uploadu
- **Real-time updates**: Aktualizacja w czasie rzeczywistym

```tsx
const renderFileStatus = (file: UploadFile) => {
  switch (file.status) {
    case 'pending':
      return <StatusBadge status="info">Oczekuje</StatusBadge>
    case 'uploading':
      return <StatusBadge status="warning">W toku ({file.progress}%)</StatusBadge>
    case 'success':
      return <StatusBadge status="success">Załadowany</StatusBadge>
    case 'error':
      return <StatusBadge status="danger">Błąd</StatusBadge>
  }
}
```

### 4. Error Handling

- **Walidacja błędów**: Wyświetlanie błędów walidacji
- **Upload błędów**: Obsługa błędów podczas uploadu
- **Retry mechanism**: Możliwość ponowienia uploadu
- **User-friendly messages**: Przyjazne komunikaty błędów

## 🎨 Styling

### CSS Classes

Komponent używa Tailwind CSS classes:

```css
/* Dropzone */
.border-2.border-dashed.rounded-lg.p-8.text-center.cursor-pointer

/* Drag active */
.border-primary-500.bg-primary-50.text-primary-600

/* Drag reject */
.border-danger-500.bg-danger-50.text-danger-600

/* File item */
.flex.items-center.justify-between.p-3.bg-neutral-50.rounded-lg
```

### Responsywność

- **Mobile**: Pełna szerokość, większe touch targets
- **Tablet**: Optymalizacja dla średnich ekranów
- **Desktop**: Pełna funkcjonalność z hover effects

## 🔧 Konfiguracja

### Maksymalny rozmiar pliku

```typescript
// W uploadStore.ts
const maxSize = 10 * 1024 * 1024 // 10MB
```

### Obsługiwane formaty

```typescript
const allowedTypes = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'text/csv', // .csv
  'application/pdf' // .pdf
]
```

### Maksymalna liczba plików

```tsx
<FileUpload maxFiles={5} />
```

## 🧪 Testowanie

### Testy jednostkowe

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { FileUpload } from '../FileUpload'

test('renders file upload component', () => {
  render(<FileUpload />)
  expect(screen.getByText('Przeciągnij pliki tutaj lub kliknij aby wybrać')).toBeInTheDocument()
})

test('handles file drop', () => {
  const onUploadComplete = jest.fn()
  render(<FileUpload onUploadComplete={onUploadComplete} />)
  
  // Test drag & drop
  const dropzone = screen.getByRole('button')
  fireEvent.drop(dropzone, {
    dataTransfer: {
      files: [new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })]
    }
  })
  
  expect(onUploadComplete).toHaveBeenCalled()
})
```

### Testy integracyjne

```typescript
test('file upload workflow', async () => {
  render(<AnalysisPage />)
  
  // 1. Sprawdź czy komponent się renderuje
  expect(screen.getByText('Nowa analiza')).toBeInTheDocument()
  
  // 2. Dodaj plik
  const file = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const input = screen.getByRole('button')
  fireEvent.change(input, { target: { files: [file] } })
  
  // 3. Sprawdź czy plik się dodał
  expect(screen.getByText('test.xlsx')).toBeInTheDocument()
  
  // 4. Rozpocznij upload
  fireEvent.click(screen.getByText('Rozpocznij upload'))
  
  // 5. Sprawdź status
  expect(screen.getByText('W toku')).toBeInTheDocument()
})
```

## 🚀 Performance

### Optymalizacje

- **Lazy loading**: Komponent ładuje się tylko gdy potrzebny
- **Memoization**: `useCallback` dla funkcji
- **Debouncing**: Opóźnienie dla uploadu
- **File validation**: Szybka walidacja po stronie klienta

### Bundle size

- **React Dropzone**: ~15KB gzipped
- **Zustand**: ~2KB gzipped
- **Total**: ~17KB gzipped

## 🔒 Bezpieczeństwo

### Walidacja po stronie klienta

- **File type**: Sprawdzanie MIME type i rozszerzenia
- **File size**: Ograniczenie rozmiaru
- **File name**: Sanityzacja nazw plików

### Bezpieczeństwo po stronie serwera

```typescript
// Przykład walidacji po stronie serwera
const validateFileServer = (file: File) => {
  // Sprawdzenie magic numbers
  const magicNumbers = {
    'xlsx': [0x50, 0x4B, 0x03, 0x04],
    'pdf': [0x25, 0x50, 0x44, 0x46],
    'csv': [0xEF, 0xBB, 0xBF] // UTF-8 BOM
  }
  
  // Sprawdzenie rozmiaru
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large')
  }
  
  // Sprawdzenie typu
  if (!isValidFileType(file)) {
    throw new Error('Invalid file type')
  }
}
```

## 🐛 Troubleshooting

### Częste problemy

1. **Plik nie się ładuje**
   - Sprawdź format pliku
   - Sprawdź rozmiar pliku
   - Sprawdź czy plik nie jest uszkodzony

2. **Drag & drop nie działa**
   - Sprawdź czy `react-dropzone` jest zainstalowane
   - Sprawdź czy komponent nie jest disabled

3. **Progress bar nie się aktualizuje**
   - Sprawdź czy `updateFileStatus` jest wywoływane
   - Sprawdź czy store jest poprawnie skonfigurowane

### Debug mode

```tsx
<FileUpload
  onUploadComplete={(files) => {
    console.log('Upload complete:', files)
  }}
  maxFiles={5}
  className="debug-mode"
/>
```

## 📚 Przykłady

### Przykład 1: Podstawowy upload

```tsx
function BasicUpload() {
  return (
    <FileUpload
      onUploadComplete={(files) => {
        console.log('Uploaded files:', files)
      }}
    />
  )
}
```

### Przykład 2: Upload z limitem

```tsx
function LimitedUpload() {
  return (
    <FileUpload
      maxFiles={3}
      onUploadComplete={(files) => {
        if (files.length === 3) {
          alert('Maksymalna liczba plików osiągnięta')
        }
      }}
    />
  )
}
```

### Przykład 3: Upload z custom styling

```tsx
function CustomUpload() {
  return (
    <FileUpload
      className="custom-upload"
      onUploadComplete={(files) => {
        // Custom logic
      }}
    />
  )
}
```

## 🔄 Changelog

### v1.0.0 (Styczeń 2025)
- ✅ Podstawowa funkcjonalność drag & drop
- ✅ Walidacja plików
- ✅ Progress tracking
- ✅ Error handling
- ✅ File preview
- ✅ Zustand store integration

### v1.1.0 (Planowane)
- 🔄 Batch upload
- 🔄 Resume upload
- 🔄 Cloud storage integration
- 🔄 Advanced file preview

## 🤝 Contributing

1. Fork projektu
2. Stwórz branch dla nowej funkcji
3. Commit zmiany
4. Push do branch
5. Otwórz Pull Request

## 📄 Licencja

MIT License - zobacz plik [LICENSE](LICENSE) dla szczegółów.

---

*Dokumentacja komponentu FileUpload utworzona: Styczeń 2025*  
*Wersja: 1.0*
