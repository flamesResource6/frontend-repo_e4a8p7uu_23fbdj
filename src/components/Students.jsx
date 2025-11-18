import { useEffect, useMemo, useState } from 'react'

export default function Students() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [className, setClassName] = useState('')
  const [roll, setRoll] = useState('')
  const [selected, setSelected] = useState(null)
  const [subject, setSubject] = useState('')
  const [score, setScore] = useState('')
  const [total, setTotal] = useState('100')
  const [atype, setAtype] = useState('Test')

  const loadStudents = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/students`)
      const data = await res.json()
      setStudents(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStudents() }, [])

  const createStudent = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    await fetch(`${baseUrl}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, class_name: className, roll_no: roll })
    })
    setName(''); setEmail(''); setClassName(''); setRoll('')
    await loadStudents()
  }

  const addAssessment = async (e) => {
    e.preventDefault()
    if (!selected) return
    await fetch(`${baseUrl}/api/assessments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: selected, subject, score: parseFloat(score), total: parseFloat(total), assessment_type: atype })
    })
    setSubject(''); setScore(''); setTotal('100'); setAtype('Test')
  }

  const selectedStudent = useMemo(() => students.find(s => s._id === selected), [students, selected])

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Add Student</h3>
        <form onSubmit={createStudent} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
            <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="input" placeholder="Class (e.g., 10-A)" value={className} onChange={e=>setClassName(e.target.value)} />
            <input className="input" placeholder="Roll No" value={roll} onChange={e=>setRoll(e.target.value)} />
          </div>
          <button className="btn-primary" type="submit">Create</button>
        </form>

        <h3 className="text-white font-semibold mt-6 mb-3">Students</h3>
        {loading ? (
          <p className="text-blue-200">Loading...</p>
        ) : (
          <ul className="divide-y divide-blue-500/10">
            {students.map(s => (
              <li key={s._id} className={`py-2 flex items-center justify-between ${selected===s._id?'text-white':'text-blue-100'}`}>
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm text-blue-300/70">{s.class_name || '—'} · {s.roll_no || '—'}</div>
                </div>
                <button onClick={()=>setSelected(s._id)} className="px-3 py-1 rounded bg-blue-600 text-white">Select</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3">Add Assessment</h3>
        <form onSubmit={addAssessment} className="space-y-3">
          <select className="input" value={selected||''} onChange={e=>setSelected(e.target.value)}>
            <option value="" disabled>Select a student</option>
            {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <div className="grid sm:grid-cols-2 gap-3">
            <input className="input" placeholder="Subject" value={subject} onChange={e=>setSubject(e.target.value)} />
            <input className="input" placeholder="Score" type="number" value={score} onChange={e=>setScore(e.target.value)} />
            <input className="input" placeholder="Total" type="number" value={total} onChange={e=>setTotal(e.target.value)} />
            <input className="input" placeholder="Type (Test/Exam)" value={atype} onChange={e=>setAtype(e.target.value)} />
          </div>
          <button className="btn-primary" type="submit" disabled={!selected}>Save Assessment</button>
        </form>

        {selectedStudent && (
          <div className="mt-6">
            <h4 className="text-white font-semibold mb-2">Selected: {selectedStudent.name}</h4>
            <StudentStats id={selectedStudent._id} />
          </div>
        )}
      </div>
    </div>
  )
}

function StudentStats({ id }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [stats, setStats] = useState(null)

  const load = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/students/${id}/stats`)
      const data = await res.json()
      setStats(data)
    } catch (e) {
      setStats({ error: e.message })
    }
  }

  useEffect(()=>{ load() }, [id])

  if (!stats) return <p className="text-blue-200">Loading stats...</p>
  if (stats.error) return <p className="text-red-300">{stats.error}</p>

  return (
    <div className="p-3 rounded-lg bg-slate-900/60 border border-blue-500/10 text-blue-100 space-y-1">
      <div>Overall Average: <span className="font-semibold">{stats.overall_average}%</span></div>
      {stats.best_subject && <div>Best Subject: <span className="font-semibold">{stats.best_subject}</span></div>}
      {stats.worst_subject && <div>Needs Work: <span className="font-semibold">{stats.worst_subject}</span></div>}
    </div>
  )
}
