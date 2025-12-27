import { ReactNode, ButtonHTMLAttributes } from 'react'
import LoadingSpinner from './LoadingSpinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  isLoading?: boolean
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
  
  const variantClasses = {
    primary: 'bg-commbank-yellow text-commbank-black hover:bg-yellow-500',
    secondary: 'bg-commbank-gray-800 text-white hover:bg-commbank-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      className={baseClasses + ' ' + variantClasses[variant] + ' ' + widthClass + ' ' + className}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  )
}
