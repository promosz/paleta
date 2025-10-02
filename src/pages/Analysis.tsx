import React from 'react'
import { Card, CardHeader, CardBody, Button, StatusBadge } from '../components/ui'

const Analysis: React.FC = () => {
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
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
            <div className="text-neutral-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">
              Przeciągnij pliki tutaj lub kliknij aby wybrać
            </h3>
            <p className="text-neutral-500 mb-4">
              Obsługiwane formaty: .xlsx, .pdf, .csv
            </p>
            <p className="text-sm text-neutral-400 mb-6">
              Maksymalny rozmiar: 10MB
            </p>
            <Button variant="primary">
              Wybierz plik
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Analysis List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-800">
            Historia analiz
          </h2>
        </CardHeader>
        <CardBody>
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
        </CardBody>
      </Card>
    </div>
  )
}

export default Analysis
