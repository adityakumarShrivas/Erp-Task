import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout.jsx'
import { useGetOrdersQuery }        from '../../features/api/ordersApi.js'
import { useGetProcessByOrderQuery } from '../../features/api/processApi.js'
import {
  CheckCircle2, Clock, AlertTriangle,
  ChevronDown, ChevronUp, User,
  FileText, Calendar, ArrowLeft
} from 'lucide-react'

function SLABadge({ slaStatus, delayMinutes }) {
  if (slaStatus === 'DELAYED') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: '500',
        backgroundColor: '#fef2f2', color: '#dc2626',
      }}>
        <AlertTriangle size={10} />
        Delayed by {delayMinutes}m
      </span>
    )
  }
  if (slaStatus === 'OVERDUE') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: '500',
        backgroundColor: '#fff7ed', color: '#ea580c',
      }}>
        <Clock size={10} />
        Overdue by {delayMinutes}m
      </span>
    )
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: '500',
      backgroundColor: '#f0fdf4', color: '#16a34a',
    }}>
      <CheckCircle2 size={10} />
      On time
    </span>
  )
}

function StepCard({ step, index }) {
  const [expanded, setExpanded] = useState(false)

  const statusConfig = {
    DONE:    { bg: '#f0fdf4', border: '#bbf7d0', dot: '#16a34a', label: 'Done',    icon: CheckCircle2  },
    PENDING: { bg: '#fffbeb', border: '#fde68a', dot: '#d97706', label: 'Pending', icon: Clock         },
    OVERDUE: { bg: '#fef2f2', border: '#fecaca', dot: '#dc2626', label: 'Overdue', icon: AlertTriangle  },
  }

  const cfg = statusConfig[step.status] || statusConfig.PENDING
  const Icon = cfg.icon

  const formatDate = (d) => d ? new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  }) : '—'

  const hasSubmission = step.formSubmission &&
    Object.keys(step.formSubmission.values || {}).length > 0

  return (
    <div style={{
      border: `1px solid ${expanded ? cfg.border : '#e2e8f0'}`,
      borderRadius: '12px', overflow: 'hidden',
      backgroundColor: expanded ? cfg.bg : 'white',
      transition: 'all 0.2s',
    }}>

      {/* Step header */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          padding: '16px 20px', cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Step number */}
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          backgroundColor: cfg.dot, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '12px', fontWeight: '700', flexShrink: 0,
        }}>
          {step.status === 'DONE'
            ? <CheckCircle2 size={16} />
            : step.order || index + 1
          }
        </div>

        {/* Step info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
              {step.name}
            </p>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: '500',
              backgroundColor: cfg.bg, color: cfg.dot,
              border: `1px solid ${cfg.border}`,
            }}>
              <Icon size={10} />
              {cfg.label}
            </span>
            {step.status !== 'PENDING' && (
              <SLABadge slaStatus={step.slaStatus} delayMinutes={step.delayMinutes} />
            )}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={11} />
              {step.assigneeId?.name || 'Unassigned'}
            </span>
            {step.buddyId && (
              <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={11} />
                Buddy: {step.buddyId?.name}
              </span>
            )}
            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={11} />
              SLA: {step.slaMinutes} min
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {step.status === 'DONE' && (
            <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'right' }}>
              Done at<br />
              <span style={{ color: '#374151', fontWeight: '500' }}>
                {formatDate(step.completedAt)}
              </span>
            </p>
          )}
          {expanded ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${cfg.border}` }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '16px', marginTop: '16px',
          }}>
            <div style={{
              backgroundColor: 'white', border: '1px solid #e2e8f0',
              borderRadius: '10px', padding: '14px',
            }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                Timeline
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={12} /> Planned by
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: '#0f172a' }}>
                    {formatDate(step.plannedAt)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckCircle2 size={12} /> Completed at
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: '#0f172a' }}>
                    {formatDate(step.completedAt)}
                  </span>
                </div>
                {step.completedBy && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <User size={12} /> Completed by
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#0f172a' }}>
                      {step.completedBy?.name || '—'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {hasSubmission && (
              <div style={{
                backgroundColor: 'white', border: '1px solid #e2e8f0',
                borderRadius: '10px', padding: '14px',
              }}>
                <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  Submitted form data
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {Object.entries(step.formSubmission.values || {}).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{key}</span>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#0f172a', maxWidth: '140px', textAlign: 'right', wordBreak: 'break-word' }}>
                        {String(val) || '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {step.formSubmission?.attachments?.length > 0 && (
            <div style={{
              marginTop: '12px', backgroundColor: 'white',
              border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px',
            }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Attachments
              </p>
              {step.formSubmission.attachments.map((file, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
                  <FileText size={14} color="#2563eb" />
                  
                    < a href={`http://localhost:5000/uploads/${file}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'none' }}
                  >
                    {file}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function OrderSelector({ orders, selectedId, onSelect }) {
  return (
    <div style={{
      backgroundColor: 'white', border: '1px solid #e2e8f0',
      borderRadius: '12px', padding: '20px', marginBottom: '20px',
    }}>
      <p style={{ fontSize: '12px', fontWeight: '500', color: '#475569', marginBottom: '10px' }}>
        Select an order to track
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {orders.map((order) => (
          <button
            key={order._id}
            onClick={() => onSelect(order._id)}
            style={{
              padding: '7px 16px', borderRadius: '8px', fontSize: '13px',
              fontWeight: '500', cursor: 'pointer', transition: 'all 0.15s',
              border: selectedId === order._id ? 'none' : '1px solid #e2e8f0',
              backgroundColor: selectedId === order._id ? '#2563eb' : 'white',
              color: selectedId === order._id ? 'white' : '#374151',
            }}
          >
            {order.orderNo} — {order.partyName}
          </button>
        ))}
      </div>
    </div>
  )
}

function FMSTracker() {
  const { orderId: paramOrderId } = useParams()
  const navigate = useNavigate()
  const [selectedOrderId, setSelectedOrderId] = useState(paramOrderId || null)

  const { data: orders = [] } = useGetOrdersQuery()

  const {
    data: process,
    isLoading,
    isError,
  } = useGetProcessByOrderQuery(selectedOrderId, { skip: !selectedOrderId })

  const order = orders.find(o => o._id === selectedOrderId)

  const total    = process?.steps?.length || 0
  const done     = process?.steps?.filter(s => s.status === 'DONE').length || 0
  const overdue  = process?.steps?.filter(s => s.status === 'OVERDUE').length || 0
  const progress = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <Layout title="FMS tracker" subtitle="Track workflow progress step by step">
      <div style={{ maxWidth: '860px' }}>

        {orders.length > 0 && (
          <OrderSelector
            orders={orders}
            selectedId={selectedOrderId}
            onSelect={setSelectedOrderId}
          />
        )}

        {!selectedOrderId && (
          <div style={{
            backgroundColor: 'white', border: '2px dashed #e2e8f0',
            borderRadius: '16px', padding: '60px', textAlign: 'center',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              backgroundColor: '#f1f5f9', display: 'flex',
              alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
            }}>
              <FileText size={24} color="#94a3b8" />
            </div>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>
              Select an order above to view its workflow progress
            </p>
          </div>
        )}

        {selectedOrderId && isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div style={{ width: '24px', height: '24px', border: '2px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        )}

        {selectedOrderId && isError && (
          <div style={{
            backgroundColor: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '12px', padding: '20px', textAlign: 'center',
          }}>
            <p style={{ fontSize: '14px', color: '#dc2626', fontWeight: '500' }}>
              Workflow not started for this order yet
            </p>
            <button
              onClick={() => navigate('/orders')}
              style={{
                marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', backgroundColor: '#2563eb', color: 'white',
                border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
              }}
            >
              <ArrowLeft size={14} />
              Go to Orders
            </button>
          </div>
        )}

        {process && (
          <div>
            {/* Order summary */}
            <div style={{
              backgroundColor: 'white', border: '1px solid #e2e8f0',
              borderRadius: '14px', padding: '20px', marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
                    {order?.orderNo} — {order?.partyName}
                  </h2>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>
                    {done} of {total} steps completed
                    {overdue > 0 && ` · ${overdue} overdue`}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '24px', fontWeight: '700', color: progress === 100 ? '#16a34a' : '#2563eb' }}>
                    {progress}%
                  </p>
                  <p style={{ fontSize: '11px', color: '#94a3b8' }}>complete</p>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '99px',
                  backgroundColor: progress === 100 ? '#16a34a' : '#2563eb',
                  width: `${progress}%`, transition: 'width 0.4s ease',
                }} />
              </div>

              {/* Step mini dots */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                {process.steps?.map((step, i) => {
                  const colors = {
                    DONE:    '#16a34a',
                    PENDING: '#d97706',
                    OVERDUE: '#dc2626',
                  }
                  return (
                    <div
                      key={step._id}
                      title={step.name}
                      style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        backgroundColor: colors[step.status] || '#d97706',
                      }}
                    />
                  )
                })}
              </div>
            </div>

            {/* Steps list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {process.steps?.map((step, index) => (
                <StepCard key={step._id} step={step} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default FMSTracker