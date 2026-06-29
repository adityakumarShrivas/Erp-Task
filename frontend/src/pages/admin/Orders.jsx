import { useState } from 'react'
import Layout from '../../components/Layout.jsx'
import {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useStartWorkflowMutation,
} from '../../features/api/ordersApi.js'
import { useGetAllProcessesQuery } from '../../features/api/processApi.js'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Plus, X, Save, PackageOpen,
  Play, Eye, CheckCircle2, Clock, AlertTriangle
} from 'lucide-react'

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '13px',
  color: '#0f172a',
  backgroundColor: 'white',
  outline: 'none',
}

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '500',
  color: '#475569',
  marginBottom: '6px',
}

function CreateOrderModal({ onClose, onSave, isLoading }) {
  const [form, setForm] = useState({ orderNo: '', partyName: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.45)', padding: '16px',
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '16px',
        border: '1px solid #e2e8f0', width: '100%', maxWidth: '440px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
            Create new order
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '30px', height: '30px', border: 'none',
              backgroundColor: '#f1f5f9', borderRadius: '8px',
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#64748b',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Order number *</label>
            <input
              value={form.orderNo}
              onChange={(e) => setForm({ ...form, orderNo: e.target.value })}
              required
              placeholder="e.g. SO-1002"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Party name *</label>
            <input
              value={form.partyName}
              onChange={(e) => setForm({ ...form, partyName: e.target.value })}
              required
              placeholder="e.g. Acme Corp"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 18px', fontSize: '13px', fontWeight: '500',
                color: '#475569', backgroundColor: 'white',
                border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '9px 18px', fontSize: '13px', fontWeight: '500',
                color: 'white',
                backgroundColor: isLoading ? '#93c5fd' : '#2563eb',
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              {isLoading
                ? <div style={{ width: '14px', height: '14px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                : <Save size={14} />
              }
              Create order
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function StatusBadge({ process }) {
  if (!process) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '500',
        backgroundColor: '#f1f5f9', color: '#64748b',
      }}>
        <Clock size={11} />
        Not started
      </span>
    )
  }

  const total    = process.steps?.length || 0
  const done     = process.steps?.filter(s => s.status === 'DONE').length || 0
  const overdue  = process.steps?.filter(s => s.status === 'OVERDUE').length || 0

  if (done === total && total > 0) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '500',
        backgroundColor: '#f0fdf4', color: '#16a34a',
      }}>
        <CheckCircle2 size={11} />
        Completed
      </span>
    )
  }

  if (overdue > 0) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '500',
        backgroundColor: '#fef2f2', color: '#dc2626',
      }}>
        <AlertTriangle size={11} />
        {overdue} overdue
      </span>
    )
  }

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '500',
      backgroundColor: '#fffbeb', color: '#d97706',
    }}>
      <Clock size={11} />
      {done}/{total} steps done
    </span>
  )
}

function Orders() {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const { data: orders    = [], isLoading } = useGetOrdersQuery()
  const { data: processes = [] }            = useGetAllProcessesQuery()

  const [createOrder,   { isLoading: creating }]  = useCreateOrderMutation()
  const [startWorkflow, { isLoading: starting }]  = useStartWorkflowMutation()

  const getProcess = (orderId) =>
    processes.find(p =>
      p.orderId?._id === orderId || p.orderId === orderId
    )

  const handleCreate = async (form) => {
    try {
      await createOrder(form).unwrap()
      toast.success('Order created')
      setShowModal(false)
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create order')
    }
  }

  const handleStart = async (orderId) => {
    try {
      await startWorkflow(orderId).unwrap()
      toast.success('Workflow started!')
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to start workflow')
    }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  return (
    <Layout title="Orders" subtitle="Manage orders and start workflows">

      {showModal && (
        <CreateOrderModal
          onClose={() => setShowModal(false)}
          onSave={handleCreate}
          isLoading={creating}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            {orders.length} order{orders.length !== 1 ? 's' : ''} total
          </p>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 18px', backgroundColor: '#2563eb',
              color: 'white', border: 'none', borderRadius: '8px',
              cursor: 'pointer', fontSize: '13px', fontWeight: '500',
            }}
          >
            <Plus size={15} />
            New order
          </button>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div style={{ width: '24px', height: '24px', border: '2px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : orders.length === 0 ? (
          <div style={{
            backgroundColor: 'white', border: '2px dashed #e2e8f0',
            borderRadius: '16px', padding: '60px', textAlign: 'center',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              backgroundColor: '#f1f5f9', display: 'flex',
              alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
            }}>
              <PackageOpen size={24} color="#94a3b8" />
            </div>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>No orders yet</p>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
              Create your first order to start a workflow
            </p>
            <button
              onClick={() => setShowModal(true)}
              style={{
                marginTop: '16px', padding: '9px 20px',
                backgroundColor: '#2563eb', color: 'white',
                border: 'none', borderRadius: '8px',
                cursor: 'pointer', fontSize: '13px', fontWeight: '500',
              }}
            >
              Create first order
            </button>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white', border: '1px solid #e2e8f0',
            borderRadius: '14px', overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Order no.', 'Party name', 'Created', 'Status', 'Progress', 'Actions'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '11px 20px',
                      fontSize: '11px', fontWeight: '600',
                      color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const process  = getProcess(order._id)
                  const total    = process?.steps?.length || 0
                  const done     = process?.steps?.filter(s => s.status === 'DONE').length || 0
                  const progress = total > 0 ? Math.round((done / total) * 100) : 0

                  return (
                    <tr
                      key={order._id}
                      style={{ borderBottom: '1px solid #f1f5f9' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          fontSize: '13px', fontWeight: '600',
                          color: '#0f172a', fontFamily: 'monospace',
                        }}>
                          {order.orderNo}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <p style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>
                          {order.partyName}
                        </p>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                          {formatDate(order.createdAt)}
                        </p>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <StatusBadge process={process} />
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {process ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              flex: 1, height: '6px', backgroundColor: '#f1f5f9',
                              borderRadius: '99px', overflow: 'hidden', minWidth: '80px',
                            }}>
                              <div style={{
                                height: '100%', borderRadius: '99px',
                                backgroundColor: progress === 100 ? '#16a34a' : '#2563eb',
                                width: `${progress}%`,
                                transition: 'width 0.3s ease',
                              }} />
                            </div>
                            <span style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                              {progress}%
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#cbd5e1' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {!process ? (
                            <button
                              onClick={() => handleStart(order._id)}
                              disabled={starting}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '5px',
                                padding: '6px 12px', fontSize: '12px', fontWeight: '500',
                                backgroundColor: '#2563eb', color: 'white',
                                border: 'none', borderRadius: '6px', cursor: 'pointer',
                              }}
                            >
                              <Play size={12} />
                              Start workflow
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate(`/tracker/${order._id}`)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '5px',
                                padding: '6px 12px', fontSize: '12px', fontWeight: '500',
                                backgroundColor: '#f8fafc', color: '#374151',
                                border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer',
                              }}
                            >
                              <Eye size={12} />
                              View tracker
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Orders