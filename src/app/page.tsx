'use client'

import { useState } from 'react'

interface YouTubeUrl {
  id: number
  url: string
}

interface ThoughtLeadershipResult {
  urls: string[]
  directQuotesAndImplications: Array<{
    quote: string
    source: string
    implication: string
    ranking?: number
  }>
  strategicChoices: string[]
  moatPlays: {
    trust: string
    impact: string
  }
  topRisks: string[]
  counterArguments: string[]
}

export default function ThoughtLeadership() {
  const [urls, setUrls] = useState<YouTubeUrl[]>([
    { id: 1, url: '' },
  ])
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<ThoughtLeadershipResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const addUrl = () => {
    const newId = urls.length > 0 ? Math.max(...urls.map(u => u.id)) + 1 : 1
    setUrls([...urls, { id: newId, url: '' }])
  }

  const updateUrl = (id: number, newUrl: string) => {
    setUrls(urls.map(u => u.id === id ? { ...u, url: newUrl } : u))
  }

  const removeUrl = (id: number) => {
    setUrls(urls.filter(u => u.id !== id))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setResult(null)
    setError(null)

    try {
      // Use fetch for Next.js API routes instead of apiClient (which points to backend)
      const response = await fetch('/api/thought-leadership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: urls.map(u => u.url)
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate brief')
      }

      const data = await response.json()
      setResult(data)
      setIsGenerating(false)
    } catch (err: any) {
      console.error('Error generating brief:', err)
      setError(err.message || 'Failed to generate brief. Please check your YouTube URLs and try again.')
      setIsGenerating(false)
    }
  }

  const clearQueue = () => {
    setUrls([])
  }

  const handleDownloadPDF = () => {
    window.print()
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-10">
        <h2 className="section-header">Thought Leadership</h2>
        <p className="text-commbank-gray-600 text-lg">
          Convert expert interviews into minister-ready policy insights
        </p>
      </div>

      <div className="card mb-8 card-hover">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🎯</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-commbank-gray-900">
              Thought Leadership Intake
            </h3>
            <p className="text-commbank-gray-600 mt-1">
              Transform expert insights into executive-ready strategy
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 border-l-4 border-blue-500">
          <p className="text-commbank-gray-700 leading-relaxed">
            Queue the interviews, podcasts, or conference talks to analyse for political strategy insights.
            Every brief cites transcripts using [T# speaker] notation and is optimised for ministerial briefings,
            cabinet submissions, and policy communications.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-l-4 border-red-500">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-lg font-bold text-red-900">Error</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="mb-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-l-4 border-yellow-500 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
              <div>
                <p className="text-lg font-bold text-yellow-900">Processing transcripts...</p>
                <p className="text-yellow-700 text-sm mt-1">This may take a minute for longer videos</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-6">
          {urls.map((item, index) => (
            <div key={item.id} className="flex items-start gap-3">
              <span className="text-commbank-gray-500 font-medium mt-2">{index + 1}.</span>
              <div className="flex-1">
                <label className="block text-sm font-medium text-commbank-gray-700 mb-2">
                  YouTube URL
                </label>
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => updateUrl(item.id, e.target.value)}
                  className="w-full px-4 py-2 border border-commbank-gray-300 rounded-md focus:ring-2 focus:ring-commbank-yellow focus:border-transparent"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <button
                onClick={() => removeUrl(item.id)}
                className="mt-8 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addUrl}
          className="text-commbank-gray-700 hover:text-commbank-black font-medium mb-6"
        >
          + Add another URL
        </button>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || urls.length === 0}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isGenerating ? 'Generating...' : 'Generate Thought Leadership Brief'}
          </button>
          <button
            onClick={clearQueue}
            className="btn-secondary"
          >
            Clear queue
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-commbank-gray-900">Thought Leadership Brief</h3>
            <button
              onClick={handleDownloadPDF}
              className="px-6 py-2 bg-commbank-gray-800 text-white rounded-lg hover:bg-commbank-gray-700 transition-all font-semibold flex items-center gap-2"
            >
              <span>📄</span>
              Download PDF
            </button>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl">
            <h4 className="text-xl font-bold mb-2">THOUGHT LEADERSHIP INTELLIGENCE</h4>
            <p className="text-blue-100">Government Policy Strategy Brief</p>
          </div>

          {/* Source URLs */}
          <div className="card bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300">
            <h4 className="text-lg font-bold text-gray-900 mb-3">Source Transcripts</h4>
            <ul className="space-y-2">
              {result.urls.map((url, idx) => (
                <li key={idx} className="text-sm text-gray-700">
                  <span className="font-mono font-bold text-blue-600">[T{idx + 1}]</span> {url}
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Quotes & Strategic Implications */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-commbank-gray-900">Direct Quotes & Strategic Implications</h4>
            <p className="text-sm text-gray-600 italic">5-10 ranked quotes from transcripts with policy implications</p>
            {result.directQuotesAndImplications.map((item, idx) => (
              <div key={idx} className="card border-l-4 border-blue-500">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {item.ranking || idx + 1}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="p-4 bg-yellow-50 rounded-xl border-l-2 border-yellow-400">
                      <p className="text-xs font-bold text-gray-600 mb-2">{item.source}</p>
                      <p className="text-gray-800 italic">&ldquo;{item.quote}&rdquo;</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <p className="text-xs font-bold text-blue-900 mb-2">Strategic Implication:</p>
                      <p className="text-commbank-gray-700">{item.implication}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Strategic Choices */}
          <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-300">
            <h4 className="text-lg font-bold text-indigo-900 mb-4">Strategic Choices</h4>
            <p className="text-sm text-gray-600 italic mb-4">3-5 key recommendations for government action</p>
            <ul className="space-y-3">
              {result.strategicChoices.map((choice, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-commbank-gray-700 flex-1">{choice}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Moat Plays */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-commbank-gray-900">Moat Plays</h4>
            <p className="text-sm text-gray-600 italic">Strategic positioning unique to government</p>

            <div className="card border-l-4 border-green-500">
              <h5 className="text-lg font-bold text-green-900 mb-3">Trust</h5>
              <p className="text-commbank-gray-700">{result.moatPlays.trust}</p>
            </div>

            <div className="card border-l-4 border-purple-500">
              <h5 className="text-lg font-bold text-purple-900 mb-3">Impact</h5>
              <p className="text-commbank-gray-700">{result.moatPlays.impact}</p>
            </div>
          </div>

          {/* Top Risks */}
          <div className="card bg-gradient-to-br from-red-50 to-orange-50 border-red-300">
            <h4 className="text-lg font-bold text-red-900 mb-4">Top Risks if We Delay</h4>
            <ul className="space-y-3">
              {result.topRisks.map((risk, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span className="text-red-600 font-bold text-xl">•</span>
                  <p className="text-commbank-gray-700 flex-1">{risk}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Counter-Arguments & Fragile Assumptions */}
          <div className="card bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-400">
            <h4 className="text-lg font-bold text-yellow-900 mb-4">Counter-Arguments & Fragile Assumptions</h4>
            <p className="text-sm text-yellow-700 mb-4 italic">Pressure-test these before finalising recommendations</p>
            <ul className="space-y-3">
              {result.counterArguments.map((arg, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span className="text-yellow-600 font-bold text-xl">⚠</span>
                  <p className="text-commbank-gray-700 flex-1">{arg}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!result && !isGenerating && (
        <div className="card">
          <h3 className="text-lg font-bold text-commbank-gray-900 mb-4">
            Delivery Principles
          </h3>
          <ul className="space-y-3 text-commbank-gray-700">
            <li className="flex gap-2 items-start">
              <span className="text-blue-600 font-bold mt-1">•</span>
              <span><strong>Key Signals</strong> always cite transcripts using the [T# speaker] notation</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-blue-600 font-bold mt-1">•</span>
              <span>Every section is written for government officials and ministers with policy implications in mind</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-blue-600 font-bold mt-1">•</span>
              <span>Markdown hierarchy is optimised for ministerial briefings, cabinet submissions, and policy updates</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-blue-600 font-bold mt-1">•</span>
              <span><strong>Direct Quotes</strong> section surfaces verbatim lines from transcripts with [T#] citations</span>
            </li>
          </ul>

          <div className="mt-6 pt-6 border-t border-commbank-gray-200">
            <h4 className="font-bold text-commbank-gray-900 mb-2">Evidence-first Posture</h4>
            <p className="text-commbank-gray-700">
              Highlight any assumption that is not backed by transcript evidence before circulating.
              Pressure-test recommendations against public interest and government policy objectives.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
