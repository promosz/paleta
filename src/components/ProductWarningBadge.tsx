import React from 'react'
import { Info, AlertTriangle, XCircle } from 'lucide-react'
import type { ProductWarningLevel, AppliedProductRule } from '../types/rules'
import { productWarningEngine } from '../services/productWarningEngine'

interface ProductWarningBadgeProps {
  level: ProductWarningLevel
  appliedRules?: AppliedProductRule[]
  showIcon?: boolean
  showLabel?: boolean
  className?: string
}

const ProductWarningBadge: React.FC<ProductWarningBadgeProps> = ({
  level,
  appliedRules,
  showIcon = true,
  showLabel = true,
  className = ''
}) => {
  const colors = productWarningEngine.getWarningColor(level)
  const label = productWarningEngine.getWarningLabel(level)

  const getIcon = () => {
    const iconSize = 16
    switch (level) {
      case 'LOW':
        return <Info className={`h-${iconSize} w-${iconSize} ${colors.icon}`} />
      case 'MEDIUM':
        return <AlertTriangle className={`h-${iconSize} w-${iconSize} ${colors.icon}`} />
      case 'HIGH':
        return <XCircle className={`h-${iconSize} w-${iconSize} ${colors.icon}`} />
    }
  }

  const getTooltip = () => {
    if (!appliedRules || appliedRules.length === 0) {
      return `Poziom ostrzeżenia: ${label}`
    }
    
    const labels = productWarningEngine.getAppliedRulesLabels(appliedRules)
    return `Poziom: ${label}\n\nZastosowane reguły:\n${labels.join('\n')}`
  }

  return (
    <div 
      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md border ${colors.bg} ${colors.text} ${className}`}
      title={getTooltip()}
    >
      {showIcon && getIcon()}
      {showLabel && <span className="text-sm font-medium">{label}</span>}
    </div>
  )
}

export default ProductWarningBadge

