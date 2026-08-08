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
    <div className="animate-fade-in">
      <div className="flex-between mb-16">
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>பழைய நகை கொள்முதல் (Old Item Buyback)</h2>
          <p className="text-sub">Total Buyback: {totalBuybackWeight.toFixed(2)}g | ₹{totalBuybackAmount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="layout-split-grid">
        {/* Form */}
        <div className="card">
          <div className="card-title">கொள்முதல் பதிவு (Add Old Item Buyback)</div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
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
                <label>செல் (Mobile No)</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label>பொருள் பெயர் (Item Description) *</label>
              <input
                type="text"
                placeholder="எ.கா. பழைய வெள்ளி கொலுசு, சங்கிலி..."
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
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

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>கூடுதல் விவரம் (Note / Detail)</label>
              <input
                type="text"
                placeholder="குறிப்பு..."
                value={detail}
                onChange={e => setDetail(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-gold btn-full" disabled={loading}>
              <Plus size={16} /> {loading ? 'பதிவாகிறது...' : 'கொள்முதல் சேர் (Save Buyback)'}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>
              கொள்முதல் வரலாறு (Buyback History)
            </div>
            <span className="badge badge-blue">{buybacks.length} பதிவுகள்</span>
          </div>

          <div className="table-wrap">
            <table style={{ width: '100%', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ width: '20%', textAlign: 'left' }}>தேதி (DATE)</th>
                  <th style={{ width: '34%', textAlign: 'left' }}>பொருள் / வாடிக்கையாளர்</th>
                  <th style={{ width: '20%', textAlign: 'right' }}>எடை (WEIGHT)</th>
                  <th style={{ width: '18%', textAlign: 'right' }}>தொகை (AMOUNT)</th>
                  <th style={{ width: '8%', textAlign: 'center' }}></th>
                </tr>
              </thead>
              <tbody>
                {buybacks.map((b, idx) => (
                  <tr key={b.id || idx}>
                    <td style={{ fontSize: 12, color: 'var(--text-sub)' }}>{b.date}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <div className="fw-600" style={{ color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {b.itemName}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-sub)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {b.customerName || 'Walk-in'} {b.mobile ? `(${b.mobile})` : ''} {b.detail ? `• ${b.detail}` : ''}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{b.weight ? `${b.weight}g` : '-'}</td>
                    <td style={{ textAlign: 'right' }} className="fw-700 text-gold">₹{b.amount?.toLocaleString('en-IN')}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn-danger-ghost" onClick={() => onDeleteBuyback && onDeleteBuyback(b.id)} title="நீக்கு">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
                {buybacks.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: 36, color: 'var(--text-sub)' }}>பதிவுகள் இல்லை</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OldBuyback
