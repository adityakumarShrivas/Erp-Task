import { useState } from 'react'
import { Upload, X, FileText } from 'lucide-react'

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
  fontSize: '13px',
  fontWeight: '500',
  color: '#374151',
  marginBottom: '6px',
}

function DynamicFormRenderer({ fields = [], values = {}, onChange, disabled = false }) {
  const [fileNames, setFileNames] = useState({})

  const handleChange = (key, value) => {
    onChange({ ...values, [key]: value })
  }

  const handleFile = (key, file) => {
    if (!file) return
    setFileNames(prev => ({ ...prev, [key]: file.name }))
    onChange({ ...values, [key]: file.name })
  }

  const removeFile = (key) => {
    setFileNames(prev => { const n = { ...prev }; delete n[key]; return n })
    const updated = { ...values }
    delete updated[key]
    onChange(updated)
  }

  if (!fields || fields.length === 0) {
    return (
      <div style={{
        border: '2px dashed #e2e8f0', borderRadius: '10px',
        padding: '24px', textAlign: 'center',
      }}>
        <p style={{ fontSize: '13px', color: '#94a3b8' }}>No form fields configured</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {fields.map((field) => (
        <div key={field.key || field._id}>
          <label style={labelStyle}>
            {field.label}
            {field.required && (
              <span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>
            )}
          </label>

          {field.type === 'TEXT' && (
            <input
              type="text"
              value={values[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              disabled={disabled}
              required={field.required}
              style={{ ...inputStyle, backgroundColor: disabled ? '#f8fafc' : 'white' }}
              onFocus={e => !disabled && (e.target.style.borderColor = '#2563eb')}
              onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
            />
          )}

          {field.type === 'NUMBER' && (
            <input
              type="number"
              value={values[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder="0"
              disabled={disabled}
              required={field.required}
              style={{ ...inputStyle, backgroundColor: disabled ? '#f8fafc' : 'white' }}
              onFocus={e => !disabled && (e.target.style.borderColor = '#2563eb')}
              onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
            />
          )}

          {field.type === 'DATE' && (
            <input
              type="date"
              value={values[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              disabled={disabled}
              required={field.required}
              style={{ ...inputStyle, backgroundColor: disabled ? '#f8fafc' : 'white' }}
              onFocus={e => !disabled && (e.target.style.borderColor = '#2563eb')}
              onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
            />
          )}

          {field.type === 'SELECT' && (
            <select
              value={values[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              disabled={disabled}
              required={field.required}
              style={{ ...inputStyle, cursor: disabled ? 'not-allowed' : 'pointer', backgroundColor: disabled ? '#f8fafc' : 'white' }}
              onFocus={e => !disabled && (e.target.style.borderColor = '#2563eb')}
              onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
            >
              <option value="">Select an option</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}

          {field.type === 'CHECKBOX' && (
            <label style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              padding: '10px 14px', border: '1px solid #e2e8f0',
              borderRadius: '8px', backgroundColor: disabled ? '#f8fafc' : 'white',
            }}>
              <input
                type="checkbox"
                checked={values[field.key] === true || values[field.key] === 'true'}
                onChange={(e) => handleChange(field.key, e.target.checked)}
                disabled={disabled}
                style={{ width: '16px', height: '16px', accentColor: '#2563eb', cursor: disabled ? 'not-allowed' : 'pointer' }}
              />
              <span style={{ fontSize: '13px', color: '#374151' }}>
                {field.label}
              </span>
            </label>
          )}

          {field.type === 'FILE' && (
            <div>
              {fileNames[field.key] ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', border: '1px solid #bfdbfe',
                  borderRadius: '8px', backgroundColor: '#eff6ff',
                }}>
                  <FileText size={16} color="#2563eb" />
                  <span style={{ fontSize: '13px', color: '#1d4ed8', flex: 1 }}>
                    {fileNames[field.key]}
                  </span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => removeFile(field.key)}
                      style={{
                        border: 'none', backgroundColor: 'transparent',
                        cursor: 'pointer', color: '#64748b',
                        display: 'flex', alignItems: 'center',
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ) : (
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: '8px',
                  padding: '24px', border: '2px dashed #e2e8f0',
                  borderRadius: '8px', backgroundColor: disabled ? '#f8fafc' : 'white',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                }}>
                  <Upload size={20} color="#94a3b8" />
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                    Click to upload file
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    PDF, PNG, JPG up to 10MB
                  </span>
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    disabled={disabled}
                    onChange={(e) => handleFile(field.key, e.target.files[0])}
                  />
                </label>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default DynamicFormRenderer