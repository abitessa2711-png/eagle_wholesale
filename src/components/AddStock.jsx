import React, { useState } from 'react'
import { MASTER_DATA, KOLUSU_VIVARAM } from '../data/masterData'
import { Plus, CheckCircle2 } from 'lucide-react'

const CATEGORIES = Object.keys(MASTER_DATA)

const AddStock = ({ onAddProduct }) => {
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    variant: '',
    detail: '',
    weight: '',
    quantity: '1',
    date: new Date().toLocaleString('sv-SE').slice(0, 16).replace(' ', 'T')
  })
  const [customSubcategory, setCustomSubcategory] = useState('')
  const [customVariant, setCustomVariant] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const getSubs = () => {
    if (!formData.category || !MASTER_DATA[formData.category]) return []
    return Object.keys(MASTER_DATA[formData.category])
  }
  
  const getVariants = () => {
    if (!formData.category || !formData.subcategory || !MASTER_DATA[formData.category]) return []
    const d = MASTER_DATA[formData.category][formData.subcategory]
    return Array.isArray(d) ? d : (typeof d === 'object' ? Object.keys(d) : [])
  }

  const getDetails = () => {
    if (formData.category === 'கொலுசு') {
      return KOLUSU_VIVARAM
    }
    return []
  }

  const handleVariantChange = (variantVal) => {
    let autoWeight = formData.weight
    const match = variantVal.match(/\(([\d.]+)\s*g\)/)
    if (match && match[1]) {
      autoWeight = match[1]
    }
    setFormData(prev => ({
      ...prev,
      variant: variantVal,
      weight: autoWeight,
      detail: ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const subcat = formData.subcategory === '__other__' ? customSubcategory : formData.subcategory
    const variantName = formData.variant === '__other__' ? customVariant : formData.variant

    if (!formData.category || !subcat || !variantName) {
      alert('தயவுசெய்து பிரிவு, துணைப்பிரிவு மற்றும் மாடலை தேர்வு செய்யவும் (Please fill required fields)')
      return
    }

    setLoading(true)
    try {
      await onAddProduct({
        category: formData.category,
        subcategory: subcat,
        variant: variantName,
        detail: formData.detail || "",
        weight: parseFloat(formData.weight || 0),
        quantity: parseInt(formData.quantity || 1),
        customDate: new Date(formData.date).toISOString()
      })

      setFormData({ 
        category: '', subcategory: '', variant: '', detail: '', weight: '', quantity: '1',
        date: new Date().toLocaleString('sv-SE').slice(0, 16).replace(' ', 'T')
      })
      setCustomSubcategory('')
      setCustomVariant('')
      
      setSuccessMsg(`✅ "${variantName}" இருப்பு வெற்றிகரமாக சேர்க்கப்பட்டது! (Stock added successfully!)`)
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err) {
      alert('சேமிப்பதில் பிழை: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const availableSubs = getSubs()
  const availableVariants = getVariants()
  const availableDetails = getDetails()

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex-between mb-14">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>
            சரக்கு சேர்த்தல் (Add Stock)
          </h2>
          <p className="text-sub">Add new inventory items across all categories and subcategories</p>
        </div>
      </div>

      {/* Prominent Success Notification Banner */}
      {successMsg && (
        <div className="toast-success mb-14" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid #10B981', borderRadius: 10 }}>
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="card" style={{ padding: '20px 24px' }}>
        <div className="card-title">பொருள் விவரங்கள் (Product Entry Form)</div>

        <form onSubmit={handleSubmit}>
          {/* Row 1: Category & Subcategory */}
          <div className="form-grid" style={{ marginBottom: 14 }}>
            <div className="form-group">
              <label>1. முக்கியப் பிரிவு (Main Category) *</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({ ...formData, category: e.target.value, subcategory: '', variant: '', detail: '', weight: '' })} 
                required
              >
                <option value="">— பிரிவு தேர்வு செய்க (Select Category) —</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>2. துணைப் பிரிவு (Subcategory) *</label>
              {availableSubs.length > 0 ? (
                <select 
                  value={formData.subcategory} 
                  onChange={e => setFormData({ ...formData, subcategory: e.target.value, variant: '', detail: '', weight: '' })} 
                  disabled={!formData.category}
                  required
                >
                  <option value="">— துணைப்பிரிவு (Select Subcategory) —</option>
                  {availableSubs.map(s => <option key={s} value={s}>{s}</option>)}
                  <option value="__other__">+ புதிய துணைப்பிரிவு (Custom / Other)...</option>
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="துணைப்பிரிவு பெயர்..."
                  value={customSubcategory}
                  onChange={e => {
                    setCustomSubcategory(e.target.value)
                    setFormData({ ...formData, subcategory: '__other__' })
                  }}
                  disabled={!formData.category}
                  required
                />
              )}
            </div>
          </div>

          {formData.subcategory === '__other__' && (
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label>புதிய துணைப்பிரிவு பெயர் (Custom Subcategory Name) *</label>
              <input
                type="text"
                placeholder="எ.கா. பேன்சி பாம்பே வகை..."
                value={customSubcategory}
                onChange={e => setCustomSubcategory(e.target.value)}
                required
              />
            </div>
          )}

          {/* Row 2: Variant & Detail */}
          <div className="form-grid" style={{ marginBottom: 14 }}>
            <div className="form-group">
              <label>3. மாடல் / அளவு / பொருள் பெயர் (Variant / Size) *</label>
              {availableVariants.length > 0 ? (
                <select 
                  value={formData.variant} 
                  onChange={e => handleVariantChange(e.target.value)} 
                  disabled={!formData.subcategory}
                  required
                >
                  <option value="">— மாடல் / அளவு தேர்வு செய்க (Select Variant) —</option>
                  {availableVariants.map(v => <option key={v} value={v}>{v}</option>)}
                  <option value="__other__">+ புதிய மாடல் பெயர் (Custom / Other)...</option>
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="மாடல் பெயர் (e.g. 10.5 கொலுசு)..."
                  value={customVariant}
                  onChange={e => {
                    setCustomVariant(e.target.value)
                    setFormData({ ...formData, variant: '__other__' })
                  }}
                  disabled={!formData.subcategory}
                  required
                />
              )}
            </div>

            <div className="form-group">
              <label>4. கூடுதல் விவரம் / முத்து (Detail / Pearls)</label>
              {availableDetails.length > 0 ? (
                <select 
                  value={formData.detail} 
                  onChange={e => setFormData({ ...formData, detail: e.target.value })}
                >
                  <option value="">— முத்து / விவரம் தேர்வு செய்க (Select Detail) —</option>
                  {availableDetails.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="விவரம் (e.g. 1 முத்து, சிங்கிள் பட்டி...)"
                  value={formData.detail}
                  onChange={e => setFormData({ ...formData, detail: e.target.value })}
                />
              )}
            </div>
          </div>

          {formData.variant === '__other__' && (
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label>புதிய மாடல் பெயர் (Custom Variant Name) *</label>
              <input
                type="text"
                placeholder="எ.கா. ஸ்பெஷல் கொலுசு..."
                value={customVariant}
                onChange={e => setCustomVariant(e.target.value)}
                required
              />
            </div>
          )}

          {/* Row 3: Weight, Quantity & Date */}
          <div className="form-grid" style={{ marginBottom: 18 }}>
            <div className="form-group">
              <label>5. எடை (Unit Weight in g)</label>
              <input 
                type="number" 
                step="0.001" 
                min="0"
                placeholder="0.000"
                value={formData.weight}
                onChange={e => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>6. எண்ணிக்கை (Quantity in pcs) *</label>
              <input 
                type="number" 
                min="1"
                placeholder="1"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                required 
              />
            </div>

            <div className="form-group">
              <label>7. தேதி & நேரம் (Date & Time) *</label>
              <input 
                type="datetime-local" 
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                required 
              />
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <button type="submit" className="btn btn-gold btn-full btn-lg" disabled={loading} style={{ height: '46px', fontSize: '15px' }}>
              <Plus size={18} /> {loading ? 'சேமிக்கப்படுகிறது...' : '+ இருப்பில் சேர் (Add Stock)'}
            </button>
          </div>
        </form>
      </div>
      
      <div style={{ marginTop: 12, background: 'rgba(229,184,105,0.06)', border: '1px dashed var(--gold)', padding: 10, borderRadius: 10 }}>
        <p style={{ fontSize: '11.5px', color: 'var(--text-sub)', textAlign: 'center', margin: 0 }}>
          💡 <strong>குறிப்பு:</strong> அனைத்துப் பிரிவுகள் (கொலுசு, கொடி, மெட்டி, தண்டை, கம்மல், செயின், வளையல், பாத்திரங்கள்) அனைத்திற்கும் எளிதாக சரக்கு சேர்க்கலாம்.
        </p>
      </div>
    </div>
  )
}

export default AddStock
