import React, { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

const OldBuyback = ({ buybacks = [], onAddBuyback, onDeleteBuyback }) => {
  const [customerName, setCustomerName] = useState('')
  const [mobile, setMobile]             = useState('')
  const [itemName, setItemName]         = useState('')
  const [weight, setWeight]             = useState('')
  const [amount, setAmount]             = useState('')
  const [detail, setDetail]             = useState('')
  const [loading, setLoading]           = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!itemName || !weight || !amount) return
    setLoading(true)

    try {
      await onAddBuyback({
        customerName: customerName || 'Walk-in Customer',
        mobile,
        itemName,
        weight: parseFloat(weight),
        amount: parseFloat(amount),
        detail,
        date: new Date().toISOString().split('T')[0]
      })
      setCustomerName('')
      setMobile('')
      setItemName('')
      setWeight('')
      setAmount('')
      setDetail('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const totalBuybackAmount = buybacks.reduce((s, b) => s + (b.amount || 0), 0)
  const totalBuybackWeight = buybacks.reduce((s, b) => s + (b.weight || 0), 0)

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      <div className="flex-between mb-16">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>
            பழைய நகை கொள்முதல் (Old Item Buyback)
          </h2>
          <p className="text-sub">
            மொத்த கொள்முதல்: <strong style={{ color: 'var(--text-main)' }}>{totalBuybackWeight.toFixed(3)}g</strong> | மதிப்பு: <strong style={{ color: 'var(--text-main)' }}>₹{totalBuybackAmount.toLocaleString('en-IN')}</strong>
          </p>
        </div>
      </div>

      <div className="layout-split-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 20, alignItems: 'start' }}>
        {/* Form */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <div className="card-title" style={{ fontSize: '15px', marginBottom: 14 }}>
            1. கொள்முதல் பதிவு (Add Old Item Entry)
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div className="form-group">
                <label>வாடிக்கையாளர் பெயர் (Name)</label>
                <input
                  type="text"
                  placeholder="வாடிக்கையாளர் பெயர்"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>தொலைபேசி (Mobile No)</label>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 12 }}>
              <label>பொருள் பெயர் (Item Description) *</label>
              <input
                type="text"
                placeholder="எ.கா. பழைய வெள்ளி கொலுசு, சங்கிலி..."
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div className="form-group">
                <label>எடை (Weight in g) *</label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="0.000"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>தொகை (Amount Paid ₹) *</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 18 }}>
              <label>கூடுதல் விவரம் (Note / Detail)</label>
              <input
                type="text"
                placeholder="குறிப்புகள்..."
                value={detail}
                onChange={e => setDetail(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-gold btn-full btn-lg" disabled={loading} style={{ height: '46px', fontSize: '15px', fontWeight: 800 }}>
              <Plus size={16} /> {loading ? 'பதிவாகிறது...' : '+ கொள்முதல் சேர் (Save Buyback)'}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div className="card-title" style={{ fontSize: '15px', margin: 0 }}>
              2. கொள்முதல் வரலாறு (Buyback Records)
            </div>
            <span className="badge badge-blue">{buybacks.length} பதிவுகள்</span>
          </div>

          {/* Desktop Table */}
          <div className="desktop-table-view">
            <div className="table-wrap" style={{ maxHeight: '380px', overflowY: 'auto' }}>
              <table style={{ width: '100%', minWidth: '420px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '75px', textAlign: 'left' }}>தேதி</th>
                    <th style={{ textAlign: 'left' }}>பொருள் / பெயர்</th>
                    <th style={{ width: '85px', textAlign: 'right' }}>எடை</th>
                    <th style={{ width: '85px', textAlign: 'right' }}>தொகை</th>
                    <th style={{ width: '45px', textAlign: 'center' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {buybacks.map((b, idx) => (
                    <tr key={b.id || idx}>
                      <td style={{ fontSize: 11.5, color: 'var(--text-sub)' }}>{b.date}</td>
                      <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <div className="fw-600" style={{ color: 'var(--text-main)', fontSize: '13px' }}>
                          {b.itemName}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-sub)' }}>
                          {b.customerName || 'Walk-in'} {b.detail ? `• ${b.detail}` : ''}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{b.weight ? `${b.weight.toFixed(3)}g` : '-'}</td>
                      <td style={{ textAlign: 'right' }} className="fw-700 text-gold">₹{b.amount?.toLocaleString('en-IN')}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="btn btn-danger-ghost" onClick={() => onDeleteBuyback && onDeleteBuyback(b.id)} title="நீக்கு" style={{ padding: '3px 6px' }}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {buybacks.length === 0 && (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: 36, color: 'var(--text-sub)' }}>பதிவுகள் எதுவும் இல்லை</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List */}
          <div className="mobile-card-list">
            {buybacks.map((b, idx) => (
              <div key={b.id || idx} className="mobile-item-card" style={{ padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div className="fw-700" style={{ fontSize: '14px', color: 'var(--text-main)' }}>{b.itemName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>{b.date}</div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-sub)', marginBottom: 6 }}>
                  👤 {b.customerName || 'Walk-in'} {b.detail ? `• ${b.detail}` : ''}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border)', paddingTop: 6 }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-sub)' }}>
                    எடை: <strong style={{ color: 'var(--text-main)' }}>{b.weight ? `${b.weight.toFixed(3)}g` : '-'}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#1A3D63' }}>₹{b.amount?.toLocaleString('en-IN')}</span>
                    <button className="btn btn-danger-ghost" onClick={() => onDeleteBuyback && onDeleteBuyback(b.id)} style={{ padding: '2px 6px', height: '26px' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {buybacks.length === 0 && (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-sub)' }}>
                பதிவுகள் எதுவும் இல்லை
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default OldBuyback
