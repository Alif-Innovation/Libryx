import { LayoutDashboard, BookOpen, Package, ArrowLeftRight, Users, ChevronRight, Library } from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'books', label: 'Books', icon: BookOpen },
  { id: 'equipment', label: 'Equipment', icon: Package },
  { id: 'loans', label: 'Loans', icon: ArrowLeftRight },
  { id: 'members', label: 'Members', icon: Users },
]

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col bg-white border-r border-zinc-200">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-zinc-100">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
          <Library size={16} className="text-white" />
        </div>
        <span className="text-base font-bold text-zinc-900 tracking-tight">Libryx</span>
      </div>

      <nav className="flex-1 py-4 px-3 overflow-y-auto scrollbar-thin">
        <p className="px-2 mb-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
          Navigation
        </p>
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activePage === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium mb-0.5 transition-all duration-150
                ${active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                }
              `}
            >
              <Icon size={16} className={active ? 'text-indigo-600' : 'text-zinc-400'} />
              <span className="flex-1 text-left">{label}</span>
              {active && <ChevronRight size={14} className="text-indigo-400" />}
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-zinc-100">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            A
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-zinc-800 truncate">Admin</p>
            <p className="text-[10px] text-zinc-400 truncate">admin@libryx.io</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
