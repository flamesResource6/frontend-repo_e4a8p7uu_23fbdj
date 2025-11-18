import Navbar from './components/Navbar'
import Overview from './components/Overview'
import Students from './components/Students'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-blue-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.06),transparent_55%)]"></div>
      <div className="relative">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          <section>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Student Performance Dashboard</h1>
            <p className="text-blue-300/80">Track students, record assessments, and view insights.</p>
          </section>
          <Overview />
          <Students />
        </main>
      </div>
    </div>
  )
}

export default App
