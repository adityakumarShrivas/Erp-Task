import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice.js'
import toast from 'react-hot-toast'
import {
  Workflow, LayoutDashboard, ListChecks,
  FormInput, PackageOpen, Route,
  ClipboardList, LogOut, ChevronRight
} from 'lucide-react'

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/steps',     label: 'Step builder', icon: ListChecks      },
  { to: '/forms',     label: 'Form builder', icon: FormInput       },
  { to: '/orders',    label: 'Orders',       icon: PackageOpen     },
  { to: '/tracker',   label: 'FMS tracker',  icon: Route           },
]

const doerLinks = [
  { to: '/my-tasks', label: 'My tasks',    icon: ClipboardList },
  { to: '/tracker',  label: 'FMS tracker', icon: Route         },
]

const linkStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '9px 12px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '500',
  textDecoration: 'none',
  transition: 'all 0.15s',
  marginBottom: '2px',
  backgroundColor: isActive ? '#2563eb' : 'transparent',
  color: isActive ? '#ffffff' : '#94a3b8',
})

function Sidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const links    = user?.role === 'ADMIN' ? adminLinks : doerLinks

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Signed out')
    navigate('/login')
  }

  return (
    <aside style={{
      width: '220px',
      minWidth: '220px',
      height: '100vh',
      backgroundColor: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      borderRight: '1px solid #1e293b',
      flexShrink: 0,
    }}>

      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', backgroundColor: '#2563eb',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
          }}>
            <Workflow size={16} color="white" />
          </div>
          <div>
            <p style={{ color: 'white', fontSize: '14px', fontWeight: '600', lineHeight: 1 }}>Dtable FMS</p>
            <p style={{ color: '#64748b', fontSize: '11px', marginTop: '3px' }}>O2D Engine</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '16px 10px', overflowY: 'auto' }}>
        <p style={{
          color: '#475569', fontSize: '10px', fontWeight: '600',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          padding: '0 10px', marginBottom: '10px'
        }}>
          {user?.role === 'ADMIN' ? 'Admin' : 'Doer'}
        </p>

        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} style={({ isActive }) => linkStyle(isActive)}>
            {({ isActive }) => (
              <>
                <Icon size={16} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{label}</span>
                {isActive && <ChevronRight size={13} style={{ opacity: 0.6, flexShrink: 0 }} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div style={{ padding: '12px 10px 16px', borderTop: '1px solid #1e293b' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px', backgroundColor: '#1e293b',
          borderRadius: '8px', marginBottom: '4px',
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            backgroundColor: '#2563eb', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '11px', fontWeight: '700', flexShrink: 0,
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: 'white', fontSize: '12px', fontWeight: '600', lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </p>
            <p style={{ color: '#64748b', fontSize: '11px', marginTop: '3px' }}>{user?.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 12px', borderRadius: '8px', border: 'none',
            backgroundColor: 'transparent', color: '#64748b',
            fontSize: '13px', fontWeight: '500', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1e293b'; e.currentTarget.style.color = 'white' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748b' }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar