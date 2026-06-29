import { useState } from 'react'
import Layout from '../../components/Layout.jsx'
import DynamicFormRenderer from '../../components/DynamicFormRenderer.jsx'
import {
  useGetMyTasksQuery,
  useCompleteStepMutation,
} from '../../features/api/processApi.js'
import toast from 'react-hot-toast'
import {
  ClipboardList, CheckCircle2, Clock,
  AlertTriangle, ChevronDown, ChevronUp,
  Package, User, X, Send
} from 'lucide-react'

function StatusBadge({ status }) {
  const config = {
    DONE:    { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', icon: CheckCircle2,  label: 'Done'    },
    PENDING: { bg: '#fffbeb', color: '#d97706', border: '#fde68a', icon: Clock,         label: 'Pending' },
    OVERDUE: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', icon: AlertTriangle, label: 'Overdue' },
  }
  const cfg  = config[status] || config.PENDING
  const Icon = cfg.icon

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '500',
      backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
    }}>
      <Icon size={11} />
      {cfg.label}
    </span>
  )
}

function TaskCard({ task }) {
  const [expanded,    setExpanded]    = useState(false)
  const [formValues,  setFormValues]  = useState({})
  const [submitting,  setSubmitting]  = useState(false)

  const [completeStep] = useCompleteStepMutation()

  const { step, orderId, processId } = task
  const isDone    = step.status === 'DONE'
  const isOverdue = step.status === 'OVERDUE'

  const handleSubmit = async (e) => {
    e.preventDefault()

    const requiredFields = step.formId?.fields?.filter(f => f.required) || []
    for (const field of requiredFields) {
      if (!formValues[field.key] && formValues[field.key] !== false) {
        toast.error(`"${field.label}" is required`)
        return
      }
    }

    setSubmitting(true)
    try {
      await completeStep({
        processId,
        stepId: step._id,
        values: formValues,
        attachments: [],
      }).unwrap()
      toast.success('Step completed!')
      setExpanded(false)
    } catch (err) {
      toast.error(err?.data?.message || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{
      backgroundColor: 'white',
      border: `1px solid ${isOverdue ? '#fecaca' : isDone ? '#bbf7d0' : '#e2e8f0'}`,
      borderRadius: '14px',
      overflow: 'hidden',
      transition: 'all 0.2s',
    }}>

      {/* Card header */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          padding: '18px 20px', cursor: 'pointer',
          backgroundColor: isDone ? '#f0fdf4' : isOverdue ? '#fef2f2' : 'white',
        }}
        onClick={() => !isDone && setExpanded(!expanded)}
      >
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          backgroundColor: isDone ? '#dcfce7' : isOverdue ? '#fee2e2' : '#eff6ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {isDone
            ? <CheckCircle2 size={20} color="#16a34a" />
            : isOverdue
              ? <AlertTriangle size={20} color="#dc2626" />
              : <ClipboardList size={20} color="#2563eb" />
          }
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
              {step.name}
            </p>
            <StatusBadge status={step.status} />
          </div>
          <div style={{ display: 'flex', gap: '14px', marginTop: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Package size={11} />
              {orderId?.orderNo} — {orderId?.partyName}
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={11} />
              SLA: {step.slaMinutes} min
            </span>
            {step.buddyId && (
              <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={11} />
                Buddy: {step.buddyId?.name}
              </span>
            )}
          </div>
        </div>

        {!isDone && (
          <div style={{ flexShrink: 0 }}>
            {expanded
              ? <ChevronUp size={18} color="#94a3b8" />
              : <ChevronDown size={18} color="#94a3b8" />
            }
          </div>
        )}

        {isDone && (
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: '11px', color: '#94a3b8' }}>Completed</p>
            <p style={{ fontSize: '12px', fontWeight: '500', color: '#16a34a' }}>
              {new Date(step.completedAt).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        )}
      </div>

      {/* Expanded form */}
      {expanded && !isDone && (
        <div style={{ borderTop: '1px solid #e2e8f0' }}>
          <form onSubmit={handleSubmit}>

            {step.formId?.fields?.length > 0 ? (
              <div style={{ padding: '20px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '16px',
                }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
                      {step.formId?.title}
                    </p>
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      Fill all required fields to complete this step
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    style={{
                      width: '28px', height: '28px', border: 'none',
                      backgroundColor: '#f1f5f9', borderRadius: '6px',
                      cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', color: '#64748b',
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>

                <DynamicFormRenderer
                  fields={step.formId.fields}
                  values={formValues}
                  onChange={setFormValues}
                />
              </div>
            ) : (
              <div style={{ padding: '20px' }}>
                <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center' }}>
                  No form attached to this step. Click submit to mark as complete.
                </p>
              </div>
            )}

            {/* Submit footer */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px', borderTop: '1px solid #f1f5f9',
              backgroundColor: '#f8fafc',
            }}>
              <div>
                {step.status === 'OVERDUE' && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    fontSize: '12px', color: '#dc2626', fontWeight: '500',
                  }}>
                    <AlertTriangle size={13} />
                    This step is overdue
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '9px 20px', backgroundColor: submitting ? '#93c5fd' : '#2563eb',
                  color: 'white', border: 'none', borderRadius: '8px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontSize: '13px', fontWeight: '500',
                }}
              >
                {submitting
                  ? <div style={{ width: '14px', height: '14px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  : <Send size={14} />
                }
                {submitting ? 'Submitting...' : 'Complete step'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Done — show submitted data */}
      {isDone && step.formSubmission && Object.keys(step.formSubmission.values || {}).length > 0 && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f0fdf4' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            Submitted data
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {Object.entries(step.formSubmission.values).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{key}</span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#166534' }}>
                  {String(val)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MyTasks() {
  const { data: tasks = [], isLoading } = useGetMyTasksQuery()

  const pending  = tasks.filter(t => t.step.status === 'PENDING')
  const overdue  = tasks.filter(t => t.step.status === 'OVERDUE')
  const done     = tasks.filter(t => t.step.status === 'DONE')

  return (
    <Layout title="My tasks" subtitle="View and complete your assigned workflow steps">
      <div style={{ maxWidth: '760px' }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Pending',  value: pending.length,  bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
            { label: 'Overdue',  value: overdue.length,  bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
            { label: 'Completed', value: done.length,    bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
          ].map(({ label, value, bg, color, border }) => (
            <div key={label} style={{
              backgroundColor: bg, border: `1px solid ${border}`,
              borderRadius: '12px', padding: '16px 20px',
            }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
              </p>
              <p style={{ fontSize: '28px', fontWeight: '700', color, marginTop: '4px' }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div style={{ width: '24px', height: '24px', border: '2px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : tasks.length === 0 ? (
          <div style={{
            backgroundColor: 'white', border: '2px dashed #e2e8f0',
            borderRadius: '16px', padding: '60px', textAlign: 'center',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              backgroundColor: '#f1f5f9', display: 'flex',
              alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
            }}>
              <ClipboardList size={24} color="#94a3b8" />
            </div>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>
              No tasks assigned yet
            </p>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
              Tasks will appear here when an admin starts a workflow and assigns steps to you
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Overdue first */}
            {overdue.length > 0 && (
              <div>
                <p style={{ fontSize: '11px', fontWeight: '600', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  Overdue — {overdue.length}
                </p>
                {overdue.map((task, i) => <TaskCard key={i} task={task} />)}
              </div>
            )}

            {/* Pending */}
            {pending.length > 0 && (
              <div>
                <p style={{ fontSize: '11px', fontWeight: '600', color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginTop: overdue.length > 0 ? '12px' : 0 }}>
                  Pending — {pending.length}
                </p>
                {pending.map((task, i) => <TaskCard key={i} task={task} />)}
              </div>
            )}

            {/* Done */}
            {done.length > 0 && (
              <div>
                <p style={{ fontSize: '11px', fontWeight: '600', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginTop: pending.length > 0 ? '12px' : 0 }}>
                  Completed — {done.length}
                </p>
                {done.map((task, i) => <TaskCard key={i} task={task} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default MyTasks