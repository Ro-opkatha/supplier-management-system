import { useCallback, useEffect, useRef, useState } from 'react'
import api from './services/api'
import Sidebar from './components/Sidebar'
import AddSupplierModal from './components/AddSupplierModal'
import NotificationCenter from './components/NotificationCenter'
import Dashboard from './pages/Dashboard'
import Suppliers from './pages/Suppliers'
import Settings from './pages/Settings'
import './styles/App.css'

const SETTINGS_STORAGE_KEY = 'supplierhub-settings'
const NOTIFICATIONS_STORAGE_KEY = 'supplierhub-notifications'
const MAX_NOTIFICATIONS = 100
const DEFAULT_SETTINGS = {
  applicationName: 'SupplierHub',
  applicationDescription: 'Manage your supplier relationships with SupplierHub.',
  defaultSupplierStatus: 'Active',
  theme: 'light',
}

function readNotifications() {
  try {
    const storedNotifications = window.localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
    if (!storedNotifications) return { notifications: [], error: '' }

    const parsedNotifications = JSON.parse(storedNotifications)
    if (!Array.isArray(parsedNotifications)) {
      throw new Error('Stored notifications were not an array.')
    }

    const notifications = parsedNotifications.filter((notification) => (
      notification &&
      typeof notification.id === 'string' &&
      ['added', 'updated', 'deleted'].includes(notification.type) &&
      typeof notification.message === 'string' &&
      typeof notification.timestamp === 'string' &&
      !Number.isNaN(Date.parse(notification.timestamp)) &&
      typeof notification.read === 'boolean'
    )).slice(0, MAX_NOTIFICATIONS)

    return {
      notifications,
      error: notifications.length === parsedNotifications.length
        ? ''
        : 'Some saved notifications could not be loaded.',
    }
  } catch {
    return {
      notifications: [],
      error: 'Saved notifications could not be loaded from this browser.',
    }
  }
}

function readSettings() {
  try {
    const savedSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!savedSettings) return { settings: DEFAULT_SETTINGS, error: '' }

    const parsedSettings = JSON.parse(savedSettings)
    if (!parsedSettings || typeof parsedSettings !== 'object' || Array.isArray(parsedSettings)) {
      throw new Error('Stored settings were not an object.')
    }

    return {
      settings: {
        applicationName:
          typeof parsedSettings.applicationName === 'string' && parsedSettings.applicationName.trim()
            ? parsedSettings.applicationName
            : DEFAULT_SETTINGS.applicationName,
        applicationDescription:
          typeof parsedSettings.applicationDescription === 'string'
            ? parsedSettings.applicationDescription
            : DEFAULT_SETTINGS.applicationDescription,
        defaultSupplierStatus: ['Active', 'Inactive'].includes(parsedSettings.defaultSupplierStatus)
          ? parsedSettings.defaultSupplierStatus
          : DEFAULT_SETTINGS.defaultSupplierStatus,
        theme: ['light', 'dark'].includes(parsedSettings.theme)
          ? parsedSettings.theme
          : DEFAULT_SETTINGS.theme,
      },
      error: '',
    }
  } catch {
    return {
      settings: DEFAULT_SETTINGS,
      error: 'Saved settings could not be loaded. Default settings are shown.',
    }
  }
}

async function fetchDashboardData() {
  const [statsResponse, suppliersResponse] = await Promise.all([
    api.get('/dashboard/stats'),
    api.get('/suppliers'),
  ])
  const stats = statsResponse.data?.data
  const suppliers = suppliersResponse.data?.data

  if (
    !stats ||
    !['total', 'active', 'inactive'].every((key) => Number.isFinite(stats[key]))
  ) {
    throw new Error('The dashboard statistics response was invalid.')
  }

  if (!Array.isArray(suppliers)) {
    throw new Error('The suppliers response was invalid.')
  }

  return { stats, suppliers }
}

