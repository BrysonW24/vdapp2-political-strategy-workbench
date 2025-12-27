interface DisruptionCall {
  title: string
  mechanism: string
  pool: string
  revenue: string
  severity: 'High' | 'Medium' | 'Low' | 'Critical'
  velocity: string
  posture: string
  response: string
  owner: string
  evidence: string
}

interface DisruptionRadarOutputProps {
  calls: DisruptionCall[]
}

export default function DisruptionRadarOutput({ calls }: DisruptionRadarOutputProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-600 text-white'
      case 'High': return 'bg-red-100 text-red-800 border-red-300'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border-l-4 border-red-500">
        <h3 className="text-xl font-bold text-commbank-gray-900 mb-2">DISRUPTION INTELLIGENCE</h3>
        <p className="text-commbank-gray-700">CEO Disruption Calls</p>
      </div>

      <div className="space-y-6">
        {calls.map((call, idx) => (
          <div key={idx} className="card card-hover border-l-4 border-red-500">
            <div className="flex items-start justify-between mb-4">
              <h4 className="text-lg font-bold text-commbank-gray-900">
                {call.title}
              </h4>
              <div className="flex gap-2">
                <span className={'px-3 py-1 rounded-full text-xs font-bold border ' + getSeverityColor(call.severity)}>
                  Sev: {call.severity}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                  Vel: {call.velocity}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-xl">
                <p className="text-sm font-bold text-red-900 mb-2">Mechanism:</p>
                <p className="text-commbank-gray-700">{call.mechanism}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm font-bold text-blue-900 mb-2">Pool:</p>
                  <p className="text-commbank-gray-700 font-semibold">{call.pool}</p>
                  <p className="text-lg font-bold text-blue-600 mt-1">{call.revenue}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm font-bold text-purple-900 mb-2">Posture & Owner:</p>
                  <p className="text-commbank-gray-700">
                    <span className="font-bold text-purple-600">{call.posture}</span> — {call.owner}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-xl border-l-2 border-green-500">
                <p className="text-sm font-bold text-green-900 mb-2">Response:</p>
                <p className="text-commbank-gray-700">{call.response}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border-l-2 border-gray-400">
                <p className="text-xs font-bold text-gray-700 mb-2">Evidence:</p>
                <p className="text-sm text-gray-600 italic">{call.evidence}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-300">
        <h4 className="text-lg font-bold text-orange-800 mb-3 flex items-center gap-2">
          <span className="text-xl">⚡</span>
          Additional Notes
        </h4>
        <p className="text-commbank-gray-700">
          Kimi K2s open-weights agentic SOTA accelerates threats to CBAs core pools via disintermediation and interface loss; prioritize API defenses and partnerships to retain control.
        </p>
      </div>
    </div>
  )
}
