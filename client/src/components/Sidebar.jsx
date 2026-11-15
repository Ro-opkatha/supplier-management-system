import { Building2, LayoutDashboard, Settings } from 'lucide-react'

const navigationItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Suppliers', icon: Building2 },
  { label: 'Settings', icon: Settings },
]

function Sidebar({ activePage, onNavigate, applicationName = 'SupplierHub' }) {
  const brandName = applicationName === 'SupplierHub'
    ? <><span>Supplier</span><span className="brand-light">Hub</span></>
    : applicationName

  return (
    <aside className="sidebar">
      <button className="brand" type="button" onClick={() => onNavigate('Dashboard')}>
        <span className="brand-mark"><Building2 size={20} strokeWidth={2.2} /></span>
        <span className="brand-name">{brandName}</span>
      </button>

      <div className="sidebar-label">MENU</div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigationItems.map(({ label, icon: Icon }) => (
          <button
            className={`nav-item${activePage === label ? ' is-active' : ''}`}
            key={label}
            type="button"
            aria-current={activePage === label ? 'page' : undefined}
            onClick={() => onNavigate(label)}
          >
            <Icon size={19} strokeWidth={1.9} />
            <span>{label}</span>
            {activePage === label && <span className="nav-active-mark" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-footer-mark"><Building2 size={15} /></span>
        <span className="sidebar-footer-copy">
          <strong>SupplierHub</strong>
          <span>Supplier Management System</span>
          <small>MERN Stack Application</small>
        </span>
      </div>
    </aside>
  )
}

export default Sidebar
