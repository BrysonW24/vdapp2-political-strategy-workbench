'use client'

import { useState } from 'react'

interface MoatPlay {
  title: string
  whyUs: string
  horizon: string
  owner: string
  firstMove: string
  evidence: string
  evidenceSource: string
}

interface MoatResult {
  moats: MoatPlay[]
  additionalNotes: string
  citations: Array<{
    source: string
    quote: string
    relevance: string
  }>
}

export default function MoatFinder() {
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<MoatResult | null>(null)

  const handleGenerate = async () => {
    setIsScanning(true)
    setResult(null)

    try {
      // Use fetch for Next.js API routes instead of apiClient (which points to backend)
      const response = await fetch('/api/moat-finder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to generate moat analysis')
      }

      const data = await response.json()

      setTimeout(() => {
        setResult(data)
        setIsScanning(false)
      }, 2000)
    } catch (error) {
      console.error('Error generating moat intel:', error)
      setIsScanning(false)
    }
  }

  const resetAnalysis = () => {
    setResult(null)
    setIsScanning(false)
  }

  const handleDownloadPDF = () => {
    window.print()
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-10">
        <h2 className="section-header">Strategic Moat Finder</h2>
        <p className="text-commbank-gray-600 text-lg">
          Latest media signals translated into defensible policy positions
        </p>
      </div>

      <div className="card mb-8 card-hover">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🛡️</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-commbank-gray-900">
              Strategic Moat Finder
            </h3>
            <p className="text-commbank-gray-600 mt-1">
              Pull the latest news and analyse for strategic political opportunities
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 border-l-4 border-blue-500">
          <p className="text-commbank-gray-700 leading-relaxed">
            This sweep ingests the latest items from the news intelligence feed and reframes each
            signal as a defendable policy position. Use it to brief ministers, communications teams,
            or cabinet on strategic messaging opportunities.
          </p>
        </div>

        {isScanning && (
          <div className="mb-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-l-4 border-yellow-500 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
              <p className="text-lg font-bold text-yellow-900">Scanning news...</p>
            </div>
          </div>
        )}

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleGenerate}
            disabled={isScanning}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Generate Moat Intel
          </button>
          <button
            onClick={resetAnalysis}
            className="btn-secondary"
          >
            Reset analysis
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-commbank-gray-900">Strategic Moat Finder</h3>
            <button
              onClick={handleDownloadPDF}
              className="px-6 py-2 bg-commbank-gray-800 text-white rounded-lg hover:bg-commbank-gray-700 transition-all font-semibold flex items-center gap-2"
            >
              <span>📄</span>
              Download PDF
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-xl">
            <h4 className="text-xl font-bold mb-2">POSITION INTELLIGENCE</h4>
            <p className="text-green-100">Strategic Policy Positions</p>
          </div>

          <div className="space-y-6">
            {result.moats.map((moat, idx) => (
              <div key={idx} className="card border-l-4 border-green-500">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-xl font-bold text-commbank-gray-900">
                    {moat.title}
                  </h4>
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border-2 border-green-300">
                    {moat.horizon}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm font-bold text-blue-900 mb-2">Why us:</p>
                    <p className="text-commbank-gray-700">{moat.whyUs}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <p className="text-sm font-bold text-purple-900 mb-2">Owner:</p>
                      <p className="text-commbank-gray-700">{moat.owner}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-xl">
                      <p className="text-sm font-bold text-orange-900 mb-2">First move:</p>
                      <p className="text-commbank-gray-700">{moat.firstMove}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-100 rounded-xl border-l-2 border-gray-400">
                    <p className="text-xs font-bold text-gray-700 mb-2">Evidence: {moat.evidenceSource}</p>
                    <p className="text-sm text-gray-600 italic">{moat.evidence}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-300">
            <h4 className="text-lg font-bold text-orange-800 mb-3">Additional Notes</h4>
            <p className="text-commbank-gray-700">{result.additionalNotes}</p>
          </div>

          <div className="card">
            <h4 className="text-lg font-bold text-commbank-gray-900 mb-4">Document Citations</h4>
            <ul className="space-y-4">
              {result.citations.map((citation, idx) => (
                <li key={idx} className="p-4 bg-gray-50 rounded-xl">
                  <p className="font-bold text-blue-600 mb-2">{citation.source}</p>
                  <p className="text-sm text-gray-700 italic mb-2">{citation.quote}</p>
                  <p className="text-sm text-gray-600">{citation.relevance}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!result && !isScanning && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🔗</span>
              </div>
              <h3 className="text-lg font-bold text-commbank-gray-900">
                Moat Traceability
              </h3>
            </div>
            <ul className="space-y-3 text-commbank-gray-700">
              <li className="flex gap-2 items-start">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span>Every position insight links to verbatim evidence captured from news sources</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span>Signals emphasise political advantages, public sentiment, and media positioning opportunities</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span>Outputs are markdown-ready for ministerial briefings, press releases, or cabinet submissions</span>
              </li>
            </ul>
          </div>

          <div className="card card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">📡</span>
              </div>
              <h3 className="text-lg font-bold text-commbank-gray-900">
                Media Intelligence Scope
              </h3>
            </div>
            <p className="text-commbank-gray-700 leading-relaxed">
              Feeds are pre-screened for political relevancy. Validate policy assumptions with stakeholders
              before public communications and capture any additional news inside the citations vault.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
