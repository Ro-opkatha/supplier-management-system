import { ArrowUpRight, Building2, CircleCheck, CircleX } from 'lucide-react'

const cardDetails = {
  total: {
    label: 'Total Suppliers',
    icon: Building2,
    tone: 'violet',
    note: 'Across all statuses',
  },
  active: {
    label: 'Active Suppliers',
    icon: CircleCheck,
    tone: 'green',
    note: 'Currently active',
  },
  inactive: {
    label: 'Inactive Suppliers',
    icon: CircleX,
    tone: 'orange',
    note: 'Currently inactive',
  },
}

function StatCard({ type, value, loading }) {
  const { label, icon: Icon, tone, note } = cardDetails[type]

  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <span className={`stat-icon stat-icon-${tone}`}><Icon size={20} strokeWidth={1.9} /></span>
        <span className="stat-trend"><ArrowUpRight size={15} /> Live</span>
      </div>
      <p className="stat-label">{label}</p>
      {loading ? (
        <div className="stat-skeleton" aria-label={`Loading ${label.toLowerCase()}`} />
      ) : (
        <p className="stat-value">{value?.toLocaleString() ?? '—'}</p>
      )}
      <p className="stat-note">{note}</p>
    </article>
  )
}

export default StatCard
