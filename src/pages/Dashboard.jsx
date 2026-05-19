import {
  BookOpen, Package, ArrowLeftRight, AlertTriangle,
  ArrowUpRight, ArrowDownLeft, Clock,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useApp } from '../context/AppContext'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'

const trendData = [
  { day: 'Mon', checkouts: 3, returns: 2 },
  { day: 'Tue', checkouts: 5, returns: 3 },
  { day: 'Wed', checkouts: 2, returns: 4 },
  { day: 'Thu', checkouts: 7, returns: 5 },
  { day: 'Fri', checkouts: 4, returns: 6 },
  { day: 'Sat', checkouts: 6, returns: 3 },
  { day: 'Sun', checkouts: 1, returns: 2 },
]

function ActivityIcon({ type }) {
  if (type === 'checkout') return <div className="p-1.5 bg-indigo-50 rounded-lg"><ArrowUpRight size={12} className="text-indigo-600" /></div>
  if (type === 'checkin') return <div className="p-1.5 bg-emerald-50 rounded-lg"><ArrowDownLeft size={12} className="text-emerald-600" /></div>
  return <div className="p-1.5 bg-rose-50 rounded-lg"><Clock size={12} className="text-rose-600" /></div>
}

export default function Dashboard() {
  const { stats, activityLog, transactions } = useApp()

  const overdueItems = transactions.filter((t) => t.status === 'Overdue')
  const recentActivities = activityLog.slice(0, 6)

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Loans" value={stats.totalActiveLoans} icon={<ArrowLeftRight size={18} />} color="indigo" trend="Currently borrowed" />
        <StatCard label="Overdue Items" value={stats.totalOverdue} icon={<AlertTriangle size={18} />} color="rose" trend="Needs attention" />
        <StatCard label="Available Books" value={`${stats.availableBooks}/${stats.totalBooks}`} icon={<BookOpen size={18} />} color="emerald" trend="On the shelf" />
        <StatCard label="Available Equipment" value={`${stats.availableEquipment}/${stats.totalEquipment}`} icon={<Package size={18} />} color="violet" trend="Ready to borrow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Weekly Activity</h3>
              <p className="text-xs text-zinc-400">Checkouts vs Returns this week</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />Checkouts</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />Returns</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="checkouts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="returns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e4e4e7', fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} />
              <Area type="monotone" dataKey="checkouts" stroke="#6366f1" strokeWidth={2} fill="url(#checkouts)" />
              <Area type="monotone" dataKey="returns" stroke="#10b981" strokeWidth={2} fill="url(#returns)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <ActivityIcon type={activity.type} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-800 truncate">{activity.user}</p>
                  <p className="text-xs text-zinc-400 truncate">{activity.item}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge label={activity.itemType} size="xs" />
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {overdueItems.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-rose-600" />
            <h3 className="text-sm font-semibold text-rose-800">Overdue Items ({overdueItems.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-rose-600/70">
                  <th className="text-left py-1 font-medium">Item</th>
                  <th className="text-left py-1 font-medium">Borrower</th>
                  <th className="text-left py-1 font-medium">Due Date</th>
                  <th className="text-left py-1 font-medium">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-100">
                {overdueItems.map((t) => (
                  <tr key={t.id}>
                    <td className="py-1.5 text-rose-800 font-medium">{t.itemTitle}</td>
                    <td className="py-1.5 text-rose-700">{t.borrowerName}</td>
                    <td className="py-1.5 text-rose-700">{t.dueDate}</td>
                    <td className="py-1.5"><Badge label={t.itemType} size="xs" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
