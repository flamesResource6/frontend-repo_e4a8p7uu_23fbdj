import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()
  const link = (to, label) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        pathname === to ? 'bg-blue-600 text-white' : 'text-blue-100 hover:bg-blue-500/20'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur border-b border-blue-500/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="logo" className="w-8 h-8" />
          <span className="text-white font-semibold">Student Performance</span>
        </div>
        <nav className="flex items-center gap-2">
          {link('/', 'Overview')}
          {link('/students', 'Students')}
          {link('/test', 'Connection Test')}
        </nav>
      </div>
    </header>
  )
}
