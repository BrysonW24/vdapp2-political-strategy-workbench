import axios, { AxiosError } from 'axios'
import type { ApiResponse, ApiError } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const apiError: ApiError = {
      error: error.response?.data?.error || error.message || 'An unexpected error occurred',
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    }
    return Promise.reject(apiError)
  }
)

export const thoughtLeadershipApi = {
  generateBrief: async (urls: string[]) => {
    const response = await apiClient.post('/api/thought-leadership', { urls })
    return response.data
  },
}

export const moatFinderApi = {
  generateIntel: async () => {
    const response = await apiClient.post('/api/moat-finder')
    return response.data
  },
}

export const disruptionRadarApi = {
  generateIntel: async () => {
    const response = await apiClient.post('/api/disruption-radar')
    return response.data
  },
}

export const newsApi = {
  fetchNews: async (category?: string, limit?: number) => {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (limit) params.append('limit', limit.toString())
    
    const response = await apiClient.get('/api/news?' + params.toString())
    return response.data
  },
}

export default apiClient
