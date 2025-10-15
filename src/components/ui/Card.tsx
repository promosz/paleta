import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  shadow?: 'sm' | 'md' | 'lg'
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm'
}) => {
  const baseClasses = 'bg-white rounded-lg border border-neutral-200'
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  }
  
  const classes = `${baseClasses} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${className}`
  
  return (
    <div className={classes}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`mb-4 pb-4 border-b border-neutral-200 ${className}`}>
      {children}
    </div>
  )
}

interface CardBodyProps {
  children: React.ReactNode
  className?: string
}

const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`mt-4 pt-4 border-t border-neutral-200 ${className}`}>
      {children}
    </div>
  )
}

export { Card, CardHeader, CardBody, CardFooter }
