import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useRegisterMutation } from '../features/api/authApi.js'
import { setCredentials } from '../features/auth/authSlice.js'
import toast from 'react-hot-toast'
import { UserPlus, Mail, Lock, User, Workflow } from 'lucide-react'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'DOER' })
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const [register, { isLoading }] = useRegisterMutation()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await register(form).unwrap()
      dispatch(setCredentials(data))
      toast.success('Account created successfully!')
      navigate(data.role === 'ADMIN' ? '/dashboard' : '/my-tasks')
    } catch (err) {
      toast.error(err?.data?.message || 'Registration failed')
    }
  }

  const inputStyle = {
    width: '100%', paddingLeft: '36px', paddingRight: '16px',
    paddingTop: '10px', paddingBottom: '10px',
    border: '1px solid #e2e8f0', borderRadius: '8px',
    fontSize: '13px', color: '#0f172a', outline: 'none',
    boxSizing: 'border-box', backgroundColor: 'white'
  }

  const labelStyle = {
    display: 'block', fontSize: '13px',
    fontWeight: '500', color: '#374151', marginBottom: '6px'
  }

  const iconStyle = {
    position: 'absolute', left: '12px',
    top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'
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
            Create your account
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Full name */}
            <div>
              <label style={labelStyle}>Full name</label>
              <div style={{ position: 'relative' }}>
                <User style={iconStyle} size={15} />
                <input
                  type="text" name="name" value={form.name}
                  onChange={handleChange} placeholder="Aditya Kumar" required
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={iconStyle} size={15} />
                <input
                  type="email" name="email" value={form.email}
                  onChange={handleChange} placeholder="you@example.com" required
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={iconStyle} size={15} />
                <input
                  type="password" name="password" value={form.password}
                  onChange={handleChange} placeholder="••••••••" required
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label style={labelStyle}>Role</label>
              <select
                name="role" value={form.role} onChange={handleChange}
                style={{
                  width: '100%', padding: '10px 16px',
                  border: '1px solid #e2e8f0', borderRadius: '8px',
                  fontSize: '13px', color: '#0f172a', outline: 'none',
                  boxSizing: 'border-box', backgroundColor: 'white', cursor: 'pointer'
                }}
              >
                <option value="DOER">Doer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Submit */}
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
                : <><UserPlus size={15} /> Create account</>
              }
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', marginTop: '24px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', fontWeight: '500', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Register