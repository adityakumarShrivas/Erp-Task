import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useLoginMutation } from '../features/api/authApi.js'
import { setCredentials } from '../features/auth/authSlice.js'
import toast from 'react-hot-toast'
import { LogIn, Mail, Lock, Workflow } from 'lucide-react'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const dispatch    = useDispatch()
  const navigate    = useNavigate()
  const [login, { isLoading }] = useLoginMutation()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await login(form).unwrap()
      dispatch(setCredentials(data))
      toast.success(`Welcome back, ${data.name}!`)
      if (data.role === 'ADMIN') {
        navigate('/dashboard')
      } else {
        navigate('/my-tasks')
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Login failed')
    }
  }

  return (
  <div style={{
    minHeight: '100vh', backgroundColor: '#f8fafc',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
  }}>
    <div style={{ width: '100%', maxWidth: '420px' }}>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '56px', height: '56px', backgroundColor: '#2563eb',
          borderRadius: '16px', marginBottom: '16px'
        }}>
          <Workflow color="white" size={28} />
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#0f172a', margin: 0 }}>FlowOS</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Order-to-Delivery Engine</p>
      </div>

      {/* Card */}
      <div style={{
        backgroundColor: 'white', borderRadius: '16px',
        border: '1px solid #e2e8f0', padding: '32px'
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '24px' }}>
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Email address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={15} />
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="admin@fms.com" required
                style={{
                  width: '100%', paddingLeft: '36px', paddingRight: '16px',
                  paddingTop: '10px', paddingBottom: '10px',
                  border: '1px solid #e2e8f0', borderRadius: '8px',
                  fontSize: '13px', color: '#0f172a', outline: 'none',
                  boxSizing: 'border-box', backgroundColor: 'white'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={15} />
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="••••••••" required
                style={{
                  width: '100%', paddingLeft: '36px', paddingRight: '16px',
                  paddingTop: '10px', paddingBottom: '10px',
                  border: '1px solid #e2e8f0', borderRadius: '8px',
                  fontSize: '13px', color: '#0f172a', outline: 'none',
                  boxSizing: 'border-box', backgroundColor: 'white'
                }}
              />
            </div>
          </div>

          <button
            type="submit" disabled={isLoading}
            style={{
              width: '100%', backgroundColor: isLoading ? '#93c5fd' : '#2563eb',
              color: 'white', fontWeight: '500', padding: '10px',
              borderRadius: '8px', fontSize: '13px', border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              marginTop: '4px'
            }}
          >
            {isLoading
              ? <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              : <><LogIn size={15} /> Sign in</>
            }
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', marginTop: '24px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#2563eb', fontWeight: '500', textDecoration: 'none' }}>Register</Link>
        </p>
      </div>

      {/* Test credentials */}
      <div style={{
        marginTop: '16px', backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px'
      }}>
        <p style={{ fontSize: '11px', fontWeight: '600', color: '#1d4ed8', marginBottom: '8px' }}>Test credentials</p>
        <p style={{ fontSize: '11px', color: '#2563eb', marginBottom: '4px' }}>Admin: Aditya Kumar / 12345678</p>
        <p style={{ fontSize: '11px', color: '#2563eb' }}>Doer: rohit@gmail.com / 12345678</p>
      </div>

    </div>
  </div>
)}

export default Login