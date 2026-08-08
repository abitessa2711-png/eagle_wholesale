import React, { useState } from 'react'
import { ShoppingBag, Plus, Trash2, AlertTriangle } from 'lucide-react'
import BillModal from './BillModal'

const SellDashboard = ({ products = [], processSale }) => {
  const [customerName, setCustomerName] = useState('')
  const [mobile, setMobile]             = useState('')
  const [goldRate, setGoldRate]         = useState('')
  const [silverRate, setSilverRate]     = useState('')
  const [oldSilverAmount, setOldSilverAmount] = useState('')
  const [oldGoldAmount, setOldGoldAmount]     = useState('')
  const [oldSilverWeight, setOldSilverWeight] = useState('')
  const [cart, setCart]                 = useState([])
  
  const [selectedProductId, setSelectedProductId] = useState('')
  const [sellQty, setSellQty]           = useState('1')
  const [sellWeight, setSellWeight]     = useState('')
  const [grossAmount, setGrossAmount]   = useState('')
  const [discount, setDiscount]         = useState('0')
  const [completedBill, setCompletedBill] = useState(null)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  const selectedProd = products.find(p => String(p.id) === String(selectedProductId))

  const existingCartQty = selectedProd
    ? cart.filter(i => String(i.productId) === String(selectedProd.id)).reduce((s, i) => s + (i.quantity || 0), 0)
    : 0

  const existingCartWeight = selectedProd
    ? cart.filter(i => String(i.productId) === String(selectedProd.id)).reduce((s, i) => s + (i.totalWeight || 0), 0)
    : 0

  const availQty = selectedProd ? Math.max(0, selectedProd.quantity - existingCartQty) : 0
  const availWeight = selectedProd ? Math.max(0, (selectedProd.quantity * (selectedProd.weight || 0)) - existingCartWeight) : 0

  const parsedQty = parseInt(sellQty) || 0
  const parsedWeight = parseFloat(sellWeight) || 0

  const isQtyOver = selectedProd && parsedQty > availQty
  const isWeightOver = selectedProd && parsedWeight > (availWeight + 0.0001)

  const handleProductChange = (prodId) => {
    setSelectedProductId(prodId)
    setError('')
    const prod = products.find(p => String(p.id) === String(prodId))
    if (prod) {
      const alreadyQty = cart.filter(i => String(i.productId) === String(prod.id)).reduce((s, i) => s + (i.quantity || 0), 0)
      const alreadyWt = cart.filter(i => String(i.productId) === String(prod.id)).reduce((s, i) => s + (i.totalWeight || 0), 0)
      const currentAvailWt = Math.max(0, (prod.quantity * (prod.weight || 0)) - alreadyWt)
      const qty = parseInt(sellQty) || 1
      const defaultWt = prod.weight ? Math.min(qty * prod.weight, currentAvailWt).toFixed(3) : ''
      setSellWeight(defaultWt)
    } else {
      setSellWeight('')
    }
  }

  const handleQtyChange = (qtyVal) => {
    setSellQty(qtyVal)
    setError('')
    if (selectedProd && selectedProd.weight) {
      const qty = parseInt(qtyVal) || 1
      const calculatedWt = (qty * selectedProd.weight)
      setSellWeight(Math.min(calculatedWt, availWeight).toFixed(3))
    }
  }

  const addToCart = () => {
    if (!selectedProductId) {
      setError('தயவுசெய்து பொருளைத் தேர்ந்தெடுக்கவும்')
      return
    }

    if (!selectedProd) return

    const qty = parseInt(sellQty) || 1
    const weightVal = parseFloat(sellWeight) || 0
    const gross = parseFloat(grossAmount) || 0
    const disc = parseFloat(discount) || 0

    if (qty <= 0) {
      setError('தயவுசெய்து செல்லுபடியாகும் எண்ணிக்கையை உள்ளிடவும்')
      return
    }

    if (qty > availQty) {
      setError(`இருப்பில் போதுமான எண்ணிக்கை இல்லை! (இருப்பில் உள்ள எண்ணிக்கை: ${availQty} pcs மட்டுமே)`)
      return
    }

    if (weightVal <= 0) {
      setError('தயவுசெய்து எடையை (Weight in Grams) உள்ளிடவும்')
      return
    }

    if (weightVal > (availWeight + 0.0001)) {
      setError(`இருப்பில் போதுமான எடை இல்லை! (இருப்பில் உள்ள மொத்த எடை: ${availWeight.toFixed(3)}g மட்டுமே)`)
      return
    }

    setError('')

    const itemTotal = Math.max(0, gross - disc)

    const cartItem = {
      productId: selectedProd.id,
      category: selectedProd.category,
      subcategory: selectedProd.subcategory,
      variant: selectedProd.variant,
      detail: selectedProd.detail,
      unitWeight: weightVal / Math.max(1, qty),
      totalWeight: weightVal,
      quantity: qty,
      totalAmount: gross,
      discountAmount: disc,
      total: itemTotal
    }

    setCart(prev => [...prev, cartItem])
    setSelectedProductId('')
    setSellQty('1')
    setSellWeight('')
    setGrossAmount('')
    setDiscount('0')
  }

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }

  const handleCheckout = async () => {
    if (cart.length === 0) return
    setLoading(true)
    setError('')

    try {
      const billData = await processSale(customerName, mobile, cart, goldRate, silverRate, oldSilverAmount, oldGoldAmount)
      setCompletedBill(billData)
      setCart([])
      setCustomerName('')
      setMobile('')
      setGoldRate('')
      setSilverRate('')
      setOldSilverAmount('')
      setOldGoldAmount('')
    } catch (err) {
      setError(err.message || 'விற்பனை செயலாக்கத்தில் பிழை')
    } finally {
      setLoading(false)
    }
  }

  const cartTotal = cart.reduce((s, i) => s + (i.total || 0), 0)
  const cartTotalWeight = cart.reduce((s, i) => s + (i.totalWeight || 0), 0)
  const cartTotalQty = cart.reduce((s, i) => s + (i.quantity || 0), 0)

  return (
    <div className="animate-fade-in">
      <div className="mb-16">
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>விற்பனை / பில் (Sell & Bill)</h2>
        <p className="text-sub">Eagle Silvers Wholesale Billing & Sales Entry</p>
      </div>

      {(error || isWeightOver || isQtyOver) && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          color: '#DC2626',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '13.5px',
          fontWeight: 700,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <AlertTriangle size={18} />
          <div>
            {isWeightOver
              ? `இருப்பில் போதுமான எடை இல்லை! (இருப்பில் இருப்பது: ${availWeight.toFixed(3)}g மட்டுமே — நீங்கள் உள்ளிட்டது: ${parsedWeight}g)`
              : isQtyOver
              ? `இருப்பில் போதுமான அளவு இல்லை! (இருப்பில் இருப்பது: ${availQty} pcs மட்டுமே — நீங்கள் உள்ளிட்டது: ${parsedQty} pcs)`
              : error}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Customer & Item Selection Form */}
        <div className="card">
          <div className="card-title">1. பொருள் தேர்வு (Select Item)</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div className="form-group">
              <label>வாடிக்கையாளர் பெயர் (Customer Name)</label>
              <input
                type="text"
                placeholder="பெயர் (e.g. மாரி)"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>செல்பேசி எண் (Mobile Number)</label>
              <input
                type="text"
                placeholder="9876543210"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div className="form-group">
              <label>இன்றைய தங்கம் விலை (Gold 1g ₹)</label>
              <input
                type="number"
                placeholder="எ.கா. 7250"
                value={goldRate}
                onChange={e => setGoldRate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>இன்றைய வெள்ளி விலை (Silver 1g ₹)</label>
              <input
                type="number"
                placeholder="எ.கா. 105"
                value={silverRate}
                onChange={e => setSilverRate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div className="form-group">
              <label>பழைய தங்கம் கழிப்பு (Old Gold Amount ₹)</label>
              <input
                type="number"
                placeholder="எ.கா. 2000"
                value={oldGoldAmount}
                onChange={e => setOldGoldAmount(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>பழைய வெள்ளி கழிப்பு (Old Silver Amount ₹)</label>
              <input
                type="number"
                placeholder="எ.கா. 1500"
                value={oldSilverAmount}
                onChange={e => setOldSilverAmount(e.target.value)}
              />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>இருப்பில் உள்ள பொருள் (Select Product) *</span>
                {selectedProd && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: (availWeight <= 0 || availQty <= 0) ? '#EF4444' : '#10B981' }}>
                    இருப்பு: {availQty} pcs | {availWeight.toFixed(3)}g
                  </span>
                )}
              </label>
              <select
                value={selectedProductId}
                onChange={e => handleProductChange(e.target.value)}
              >
                <option value="">பொருளைத் தேர்ந்தெடுக்கவும்...</option>
                {products.filter(p => p.quantity > 0).map(p => {
                  const itemInCartWt = cart.filter(i => String(i.productId) === String(p.id)).reduce((s, i) => s + (i.totalWeight || 0), 0)
                  const itemInCartQty = cart.filter(i => String(i.productId) === String(p.id)).reduce((s, i) => s + (i.quantity || 0), 0)
                  const remQty = Math.max(0, p.quantity - itemInCartQty)
                  const remWt = Math.max(0, (p.quantity * (p.weight || 0)) - itemInCartWt)
                  return (
                    <option key={p.id} value={p.id} disabled={remQty <= 0 || remWt <= 0}>
                      {p.variant} ({p.category}) — இருப்பு: {remQty} pcs | {remWt.toFixed(2)}g
                    </option>
                  )
                })}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
              <div className="form-group">
                <label style={{ fontSize: '11.5px' }}>எண்ணிக்கை (Qty)</label>
                <input
                  type="number"
                  value={sellQty}
                  onChange={e => handleQtyChange(e.target.value)}
                  min="1"
                  max={availQty || 1}
                  style={{ borderColor: isQtyOver ? '#EF4444' : undefined }}
                />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '11.5px', color: isWeightOver ? '#EF4444' : undefined }}>
                  எடை (Weight g) *
                </label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="0.000"
                  value={sellWeight}
                  onChange={e => { setSellWeight(e.target.value); setError(''); }}
                  style={{ borderColor: isWeightOver ? '#EF4444' : undefined }}
                />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '11.5px' }}>மொத்த விலை (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 20200"
                  value={grossAmount}
                  onChange={e => setGrossAmount(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '11.5px' }}>தள்ளுபடி (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 200"
                  value={discount}
                  onChange={e => setDiscount(e.target.value)}
                />
              </div>
            </div>

            <button
              className="btn btn-gold btn-full"
              onClick={addToCart}
              disabled={isWeightOver || isQtyOver}
              style={{ opacity: (isWeightOver || isQtyOver) ? 0.6 : 1, cursor: (isWeightOver || isQtyOver) ? 'not-allowed' : 'pointer' }}
            >
              <Plus size={16} /> பட்டியலில் சேர் (Add to Cart)
            </button>
          </div>
        </div>

        {/* Cart & Billing Summary */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-title">2. விற்பனைப் பட்டியல் (Cart List)</div>

            <div className="table-wrap" style={{ maxHeight: '260px', overflowY: 'auto' }}>
              <table style={{ width: '100%', tableLayout: 'fixed' }}>
                <thead>
                  <tr>
                    <th style={{ width: '26%', textAlign: 'left' }}>ITEM</th>
                    <th style={{ width: '10%', textAlign: 'center' }}>QTY</th>
                    <th style={{ width: '15%', textAlign: 'right' }}>WT (g)</th>
                    <th style={{ width: '18%', textAlign: 'right' }}>GROSS</th>
                    <th style={{ width: '13%', textAlign: 'right' }}>DISC</th>
                    <th style={{ width: '18%', textAlign: 'right' }}>NET TOTAL</th>
                    <th style={{ width: '32px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <div className="fw-600" style={{ color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.variant}</div>
                      </td>
                      <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{item.totalWeight?.toFixed(3)}g</td>
                      <td style={{ textAlign: 'right' }}>₹{item.totalAmount}</td>
                      <td style={{ textAlign: 'right', color: '#EF4444' }}>-₹{item.discountAmount}</td>
                      <td style={{ textAlign: 'right' }} className="fw-700 text-gold">
                        ₹{item.total.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <button
                          className="btn-danger-ghost"
                          onClick={() => removeFromCart(idx)}
                          style={{ padding: 4 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cart.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-sub)' }}>
                        கார்ட்டில் பொருட்கள் எதுவும் இல்லை
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-sub)', marginBottom: 4 }}>
              <span>மொத்த எண்ணிக்கை (Total Qty):</span>
              <span className="fw-600" style={{ color: 'var(--text-main)' }}>{cartTotalQty} pcs</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-sub)', marginBottom: 8 }}>
              <span>மொத்த விற்பனை எடை (Total Weight):</span>
              <span className="fw-600" style={{ color: 'var(--text-main)' }}>{cartTotalWeight.toFixed(3)} g</span>
            </div>

            {(parseFloat(oldGoldAmount) || 0) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#EF4444', marginBottom: 8 }}>
                <span>பழைய தங்கம் கழிப்பு (Less Old Gold):</span>
                <span className="fw-600">-₹{parseFloat(oldGoldAmount).toLocaleString('en-IN')}</span>
              </div>
            )}

            {(parseFloat(oldSilverAmount) || 0) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#EF4444', marginBottom: 8 }}>
                <span>பழைய வெள்ளி கழிப்பு (Less Old Silver):</span>
                <span className="fw-600">-₹{parseFloat(oldSilverAmount).toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex-between mb-16">
              <span className="fw-700" style={{ fontSize: '15px' }}>மொத்தத் தொகை (Grand Total):</span>
              <span className="stat-value" style={{ fontSize: '26px', margin: 0, color: 'var(--primary)' }}>
                ₹{Math.max(0, cartTotal - (parseFloat(oldGoldAmount) || 0) - (parseFloat(oldSilverAmount) || 0)).toLocaleString('en-IN')}
              </span>
            </div>

            <button
              className="btn btn-gold btn-full btn-lg"
              onClick={handleCheckout}
              disabled={cart.length === 0 || loading}
            >
              <ShoppingBag size={18} />
              {loading ? 'பில் உருவாகிறது...' : 'பில் உருவாக்கு & அச்சடி (Complete Sale & Print)'}
            </button>
          </div>
        </div>
      </div>

      {completedBill && (
        <BillModal bill={completedBill} onClose={() => setCompletedBill(null)} />
      )}
    </div>
  )
}

export default SellDashboard
