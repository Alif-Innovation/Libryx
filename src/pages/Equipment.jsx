import { useState } from 'react'
import { Plus, Search, Package, Pencil, Trash2, X, Cpu } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { Input, Select } from '../components/ui/Input'
import { EQUIPMENT_CATEGORIES } from '../data/mockData'

const categoryIcons = {
  Electronics: '🔌',
  Stationery: '✏️',
  Photography: '📷',
  'Audio/Visual': '🎥',
  Computing: '💻',
  'Science Lab': '🔬',
  'Art Supplies': '🎨',
  Sports: '⚽',
}

const emptyForm = {
  name: '', serialNumber: '', brand: '', model: '',
  category: EQUIPMENT_CATEGORIES[0], condition: 'Excellent',
}

export default function Equipment() {
  const { equipment, addEquipment, updateEquipment, deleteEquipment } = useApp()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterCondition, setFilterCondition] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const filtered = equipment.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.brand.toLowerCase().includes(search.toLowerCase()) ||
      e.serialNumber.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || e.status === filterStatus
    const matchCategory = filterCategory === 'All' || e.category === filterCategory
    const matchCondition = filterCondition === 'All' || e.condition === filterCondition
    return matchSearch && matchStatus && matchCategory && matchCondition
  })

  function openAdd() {
    setEditingItem(null)
    setForm(emptyForm)
    setErrors({})
    setIsModalOpen(true)
  }

  function openEdit(item) {
    setEditingItem(item)
    setForm({ ...item })
    setErrors({})
    setIsModalOpen(true)
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.serialNumber.trim()) e.serialNumber = 'Serial number is required'
    if (!form.brand.trim()) e.brand = 'Brand is required'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    if (editingItem) updateEquipment(editingItem.id, form)
    else addEquipment(form)
    setIsModalOpen(false)
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
            placeholder="Search by name, brand, serial..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-zinc-400 hover:text-zinc-600"><X size={14} /></button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <select className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Borrowed">Borrowed</option>
          </select>
          <select className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="All">All Categories</option>
            {EQUIPMENT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)}>
            <option value="All">All Conditions</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Damaged">Damaged</option>
          </select>
          <Button icon={<Plus size={14} />} onClick={openAdd}>Add Item</Button>
        </div>
      </div>

      <p className="text-xs text-zinc-400">{filtered.length} item{filtered.length !== 1 ? 's' : ''} found</p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
          <Package size={40} className="mb-3 opacity-30" />
          <p className="text-sm">No equipment match your filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-left text-xs font-medium text-zinc-500 px-5 py-3">Item</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-3 hidden md:table-cell">Serial No.</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-3 hidden lg:table-cell">Category</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-3 hidden sm:table-cell">Condition</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-3">Status</th>
                <th className="text-right text-xs font-medium text-zinc-500 px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center text-base shrink-0 group-hover:bg-indigo-50 transition-colors">
                        {categoryIcons[item.category] ?? <Cpu size={14} className="text-zinc-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{item.name}</p>
                        <p className="text-xs text-zinc-400">{item.brand} · {item.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell"><span className="text-xs font-mono text-zinc-500">{item.serialNumber}</span></td>
                  <td className="px-4 py-3.5 hidden lg:table-cell"><span className="text-xs text-zinc-600">{item.category}</span></td>
                  <td className="px-4 py-3.5 hidden sm:table-cell"><Badge label={item.condition} size="xs" /></td>
                  <td className="px-4 py-3.5"><Badge label={item.status} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => deleteEquipment(item.id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Equipment' : 'Add New Equipment'}>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label="Item Name *" id="name" placeholder="e.g. iPad Pro 12.9&quot;" value={form.name} onChange={(e) => field('name', e.target.value)} error={errors.name} />
            </div>
            <Input label="Brand *" id="brand" placeholder="e.g. Apple" value={form.brand} onChange={(e) => field('brand', e.target.value)} error={errors.brand} />
            <Input label="Model" id="model" placeholder="e.g. M2 (2022)" value={form.model} onChange={(e) => field('model', e.target.value)} />
            <Input label="Serial Number *" id="serialNumber" placeholder="e.g. DLXK9-4421" value={form.serialNumber} onChange={(e) => field('serialNumber', e.target.value)} error={errors.serialNumber} />
            <Select label="Category" id="category" value={form.category} onChange={(e) => field('category', e.target.value)}>
              {EQUIPMENT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
            <Select label="Condition" id="condition" value={form.condition} onChange={(e) => field('condition', e.target.value)}>
              <option>Excellent</option>
              <option>Good</option>
              <option>Damaged</option>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
            <Button type="submit">{editingItem ? 'Save Changes' : 'Add Equipment'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
