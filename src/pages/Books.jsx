import { useState } from 'react'
import { Plus, Search, BookOpen, Pencil, Trash2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { Input, Select } from '../components/ui/Input'
import { BOOK_CATEGORIES } from '../data/mockData'

const coverGradients = {
  indigo: 'from-indigo-400 to-indigo-600',
  emerald: 'from-emerald-400 to-emerald-600',
  violet: 'from-violet-400 to-violet-600',
  amber: 'from-amber-400 to-amber-600',
  rose: 'from-rose-400 to-rose-600',
  cyan: 'from-cyan-400 to-cyan-600',
  orange: 'from-orange-400 to-orange-600',
  teal: 'from-teal-400 to-teal-600',
  lime: 'from-lime-400 to-lime-600',
  pink: 'from-pink-400 to-pink-600',
}

const COVER_COLORS = Object.keys(coverGradients)

const emptyForm = {
  title: '', author: '', isbn: '', publisher: '',
  category: BOOK_CATEGORIES[0], shelfLocation: '',
  coverColor: 'indigo',
}

export default function Books() {
  const { books, addBook, updateBook, deleteBook } = useApp()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterCategory, setFilterCategory] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const filtered = books.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.includes(search)
    const matchStatus = filterStatus === 'All' || b.status === filterStatus
    const matchCategory = filterCategory === 'All' || b.category === filterCategory
    return matchSearch && matchStatus && matchCategory
  })

  function openAdd() {
    setEditingBook(null)
    setForm(emptyForm)
    setErrors({})
    setIsModalOpen(true)
  }

  function openEdit(book) {
    setEditingBook(book)
    setForm({ ...book })
    setErrors({})
    setIsModalOpen(true)
  }

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.author.trim()) e.author = 'Author is required'
    if (!form.isbn.trim()) e.isbn = 'ISBN is required'
    if (!form.shelfLocation.trim()) e.shelfLocation = 'Shelf location is required'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    if (editingBook) updateBook(editingBook.id, form)
    else addBook(form)
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
            placeholder="Search books, author, ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-zinc-400 hover:text-zinc-600">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <select
            className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Borrowed">Borrowed</option>
          </select>
          <select
            className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {BOOK_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <Button icon={<Plus size={14} />} onClick={openAdd}>Add Book</Button>
        </div>
      </div>

      <p className="text-xs text-zinc-400">{filtered.length} book{filtered.length !== 1 ? 's' : ''} found</p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
          <BookOpen size={40} className="mb-3 opacity-30" />
          <p className="text-sm">No books match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`h-28 bg-gradient-to-br ${coverGradients[book.coverColor] || coverGradients.indigo} flex items-center justify-center relative`}>
                <BookOpen size={32} className="text-white/70" />
                <div className="absolute top-2 right-2">
                  <Badge label={book.status} size="xs" />
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-zinc-900 line-clamp-1">{book.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{book.author}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-zinc-400">Shelf</p>
                    <p className="text-xs font-mono font-medium text-zinc-700">{book.shelfLocation}</p>
                  </div>
                  <Badge label={book.category} size="xs" />
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <p className="text-[10px] text-zinc-400 font-mono">{book.isbn}</p>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(book)} className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => deleteBook(book.id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBook ? 'Edit Book' : 'Add New Book'}>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label="Title *" id="title" placeholder="Book title" value={form.title} onChange={(e) => field('title', e.target.value)} error={errors.title} />
            </div>
            <Input label="Author *" id="author" placeholder="Author name" value={form.author} onChange={(e) => field('author', e.target.value)} error={errors.author} />
            <Input label="ISBN *" id="isbn" placeholder="978-0-..." value={form.isbn} onChange={(e) => field('isbn', e.target.value)} error={errors.isbn} />
            <Input label="Publisher" id="publisher" placeholder="Publisher name" value={form.publisher} onChange={(e) => field('publisher', e.target.value)} />
            <Select label="Category" id="category" value={form.category} onChange={(e) => field('category', e.target.value)}>
              {BOOK_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </Select>
            <Input label="Shelf Location *" id="shelfLocation" placeholder="e.g. A-01" value={form.shelfLocation} onChange={(e) => field('shelfLocation', e.target.value)} error={errors.shelfLocation} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">Cover Color</label>
              <div className="flex flex-wrap gap-2 mt-0.5">
                {COVER_COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => field('coverColor', c)}
                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${coverGradients[c]} transition-transform ${form.coverColor === c ? 'ring-2 ring-offset-1 ring-indigo-500 scale-110' : 'hover:scale-105'}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
            <Button type="submit">{editingBook ? 'Save Changes' : 'Add Book'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
