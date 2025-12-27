import type { Severity, Horizon } from '@/types'

interface BadgeProps {
  text: string
  variant?: 'severity' | 'horizon' | 'default'
  severity?: Severity
  horizon?: Horizon
}

export default function Badge({ text, variant = 'default', severity, horizon }: BadgeProps) {
  const getSeverityColor = (sev: Severity) => {
    switch (sev) {
      case 'High': return 'bg-red-100 text-red-800 border-red-300'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Low': return 'bg-green-100 text-green-800 border-green-300'
    }
  }

  const getHorizonColor = (hor: Horizon) => {
    switch (hor) {
      case 'Immediate': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'Near-term': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'Long-term': return 'bg-purple-100 text-purple-800 border-purple-300'
    }
  }

  let colorClasses = 'bg-gray-100 text-gray-800 border-gray-300'

  if (variant === 'severity' && severity) {
    colorClasses = getSeverityColor(severity)
  } else if (variant === 'horizon' && horizon) {
    colorClasses = getHorizonColor(horizon)
  }

  return (
    <span className={'px-3 py-1 rounded-full text-xs font-semibold border ' + colorClasses}>
      {text}
    </span>
  )
}
