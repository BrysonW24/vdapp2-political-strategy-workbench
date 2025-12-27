import { useState } from 'react'
import { moatFinderApi } from '@/lib/api-client'
import type { MoatIntelligence, ApiError } from '@/types'

export function useMoatFinder() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [intelligence, setIntelligence] = useState<MoatIntelligence | null>(null)

  const generateIntel = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await moatFinderApi.generateIntel()
      setIntelligence(response)
      return response
    } catch (err) {
      const apiError = err as ApiError
      const errorMessage = apiError.error || 'Failed to generate moat intelligence'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setIntelligence(null)
    setError(null)
  }

  return {
    isLoading,
    error,
    intelligence,
    generateIntel,
    reset,
  }
}
