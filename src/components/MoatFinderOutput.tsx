interface MoatPlay {
  title: string
  whyUs: string
  horizon: string
  owner: string
  firstMove: string
  evidence: string
}

interface MoatFinderOutputProps {
  moats: MoatPlay[]
}

export default function MoatFinderOutput({ moats }: MoatFinderOutputProps) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-500">
        <h3 className="text-xl font-bold text-commbank-gray-900 mb-2">MOAT INTELLIGENCE</h3>
        <p className="text-commbank-gray-700">CEO Moat Plays</p>
      </div>

      <div className="space-y-6">
        {moats.map((moat, idx) => (
          <div key={idx} className="card card-hover border-l-4 border-green-500">
            <div className="flex items-start justify-between mb-4">
              <h4 className="text-xl font-bold text-commbank-gray-900 flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                {moat.title}
              </h4>
              <div className="flex gap-2">
                <span className="badge-success">{moat.horizon}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm font-bold text-blue-900 mb-2">Why Us:</p>
                <p className="text-commbank-gray-700">{moat.whyUs}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm font-bold text-purple-900 mb-2">Owner:</p>
                  <p className="text-commbank-gray-700">{moat.owner}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl">
                  <p className="text-sm font-bold text-orange-900 mb-2">First Move:</p>
                  <p className="text-commbank-gray-700">{moat.firstMove}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border-l-2 border-gray-400">
                <p className="text-xs font-bold text-gray-700 mb-2">Evidence:</p>
                <p className="text-sm text-gray-600 italic">{moat.evidence}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-gradient-to-br from-yellow-50 to-orange-50">
        <h4 className="text-lg font-bold text-orange-800 mb-3 flex items-center gap-2">
          <span className="text-xl">📌</span>
          Additional Notes
        </h4>
        <p className="text-commbank-gray-700">
          Prioritize agentic and reasoning moats to scale IMPACT via data; hybrid builds TRUST sustainably.
        </p>
      </div>
    </div>
  )
}
