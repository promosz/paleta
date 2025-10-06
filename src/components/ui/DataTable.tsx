import React, { useState, useMemo } from 'react'
import type { ParsedProduct } from '../../types/parser'
import { Card, CardHeader, CardBody, StatusBadge } from './index'

interface DataTableProps {
  products: ParsedProduct[]
  title?: string
  className?: string
  showSource?: boolean
  showRawData?: boolean
  maxRows?: number
}

interface SortConfig {
  key: keyof ParsedProduct
  direction: 'asc' | 'desc'
}

export const DataTable: React.FC<DataTableProps> = ({
  products,
  title = 'Sparsowane produkty',
  className = '',
  showSource = true,
  showRawData = false,
  maxRows = 100
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  // Debug - sprawdź dane produktów
  console.log('DataTable: Otrzymane produkty:', {
    count: products.length,
    products: products.slice(0, 3), // Pierwsze 3 produkty
    title
  })

  // Filtrowanie i sortowanie danych
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue === undefined && bValue === undefined) return 0
        if (aValue === undefined) return 1
        if (bValue === undefined) return -1

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
        }

        return 0
      })
    }

    return filtered.slice(0, maxRows)
  }, [products, searchTerm, sortConfig, maxRows])

  // Paginacja
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex)

  // Obsługa sortowania
  const handleSort = (key: keyof ParsedProduct) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // Formatowanie wartości
  const formatValue = (value: any): string => {
    if (value === undefined || value === null) return '-'
    if (typeof value === 'number') {
      return value.toLocaleString('pl-PL')
    }
    return String(value)
  }

  // Formatowanie ceny
  const formatPrice = (price?: number): string => {
    if (price === undefined) return '-'
    return `${price.toFixed(2)} PLN`
  }

  // Renderowanie nagłówka kolumny
  const renderColumnHeader = (key: keyof ParsedProduct, label: string) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer hover:bg-neutral-50"
      onClick={() => handleSort(key)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {sortConfig?.key === key && (
          <span className="text-primary-500">
            {sortConfig.direction === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  )

  if (products.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
        </CardHeader>
        <CardBody>
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">
              Brak danych
            </h3>
            <p className="text-neutral-500">
              Załaduj pliki aby zobaczyć sparsowane produkty
            </p>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-800">
            {title} ({filteredAndSortedProducts.length})
          </h3>
          <div className="flex items-center space-x-4">
            {/* Wyszukiwarka */}
            <div className="relative">
              <input
                type="text"
                placeholder="Szukaj produktów..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg
                className="absolute left-2 top-2.5 w-4 h-4 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                {renderColumnHeader('name', 'Nazwa')}
                {renderColumnHeader('category', 'Kategoria')}
                {renderColumnHeader('price', 'Cena')}
                {renderColumnHeader('quantity', 'Ilość')}
                {renderColumnHeader('unit', 'Jednostka')}
                {renderColumnHeader('brand', 'Marka')}
                {renderColumnHeader('sku', 'SKU')}
                {showSource && renderColumnHeader('source', 'Źródło')}
                {showRawData && <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Dane surowe</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900">
                      {product.name || '-'}
                    </div>
                    {product.description && (
                      <div className="text-sm text-neutral-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusBadge status="info">
                      {product.category || '-'}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {formatValue(product.quantity)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {product.unit || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {product.brand || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-900">
                    {product.sku || '-'}
                  </td>
                  {showSource && (
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {product.source || '-'}
                    </td>
                  )}
                  {showRawData && (
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-500">
                      <details className="cursor-pointer">
                        <summary className="text-primary-600 hover:text-primary-800">
                          Pokaż dane
                        </summary>
                        <pre className="mt-2 text-xs bg-neutral-100 p-2 rounded max-w-xs overflow-auto">
                          {JSON.stringify(product.rawData, null, 2)}
                        </pre>
                      </details>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginacja */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-neutral-700">
              Pokazuję {startIndex + 1}-{Math.min(endIndex, filteredAndSortedProducts.length)} z {filteredAndSortedProducts.length} produktów
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Poprzednia
              </button>
              <span className="px-3 py-1 text-sm text-neutral-700">
                Strona {currentPage} z {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Następna
              </button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
