import { useState } from 'react'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Equipment from './pages/Equipment'
import Loans from './pages/Loans'
import Members from './pages/Members'

const pages = {
  dashboard: Dashboard,
  books: Books,
  equipment: Equipment,
  loans: Loans,
  members: Members,
}

function AppShell() {
  const [activePage, setActivePage] = useState('dashboard')
  const Page = pages[activePage] ?? Dashboard

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar activePage={activePage} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Page />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
