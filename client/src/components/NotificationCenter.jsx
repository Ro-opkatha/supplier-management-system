import { useEffect, useRef } from 'react'
import { Bell, Check, CirclePlus, Pencil, Trash2 } from 'lucide-react'
import '../styles/Notifications.css'

const operationIcons = {
  added: CirclePlus,
  updated: Pencil,
  deleted: Trash2,
}

function formatTimestamp(timestamp) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

function NotificationCenter({
  open,
  onToggle,
  onClose,
  notifications,
  unreadCount,
  storageError,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}) {
  const notificationAreaRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event) => {
      if (!notificationAreaRef.current?.contains(event.target)) onClose()
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  return (
    <div className="notification-area" ref={notificationAreaRef}>
      <button
        className="icon-button notification-button"
        type="button"
        aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="notification-panel"
        onClick={onToggle}
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="notification-count" aria-hidden="true">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <section
          className="notification-panel"
          id="notification-panel"
          role="dialog"
          aria-label="Notification centre"
        >
          <header className="notification-panel-heading">
            <div className="notification-panel-title">
              <h2>Notifications</h2>
              <p>{unreadCount ? `${unreadCount} unread` : 'You’re all caught up'}</p>
            </div>
            <div className="notification-panel-actions">
              <button
                type="button"
                onClick={onMarkAllAsRead}
                disabled={!unreadCount}
              >
                Mark all as read
              </button>
              <button
                type="button"
                onClick={onClearAll}
                disabled={!notifications.length}
              >
                Clear all
              </button>
            </div>
          </header>

          {storageError && <p className="notification-storage-error" role="alert">{storageError}</p>}

          {notifications.length ? (
            <ul className="notification-list">
              {notifications.map((notification) => {
                const Icon = operationIcons[notification.type]
                return (
                  <li
                    className={`notification-item${notification.read ? '' : ' is-unread'}`}
                    key={notification.id}
                  >
                    <span className={`notification-item-icon notification-icon-${notification.type}`}>
                      <Icon size={16} />
                    </span>
                    <div className="notification-item-content">
                      <p>{notification.message}</p>
                      <time dateTime={notification.timestamp} title={new Date(notification.timestamp).toLocaleString()}>
                        {formatTimestamp(notification.timestamp)}
                      </time>
                    </div>
                    {notification.read ? (
                      <span className="notification-read-label"><Check size={13} /> Read</span>
                    ) : (
                      <button
                        className="notification-mark-read"
                        type="button"
                        aria-label={`Mark as read: ${notification.message}`}
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        Mark as read
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="notification-empty">
              <span className="notification-empty-icon"><Bell size={18} /></span>
              <h3>No notifications</h3>
              <p>Supplier activity will appear here.</p>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export default NotificationCenter
