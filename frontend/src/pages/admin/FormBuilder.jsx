import { useState } from 'react'
import Layout from '../../components/Layout.jsx'
import {
  useGetFormsQuery,
  useCreateFormMutation,
  useUpdateFormMutation,
  useDeleteFormMutation,
} from '../../features/api/formsApi.js'
import toast from 'react-hot-toast'
import {
  Plus, Trash2, Pencil, X, Save,
  Type, Hash, Calendar, List,
  CheckSquare, Upload, GripVertical,
  ChevronDown, ChevronUp, Eye
} from 'lucide-react'

const FIELD_TYPES = [
  { value: 'TEXT',     label: 'Text',     icon: Type        },
  { value: 'NUMBER',   label: 'Number',   icon: Hash        },
  { value: 'DATE',     label: 'Date',     icon: Calendar    },
  { value: 'SELECT',   label: 'Dropdown', icon: List        },
  { value: 'CHECKBOX', label: 'Checkbox', icon: CheckSquare },
  { value: 'FILE',     label: 'File',     icon: Upload      },
]

const emptyField = () => ({
  key:      '',
  label:    '',
  type:     'TEXT',
  required: false,
  options:  [],
  _tempId:  Date.now() + Math.random(),
})

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
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
  marginBottom: '5px',
}

function FieldTypeIcon({ type, size = 14 }) {
  const found = FIELD_TYPES.find((f) => f.value === type)
  const Icon  = found?.icon || Type
  return <Icon size={size} />
}

