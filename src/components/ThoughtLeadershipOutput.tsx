interface DirectQuote {
  quote: string
  speaker: string
  transcript: string
  implication: string
}

interface ThoughtLeadershipOutputProps {
  transcripts: string[]
  quotes: DirectQuote[]
}

export default function ThoughtLeadershipOutput({ transcripts, quotes }: ThoughtLeadershipOutputProps) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500">
        <h3 className="text-xl font-bold text-commbank-gray-900 mb-4">Executive Dossier</h3>
        <div className="flex gap-2 mb-4">
          {transcripts.map((url, i) => (
            <span key={i} className="px-3 py-1 bg-commbank-yellow rounded-full text-xs font-bold">
              T{i + 1}: {url.substring(0, 30)}...
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h4 className="text-lg font-bold text-commbank-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">💬</span>
          Direct Quotes & Strategic Implications (Top 5-10, ranked)
        </h4>
        <div className="space-y-6">
          {quotes.map((quote, idx) => (
            <div key={idx} className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-l-4 border-purple-500">
              <p className="text-commbank-gray-800 font-medium mb-3 italic">
                "{quote.quote}" <span className="text-purple-600 font-bold">[{quote.transcript} - {quote.speaker}]</span>
              </p>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm font-bold text-commbank-gray-700 mb-1">Strategic Implication:</p>
                <p className="text-commbank-gray-700">{quote.implication}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h4 className="text-lg font-bold text-commbank-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">🎯</span>
            Strategic Choices
          </h4>
          <ul className="space-y-3 text-commbank-gray-700">
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">→</span>
              <span>Accelerate AI coding agents for internal dev</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">→</span>
              <span>Reskill 50% of white-collar roles to AI oversight by 2027</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">→</span>
              <span>Mandate AI transparency audits in all deployments</span>
            </li>
          </ul>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <h4 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            Top Risks If We Delay
          </h4>
          <ul className="space-y-3 text-red-700">
            <li className="flex gap-2">
              <span className="font-bold">!</span>
              <span>Job disruption cascades to talent exodus</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">!</span>
              <span>Fintechs outpace in AI-driven products</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">!</span>
              <span>Compute scarcity hampers AI scaling</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
