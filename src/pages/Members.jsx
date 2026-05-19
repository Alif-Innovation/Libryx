import { useState } from 'react'
import { Plus, Search, Users, X, GraduationCap, Briefcase } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { Input, Select } from '../components/ui/Input'

const emptyForm = { name: '', email: '', role: 'Student' }

const avatarColors = [
  'from-indigo-400 to-violet-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-500',
  'from-sky-400 to-cyan-500',
  'from-lime-400 to-green-500',
]

function getAvatarGradient(id) {
  const idx = parseInt(id.replace('M', ''), 10) % avatarColors.length
  return avatarColors[idx] || avatarColors[0]
}

export default function Members() {
  const { members, addMember, transactions } = useApp()
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const filtered = members.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === 'All' || m.role === filterRole
    return matchSearch && matchRole
  })

  function getMemberTransactions(memberId) {
    return transactions.filter((t) => t.borrowerId === memberId)
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    addMember(form)
    setIsModalOpen(false)
    setForm(emptyForm)
  }

  function field(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n })
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 h-9 bg-white border border-zinc-200 rounded-xl px-3 shadow-sm">
          <Search size={14} className="text-zinc-400 shrink-0" />
          <input
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-zinc-400"
            placeholder="Search by name, email, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (<button onClick={() => setSearch('')} className="text-zinc-400 hover:text-zinc-600"><X size={14} /></button>)}
        </div>
        <div className="flex gap-2">
          <select className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="All">All Roles</option>
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
          </select>
          <Button icon={<Plus size={14} />} onClick={() => { setForm(emptyForm); setErrors({}); setIsModalOpen(true) }}>Add Member</Button>
        </div>
      </div>

      <p className="text-xs text-zinc-400">{filtered.length} member{filtered.length !== 1 ? 's' : ''}</p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
          <Users size={40} className="mb-3 opacity-30" />
          <p className="text-sm">No members found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((member) => {
            const memberTxns = getMemberTransactions(member.id)
            const active = memberTxns.filter((t) => t.status === 'Active' || t.status === 'Overdue').length
            const history = memberTxns.length
            return (
              <div key={member.id} className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarGradient(member.id)} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-zinc-900 truncate">{member.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ring-1 ${
                    member.role === 'Faculty' ? 'bg-violet-50 text-violet-700 ring-violet-200' : 'bg-sky-50 text-sky-700 ring-sky-200'
                  }`}>
                    {member.role === 'Faculty' ? <Briefcase size={10} /> : <GraduationCap size={10} />}
                    {member.role}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">{member.id}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-100">
                  <div className="text-center">
                    <p className="text-lg font-bold text-zinc-900">{active}</p>
                    <p className="text-[10px] text-zinc-400">Active Loans</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-zinc-900">{history}</p>
                    <p className="text-[10px] text-zinc-400">Total Borrows</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Member">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input label="Full Name *" id="name" placeholder="e.g. Alex Rivera" value={form.name} onChange={(e) => field('name', e.target.value)} error={errors.name} />
          <Input label="Email *" id="email" type="email" placeholder="student@school.edu" value={form.email} onChange={(e) => field('email', e.target.value)} error={errors.email} />
          <Select label="Role" id="role" value={form.role} onChange={(e) => field('role', e.target.value)}>
            <option>Student</option>
            <option>Faculty</option>
          </Select>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
            <Button type="submit">Add Member</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
