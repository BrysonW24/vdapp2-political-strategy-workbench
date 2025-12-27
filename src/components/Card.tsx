import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
}

export default function Card({ children, className = '', title, subtitle }: CardProps) {
  return (
    <div className={'bg-white rounded-lg shadow-lg p-6 border border-commbank-gray-200 ' + className}>
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-bold text-commbank-gray-900">{title}</h3>
          {subtitle && <p className="text-commbank-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
