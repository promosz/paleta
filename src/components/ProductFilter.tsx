import React, { useState, useEffect } from 'react'
import { Filter, X, Search, Tag, AlertTriangle, CheckCircle } from 'lucide-react'

interface Product {
  paleta: string
  nazwa: string
  kategoria: string
  cena: number
  ilosc: number
  opis?: string
  status?: 'blocked' | 'warning' | 'allowed'
}

interface ProductFilterProps {
  products: Product[]
  onFilteredProducts: (products: Product[]) => void
  onCategorySelect: (category: string | null) => void
  selectedCategory: string | null
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  products,
  onFilteredProducts,
  onCategorySelect,
  selectedCategory
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'blocked' | 'warning' | 'allowed'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'price' | 'quantity'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Extract unique categories from products
  const categories = Array.from(new Set(products.map(p => p.kategoria).filter(Boolean)))

  useEffect(() => {
    let filtered = [...products]

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.kategoria === selectedCategory)
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.nazwa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.kategoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.opis && p.opis.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'name':
          aValue = a.nazwa.toLowerCase()
          bValue = b.nazwa.toLowerCase()
          break
        case 'category':
          aValue = a.kategoria.toLowerCase()
          bValue = b.kategoria.toLowerCase()
          break
        case 'price':
          aValue = a.cena
          bValue = b.cena
          break
        case 'quantity':
          aValue = a.ilosc
          bValue = b.ilosc
          break
        default:
          aValue = a.nazwa.toLowerCase()
          bValue = b.nazwa.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    onFilteredProducts(filtered)
  }, [products, selectedCategory, searchTerm, statusFilter, sortBy, sortOrder, onFilteredProducts])

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'blocked': return <X className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'allowed': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return null
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'blocked': return 'text-red-600 bg-red-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'allowed': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filtry produktów</h3>
        <span className="text-sm text-gray-500">
          ({products.length} produktów)
        </span>
      </div>

      {/* Search and Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Szukaj produktów..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory || ''}
            onChange={(e) => onCategorySelect(e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Wszystkie kategorie</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Wszystkie statusy</option>
            <option value="allowed">Dozwolone</option>
            <option value="warning">Ostrzeżenia</option>
            <option value="blocked">Zablokowane</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name">Nazwa</option>
            <option value="category">Kategoria</option>
            <option value="price">Cena</option>
            <option value="quantity">Ilość</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Category Tags */}
      {categories.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Kategorie:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCategorySelect(null)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Wszystkie
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => onCategorySelect(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {products.filter(p => p.status === 'allowed').length}
          </div>
          <div className="text-sm text-gray-600">Dozwolone</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {products.filter(p => p.status === 'warning').length}
          </div>
          <div className="text-sm text-gray-600">Ostrzeżenia</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {products.filter(p => p.status === 'blocked').length}
          </div>
          <div className="text-sm text-gray-600">Zablokowane</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {categories.length}
          </div>
          <div className="text-sm text-gray-600">Kategorie</div>
        </div>
      </div>
    </div>
  )
}

export default ProductFilter
