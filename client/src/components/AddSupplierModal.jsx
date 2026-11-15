import { useRef, useState } from 'react'
import { X } from 'lucide-react'

const initialForm = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  category: '',
  status: 'Active',
  address: '',
  paymentTerms: '',
}

const requiredFields = {
  companyName: 'Company name',
  contactPerson: 'Contact person',
  email: 'Email address',
  phone: 'Phone number',
  category: 'Category',
}

const supplierFields = [
  'companyName',
  'contactPerson',
  'email',
  'phone',
  'category',
  'address',
  'paymentTerms',
  'status',
]

function validateForm(form) {
  const errors = {}

  Object.entries(requiredFields).forEach(([field, label]) => {
    if (!String(form[field] ?? '').trim()) errors[field] = `${label} is required.`
  })

  const email = String(form.email ?? '').trim()
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  return errors
}

function AddSupplierModal({
  onClose,
  onSubmit,
  supplier = null,
  defaultSupplierStatus = 'Active',
}) {
  const isEditing = Boolean(supplier)
  const [form, setForm] = useState(() => Object.fromEntries(
    supplierFields.map((field) => [
      field,
      String(supplier?.[field] ?? (field === 'status' ? defaultSupplierStatus : initialForm[field])),
    ]),
  ))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const submissionInProgress = useRef(false)

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => {
      if (!current[name]) return current
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submissionInProgress.current) return

    const validationErrors = validateForm(form)
    setFieldErrors(validationErrors)
    setError('')
    if (Object.keys(validationErrors).length > 0) return

    submissionInProgress.current = true
    setSubmitting(true)

    try {
      const payload = Object.fromEntries(
        supplierFields.map((field) => [field, String(form[field] ?? '').trim()]),
      )
      payload.email = payload.email.toLowerCase()
      await onSubmit(payload)
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          'Unable to add this supplier.',
      )
    } finally {
      submissionInProgress.current = false
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !submitting) onClose()
    }}>
      <section
        className="supplier-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-supplier-title"
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">SUPPLIER DIRECTORY</p>
            <h2 id="add-supplier-title">{isEditing ? 'Edit supplier' : 'Add supplier'}</h2>
          </div>
          <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Close dialog" disabled={submitting}>
            <X size={20} />
          </button>
        </div>
        <p className="modal-description">
          {isEditing
            ? 'Update the supplier’s details in your directory.'
            : 'Enter the supplier’s details to add them to your directory.'}
        </p>

        <form className="supplier-form" onSubmit={handleSubmit} noValidate>
          <fieldset className="supplier-form-fields" disabled={submitting}>
            <label className="form-field form-field-wide">
              <span>Company name <em>*</em></span>
              <input
                name="companyName"
                value={form.companyName}
                onChange={updateField}
                required
                autoFocus
                aria-invalid={Boolean(fieldErrors.companyName)}
                aria-describedby={fieldErrors.companyName ? 'companyName-error' : undefined}
              />
              {fieldErrors.companyName && <span className="form-error" id="companyName-error">{fieldErrors.companyName}</span>}
            </label>
            <label className="form-field">
              <span>Contact person <em>*</em></span>
              <input
                name="contactPerson"
                value={form.contactPerson}
                onChange={updateField}
                required
                aria-invalid={Boolean(fieldErrors.contactPerson)}
                aria-describedby={fieldErrors.contactPerson ? 'contactPerson-error' : undefined}
              />
              {fieldErrors.contactPerson && <span className="form-error" id="contactPerson-error">{fieldErrors.contactPerson}</span>}
            </label>
            <label className="form-field">
              <span>Email address <em>*</em></span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                required
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              />
              {fieldErrors.email && <span className="form-error" id="email-error">{fieldErrors.email}</span>}
            </label>
            <label className="form-field">
              <span>Phone number <em>*</em></span>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={updateField}
                required
                aria-invalid={Boolean(fieldErrors.phone)}
                aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
              />
              {fieldErrors.phone && <span className="form-error" id="phone-error">{fieldErrors.phone}</span>}
            </label>
            <label className="form-field">
              <span>Category <em>*</em></span>
              <input
                name="category"
                value={form.category}
                onChange={updateField}
                required
                aria-invalid={Boolean(fieldErrors.category)}
                aria-describedby={fieldErrors.category ? 'category-error' : undefined}
              />
              {fieldErrors.category && <span className="form-error" id="category-error">{fieldErrors.category}</span>}
            </label>
            <label className="form-field form-field-wide">
              <span>Status</span>
              <select name="status" value={form.status} onChange={updateField}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
            <label className="form-field form-field-wide">
              <span>Address</span>
              <input name="address" value={form.address} onChange={updateField} />
            </label>
            <label className="form-field form-field-wide">
              <span>Payment terms</span>
              <input name="paymentTerms" value={form.paymentTerms} onChange={updateField} />
            </label>
          </fieldset>
          {error && <p className="form-error form-field-wide" role="alert">{error}</p>}
          <div className="modal-actions form-field-wide">
            <button className="button button-secondary" type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button className="button button-primary" type="submit" disabled={submitting}>
              {submitting ? (isEditing ? 'Saving…' : 'Adding…') : (isEditing ? 'Save changes' : 'Add supplier')}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AddSupplierModal
