import React from 'react'
import { Card, CardHeader, CardBody, StatusBadge, DataTable } from '../components/ui'
import { FileUpload } from '../components/upload'
import { useUploadStore, type UploadFile } from '../stores/uploadStore'

const Analysis: React.FC = () => {
  const { files, getAllParsedProducts } = useUploadStore()
  const parsedProducts = getAllParsedProducts()

  // Funkcja obsługująca zakończenie uploadu
  const handleUploadComplete = (uploadedFiles: UploadFile[]) => {
    console.log('Upload zakończony:', uploadedFiles)
    // TODO: Tutaj będzie logika analizy plików
    // Na razie tylko logujemy do konsoli
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">
          Analizy
        </h1>
        <p className="text-neutral-600">
          Zarządzaj analizami zestawów produktów
        </p>
      </div>

      {/* Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-800">
            Nowa analiza
          </h2>
        </CardHeader>
        <CardBody>
          <FileUpload
            onUploadComplete={handleUploadComplete}
            maxFiles={5}
          />
        </CardBody>
      </Card>

      {/* Parsed Data Table */}
      {parsedProducts.length > 0 && (
        <DataTable
          products={parsedProducts}
          title="Sparsowane produkty"
          showSource={true}
          showRawData={false}
          maxRows={1000}
          className="mb-8"
        />
      )}

      {/* Analysis List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-800">
            Historia analiz
          </h2>
        </CardHeader>
        <CardBody>
          {files.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-600 mb-2">
                Brak analiz
              </h3>
              <p className="text-neutral-500 mb-4">
                Załaduj pierwszy plik aby rozpocząć analizę
              </p>
              <StatusBadge status="info">
                Użyj sekcji "Nowa analiza" powyżej
              </StatusBadge>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Załadowane pliki ({files.length})
                </h3>
                <StatusBadge status="success">
                  {parsedProducts.length > 0 ? `${parsedProducts.length} produktów sparsowanych` : 'Gotowe do analizy'}
                </StatusBadge>
              </div>
              
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 text-neutral-500">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-neutral-500">
                          {file.size} bytes • {file.type}
                        </p>
                        {file.parseResult && (
                          <p className="text-xs text-primary-600">
                            {file.parseResult.products.length} produktów • {file.parseResult.metadata?.validRows || 0} poprawnych
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <StatusBadge 
                      status={
                        file.parseResult?.status === 'success' ? 'success' :
                        file.parseResult?.status === 'error' ? 'danger' :
                        file.status === 'success' ? 'success' :
                        file.status === 'error' ? 'danger' :
                        file.status === 'uploading' ? 'warning' : 'info'
                      }
                    >
                      {file.parseResult?.status === 'success' ? 'Sparsowany' :
                       file.parseResult?.status === 'error' ? 'Błąd parsowania' :
                       file.status === 'success' ? 'Załadowany' :
                       file.status === 'error' ? 'Błąd' :
                       file.status === 'uploading' ? 'W toku' : 'Oczekuje'}
                    </StatusBadge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default Analysis
