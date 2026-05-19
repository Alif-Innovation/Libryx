const variants = {
  Available: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Returned: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Active: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Borrowed: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Overdue: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  Excellent: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
  Good: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  Damaged: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  book: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  equipment: 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200',
}

export default function Badge({ label, size = 'sm' }) {
  const base = variants[label] ?? 'bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200'
  const sz = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sz} ${base}`}>
      {label}
    </span>
  )
}
