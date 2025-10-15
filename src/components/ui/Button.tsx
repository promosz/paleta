import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-400 focus:ring-primary-200 disabled:bg-neutral-300 disabled:text-neutral-500',
    secondary: 'bg-transparent text-primary-500 border border-primary-500 hover:bg-primary-50 focus:ring-primary-200',
    danger: 'bg-danger-500 text-white hover:bg-danger-400 focus:ring-danger-200 disabled:bg-neutral-300 disabled:text-neutral-500'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base'
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
