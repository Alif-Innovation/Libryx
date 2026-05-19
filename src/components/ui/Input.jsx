export function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-zinc-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900
          placeholder:text-zinc-400 shadow-sm transition-colors
          focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400
          disabled:opacity-50 disabled:bg-zinc-50
          ${error ? 'border-rose-300 focus:ring-rose-500/30 focus:border-rose-400' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
}

export function Select({ label, id, error, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-zinc-700">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`
          h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900
          shadow-sm transition-colors appearance-none cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400
          ${error ? 'border-rose-300' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  )
}
