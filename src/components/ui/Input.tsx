

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-3 border rounded-md text-sm text-neutral-700 bg-white transition-all duration-200 focus:outline-none focus:ring-3 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed'
  
  const borderClasses = error 
    ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-100' 
    : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-100'
  
  const iconClasses = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : ''
  
  const classes = `${baseClasses} ${borderClasses} ${iconClasses} ${className}`
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-neutral-400">
              {leftIcon}
            </div>
          </div>
        )}
        
        <input className={classes} {...props} />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-neutral-400">
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-danger-500">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-neutral-500">
          {helperText}
        </p>
      )}
    </div>
  )
}

export default Input
