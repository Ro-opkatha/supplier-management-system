import { Building2, Pencil, Trash2 } from 'lucide-react'

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

function SupplierTable({
  suppliers,
  loading,
  error,
  onRetry,
  onAddSupplier,
  onEditSupplier,
  onDeleteSupplier,
  deletingId,
  emptyTitle = 'No suppliers yet',
  emptyMessage = 'Add your first supplier to start building your directory.',
  compact = false,
}) {
  if (loading) {
    return (
      <div className="table-state" role="status">
        <span className="loading-spinner" />
        <span>Loading suppliers…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="table-state table-error" role="alert">
        <p>{error}</p>
        <button className="text-button" type="button" onClick={onRetry}>Try again</button>
      </div>
    )
  }

  if (suppliers.length === 0) {
    return (
      <div className="table-empty">
        <span className="empty-icon"><Building2 size={22} /></span>
        <h3>{emptyTitle}</h3>
        <p>{emptyMessage}</p>
        {onAddSupplier && (
          <button className="text-button" type="button" onClick={onAddSupplier}>Add your first supplier</button>
        )}
      </div>
    )
  }

  return (
    <div className="supplier-table-wrap">
      <table className={`supplier-table${compact ? ' is-compact' : ''}`}>
        <thead>
          <tr>
            <th scope="col">Company Name</th>
            {compact ? (
              <>
                <th scope="col">Category</th>
                <th scope="col">Status</th>
                <th scope="col">Added</th>
              </>
            ) : (
              <>
                <th scope="col">Contact Person</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Category</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier._id}>
              <td>
                <div className="supplier-identity">
                  <span className="supplier-avatar">
                    {(supplier.companyName || '?').trim().charAt(0).toUpperCase()}
                  </span>
                  <span className="supplier-name-block">
                    <strong>{supplier.companyName}</strong>
                    {compact && <span>{supplier.contactPerson}</span>}
                  </span>
                </div>
              </td>
              {compact ? (
                <>
                  <td><span className="category-label">{supplier.category}</span></td>
                  <td>
                    <span className={`status-badge${supplier.status === 'Active' ? ' status-active' : ' status-inactive'}`}>
                      <span className="status-dot" />
                      {supplier.status}
                    </span>
                  </td>
                  <td className="supplier-secondary">{formatDate(supplier.createdAt)}</td>
                </>
              ) : (
                <>
                  <td>{supplier.contactPerson}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                  <td><span className="category-label">{supplier.category}</span></td>
                  <td>
                    <span className={`status-badge${supplier.status === 'Active' ? ' status-active' : ' status-inactive'}`}>
                      <span className="status-dot" />
                      {supplier.status}
                    </span>
                  </td>
                  <td>
                    <div className="supplier-actions">
                      <button
                        className="row-action"
                        type="button"
                        aria-label={`Edit ${supplier.companyName}`}
                        title="Edit supplier"
                        onClick={() => onEditSupplier(supplier)}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="row-action row-action-delete"
                        type="button"
                        aria-label={`Delete ${supplier.companyName}`}
                        title={deletingId === supplier._id ? 'Deleting supplier' : 'Delete supplier'}
                        disabled={deletingId === supplier._id}
                        onClick={() => onDeleteSupplier(supplier)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SupplierTable
