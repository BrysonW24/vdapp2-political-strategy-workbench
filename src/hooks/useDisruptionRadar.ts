import { useState } from 'react'
import { disruptionRadarApi } from '@/lib/api-client'
import type { DisruptionSignal, ApiError } from '@/types'

export function useDisruptionRadar() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signals, setSignals] = useState<DisruptionSignal[]>([])

  const generateIntel = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await disruptionRadarApi.generateIntel()
      setSignals(response.signals || [])
      return response.signals
    } catch (err) {
      const apiError = err as ApiError
      const errorMessage = apiError.error || 'Failed to generate disruption intelligence'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setSignals([])
    setError(null)
  }

  return {
    isLoading,
    error,
    signals,
    generateIntel,
    reset,
  }
}