function FieldCard({ field, index, total, onChange, onDelete, onMoveUp, onMoveDown }) {
  const [expanded, setExpanded] = useState(true)

  const handleOptionAdd = () => {
    onChange({ ...field, options: [...(field.options || []), ''] })
  }

  const handleOptionChange = (i, val) => {
    const opts = [...field.options]
    opts[i] = val
    onChange({ ...field, options: opts })
  }

  const handleOptionRemove = (i) => {
    onChange({ ...field, options: field.options.filter((_, idx) => idx !== i) })
  }

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '10px',
    }}>
      {/* Field header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 16px', backgroundColor: '#f8fafc',
        borderBottom: expanded ? '1px solid #e2e8f0' : 'none',
      }}>
        <GripVertical size={16} color="#cbd5e1" style={{ flexShrink: 0 }} />

        <div style={{
          width: '28px', height: '28px', borderRadius: '6px',
          backgroundColor: '#eff6ff', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: '#2563eb', flexShrink: 0,
        }}>
          <FieldTypeIcon type={field.type} size={14} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', lineHeight: 1 }}>
            {field.label || `Field ${index + 1}`}
          </p>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>
            {FIELD_TYPES.find(f => f.value === field.type)?.label}
            {field.required && ' · Required'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            style={{
              width: '26px', height: '26px', border: 'none',
              backgroundColor: 'transparent', cursor: index === 0 ? 'not-allowed' : 'pointer',
              color: index === 0 ? '#cbd5e1' : '#64748b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '6px',
            }}
          >
            <ChevronUp size={14} />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            style={{
              width: '26px', height: '26px', border: 'none',
              backgroundColor: 'transparent', cursor: index === total - 1 ? 'not-allowed' : 'pointer',
              color: index === total - 1 ? '#cbd5e1' : '#64748b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '6px',
            }}
          >
            <ChevronDown size={14} />
          </button>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            style={{
              width: '26px', height: '26px', border: 'none',
              backgroundColor: 'transparent', cursor: 'pointer',
              color: '#64748b', display: 'flex', alignItems: 'center',
              justifyContent: 'center', borderRadius: '6px',
            }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            type="button"
            onClick={onDelete}
            style={{
              width: '26px', height: '26px', border: 'none',
              backgroundColor: 'transparent', cursor: 'pointer',
              color: '#ef4444', display: 'flex', alignItems: 'center',
              justifyContent: 'center', borderRadius: '6px',
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Field body */}
      {expanded && (
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>Field label *</label>
              <input
                value={field.label}
                onChange={(e) => onChange({ ...field, label: e.target.value })}
                placeholder="e.g. Batch number"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            <div>
              <label style={labelStyle}>Field key *</label>
              <input
                value={field.key}
                onChange={(e) => onChange({
                  ...field,
                  key: e.target.value.toLowerCase().replace(/\s+/g, '_')
                })}
                placeholder="e.g. batch_number"
                required
                style={{ ...inputStyle, fontFamily: 'monospace' }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>Field type *</label>
              <select
                value={field.type}
                onChange={(e) => onChange({ ...field, type: e.target.value, options: [] })}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              >
                {FIELD_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '22px' }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                cursor: 'pointer', userSelect: 'none',
              }}>
                <div
                  onClick={() => onChange({ ...field, required: !field.required })}
                  style={{
                    width: '36px', height: '20px', borderRadius: '10px',
                    backgroundColor: field.required ? '#2563eb' : '#e2e8f0',
                    position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '50%',
                    backgroundColor: 'white', position: 'absolute',
                    top: '2px', transition: 'left 0.2s',
                    left: field.required ? '18px' : '2px',
                  }} />
                </div>
                <span style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>
                  Required field
                </span>
              </label>
            </div>
          </div>

          {/* Dropdown options */}
          {field.type === 'SELECT' && (
            <div>
              <label style={labelStyle}>Dropdown options</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(field.options || []).map((opt, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      value={opt}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      style={{ ...inputStyle, flex: 1 }}
                      onFocus={e => e.target.style.borderColor = '#2563eb'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                    <button
                      type="button"
                      onClick={() => handleOptionRemove(i)}
                      style={{
                        width: '36px', height: '36px', border: '1px solid #fecaca',
                        backgroundColor: '#fef2f2', borderRadius: '8px',
                        cursor: 'pointer', color: '#ef4444',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleOptionAdd}
                  style={{
                    padding: '7px 12px', border: '1px dashed #cbd5e1',
                    backgroundColor: 'transparent', borderRadius: '8px',
                    cursor: 'pointer', color: '#64748b', fontSize: '13px',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  <Plus size={14} />
                  Add option
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FormEditor({ initial, onClose, onSave, isLoading }) {
  const [title,  setTitle]  = useState(initial?.title  || '')
  const [fields, setFields] = useState(
    initial?.fields?.map(f => ({ ...f, _tempId: Math.random() })) || []
  )

  const addField = () => {
    setFields([...fields, emptyField()])
  }

  const updateField = (index, updated) => {
    setFields(fields.map((f, i) => i === index ? updated : f))
  }

  const deleteField = (index) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const moveUp = (index) => {
    if (index === 0) return
    const arr = [...fields]
    ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
    setFields(arr)
  }

  const moveDown = (index) => {
    if (index === fields.length - 1) return
    const arr = [...fields]
    ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
    setFields(arr)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (fields.length === 0) {
      toast.error('Add at least one field')
      return
    }
    for (const f of fields) {
      if (!f.label || !f.key) {
        toast.error('All fields must have a label and key')
        return
      }
    }
    const cleanFields = fields.map(({ _tempId, ...rest }) => rest)
    onSave({ title, fields: cleanFields })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.45)', padding: '20px',
      overflowY: 'auto',
    }}>
      <div style={{
        backgroundColor: '#f8fafc', borderRadius: '16px',
        border: '1px solid #e2e8f0', width: '100%', maxWidth: '640px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        marginTop: '20px', marginBottom: '20px',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: '1px solid #e2e8f0',
          backgroundColor: 'white', borderRadius: '16px 16px 0 0',
        }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
              {initial?._id ? 'Edit form' : 'Create new form'}
            </h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
              {fields.length} field{fields.length !== 1 ? 's' : ''} added
            </p>
          </div>
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

        <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>

          {/* Form title */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Form title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Production Checklist"
              style={{ ...inputStyle, fontSize: '14px', padding: '10px 14px' }}
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Fields */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: '12px',
            }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Form fields</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {FIELD_TYPES.map((ft) => {
                  const Icon = ft.icon
                  return (
                    <button
                      key={ft.value}
                      type="button"
                      title={`Add ${ft.label} field`}
                      onClick={() => setFields([...fields, { ...emptyField(), type: ft.value }])}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '5px 10px', border: '1px solid #e2e8f0',
                        borderRadius: '6px', backgroundColor: 'white',
                        cursor: 'pointer', fontSize: '11px', color: '#475569',
                        fontWeight: '500',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#eff6ff'
                        e.currentTarget.style.borderColor = '#2563eb'
                        e.currentTarget.style.color = '#2563eb'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'white'
                        e.currentTarget.style.borderColor = '#e2e8f0'
                        e.currentTarget.style.color = '#475569'
                      }}
                    >
                      <Icon size={12} />
                      {ft.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {fields.length === 0 ? (
              <div style={{
                border: '2px dashed #e2e8f0', borderRadius: '12px',
                padding: '32px', textAlign: 'center', backgroundColor: 'white',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  backgroundColor: '#f1f5f9', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px',
                }}>
                  <Plus size={20} color="#94a3b8" />
                </div>
                <p style={{ fontSize: '13px', fontWeight: '500', color: '#475569' }}>
                  No fields yet
                </p>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  Click a field type above to add it
                </p>
              </div>
            ) : (
              fields.map((field, index) => (
                <FieldCard
                  key={field._tempId || index}
                  field={field}
                  index={index}
                  total={fields.length}
                  onChange={(updated) => updateField(index, updated)}
                  onDelete={() => deleteField(index)}
                  onMoveUp={() => moveUp(index)}
                  onMoveDown={() => moveDown(index)}
                />
              ))
            )}
          </div>

          {/* Footer buttons */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', paddingTop: '16px',
            borderTop: '1px solid #e2e8f0', marginTop: '8px',
          }}>
            <button
              type="button"
              onClick={addField}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '9px 16px', border: '1px dashed #cbd5e1',
                borderRadius: '8px', backgroundColor: 'white',
                cursor: 'pointer', fontSize: '13px', color: '#64748b', fontWeight: '500',
              }}
            >
              <Plus size={15} />
              Add field
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
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
                {initial?._id ? 'Save changes' : 'Create form'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormBuilder() {
  const [showEditor, setShowEditor] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [previewForm, setPreviewForm] = useState(null)

  const { data: forms = [], isLoading } = useGetFormsQuery()
  const [createForm, { isLoading: creating }] = useCreateFormMutation()
  const [updateForm, { isLoading: updating }] = useUpdateFormMutation()
  const [deleteForm] = useDeleteFormMutation()

  const openCreate = () => { setEditTarget(null); setShowEditor(true) }
  const openEdit   = (form) => { setEditTarget(form); setShowEditor(true) }

  const handleSave = async (data) => {
    try {
      if (editTarget?._id) {
        await updateForm({ id: editTarget._id, ...data }).unwrap()
        toast.success('Form updated')
      } else {
        await createForm(data).unwrap()
        toast.success('Form created')
      }
      setShowEditor(false)
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this form?')) return
    try {
      await deleteForm(id).unwrap()
      toast.success('Form deleted')
    } catch (err) {
      toast.error('Delete failed',err)
    }
  }

  const typeColors = {
    TEXT:     { bg: '#eff6ff', color: '#2563eb' },
    NUMBER:   { bg: '#f0fdf4', color: '#16a34a' },
    DATE:     { bg: '#fdf4ff', color: '#9333ea' },
    SELECT:   { bg: '#fff7ed', color: '#ea580c' },
    CHECKBOX: { bg: '#f0fdf4', color: '#16a34a' },
    FILE:     { bg: '#fefce8', color: '#ca8a04' },
  }

  return (
    <Layout title="Form builder" subtitle="Create dynamic forms for workflow steps">

      {showEditor && (
        <FormEditor
          initial={editTarget}
          onClose={() => setShowEditor(false)}
          onSave={handleSave}
          isLoading={creating || updating}
        />
      )}

      {/* Preview modal */}
      {previewForm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.45)', padding: '20px',
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '16px',
            border: '1px solid #e2e8f0', width: '100%', maxWidth: '480px',
            maxHeight: '80vh', overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, backgroundColor: 'white',
            }}>
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
                  {previewForm.title}
                </h2>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Form preview</p>
              </div>
              <button
                onClick={() => setPreviewForm(null)}
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
            <div style={{ padding: '24px' }}>
              {previewForm.fields.map((field) => (
                <div key={field._id} style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block', fontSize: '13px', fontWeight: '500',
                    color: '#374151', marginBottom: '6px',
                  }}>
                    {field.label}
                    {field.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                  </label>
                  {field.type === 'TEXT' && (
                    <input disabled placeholder={`Enter ${field.label.toLowerCase()}`} style={{ ...inputStyle, backgroundColor: '#f8fafc' }} />
                  )}
                  {field.type === 'NUMBER' && (
                    <input type="number" disabled placeholder="0" style={{ ...inputStyle, backgroundColor: '#f8fafc' }} />
                  )}
                  {field.type === 'DATE' && (
                    <input type="date" disabled style={{ ...inputStyle, backgroundColor: '#f8fafc' }} />
                  )}
                  {field.type === 'SELECT' && (
                    <select disabled style={{ ...inputStyle, backgroundColor: '#f8fafc' }}>
                      <option>Select an option</option>
                      {field.options?.map((opt) => <option key={opt}>{opt}</option>)}
                    </select>
                  )}
                  {field.type === 'CHECKBOX' && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" disabled />
                      <span style={{ fontSize: '13px', color: '#475569' }}>{field.label}</span>
                    </label>
                  )}
                  {field.type === 'FILE' && (
                    <div style={{
                      border: '2px dashed #e2e8f0', borderRadius: '8px',
                      padding: '20px', textAlign: 'center', backgroundColor: '#f8fafc',
                    }}>
                      <Upload size={20} color="#94a3b8" style={{ margin: '0 auto 6px' }} />
                      <p style={{ fontSize: '12px', color: '#94a3b8' }}>Click to upload file</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            {forms.length} form{forms.length !== 1 ? 's' : ''} created
          </p>
          <button
            onClick={openCreate}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 18px', backgroundColor: '#2563eb',
              color: 'white', border: 'none', borderRadius: '8px',
              cursor: 'pointer', fontSize: '13px', fontWeight: '500',
            }}
          >
            <Plus size={15} />
            Create form
          </button>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div style={{ width: '24px', height: '24px', border: '2px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : forms.length === 0 ? (
          <div style={{
            backgroundColor: 'white', border: '2px dashed #e2e8f0',
            borderRadius: '16px', padding: '60px', textAlign: 'center',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              backgroundColor: '#f1f5f9', display: 'flex',
              alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
            }}>
              <List size={24} color="#94a3b8" />
            </div>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>No forms yet</p>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
              Create your first dynamic form to attach to workflow steps
            </p>
            <button
              onClick={openCreate}
              style={{
                marginTop: '16px', padding: '9px 20px',
                backgroundColor: '#2563eb', color: 'white',
                border: 'none', borderRadius: '8px',
                cursor: 'pointer', fontSize: '13px', fontWeight: '500',
              }}
            >
              Create first form
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {forms.map((form) => (
              <div
                key={form._id}
                style={{
                  backgroundColor: 'white', border: '1px solid #e2e8f0',
                  borderRadius: '14px', overflow: 'hidden',
                }}
              >
                <div style={{
                  padding: '16px 20px', borderBottom: '1px solid #f1f5f9',
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                }}>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                      {form.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>
                      {form.fields?.length || 0} fields
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => setPreviewForm(form)}
                      style={{
                        width: '30px', height: '30px', border: 'none',
                        backgroundColor: '#f8fafc', borderRadius: '8px',
                        cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: '#64748b',
                      }}
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => openEdit(form)}
                      style={{
                        width: '30px', height: '30px', border: 'none',
                        backgroundColor: '#f8fafc', borderRadius: '8px',
                        cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: '#2563eb',
                      }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(form._id)}
                      style={{
                        width: '30px', height: '30px', border: 'none',
                        backgroundColor: '#f8fafc', borderRadius: '8px',
                        cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: '#ef4444',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {form.fields?.map((field) => {
                      const colors = typeColors[field.type] || typeColors.TEXT
                      return (
                        <span
                          key={field._id}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            padding: '3px 10px', borderRadius: '99px',
                            fontSize: '11px', fontWeight: '500',
                            backgroundColor: colors.bg, color: colors.color,
                          }}
                        >
                          <FieldTypeIcon type={field.type} size={10} />
                          {field.label}
                          {field.required && ' *'}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default FormBuilder