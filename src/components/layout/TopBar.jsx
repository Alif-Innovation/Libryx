import { Bell, Search } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const pageTitles = {
  dashboard: { title: 'Dashboard', sub: 'Overview of your library system' },
  books: { title: 'Books Catalog', sub: 'Manage your book collection' },
  equipment: { title: 'Equipment', sub: 'Manage learning tools & gear' },
  loans: { title: 'Loan Transactions', sub: 'Track borrowing & returns' },
  members: { title: 'Members', sub: 'Manage borrowers & accounts' },
}

export default function TopBar({ activePage }) {
  const { stats } = useApp()
  const { title, sub } = pageTitles[activePage] ?? pageTitles.dashboard

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm border-b border-zinc-200 sticky top-0 z-10">
      <div>
        <h1 className="text-base font-semibold text-zinc-900">{title}</h1>
        <p className="text-xs text-zinc-400">{sub}</p>
      </div>
      <div className="flex items-center gap-2">
        {stats.totalOverdue > 0 && (
          <div className="relative">
            <button className="relative p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 transition-colors">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-1.5 h-9 bg-zinc-50 border border-zinc-200 rounded-xl px-3 text-sm text-zinc-400">
          <Search size={14} />
          <span className="hidden sm:block">Search...</span>
        </div>
      </div>
    </header>
  )
}
