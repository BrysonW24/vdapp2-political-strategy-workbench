'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SearchFilters {
  keywords: string
  category: string
  source: string
  dateFrom: string
  dateTo: string
  sentiment?: string
}

interface NewsArticle {
  id: string
  title: string
  content: string
  source: string
  sourceUrl: string
  publishedAt: string
  category: string
  sentiment?: string
}

export default function AdvancedSearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    keywords: '',
    category: 'all',
    source: 'all',
    dateFrom: '',
    dateTo: '',
    sentiment: 'all',
  })

  const [results, setResults] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    setSearched(true)

    try {
      // Use new search API that supports historical archive
      const params = new URLSearchParams()

      // Add keywords if provided
      if (filters.keywords) {
        params.append('keywords', filters.keywords)
      }

      // Add date range if provided (enables Archive API)
      if (filters.dateFrom) {
        params.append('from_date', filters.dateFrom)
      }
      if (filters.dateTo) {
        params.append('to_date', filters.dateTo)
      }

      // Add category filter
      if (filters.category !== 'all') {
        params.append('category', filters.category)
      }

      console.log('Searching with params:', params.toString())

      const response = await fetch(`/api/news/search?${params.toString()}`)
      const data = await response.json()

      console.log('API Response:', data)
      console.log('Total articles fetched:', data.news?.length || 0)
      console.log('Archive API used:', data.hasArchiveAccess)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch news')
      }

      // Transform results
      let filteredResults = (data.news || []).map((article: any) => {
        const categoryMap: Record<string, string> = {
          'politics': 'politics',
          'federal-politics': 'politics',
          'business': 'business',
          'technology': 'technology',
          'environment': 'environment',
          'regulation': 'politics',
          'latest': 'other',
        }

        return {
          id: article.id.toString(),
          title: article.title,
          content: article.summary,
          source: article.source,
          sourceUrl: article.url,
          publishedAt: article.publishedAt,
          category: categoryMap[article.category.toLowerCase()] || 'other',
          sentiment: article.sentiment,
        }
      })

      // Apply client-side filters (only source and sentiment - keywords/dates handled by API)
      if (filters.source !== 'all') {
        filteredResults = filteredResults.filter((article: NewsArticle) =>
          article.source === filters.source
        )
      }

      if (filters.sentiment && filters.sentiment !== 'all') {
        filteredResults = filteredResults.filter((article: NewsArticle) =>
          article.sentiment?.toLowerCase() === filters.sentiment?.toLowerCase()
        )
      }

      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom)
        filteredResults = filteredResults.filter((article: NewsArticle) =>
          new Date(article.publishedAt) >= fromDate
        )
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo)
        toDate.setHours(23, 59, 59, 999)
        filteredResults = filteredResults.filter((article: NewsArticle) =>
          new Date(article.publishedAt) <= toDate
        )
      }

      setResults(filteredResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFilters({
      keywords: '',
      category: 'all',
      source: 'all',
      dateFrom: '',
      dateTo: '',
      sentiment: 'all',
    })
    setResults([])
    setSearched(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      politics: 'bg-blue-100 text-blue-800',
      business: 'bg-purple-100 text-purple-800',
      technology: 'bg-indigo-100 text-indigo-800',
      environment: 'bg-green-100 text-green-800',
      social: 'bg-pink-100 text-pink-800',
      international: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800',
    }
    return colors[category] || colors.other
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/news"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-2"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to News
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Advanced News Search</h1>
              <p className="text-gray-600 mt-1">
                Search and filter Australian political news with advanced criteria
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Filters</h2>

              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                <p className="text-xs text-blue-800">
                  <strong>Quick Search:</strong> Leave all filters blank and click &ldquo;Search&rdquo; to see all available articles.
                </p>
                <p className="text-xs text-blue-700">
                  <strong>Historical Search:</strong> Enter a date range to search the archive (requires paid plan). Free tier searches only the latest ~35 articles.
                </p>
                <p className="text-xs text-blue-600">
                  <strong>Example:</strong> Search &ldquo;china&rdquo; from 2024-01-01 to today for hundreds of historical articles (paid plan).
                </p>
              </div>

              {/* Keywords */}
              <div className="mb-4">
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  id="keywords"
                  placeholder="e.g., climate policy, parliament"
                  value={filters.keywords}
                  onChange={(e) => setFilters({ ...filters, keywords: e.target.value })}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="politics">Politics</option>
                  <option value="federal-politics">Federal Politics</option>
                  <option value="business">Business</option>
                  <option value="environment">Environment</option>
                  <option value="regulation">Regulation</option>
                </select>
              </div>

              {/* Source */}
              <div className="mb-4">
                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
                  Source
                </label>
                <select
                  id="source"
                  value={filters.source}
                  onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Sources</option>
                  <option value="ABC News">ABC News</option>
                  <option value="The Guardian">The Guardian</option>
                  <option value="Sydney Morning Herald">Sydney Morning Herald</option>
                  <option value="The Age">The Age</option>
                  <option value="Nine News">Nine News</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <span className="text-xs text-gray-500 text-center block">to</span>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Sentiment */}
              <div className="mb-6">
                <label htmlFor="sentiment" className="block text-sm font-medium text-gray-700 mb-2">
                  Sentiment
                </label>
                <select
                  id="sentiment"
                  value={filters.sentiment}
                  onChange={(e) => setFilters({ ...filters, sentiment: e.target.value })}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Sentiments</option>
                  <option value="positive">Positive</option>
                  <option value="neutral">Neutral</option>
                  <option value="negative">Negative</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-2">
            {!searched ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Search</h3>
                <p className="text-gray-600">
                  Use the filters on the left to search for specific news articles
                </p>
              </div>
            ) : loading ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching articles...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search filters
                </p>
                <button
                  onClick={handleReset}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Search Results ({results.length})
                  </h2>
                </div>

                <div className="space-y-4">
                  {results.map((article) => (
                    <div
                      key={article.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                    >
                      {/* Meta Info */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                          {article.category}
                        </span>
                        {article.sentiment && (
                          <span className="text-xs text-gray-500">
                            {article.sentiment}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>

                      {/* Content Preview */}
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {article.content?.substring(0, 200)}...
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4">
                        <div className="flex items-center text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                          <span className="font-medium">{article.source}</span>
                        </div>
                        <time className="text-gray-500 text-xs">
                          {formatDate(article.publishedAt)}
                        </time>
                      </div>
                      {article.sourceUrl && (
                        <a
                          href={article.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                        >
                          Read full article
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
