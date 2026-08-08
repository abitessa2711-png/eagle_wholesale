import React, { useState } from 'react'
import { MASTER_DATA } from '../data/masterData'
import { Plus, Package, CheckCircle2 } from 'lucide-react'

const CATEGORIES = Object.keys(MASTER_DATA)

const AddStock = ({ onAddProduct }) => {
  const [formData, setFormData] = useState({
    category: '', subcategory: '', variant: '', detail: '', weight: '', quantity: '',
    date: new Date().toLocaleString('sv-SE').slice(0, 16).replace(' ', 'T')
  })
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const getSubs = () => formData.category ? Object.keys(MASTER_DATA[formData.category]) : []
  
  const getVariants = () => {
    if (!formData.category || !formData.subcategory) return []
    const d = MASTER_DATA[formData.category][formData.subcategory]
    return Array.isArray(d) ? d : (typeof d === 'object' ? Object.keys(d) : [])
  }

  const getDetails = () => {
    if (formData.category === 'கொலுசு' && (formData.subcategory === 'அளவு' || formData.subcategory === 'சிங்கிள் பட்டி கொலுசு') && formData.variant) {
      return MASTER_DATA['கொலுசு']['விவரம்'][formData.variant] || []
    }
    return []
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.category || !formData.subcategory || !formData.variant) {
      alert('தயவுசெய்து கட்டாய புலங்களை நிரப்பவும் (Please fill required fields)')
      return
    }

    setLoading(true)
    try {
      const addedName = formData.variant
      await onAddProduct({
        category: formData.category,
        subcategory: formData.subcategory,
        variant: formData.variant,
        detail: formData.detail || "",
        weight: parseFloat(formData.weight || 0),
        quantity: parseInt(formData.quantity || 1),
        customDate: new Date(formData.date).toISOString()
      })

      setFormData({ 
        category: '', subcategory: '', variant: '', detail: '', weight: '', quantity: '',
        date: new Date().toLocaleString('sv-SE').slice(0, 16).replace(' ', 'T')
      })
      
      setSuccessMsg(`✅ "${addedName}" இருப்பு வெற்றிகரமாக சேர்க்கப்பட்டது! (Stock added successfully!)`)
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err) {
      alert('சேமிப்பதில் பிழை: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="flex-between mb-14">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>சரக்கு சேர்த்தல் (Add Stock)</h2>
          <p className="text-sub">Add new inventory items to Eagle Silvers Wholesale</p>
        </div>
        <div className="stat-icon" style={{ background: 'rgba(229,184,105,0.18)', color: 'var(--gold)' }}>
          <Plus size={22} />
        </div>
      </div>

      {/* Prominent Success Notification Banner */}
      {successMsg && (
        <div className="toast-success mb-14">
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="card">
        <div className="card-title">பொருள் விவரங்கள் (Product Details)</div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>பிரிவு (Category) *</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({ ...formData, category: e.target.value, subcategory: '', variant: '', detail: '' })} 
                required
              >
                <option value="">— Select Category —</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>துணை பிரிவு (Subcategory) *</label>
              <select 
                value={formData.subcategory} 
                onChange={e => setFormData({ ...formData, subcategory: e.target.value, variant: '', detail: '' })} 
                disabled={!formData.category}
                required
              >
                <option value="">— Select Sub —</option>
                {getSubs().map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>மாடல் (Variant) *</label>
              <select 
                value={formData.variant} 
                onChange={e => setFormData({ ...formData, variant: e.target.value, detail: '' })} 
                disabled={!formData.subcategory}
                required
              >
                <option value="">— Select Variant —</option>
                {getVariants().map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            {getDetails().length > 0 && (
              <div className="form-group">
                <label>விவரம் (Detail)</label>
                <select 
                  value={formData.detail} 
                  onChange={e => setFormData({ ...formData, detail: e.target.value })}
                >
                  <option value="">— Select Detail —</option>
                  {getDetails().map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            )}

            <div className="form-group">
              <label>எடை (Total Weight g)</label>
              <input 
                type="number" step="0.001" min="0"
                placeholder="0.000"
                value={formData.weight}
                onChange={e => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>எண்ணிக்கை (Quantity pcs) *</label>
              <input 
                type="number" min="1"
                placeholder="1"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                required 
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>சேர்க்கை தேதி (Stock Date & Time) *</label>
              <input 
                type="datetime-local" 
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                required 
              />
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-add btn-lg btn-full" disabled={loading}>
              {loading ? 'சேமிக்கப்படுகிறது...' : '+ இருப்பில் சேர் (Add Stock)'}
            </button>
          </div>
        </form>
      </div>
      
      <div style={{ marginTop: 14 }} className="card" style={{ background: 'rgba(229,184,105,0.04)', border: '1px dashed var(--gold)', padding: 12 }}>
        <p style={{ fontSize: '12px', color: 'var(--text-sub)', textAlign: 'center' }}>
          <strong>Note:</strong> ஒவ்வொரு முறை சரக்கு சேர்க்கும் போதும் அது ஒரு தனி பதிவாக சேமிக்கப்படும்.
        </p>
      </div>
    </div>
  )
}

export default AddStock
