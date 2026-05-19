import { useState } from 'react'
import { Plus, Search, ArrowLeftRight, X, ArrowDownLeft } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { useApp } from '../context/AppContext'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { Input, Select } from '../components/ui/Input'

const today = format(new Date(), 'yyyy-MM-dd')
const defaultDue = format(addDays(new Date(), 7), 'yyyy-MM-dd')

const emptyForm = {
  borrowerName: '', borrowerId: '', itemType: 'book',
  itemId: '', borrowDate: today, dueDate: defaultDue,
}

export default function Loans() {
  const { transactions, books, equipment, members, createTransaction, returnTransaction } = useApp()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.borrowerName.toLowerCase().includes(search.toLowerCase()) ||
      t.itemTitle.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || t.status === filterStatus
    const matchType = filterType === 'All' || t.itemType === filterType
    return matchSearch && matchStatus && matchType
  }).sort((a, b) => b.id.localeCompare(a.id))

  const availableItems = form.itemType === 'book'
    ? books.filter((b) => b.status === 'Available')
    : equipment.filter((e) => e.status === 'Available')

  const selectedItem = form.itemType === 'book'
    ? books.find((b) => b.id === form.itemId)
    : equipment.find((e) => e.id === form.itemId)

  function validate() {
    const e = {}
    if (!form.borrowerName.trim()) e.borrowerName = 'Borrower name is required'
    if (!form.borrowerId.trim()) e.borrowerId = 'Borrower ID is required'
    if (!form.itemId) e.itemId = 'Select an item to borrow'
    if (!form.borrowDate) e.borrowDate = 'Borrow date required'
    if (!form.dueDate) e.dueDate = 'Due date required'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const itemTitle = form.itemType === 'book'
      ? selectedItem?.title
      : selectedItem?.name

    createTransaction({ ...form, itemTitle })
    setIsModalOpen(false)
    setForm(emptyForm)
  }

  function field(key, value) {
    const updates = { [key]: value }
    if (key === 'itemType') updates.itemId = ''
    setForm((f) => ({ ...f, ...updates }))
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n })
  }

  function openModal() {
    setForm(emptyForm)
    setErrors({})
    setIsModalOpen(true)
  }

  const statusOrder = { Overdue: 0, Active: 1, Returned: 2 }

  return (
    <div className="p-6 space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 h-9 bg-white border border-zinc-200 rounded-xl px-3 shadow-sm">
          <Search size={14} className="text-zinc-400 shrink-0" />
          <input
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-zinc-400"
            placeholder="Search by borrower, item, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-zinc-400 hover:text-zinc-600"><X size={14} /></button>
          )}
        </div>
        <div className="flex gap-2">
          <select
            className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Overdue">Overdue</option>
            <option value="Returned">Returned</option>
          </select>
          <select
            className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            value={filterType} onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="book">Books</option>
            <option value="equipment">Equipment</option>
          </select>
          <Button icon={<Plus size={14} />} onClick={openModal}>New Loan</Button>
        </div>
      </div>

      <p className="text-xs text-zinc-400">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</p>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
          <ArrowLeftRight size={40} className="mb-3 opacity-30" />
          <p className="text-sm">No transactions found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-left text-xs font-medium text-zinc-500 px-5 py-3">Transaction</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-3 hidden sm:table-cell">Borrower</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-3 hidden md:table-cell">Dates</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-3 hidden lg:table-cell">Type</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-3">Status</th>
                <th className="text-right text-xs font-medium text-zinc-500 px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-mono text-zinc-400">{t.id}</p>
                    <p className="text-sm font-medium text-zinc-900 mt-0.5 line-clamp-1">{t.itemTitle}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <p className="text-sm text-zinc-800">{t.borrowerName}</p>
                    <p className="text-xs text-zinc-400">{t.borrowerId}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <p className="text-xs text-zinc-500">Borrowed: <span className="text-zinc-700">{t.borrowDate}</span></p>
                    <p className="text-xs text-zinc-500">Due: <span className={t.status === 'Overdue' ? 'text-rose-600 font-medium' : 'text-zinc-700'}>{t.dueDate}</span></p>
                    {t.returnDate && <p className="text-xs text-zinc-500">Returned: <span className="text-emerald-600">{t.returnDate}</span></p>}
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <Badge label={t.itemType} size="xs" />
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge label={t.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {t.status !== 'Returned' && (
                      <Button
                        variant="secondary"
                        size="xs"
                        icon={<ArrowDownLeft size={11} />}
                        onClick={() => returnTransaction(t.id)}
                      >
                        Return
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Loan Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Loan / Checkout">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-xs text-indigo-700 font-medium">Checking out a new item. Select the borrower and item details below.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Borrower Name *" id="borrowerName" placeholder="Full name"
              value={form.borrowerName} onChange={(e) => field('borrowerName', e.target.value)}
              error={errors.borrowerName}
            />
            <div>
              <Select
                label="Borrower (Member)" id="borrowerIdSelect"
                value={form.borrowerId}
                onChange={(e) => {
                  const member = members.find((m) => m.id === e.target.value)
                  if (member) {
                    field('borrowerId', member.id)
                    setForm((f) => ({ ...f, borrowerId: member.id, borrowerName: member.name }))
                  } else {
                    field('borrowerId', e.target.value)
                  }
                }}
                error={errors.borrowerId}
              >
                <option value="">Select member…</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
                ))}
              </Select>
            </div>

            <Select
              label="Item Type" id="itemType"
              value={form.itemType} onChange={(e) => field('itemType', e.target.value)}
            >
              <option value="book">Book</option>
              <option value="equipment">Equipment</option>
            </Select>

            <Select
              label="Select Item *" id="itemId"
              value={form.itemId} onChange={(e) => field('itemId', e.target.value)}
              error={errors.itemId}
            >
              <option value="">Choose available item…</option>
              {availableItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {form.itemType === 'book' ? `${item.title} — ${item.author}` : `${item.name} (${item.serialNumber})`}
                </option>
              ))}
            </Select>

            <Input
              label="Borrow Date *" id="borrowDate" type="date"
              value={form.borrowDate} onChange={(e) => field('borrowDate', e.target.value)}
              error={errors.borrowDate}
            />
            <Input
              label="Due Date *" id="dueDate" type="date"
              value={form.dueDate} onChange={(e) => field('dueDate', e.target.value)}
              error={errors.dueDate}
            />
          </div>

          {selectedItem && (
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-600">
              <p className="font-medium text-zinc-800 mb-1">Selected Item Preview</p>
              {form.itemType === 'book'
                ? <p>{selectedItem.title} by {selectedItem.author} · Shelf: {selectedItem.shelfLocation}</p>
                : <p>{selectedItem.name} · {selectedItem.brand} {selectedItem.model} · S/N: {selectedItem.serialNumber}</p>
              }
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
            <Button type="submit" icon={<ArrowLeftRight size={14} />}>Confirm Checkout</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
