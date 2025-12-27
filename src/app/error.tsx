'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-commbank-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-commbank-gray-700 mb-4">
          An error occurred while loading the page.
        </p>
        <button
          onClick={reset}
          className="w-full bg-commbank-yellow text-commbank-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-500 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
