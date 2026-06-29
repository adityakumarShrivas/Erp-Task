import { useState } from 'react'
import Layout from '../../components/Layout.jsx'
import {
  useGetStepsQuery,
  useCreateStepMutation,
  useUpdateStepMutation,
  useDeleteStepMutation,
} from '../../features/api/stepsApi.js'
import { useGetFormsQuery } from '../../features/api/formsApi.js'
import { useGetDoersQuery } from '../../features/api/authApi.js'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Save, Clock, FileText } from 'lucide-react'

const empty = {
  name: '', order: '', description: '',
  assigneeId: '', buddyId: '', slaMinutes: '', formId: ''
}

const inputStyle = {
  width: '100%', padding: '9px 12px',
  border: '1px solid #e2e8f0', borderRadius: '8px',
  fontSize: '13px', color: '#0f172a', backgroundColor: 'white',
  outline: 'none', boxSizing: 'border-box',
}

const labelStyle = {
  display: 'block', fontSize: '12px',
  fontWeight: '500', color: '#475569', marginBottom: '6px',
}

function StepModal({ initial, onClose, onSave, doers, forms, isLoading }) {
  const [form, setForm] = useState(initial)
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = (e) => { e.preventDefault(); onSave(form) }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.45)', padding: '16px',
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '16px',
        border: '1px solid #e2e8f0', width: '100%', maxWidth: '520px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', margin: 0 }}>
            {initial._id ? 'Edit step' : 'Add new step'}
          </h2>
          <button onClick={onClose} style={{
            width: '28px', height: '28px', border: 'none', backgroundColor: '#f1f5f9',
            borderRadius: '6px', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#64748b',
          }}>
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Step name *</label>
              <input name="name" value={form.name} onChange={handleChange} required
                placeholder="e.g. Production" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
            <div>
              <label style={labelStyle}>Sequence order *</label>
              <input name="order" type="number" value={form.order} onChange={handleChange}
                required placeholder="1" min="1" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={3} placeholder="What happens in this step..."
              style={{ ...inputStyle, resize: 'none', lineHeight: '1.5' }}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Assign doer *</label>
              <select name="assigneeId" value={form.assigneeId} onChange={handleChange}
                required style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}>
                <option value="">Select doer</option>
                {doers.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Buddy (optional)</label>
              <select name="buddyId" value={form.buddyId} onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}>
                <option value="">No buddy</option>
                {doers.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>SLA (minutes) *</label>
              <input name="slaMinutes" type="number" value={form.slaMinutes} onChange={handleChange}
                required placeholder="60" min="1" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
            <div>
              <label style={labelStyle}>Attach form</label>
              <select name="formId" value={form.formId} onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}>
                <option value="">No form</option>
                {forms.map(f => <option key={f._id} value={f._id}>{f.title}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{
              padding: '9px 18px', fontSize: '13px', fontWeight: '500',
              color: '#475569', backgroundColor: 'white',
              border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer',
            }}>Cancel</button>
            <button type="submit" disabled={isLoading} style={{
              padding: '9px 18px', fontSize: '13px', fontWeight: '500',
              color: 'white', backgroundColor: isLoading ? '#93c5fd' : '#2563eb',
              border: 'none', borderRadius: '8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              {isLoading
                ? <div style={{ width: '14px', height: '14px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                : <Save size={14} />}
              {initial._id ? 'Save changes' : 'Create step'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function StepBuilder() {
  const [showModal, setShowModal]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  const { data: steps = [], isLoading: loadingSteps } = useGetStepsQuery()
  const { data: doers = [] } = useGetDoersQuery()
  const { data: forms = [] } = useGetFormsQuery()

  const [createStep, { isLoading: creating }] = useCreateStepMutation()
  const [updateStep, { isLoading: updating }] = useUpdateStepMutation()
  const [deleteStep] = useDeleteStepMutation()

  const openCreate = () => { setEditTarget(null); setShowModal(true) }
  const openEdit = (step) => {
    setEditTarget({
      _id: step._id, name: step.name, order: step.order,
      description: step.description || '',
      assigneeId: step.assigneeId?._id || '',
      buddyId: step.buddyId?._id || '',
      slaMinutes: step.slaMinutes,
      formId: step.formId?._id || '',
    })
    setShowModal(true)
  }

  const handleSave = async (form) => {
    try {
      if (editTarget?._id) {
        await updateStep({ id: editTarget._id, ...form }).unwrap()
        toast.success('Step updated')
      } else {
        await createStep(form).unwrap()
        toast.success('Step created')
      }
      setShowModal(false)
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this step?')) return
    try {
      await deleteStep(id).unwrap()
      toast.success('Step deleted')
    } catch (err) {
      toast.error(err?.data?.message || 'Delete failed')
    }
  }

  const thStyle = {
    textAlign: 'left', fontSize: '11px', fontWeight: '600',
    color: '#94a3b8', padding: '10px 20px', textTransform: 'uppercase', letterSpacing: '0.04em',
  }

  const tdStyle = { padding: '12px 20px', borderBottom: '1px solid #f8fafc' }

  return (
    <Layout title="Step builder" subtitle="Configure your workflow steps">

      {showModal && (
        <StepModal
          initial={editTarget || empty}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          doers={doers} forms={forms}
          isLoading={creating || updating}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
            {steps.length} step{steps.length !== 1 ? 's' : ''} configured
          </p>
          <button onClick={openCreate} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '9px 16px', backgroundColor: '#2563eb', color: 'white',
            fontSize: '13px', fontWeight: '500', border: 'none',
            borderRadius: '8px', cursor: 'pointer',
          }}>
            <Plus size={15} /> Add step
          </button>
        </div>

        {/* Content */}
        {loadingSteps ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
            <div style={{ width: '24px', height: '24px', border: '2px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
          </div>
        ) : steps.length === 0 ? (
          <div style={{
            backgroundColor: 'white', borderRadius: '12px',
            border: '1px dashed #cbd5e1', padding: '64px 20px', textAlign: 'center',
          }}>
            <div style={{
              width: '48px', height: '48px', backgroundColor: '#f1f5f9',
              borderRadius: '12px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 12px',
            }}>
              <FileText size={22} color="#94a3b8" />
            </div>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#475569', margin: '0 0 4px' }}>No steps yet</p>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px' }}>Add your first workflow step to get started</p>
            <button onClick={openCreate} style={{
              padding: '9px 18px', backgroundColor: '#2563eb', color: 'white',
              fontSize: '13px', fontWeight: '500', border: 'none',
              borderRadius: '8px', cursor: 'pointer',
            }}>Add first step</button>
          </div>
        ) : (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ ...thStyle, width: '40px' }}>#</th>
                  <th style={thStyle}>Step name</th>
                  <th style={thStyle}>Doer</th>
                  <th style={thStyle}>Buddy</th>
                  <th style={thStyle}>SLA</th>
                  <th style={thStyle}>Form</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((step) => (
                  <tr key={step._id}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                    style={{ backgroundColor: 'white', transition: 'background 0.1s' }}>
                    <td style={tdStyle}>
                      <div style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        backgroundColor: '#f1f5f9', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: '600', color: '#64748b',
                      }}>{step.order}</div>
                    </td>
                    <td style={tdStyle}>
                      <p style={{ fontSize: '13px', fontWeight: '500', color: '#374151', margin: 0 }}>{step.name}</p>
                      {step.description && (
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {step.description}
                        </p>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '26px', height: '26px', borderRadius: '50%',
                          backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '11px', fontWeight: '600', color: '#2563eb',
                        }}>{step.assigneeId?.name?.charAt(0)}</div>
                        <span style={{ fontSize: '13px', color: '#475569' }}>{step.assigneeId?.name}</span>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      {step.buddyId ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '26px', height: '26px', borderRadius: '50%',
                            backgroundColor: '#ede9fe', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: '11px', fontWeight: '600', color: '#7c3aed',
                          }}>{step.buddyId?.name?.charAt(0)}</div>
                          <span style={{ fontSize: '13px', color: '#475569' }}>{step.buddyId?.name}</span>
                        </div>
                      ) : <span style={{ fontSize: '13px', color: '#cbd5e1' }}>—</span>}
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        fontSize: '12px', color: '#64748b', backgroundColor: '#f1f5f9',
                        padding: '3px 8px', borderRadius: '99px',
                      }}>
                        <Clock size={11} /> {step.slaMinutes} min
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {step.formId ? (
                        <span style={{
                          fontSize: '12px', color: '#2563eb', backgroundColor: '#eff6ff',
                          padding: '3px 8px', borderRadius: '99px',
                        }}>{step.formId?.title}</span>
                      ) : <span style={{ fontSize: '12px', color: '#cbd5e1' }}>No form</span>}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                        <button onClick={() => openEdit(step)}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.color = '#2563eb' }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8' }}
                          style={{ padding: '6px', border: 'none', backgroundColor: 'transparent', borderRadius: '6px', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(step._id)}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.color = '#dc2626' }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8' }}
                          style={{ padding: '6px', border: 'none', backgroundColor: 'transparent', borderRadius: '6px', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default StepBuilder