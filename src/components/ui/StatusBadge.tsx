import React from 'react'

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'danger' | 'info'
  children: React.ReactNode
  className?: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium'
  
  const statusClasses = {
    success: 'text-success-500 bg-success-50',
    warning: 'text-warning-500 bg-warning-50',
    danger: 'text-danger-500 bg-danger-50',
    info: 'text-primary-500 bg-primary-50'
  }
  
  const classes = `${baseClasses} ${statusClasses[status]} ${className}`
  
  return (
    <span className={classes}>
      {children}
    </span>
  )
}

export default StatusBadge
