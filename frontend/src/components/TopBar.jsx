import { useSelector } from 'react-redux'
import NotificationBell from './NotificationBell.jsx'

function TopBar({ title, subtitle }) {
  const { user } = useSelector((state) => state.auth)

  return (
    <header style={{
      height: '56px', minHeight: '56px',
      backgroundColor: 'white', borderBottom: '1px solid #e2e8f0',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 24px', flexShrink: 0,
    }}>
      <div>
        <h1 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', lineHeight: 1 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>{subtitle}</p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

        <NotificationBell />

        <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            backgroundColor: '#2563eb', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '12px', fontWeight: '700', flexShrink: 0,
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', lineHeight: 1 }}>
              {user?.name}
            </p>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>
              {user?.email}
            </p>
          </div>
          <span style={{
            fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '6px',
            backgroundColor: user?.role === 'ADMIN' ? '#eff6ff' : '#f0fdf4',
            color: user?.role === 'ADMIN' ? '#2563eb' : '#16a34a',
          }}>
            {user?.role}
          </span>
        </div>
      </div>
    </header>
  )
}

export default TopBar