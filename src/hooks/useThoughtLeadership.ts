import { useState } from 'react'
import { thoughtLeadershipApi } from '@/lib/api-client'
import type { ThoughtLeadershipBrief, ApiError } from '@/types'

export function useThoughtLeadership() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [brief, setBrief] = useState<ThoughtLeadershipBrief | null>(null)

  const generateBrief = async (urls: string[]) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await thoughtLeadershipApi.generateBrief(urls)
      setBrief(response.brief)
      return response.brief
    } catch (err) {
      const apiError = err as ApiError
      const errorMessage = apiError.error || 'Failed to generate thought leadership brief'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setBrief(null)
    setError(null)
  }

  return {
    isLoading,
    error,
    brief,
    generateBrief,
    reset,
  }
}
