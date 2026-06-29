import { useState } from 'react'
import Layout from '../../components/Layout.jsx'
import {
  useGetStepsQuery,
  useCreateStepMutation,
  useUpdateStepMutation,
  useDeleteStepMutation,
} from '../../features/api/stepsApi.js'
import { useGetFormsQuery }  from '../../features/api/formsApi.js'
import { useGetDoersQuery }  from '../../features/api/authApi.js'
import toast from 'react-hot-toast'
import {
  Plus, Pencil, Trash2, X, Save,
  User, Clock, FileText, Hash, AlignLeft
} from 'lucide-react';

const empty = {
  name: '', order: '', description: '',
  assigneeId: '', buddyId: '', slaMinutes: '', formId: ''
}

function StepModal({ initial, onClose, onSave, doers, forms, isLoading }) {
  const [form, setForm] = useState(initial)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#0f172a',
    backgroundColor: 'white',
    outline: 'none',
    transition: 'border-color 0.15s',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#475569',
    marginBottom: '6px',
  }

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
          <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
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
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Production"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            <div>
              <label style={labelStyle}>Sequence order *</label>
              <input
                name="order"
                type="number"
                value={form.order}
                onChange={handleChange}
                required
                placeholder="1"
                min="1"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="What happens in this step..."
              style={{ ...inputStyle, resize: 'none', lineHeight: '1.5' }}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Assign doer *</label>
              <select
                name="assigneeId"
                value={form.assigneeId}
                onChange={handleChange}
                required
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              >
                <option value="">Select doer</option>
                {doers.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Buddy (optional)</label>
              <select
                name="buddyId"
                value={form.buddyId}
                onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              >
                <option value="">No buddy</option>
                {doers.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>SLA (minutes) *</label>
              <input
                name="slaMinutes"
                type="number"
                value={form.slaMinutes}
                onChange={handleChange}
                required
                placeholder="60"
                min="1"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            <div>
              <label style={labelStyle}>Attach form</label>
              <select
                name="formId"
                value={form.formId}
                onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              >
                <option value="">No form</option>
                {forms.map((f) => (
                  <option key={f._id} value={f._id}>{f.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 18px', fontSize: '13px', fontWeight: '500',
                color: '#475569', backgroundColor: 'white',
                border: '1px solid #e2e8f0', borderRadius: '8px',
                cursor: 'pointer',
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
  const { data: doers = [] }  = useGetDoersQuery()
  const { data: forms = [] }  = useGetFormsQuery()

  const [createStep, { isLoading: creating }] = useCreateStepMutation()
  const [updateStep, { isLoading: updating }] = useUpdateStepMutation()
  const [deleteStep] = useDeleteStepMutation()

  const openCreate = () => { setEditTarget(null); setShowModal(true) }
  const openEdit   = (step) => {
    setEditTarget({
      _id:         step._id,
      name:        step.name,
      order:       step.order,
      description: step.description || '',
      assigneeId:  step.assigneeId?._id || '',
      buddyId:     step.buddyId?._id    || '',
      slaMinutes:  step.slaMinutes,
      formId:      step.formId?._id     || '',
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

  return (
    <Layout title="Step builder" subtitle="Configure your workflow steps">

      {showModal && (
        <StepModal
          initial={editTarget || empty}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          doers={doers}
          forms={forms}
          isLoading={creating || updating}
        />
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">
              {steps.length} step{steps.length !== 1 ? 's' : ''} configured
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={16} />
            Add Step
          </button>
        </div>

        {loadingSteps ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : steps.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 border-dashed py-16 text-center mt-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FileText size={22} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600">No steps yet</p>
            <p className="text-xs text-slate-400 mt-1">Add your first workflow step to get started</p>
            <button
              onClick={openCreate}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
            >
              Add first step
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3 w-10">#</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Step name</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Doer</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Buddy</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">SLA</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Form</th>
                  <th className="text-right text-xs font-medium text-slate-500 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {steps.map((step) => (
                  <tr key={step._id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3.5">
                      <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500">
                        {step.order}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-slate-700">{step.name}</p>
                      {step.description && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-\[200px\]">
                          {step.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">
                          {step.assigneeId?.name?.charAt(0)}
                        </div>
                        <span className="text-sm text-slate-600">{step.assigneeId?.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {step.buddyId ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-xs font-semibold text-violet-600">
                            {step.buddyId?.name?.charAt(0)}
                          </div>
                          <span className="text-sm text-slate-600">{step.buddyId?.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        <Clock size={11} />
                        {step.slaMinutes} min
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {step.formId ? (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          {step.formId?.title}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">No form</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(step)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(step._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
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