function getErrorMessage(requestError) {
  return (
    requestError.response?.data?.message ||
    requestError.message ||
    'Unable to load dashboard data.'
  )
}

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [stats, setStats] = useState(null)
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [storedSettings] = useState(readSettings)
  const [settings, setSettings] = useState(storedSettings.settings)
  const [storedNotifications] = useState(readNotifications)
  const [notifications, setNotifications] = useState(storedNotifications.notifications)
  const [notificationStorageError, setNotificationStorageError] = useState(storedNotifications.error)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [settingsNotice, setSettingsNotice] = useState(() => (
    storedSettings.error
      ? { type: 'error', message: storedSettings.error }
      : null
  ))
  const notificationsRef = useRef(storedNotifications.notifications)

  const refreshData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { stats: nextStats, suppliers: nextSuppliers } = await fetchDashboardData()
      setStats(nextStats)
      setSuppliers(nextSuppliers)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true

    fetchDashboardData()
      .then(({ stats: nextStats, suppliers: nextSuppliers }) => {
        if (!active) return
        setStats(nextStats)
        setSuppliers(nextSuppliers)
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const handleCreateSupplier = async (supplier) => {
    const response = await api.post('/suppliers', supplier)
    recordSupplierOperation('added', response.data?.data?.companyName || supplier.companyName)
    await refreshData()
    setIsAddModalOpen(false)
    setSuccessMessage('Supplier added successfully.')
  }

  const updateNotifications = (update) => {
    const nextNotifications = update(notificationsRef.current)
    notificationsRef.current = nextNotifications
    setNotifications(nextNotifications)

    try {
      window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(nextNotifications))
      setNotificationStorageError('')
    } catch {
      setNotificationStorageError('Notifications could not be saved in this browser.')
    }
  }

  const recordSupplierOperation = (type, companyName) => {
    const operationMessages = {
      added: 'was added successfully.',
      updated: 'was updated successfully.',
      deleted: 'was deleted successfully.',
    }
    const notification = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      message: `${companyName || 'Supplier'} ${operationMessages[type]}`,
      timestamp: new Date().toISOString(),
      read: false,
    }

    updateNotifications((current) => [notification, ...current].slice(0, MAX_NOTIFICATIONS))
  }

  const markNotificationAsRead = (notificationId) => {
    updateNotifications((current) => current.map((notification) => (
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    )))
  }

  const markAllNotificationsAsRead = () => {
    updateNotifications((current) => current.map((notification) => (
      notification.read ? notification : { ...notification, read: true }
    )))
  }

  const clearNotifications = () => updateNotifications(() => [])

  const navigateTo = (page) => {
    setActivePage(page)
    setNotificationsOpen(false)
  }

  const updateSetting = (field, value) => {
    setSettings((current) => ({ ...current, [field]: value }))
    setSettingsNotice(null)
  }

  const saveSettings = () => {
    const nextSettings = {
      ...settings,
      applicationName: settings.applicationName.trim(),
    }
    if (!nextSettings.applicationName) {
      setSettingsNotice({ type: 'error', message: 'Application name is required.' })
      return
    }

    try {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings))
      setSettings(nextSettings)
      setSettingsNotice({ type: 'success', message: 'Settings saved successfully.' })
    } catch {
      setSettingsNotice({
        type: 'error',
        message: 'Unable to save settings in this browser. Check local storage permissions.',
      })
    }
  }

  const resetSettings = () => {
    try {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS))
      setSettings(DEFAULT_SETTINGS)
      setSettingsNotice({ type: 'success', message: 'Settings restored to defaults.' })
    } catch {
      setSettings(DEFAULT_SETTINGS)
      setSettingsNotice({
        type: 'error',
        message: 'Defaults are shown, but could not be saved in this browser.',
      })
    }
  }

  return (
    <div className="app-shell" data-theme={settings.theme}>
      <Sidebar
        activePage={activePage}
        onNavigate={navigateTo}
        applicationName={settings.applicationName}
      />
      <div className="app-main">
        <header className="topbar">
          <div className="topbar-context">
            <span className="topbar-dot" />
            {settings.applicationName} workspace
          </div>
          <NotificationCenter
            open={notificationsOpen}
            onToggle={() => setNotificationsOpen((current) => !current)}
            onClose={() => setNotificationsOpen(false)}
            notifications={notifications}
            unreadCount={notifications.filter((notification) => !notification.read).length}
            storageError={notificationStorageError}
            onMarkAsRead={markNotificationAsRead}
            onMarkAllAsRead={markAllNotificationsAsRead}
            onClearAll={clearNotifications}
          />
        </header>

        <main className="main-content">
          {successMessage && (
            <div className="dashboard-alert dashboard-success" role="status">
              <span>{successMessage}</span>
              <button className="text-button" type="button" onClick={() => setSuccessMessage('')}>
                Dismiss
              </button>
            </div>
          )}
          {activePage === 'Dashboard' && (
            <Dashboard
              stats={stats}
              suppliers={suppliers}
              loading={loading}
              error={error}
              onRetry={refreshData}
              onAddSupplier={() => {
                setSuccessMessage('')
                setIsAddModalOpen(true)
              }}
              onViewSuppliers={() => navigateTo('Suppliers')}
            />
          )}
          {activePage === 'Suppliers' && (
            <Suppliers
              allSuppliers={suppliers}
              onAddSupplier={() => {
                setSuccessMessage('')
                setIsAddModalOpen(true)
              }}
              onDataChanged={refreshData}
              defaultSupplierStatus={settings.defaultSupplierStatus}
              onSupplierOperation={recordSupplierOperation}
            />
          )}
          {activePage === 'Settings' && (
            <Settings
              settings={settings}
              notice={settingsNotice}
              onChange={updateSetting}
              onSave={saveSettings}
              onReset={resetSettings}
            />
          )}
        </main>
      </div>

      {isAddModalOpen && (
        <AddSupplierModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateSupplier}
          defaultSupplierStatus={settings.defaultSupplierStatus}
        />
      )}
    </div>
  )
}

export default App
