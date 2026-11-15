import { Building2, Info, MonitorCog, RotateCcw, Save } from 'lucide-react'
import '../styles/Settings.css'

function SettingsSection({ icon: Icon, title, description, children }) {
  return (
    <section className="settings-panel">
      <div className="settings-panel-heading">
        <span className="settings-icon"><Icon size={19} /></span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function Settings({ settings, notice, onChange, onSave, onReset }) {
  const updateField = (event) => onChange(event.target.name, event.target.value)

  return (
    <section className="settings-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">WORKSPACE</p>
          <h1>Settings</h1>
          <p className="page-subtitle">Manage your SupplierHub preferences.</p>
        </div>
      </div>

      <div className="settings-sections">
        <SettingsSection
          icon={Building2}
          title="General settings"
          description="Customize your workspace and new supplier defaults."
        >
          <div className="settings-fields">
            <label className="settings-field">
              <span>Application name <em>*</em></span>
              <input
                name="applicationName"
                value={settings.applicationName}
                onChange={updateField}
                required
                maxLength={60}
              />
            </label>
            <label className="settings-field settings-field-wide">
              <span>Application description</span>
              <textarea
                name="applicationDescription"
                value={settings.applicationDescription}
                onChange={updateField}
                rows={3}
                maxLength={240}
              />
            </label>
            <label className="settings-field">
              <span>Default supplier status</span>
              <select
                name="defaultSupplierStatus"
                value={settings.defaultSupplierStatus}
                onChange={updateField}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <small>New suppliers use this status by default. You can change it on the supplier form.</small>
            </label>
          </div>
        </SettingsSection>

        <SettingsSection
          icon={MonitorCog}
          title="Display preferences"
          description="Adjust how SupplierHub appears in this browser."
        >
          <div className="settings-fields">
            <label className="settings-field">
              <span>Theme</span>
              <select name="theme" value={settings.theme} onChange={updateField}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <small>The selected theme updates the interface immediately and is saved with your settings.</small>
            </label>
          </div>
        </SettingsSection>

        <SettingsSection
          icon={Info}
          title="About SupplierHub"
          description="Application and technology information."
        >
          <p className="about-description">
            A supplier management application built using the MERN stack.
          </p>
          <dl className="about-details">
            <div><dt>Application</dt><dd>SupplierHub</dd></div>
            <div><dt>Frontend</dt><dd>React + Vite</dd></div>
            <div><dt>Backend</dt><dd>Node.js + Express</dd></div>
            <div><dt>Database</dt><dd>MongoDB</dd></div>
            <div><dt>API communication</dt><dd>Axios</dd></div>
          </dl>
        </SettingsSection>
      </div>

      {notice && (
        <p className={`settings-notice${notice.type === 'error' ? ' is-error' : ''}`} role={notice.type === 'error' ? 'alert' : 'status'}>
          {notice.message}
        </p>
      )}

      <div className="settings-actions">
        <button className="button button-secondary" type="button" onClick={onReset}>
          <RotateCcw size={16} />
          Reset to Default
        </button>
        <button className="button button-primary" type="button" onClick={onSave}>
          <Save size={16} />
          Save settings
        </button>
      </div>
    </section>
  )
}

export default Settings
