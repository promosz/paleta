import React from 'react'
import { Card, CardHeader, CardBody, Button, StatusBadge } from '../components/ui'

const Rules: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">
          Reguły
        </h1>
        <p className="text-neutral-600">
          Zarządzaj regułami analizy produktów
        </p>
      </div>

      {/* Add Rule Section */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-800">
            Dodaj nową regułę
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="secondary" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">💰</span>
              <span>Reguła budżetowa</span>
            </Button>
            <Button variant="secondary" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">🏷️</span>
              <span>Reguła kategorii</span>
            </Button>
            <Button variant="secondary" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">⭐</span>
              <span>Reguła jakości</span>
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Rules List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-800">
            Aktywne reguły
          </h2>
        </CardHeader>
        <CardBody>
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">
              Brak reguł
            </h3>
            <p className="text-neutral-500 mb-4">
              Dodaj reguły aby automatycznie analizować produkty
            </p>
            <StatusBadge status="warning">
              Reguły pomagają w ocenie produktów
            </StatusBadge>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default Rules
