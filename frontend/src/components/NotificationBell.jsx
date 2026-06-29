import { useState, useRef, useEffect } from 'react'
import { useGetNotificationsQuery } from '../features/api/processApi.js'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCircle2, AlertTriangle, X } from 'lucide-react'

function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [read, setRead] = useState(() => {
    const saved = localStorage.getItem('readNotifications')
    return saved ? JSON.parse(saved) : []
  })
  const ref      = useRef(null)
  const navigate = useNavigate()

  const { data: notifications = [] } = useGetNotificationsQuery(undefined, {
    pollingInterval: 15000,
  })

  const unreadCount = notifications.filter(n => !read.includes(n.id)).length

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const markAllRead = () => {
    const allIds = notifications.map(n => n.id)
    setRead(allIds)
    localStorage.setItem('readNotifications', JSON.stringify(allIds))
  }

  const markRead = (id) => {
    const updated = [...read, id]
    setRead(updated)
    localStorage.setItem('readNotifications', JSON.stringify(updated))
  }

  const handleClick = (notification) => {
    markRead(notification.id)
    if (notification.orderId) {
      navigate(`/tracker/${notification.orderId}`)
    }
    setOpen(false)
  }

  const formatTime = (t) => {
    const diff = Math.floor((Date.now() - new Date(t)) / 1000)
    if (diff < 60)  return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>

      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'relative',
          width: '34px', height: '34px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: open ? '1px solid #e2e8f0' : '1px solid transparent',
          borderRadius: '8px', backgroundColor: open ? '#f8fafc' : 'transparent',
          cursor: 'pointer', transition: 'all 0.15s',
        }}
      >
        <Bell size={17} color="#64748b" />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '5px', right: '5px',
            minWidth: '16px', height: '16px',
            backgroundColor: '#ef4444', borderRadius: '99px',
            fontSize: '9px', fontWeight: '700', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 3px', border: '2px solid white',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: '42px', right: 0,
          width: '340px', backgroundColor: 'white',
          border: '1px solid #e2e8f0', borderRadius: '14px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          zIndex: 9999, overflow: 'hidden',
        }}>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderBottom: '1px solid #f1f5f9',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                Notifications
              </p>
              {unreadCount > 0 && (
                <span style={{
                  fontSize: '10px', fontWeight: '600', padding: '1px 7px',
                  backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '99px',
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  style={{
                    fontSize: '11px', color: '#2563eb', fontWeight: '500',
                    border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
                  }}
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: '24px', height: '24px', border: 'none',
                  backgroundColor: '#f1f5f9', borderRadius: '6px',
                  cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#64748b',
                }}
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <Bell size={28} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
                <p style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const isUnread = !read.includes(n.id)
                const isDone   = n.type === 'DONE'

                return (
                  <div
                    key={n.id}
                    onClick={() => handleClick(n)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '12px',
                      padding: '12px 16px', cursor: 'pointer',
                      borderBottom: '1px solid #f8fafc',
                      backgroundColor: isUnread
                        ? isDone ? '#f0fdf4' : '#fef2f2'
                        : 'white',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = isUnread ? (isDone ? '#f0fdf4' : '#fef2f2') : 'white'}
                  >
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      backgroundColor: isDone ? '#dcfce7' : '#fee2e2',
                    }}>
                      {isDone
                        ? <CheckCircle2 size={16} color="#16a34a" />
                        : <AlertTriangle size={16} color="#dc2626" />
                      }
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a' }}>
                          {n.title}
                        </p>
                        {isUnread && (
                          <div style={{
                            width: '7px', height: '7px', borderRadius: '50%',
                            backgroundColor: isDone ? '#16a34a' : '#ef4444',
                            flexShrink: 0, marginTop: '3px',
                          }} />
                        )}
                      </div>
                      <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', lineHeight: '1.4' }}>
                        {n.message}
                      </p>
                      <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                        {formatTime(n.time)}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{
              padding: '10px 16px', borderTop: '1px solid #f1f5f9',
              textAlign: 'center',
            }}>
              <button
                onClick={() => { navigate('/tracker'); setOpen(false) }}
                style={{
                  fontSize: '12px', color: '#2563eb', fontWeight: '500',
                  border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
                }}
              >
                View all in tracker →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell