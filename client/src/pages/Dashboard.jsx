import { ArrowRight, Plus } from 'lucide-react'
import StatCard from '../components/StatCard'
import SupplierTable from '../components/SupplierTable'
import '../styles/Dashboard.css'

function Dashboard({ stats, suppliers, loading, error, onRetry, onAddSupplier, onViewSuppliers }) {
  return (
    <section className="dashboard-page">
      <div className="page-heading dashboard-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Overview of your supplier management activities</p>
        </div>
        <button className="button button-primary add-supplier-button" type="button" onClick={onAddSupplier}>
          <Plus size={18} strokeWidth={2.2} />
          Add Supplier
        </button>
      </div>

      {error && (
        <div className="dashboard-alert" role="alert">
          <span>{error}</span>
          <button className="text-button" type="button" onClick={onRetry}>Retry</button>
        </div>
      )}

      <div className="stats-grid">
        <StatCard type="total" value={stats?.total} loading={loading} />
        <StatCard type="active" value={stats?.active} loading={loading} />
        <StatCard type="inactive" value={stats?.inactive} loading={loading} />
      </div>

      <section className="content-card recent-card">
        <div className="section-heading">
          <div>
            <h2>Recent suppliers</h2>
            <p>Your latest supplier records</p>
          </div>
          <button className="view-all-button" type="button" onClick={onViewSuppliers}>
            View all <ArrowRight size={16} />
          </button>
        </div>
        <SupplierTable
          suppliers={suppliers.slice(0, 5)}
          loading={loading}
          error={error}
          onRetry={onRetry}
          onAddSupplier={onAddSupplier}
          compact
        />
      </section>
    </section>
  )
}

export default Dashboard
