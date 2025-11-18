import { useEffect, useState } from 'react'

export default function Overview() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/overview`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      setData({ error: e.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  if (loading) return <div className="text-blue-200">Loading overview...</div>

  if (!data || data.error) return (
    <div className="text-red-300">Failed to load overview{data?.error ? `: ${data.error}` : ''}</div>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Overall Average" value={`${data.overall_average?.toFixed?.(2) ?? data.overall_average}%`} />
        <StatCard title="Total Assessments" value={data.assessments_count} />
        <StatCard title="Best Subject" value={data.best_subject || '—'} />
      </div>

      <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Average by Subject</h3>
        {data.per_subject_average && Object.keys(data.per_subject_average).length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(data.per_subject_average).map(([subj, avg]) => (
              <div key={subj} className="p-3 rounded-lg bg-slate-900/60 border border-blue-500/10 text-blue-100">
                <div className="text-sm text-blue-300/80">{subj}</div>
                <div className="text-xl font-semibold">{avg}%</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-blue-200/80">No data yet. Add assessments to see insights.</p>
        )}
      </div>

      <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Top Students</h3>
        {data.top_students && data.top_students.length > 0 ? (
          <ul className="divide-y divide-blue-500/10">
            {data.top_students.map((s) => (
              <li key={s.student_id} className="py-2 flex items-center justify-between text-blue-100">
                <span>{s.student_name || s.student_id}</span>
                <span className="font-semibold">{s.avgPct?.toFixed?.(2) ?? s.avgPct}%</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-blue-200/80">Not enough data yet.</p>
        )}
      </div>

      <button onClick={fetchData} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition">
        Refresh
      </button>
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div className="p-4 rounded-xl bg-slate-800/50 border border-blue-500/20">
      <div className="text-blue-300/80 text-sm">{title}</div>
      <div className="text-2xl font-semibold text-white">{value}</div>
    </div>
  )
}
