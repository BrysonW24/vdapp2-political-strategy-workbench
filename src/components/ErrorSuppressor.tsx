'use client'

import { useEffect } from 'react'

export default function ErrorSuppressor() {
  useEffect(() => {
    const handleError = (e: ErrorEvent): boolean | void => {
      if (e.message && e.message.includes('MetaMask')) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      return true
    }

    const handleRejection = (e: PromiseRejectionEvent): boolean | void => {
      if (e.reason?.message?.includes('MetaMask')) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      return true
    }

    window.addEventListener('error', handleError, true)
    window.addEventListener('unhandledrejection', handleRejection, true)

    return () => {
      window.removeEventListener('error', handleError, true)
      window.removeEventListener('unhandledrejection', handleRejection, true)
    }
  }, [])

  return null
}
