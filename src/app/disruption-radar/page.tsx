'use client'

import { useState } from 'react'

interface DisruptionSignal {
  title: string
  severity: 'High' | 'Medium' | 'Low'
  horizon: string
  impactedRevenue: string
  defendOffendMove: string
  evidence: string
  evidenceSource: string
}

interface DisruptionResult {
  signals: DisruptionSignal[]
  executiveSummary: string
  citations: Array<{
    source: string
    quote: string
    relevance: string
  }>
}

export default function DisruptionRadar() {
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<DisruptionResult | null>(null)

  const handleGenerate = async () => {
    setIsScanning(true)
    setResult(null)

    try {
      // Use fetch for Next.js API routes instead of apiClient (which points to backend)
      const response = await fetch('/api/disruption-radar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to generate disruption analysis')
      }

      const data = await response.json()

      setTimeout(() => {
        setResult(data)
        setIsScanning(false)
      }, 2000)
    } catch (error) {
      console.error('Error generating disruption intel:', error)
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800 border-red-300'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-10">
        <h2 className="section-header">Disruption Radar</h2>
        <p className="text-commbank-gray-600 text-lg">
          Scan emerging issues to identify threats to policy objectives and public support
        </p>
      </div>

      <div className="card mb-8 card-hover">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">📡</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-commbank-gray-900">
              Disruption Radar
            </h3>
            <p className="text-commbank-gray-600 mt-1">
              Detect emerging issues threatening policy objectives and public support
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl mb-6 border-l-4 border-red-500">
          <p className="text-commbank-gray-700 leading-relaxed">
            We ingest the newest political and media intelligence, tag each signal against key policy
            priorities, and highlight defensive and offensive strategic communications moves. Use this to brief
            ministers, media advisors, and cabinet on looming political risks.
          </p>
        </div>

        {isScanning && (
          <div className="mb-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-l-4 border-yellow-500 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
              <p className="text-lg font-bold text-yellow-900">Scanning threats...</p>
            </div>
          </div>
        )}

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleGenerate}
            disabled={isScanning}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Generate Disruption Intel
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
            <h3 className="text-2xl font-bold text-commbank-gray-900">Disruption Intelligence Report</h3>
            <button
              onClick={handleDownloadPDF}
              className="px-6 py-2 bg-commbank-gray-800 text-white rounded-lg hover:bg-commbank-gray-700 transition-all font-semibold flex items-center gap-2"
            >
              <span>📄</span>
              Download PDF
            </button>
          </div>

          <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-6 rounded-xl">
            <h4 className="text-xl font-bold mb-2">DISRUPTION RADAR</h4>
            <p className="text-red-100">Political Risk & Policy Threat Signals</p>
          </div>

          <div className="space-y-6">
            {result.signals.map((signal, idx) => (
              <div key={idx} className="card border-l-4 border-red-500">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-xl font-bold text-commbank-gray-900">
                    {signal.title}
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 ${getSeverityColor(signal.severity)}`}>
                      {signal.severity} Severity
                    </span>
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border-2 border-blue-300">
                      {signal.horizon}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-xl">
                    <p className="text-sm font-bold text-red-900 mb-2">Impacted Revenue:</p>
                    <p className="text-commbank-gray-700">{signal.impactedRevenue}</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm font-bold text-blue-900 mb-2">Defend/Offend Move:</p>
                    <p className="text-commbank-gray-700">{signal.defendOffendMove}</p>
                  </div>

                  <div className="p-4 bg-gray-100 rounded-xl border-l-2 border-gray-400">
                    <p className="text-xs font-bold text-gray-700 mb-2">Evidence: {signal.evidenceSource}</p>
                    <p className="text-sm text-gray-600 italic">{signal.evidence}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card bg-gradient-to-br from-orange-50 to-red-50 border-orange-300">
            <h4 className="text-lg font-bold text-orange-800 mb-3">Executive Summary</h4>
            <p className="text-commbank-gray-700">{result.executiveSummary}</p>
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
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🎯</span>
              </div>
              <h3 className="text-lg font-bold text-commbank-gray-900">
                Disruption Guardrails
              </h3>
            </div>
            <ul className="space-y-3 text-commbank-gray-700">
              <li className="flex gap-2 items-start">
                <span className="text-red-600 font-bold mt-1">•</span>
                <span>Every risk call includes verbatim evidence and identifies the impacted policy area</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-red-600 font-bold mt-1">•</span>
                <span>Severity reflects potential political impact and timeline indicates how fast to respond</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-red-600 font-bold mt-1">•</span>
                <span>Defend/offend moves are written so media advisors can brief ministers immediately</span>
              </li>
            </ul>
          </div>

          <div className="card card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="text-lg font-bold text-commbank-gray-900">
                Political Vigilance
              </h3>
            </div>
            <p className="text-commbank-gray-700 leading-relaxed">
              Validate proposed responses with policy advisors and legal before public statements.
              Feed additional media intelligence back into the radar backlog and maintain continuous monitoring.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
