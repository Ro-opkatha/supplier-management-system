import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import api from '../services/api'
import AddSupplierModal from '../components/AddSupplierModal'
import SupplierTable from '../components/SupplierTable'
import '../styles/Dashboard.css'

function getErrorMessage(requestError, fallback) {
  return requestError.response?.data?.message || requestError.message || fallback
}

function Suppliers({
  allSuppliers,
  onAddSupplier,
  onDataChanged,
  defaultSupplierStatus,
  onSupplierOperation,
}) {
  const [suppliers, setSuppliers] = useState([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const categories = useMemo(
    () => [...new Set([...allSuppliers, ...suppliers].map((supplier) => supplier.category).filter(Boolean))].sort(),
    [allSuppliers, suppliers],
  )

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const controller = new AbortController()

    api.get('/suppliers', {
      params: {
        search: debouncedSearch || undefined,
        category: category || undefined,
        status: status || undefined,
      },
      signal: controller.signal,
    })
      .then((response) => {
        const records = response.data?.data
        if (!Array.isArray(records)) {
          throw new Error('The suppliers response was invalid.')
        }
        setError('')
        setSuppliers(records)
      })
      .catch((requestError) => {
        if (requestError.code !== 'ERR_CANCELED') {
          setError(getErrorMessage(requestError, 'Unable to load suppliers.'))
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [allSuppliers, debouncedSearch, category, status, refreshKey])

  const retry = () => {
    setError('')
    setLoading(true)
    setRefreshKey((current) => current + 1)
  }

  const handleEditSupplier = async (updates) => {
    const response = await api.put(`/suppliers/${editingSupplier._id}`, updates)
    onSupplierOperation(
      'updated',
      response.data?.data?.companyName || updates.companyName || editingSupplier.companyName,
    )
    setEditingSupplier(null)
    setLoading(true)
    setError('')
    setRefreshKey((current) => current + 1)
    onDataChanged()
  }

  const handleDeleteSupplier = async (supplier) => {
    const confirmed = window.confirm(`Delete ${supplier.companyName}? This action cannot be undone.`)
    if (!confirmed) return

    setActionError('')
    setDeletingId(supplier._id)
    try {
      await api.delete(`/suppliers/${supplier._id}`)
      onSupplierOperation('deleted', supplier.companyName)
      setLoading(true)
      setError('')
      setRefreshKey((current) => current + 1)
      onDataChanged()
    } catch (requestError) {
      setActionError(getErrorMessage(requestError, 'Unable to delete this supplier.'))
    } finally {
      setDeletingId(null)
    }
  }

  const setFilter = (setter) => (event) => {
    setLoading(true)
    setError('')
    setter(event.target.value)
  }

  return (
    <section className="dashboard-page suppliers-page">
      <div className="page-heading dashboard-heading">
        <div>
          <p className="eyebrow">DIRECTORY</p>
          <h1>Suppliers</h1>
          <p className="page-subtitle">Manage and keep track of your supplier relationships</p>
        </div>
        <button className="button button-primary add-supplier-button" type="button" onClick={onAddSupplier}>
          <Plus size={18} strokeWidth={2.2} />
          Add Supplier
        </button>
      </div>

      {actionError && (
        <div className="dashboard-alert" role="alert">
          <span>{actionError}</span>
          <button className="text-button" type="button" onClick={() => setActionError('')}>Dismiss</button>
        </div>
      )}

      <section className="content-card suppliers-directory-card">
        <div className="suppliers-toolbar">
          <div className="section-heading suppliers-section-heading">
            <div>
              <h2>All suppliers</h2>
              <p>{loading ? 'Loading supplier directory…' : `${suppliers.length.toLocaleString()} supplier records`}</p>
            </div>
          </div>
          <div className="supplier-filters">
            <label className="supplier-search-field">
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setLoading(true)
                  setError('')
                  setSearch(event.target.value)
                }}
                placeholder="Search suppliers"
                aria-label="Search suppliers by company or contact"
              />
            </label>
            <label className="supplier-filter-field">
              <span className="sr-only">Filter by category</span>
              <select value={category} onChange={setFilter(setCategory)} aria-label="Filter by category">
                <option value="">All categories</option>
                {categories.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
            <label className="supplier-filter-field">
              <span className="sr-only">Filter by status</span>
              <select value={status} onChange={setFilter(setStatus)} aria-label="Filter by status">
                <option value="">All statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
            <span className="filter-indicator" aria-hidden="true"><SlidersHorizontal size={16} /></span>
          </div>
        </div>

        <SupplierTable
          suppliers={suppliers}
          loading={loading}
          error={error}
          onRetry={retry}
          onAddSupplier={onAddSupplier}
          onEditSupplier={setEditingSupplier}
          onDeleteSupplier={handleDeleteSupplier}
          deletingId={deletingId}
          emptyTitle={search || category || status ? 'No matching suppliers' : 'No suppliers yet'}
          emptyMessage={
            search || category || status
              ? 'Try adjusting your search or filters.'
              : 'Add your first supplier to start building your directory.'
          }
        />
      </section>

      {editingSupplier && (
        <AddSupplierModal
          supplier={editingSupplier}
          onClose={() => setEditingSupplier(null)}
          onSubmit={handleEditSupplier}
          defaultSupplierStatus={defaultSupplierStatus}
        />
      )}
    </section>
  )
}

export default Suppliers
