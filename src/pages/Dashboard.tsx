import React from 'react'
import { Card, CardHeader, CardBody, StatusBadge } from '../components/ui'

const Dashboard: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">
          Dashboard
        </h1>
        <p className="text-neutral-600">
          Przeglądaj historię analiz i statystyki
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">0</div>
              <div className="text-sm text-neutral-600">Przeanalizowane zestawy</div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-success-500 mb-2">0</div>
              <div className="text-sm text-neutral-600">Produkty w bazie</div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning-500 mb-2">0</div>
              <div className="text-sm text-neutral-600">Aktywne reguły</div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-neutral-500 mb-2">0</div>
              <div className="text-sm text-neutral-600">Ostatnia analiza</div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Analyses */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-800">
            Ostatnie analizy
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
              Rozpocznij swoją pierwszą analizę produktów
            </p>
            <StatusBadge status="info">
              Kliknij "Nowa analiza" w menu
            </StatusBadge>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default Dashboard
