import React, { useState } from 'react'
import { ShoppingBag, Plus, Trash2, AlertTriangle, Printer, Search } from 'lucide-react'
import BillModal from './BillModal'

const SellDashboard = ({ products = [], processSale }) => {
  const [customerName, setCustomerName] = useState('')
  const [mobile, setMobile]             = useState('')
  const [goldRate, setGoldRate]         = useState('')
  const [silverRate, setSilverRate]     = useState('')
  const [oldGoldWeight, setOldGoldWeight] = useState('')
  const [oldGoldAmount, setOldGoldAmount] = useState('')
  const [oldSilverWeight, setOldSilverWeight] = useState('')
  const [oldSilverAmount, setOldSilverAmount] = useState('')
  const [cart, setCart]                 = useState([])
  
  const [weightFilter, setWeightFilter] = useState('')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [sellQty, setSellQty]           = useState('1')
  const [sellWeight, setSellWeight]     = useState('')
  const [grossAmount, setGrossAmount]   = useState('')
  const [discount, setDiscount]         = useState('0')
  const [completedBill, setCompletedBill] = useState(null)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  const selectedProd = products.find(p => String(p.id) === String(selectedProductId))
  const isKodi = selectedProd?.category === 'கொடி'

  const existingCartQty = selectedProd
    ? cart.filter(i => String(i.productId) === String(selectedProd.id)).reduce((s, i) => s + (i.quantity || 0), 0)
    : 0

  const existingCartWeight = selectedProd
    ? cart.filter(i => String(i.productId) === String(selectedProd.id)).reduce((s, i) => s + (i.totalWeight || 0), 0)
    : 0

  const availWeight = selectedProd ? Math.max(0, (selectedProd.weight || 0) - existingCartWeight) : 0
  const availQty = selectedProd 
    ? (isKodi ? (availWeight > 0.001 ? 1 : 0) : Math.max(0, selectedProd.quantity - existingCartQty))
    : 0

  const parsedQty = parseInt(sellQty) || 0
  const parsedWeight = parseFloat(sellWeight) || 0

  const isQtyOver = !isKodi && selectedProd && parsedQty > availQty
  const isWeightOver = selectedProd && parsedWeight > (availWeight + 0.0001)

  const handleProductChange = (prodId) => {
    setSelectedProductId(prodId)
    setError('')
    setSellWeight('') // Strictly manual typing
  }

  const handleQtyChange = (qtyVal) => {
    setSellQty(qtyVal)
    setError('')
  }

  // Weight & Name Matching Search Filter
  const searchMatchedProducts = products.filter(p => {
    if ((p.weight || 0) <= 0.001) return false
    if (!weightFilter.trim()) return true

    const term = weightFilter.trim().toLowerCase()
    const matchName = p.variant?.toLowerCase().includes(term) ||
                      p.category?.toLowerCase().includes(term) ||
                      p.subcategory?.toLowerCase().includes(term) ||
                      p.detail?.toLowerCase().includes(term)
    
    const weightStr = (p.weight || 0).toString()
    const matchWeight = weightStr.includes(term) || (p.variant && p.variant.toLowerCase().includes(term))

    return matchName || matchWeight
  })

  const addToCart = () => {
    if (!selectedProductId) {
      setError('தயவுசெய்து பொருளைத் தேர்ந்தெடுக்கவும் (Please select product)')
      return
    }

    if (!selectedProd) return

    const qty = isKodi ? 1 : (parseInt(sellQty) || 1)
    const weightVal = parseFloat(sellWeight) || 0
    const gross = parseFloat(grossAmount) || 0
    const disc = parseFloat(discount) || 0

    if (!isKodi && qty <= 0) {
      setError('தயவுசெய்து சரியான எண்ணிக்கையை உள்ளிடவும் (Enter valid quantity)')
      return
    }

    if (!isKodi && qty > availQty) {
      setError(`இருப்பில் போதுமான எண்ணிக்கை இல்லை! (இருப்பில்: ${availQty} pcs மட்டுமே)`)
      return
    }

    if (weightVal <= 0) {
      setError('தயவுசெய்து விற்பனை எடையை (Sale / Cut Weight in g) உள்ளிடவும்')
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
      isKodi: isKodi,
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
    setWeightFilter('')
  }

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }

  const handleCheckout = async () => {
    if (cart.length === 0) return
    setLoading(true)
    setError('')

    try {
      const billData = await processSale(customerName, mobile, cart, goldRate, silverRate, oldSilverAmount, oldSilverWeight, oldGoldAmount, oldGoldWeight)
      setCompletedBill(billData)
      setCart([])
      setCustomerName('')
      setMobile('')
      setGoldRate('')
      setSilverRate('')
      setOldGoldWeight('')
      setOldGoldAmount('')
      setOldSilverWeight('')
      setOldSilverAmount('')
      setWeightFilter('')
    } catch (err) {
      setError(err.message || 'விற்பனை செயலாக்கத்தில் பிழை')
    } finally {
      setLoading(false)
    }
  }

  const cartTotal = cart.reduce((s, i) => s + (i.total || 0), 0)
  const cartTotalWeight = cart.reduce((s, i) => s + (i.totalWeight || 0), 0)
  const cartTotalQty = cart.reduce((s, i) => s + (i.quantity || 0), 0)
  const grandTotal = Math.max(0, cartTotal - (parseFloat(oldGoldAmount) || 0) - (parseFloat(oldSilverAmount) || 0))

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      <div className="flex-between mb-16">
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>
            விற்பனை &amp; பில்லிங் (Sales &amp; POS)
          </h2>
          <p className="text-sub">Wholesale Billing, Metal Deductions &amp; Real-time Stock Deduction</p>
        </div>
      </div>

      {error && (
        <div className="toast-error mb-14" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(239,68,68,0.12)', color: '#EF4444', border: '1px solid #EF4444', borderRadius: 10 }}>
          <AlertTriangle size={18} />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{error}</span>
        </div>
      )}

      <div className="layout-split-grid">
        {/* Left Card: Customer, Metal Rates & Product Addition */}
        <div className="card" style={{ padding: '18px 20px', width: '100%', boxSizing: 'border-box' }}>
          
          {/* Section 1: Customer Details */}
          <div className="card-title" style={{ fontSize: '14.5px', marginBottom: 12 }}>
            1. வாடிக்கையாளர் விபரம் (Customer Details)
          </div>
          <div className="responsive-grid-2" style={{ marginBottom: 14 }}>
            <div className="form-group">
              <label>வாடிக்கையாளர் பெயர் (Customer Name)</label>
              <input
                type="text"
                placeholder="எ.கா. மாரி / அன்வர் டிரேடர்ஸ்"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>தொலைபேசி எண் (Mobile No)</label>
              <input
                type="tel"
                placeholder="98765 43210"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
              />
            </div>
          </div>

          {/* Section 2: Today's Rates & Old Metals */}
          <div className="card-title" style={{ fontSize: '14.5px', marginBottom: 12, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            2. இன்றைய விலை &amp; பழைய நகை கழிவு (Rates &amp; Deductions)
          </div>
          
          <div className="responsive-grid-2" style={{ marginBottom: 12 }}>
            <div className="form-group">
              <label>இன்றைய தங்கம் விலை (Gold Rate ₹/g)</label>
              <input
                type="number"
                placeholder="எ.கா. 7200"
                value={goldRate}
                onChange={e => setGoldRate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>இன்றைய வெள்ளி விலை (Silver Rate ₹/g)</label>
              <input
                type="number"
                placeholder="எ.கா. 90"
                value={silverRate}
                onChange={e => setSilverRate(e.target.value)}
              />
            </div>
          </div>

          <div className="responsive-grid-2" style={{ marginBottom: 12 }}>
            <div className="form-group">
              <label>பழைய தங்கம் எடை (Old Gold Wt g)</label>
              <input
                type="number"
                step="0.001"
                placeholder="0.000"
                value={oldGoldWeight}
                onChange={e => setOldGoldWeight(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>பழைய தங்கம் கழிப்பு (Old Gold Less ₹)</label>
              <input
                type="number"
                placeholder="0"
                value={oldGoldAmount}
                onChange={e => setOldGoldAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="responsive-grid-2" style={{ marginBottom: 14 }}>
            <div className="form-group">
              <label>பழைய வெள்ளி எடை (Old Silver Wt g)</label>
              <input
                type="number"
                step="0.001"
                placeholder="0.000"
                value={oldSilverWeight}
                onChange={e => setOldSilverWeight(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>பழைய வெள்ளி கழிப்பு (Old Silver Less ₹)</label>
              <input
                type="number"
                placeholder="0"
                value={oldSilverAmount}
                onChange={e => setOldSilverAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Section 3: Product Selection & Weight Search */}
          <div className="card-title" style={{ fontSize: '14.5px', marginBottom: 12, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            3. பொருள் சேர்த்தல் (Add Product to Bill)
          </div>

          {/* Instant Weight & Name Search Filter */}
          <div className="form-group" style={{ marginBottom: 12 }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Search size={14} /> எடை அல்லது பெயர் மூலம் தேடுக (Search by Weight g / Name)
            </label>
            <input
              type="text"
              placeholder="எ.கா. 1.5, 30, 600, கொலுசு, 1 inch 1.500g..."
              value={weightFilter}
              onChange={e => setWeightFilter(e.target.value)}
              style={{ borderColor: weightFilter ? 'var(--gold)' : undefined, height: '38px', fontSize: '13px' }}
            />
          </div>

          {/* Quick Click Search Results */}
          {weightFilter.trim() && (
            <div style={{ maxHeight: '160px', overflowY: 'auto', marginBottom: 12, border: '1px solid rgba(200, 169, 106, 0.3)', borderRadius: 8, padding: 6, background: 'rgba(26, 61, 99, 0.08)' }}>
              <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 700, marginBottom: 6, paddingLeft: 4 }}>
                பொருந்திய பொருட்கள் ({searchMatchedProducts.length} items found):
              </div>
              {searchMatchedProducts.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    handleProductChange(p.id)
                    setWeightFilter('')
                  }}
                  style={{
                    padding: '7px 10px',
                    borderRadius: 6,
                    background: String(selectedProductId) === String(p.id) ? 'rgba(200, 169, 106, 0.25)' : 'var(--card)',
                    border: '1px solid var(--border)',
                    marginBottom: 4,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  className="hover-highlight"
                >
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)' }}>{p.variant}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-sub)', marginLeft: 6 }}>({p.category})</span>
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: 700, color: 'var(--gold)', fontSize: '12.5px' }}>
                    {p.category === 'கொடி' ? `1 pc | ${p.weight?.toFixed(3)}g` : `${p.quantity} pcs | ${p.weight?.toFixed(3)}g`}
                  </div>
                </div>
              ))}
              {searchMatchedProducts.length === 0 && (
                <div style={{ fontSize: '12px', color: 'var(--text-sub)', textAlign: 'center', padding: 8 }}>
                  பொருந்திய பொருட்கள் எதுவும் இல்லை
                </div>
              )}
            </div>
          )}

          {/* Product Dropdown Select */}
          <div className="form-group" style={{ marginBottom: 12 }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
              <span>இருப்பில் உள்ள பொருள் (Select Product) *</span>
              {selectedProd && (
                <span style={{ fontSize: 11, fontWeight: 700, color: (availWeight <= 0) ? '#EF4444' : '#10B981' }}>
                  {isKodi 
                    ? `இருப்பு: 1 pc | ${availWeight.toFixed(3)}g (கொடி ரோல்)` 
                    : `இருப்பு: ${availQty} pcs | ${availWeight.toFixed(3)}g`}
                </span>
              )}
            </label>
            <select
              value={selectedProductId}
              onChange={e => handleProductChange(e.target.value)}
            >
              <option value="">— பொருளைத் தேர்ந்தெடுக்கவும் —</option>
              {searchMatchedProducts.map(p => {
                const itemInCartWt = cart.filter(i => String(i.productId) === String(p.id)).reduce((s, i) => s + (i.totalWeight || 0), 0)
                const itemInCartQty = cart.filter(i => String(i.productId) === String(p.id)).reduce((s, i) => s + (i.quantity || 0), 0)
                const remQty = Math.max(0, p.quantity - itemInCartQty)
                const remWt = Math.max(0, (p.weight || 0) - itemInCartWt)
                const isK = p.category === 'கொடி'
                return (
                  <option key={p.id} value={p.id} disabled={remWt <= 0.001}>
                    {p.variant} ({p.category}) — {isK ? `1 pc | ${remWt.toFixed(2)}g ரோல்` : `இருப்பு: ${remQty} pcs | ${remWt.toFixed(2)}g`}
                  </option>
                )
              })}
            </select>
          </div>

          <div className="responsive-grid-2" style={{ marginBottom: 12 }}>
            {isKodi ? (
              <div className="form-group">
                <label>விற்பனை உருப்படி (Item)</label>
                <input
                  type="text"
                  value="1 pc (கொடி ரோல் - எடை கட்)"
                  disabled
                  style={{ background: 'rgba(200, 169, 106, 0.08)', color: 'var(--gold)', fontWeight: 700 }}
                />
              </div>
            ) : (
              <div className="form-group">
                <label>எண்ணிக்கை (Sale Qty pcs) *</label>
                <input
                  type="number"
                  value={sellQty}
                  onChange={e => handleQtyChange(e.target.value)}
                  min="1"
                  max={availQty || 1}
                  style={{ borderColor: isQtyOver ? '#EF4444' : undefined }}
                />
              </div>
            )}

            <div className="form-group">
              <label style={{ color: isWeightOver ? '#EF4444' : undefined }}>
                {isKodi ? 'கட் செய்து தரும் எடை (Cut Weight in g) *' : 'விற்பனை எடை (Sale Weight in g) *'}
              </label>
              <input
                type="number"
                step="0.001"
                placeholder="எ.கா. 150.000"
                value={sellWeight}
                onChange={e => { setSellWeight(e.target.value); setError(''); }}
                style={{ borderColor: isWeightOver ? '#EF4444' : undefined }}
              />
            </div>
          </div>

          <div className="responsive-grid-2" style={{ marginBottom: 14 }}>
            <div className="form-group">
              <label>மொத்த விலை (Gross Amount ₹) *</label>
              <input
                type="number"
                placeholder="எ.கா. 13500"
                value={grossAmount}
                onChange={e => setGrossAmount(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>தள்ளுபடி (Discount ₹)</label>
              <input
                type="number"
                placeholder="0"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
              />
            </div>
          </div>

          <button
            className="btn btn-gold btn-full btn-lg"
            onClick={addToCart}
            disabled={isWeightOver || isQtyOver}
            style={{ height: '44px', fontSize: '14.5px', fontWeight: 700, opacity: (isWeightOver || isQtyOver) ? 0.6 : 1, cursor: (isWeightOver || isQtyOver) ? 'not-allowed' : 'pointer' }}
          >
            <Plus size={18} /> + பட்டியலில் சேர் (Add Item to Bill)
          </button>
        </div>

        {/* Right Card: Cart Summary & Checkout */}
        <div className="card" style={{ padding: '18px 20px', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-title" style={{ fontSize: '14.5px', marginBottom: 12 }}>
              4. விற்பனைப் பட்டியல் (Cart &amp; Billing Items)
            </div>

            {/* Desktop Table for Cart */}
            <div className="table-wrap" style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: 14 }}>
              <table style={{ width: '100%', minWidth: '360px' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', width: '38%' }}>பொருள்</th>
                    <th style={{ textAlign: 'center', width: '14%' }}>அளவு</th>
                    <th style={{ textAlign: 'right', width: '22%' }}>எடை</th>
                    <th style={{ textAlign: 'right', width: '26%' }}>தொகை (₹)</th>
                    <th style={{ width: '30px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <div className="fw-600" style={{ color: 'var(--text-main)', fontSize: '13px' }}>{item.variant}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>{item.category}</div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>
                        {item.isKodi ? '1 pc' : `${item.quantity} pcs`}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{item.totalWeight?.toFixed(3)}g</td>
                      <td style={{ textAlign: 'right' }} className="fw-700 text-gold">
                        ₹{item.total.toLocaleString('en-IN')}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="btn btn-danger-ghost"
                          onClick={() => removeFromCart(idx)}
                          style={{ padding: '4px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cart.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-sub)' }}>
                        கார்ட்டில் பொருட்கள் எதுவும் இல்லை
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cart Calculations Summary Box */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-sub)', marginBottom: 4 }}>
              <span>மொத்த பொருட்கள் (Total Items):</span>
              <span className="fw-600" style={{ color: 'var(--text-main)' }}>{cartTotalQty} pcs</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-sub)', marginBottom: 5 }}>
              <span>மொத்த விற்பனை எடை (Total Weight):</span>
              <span className="fw-600" style={{ color: 'var(--text-main)' }}>{cartTotalWeight.toFixed(3)} g</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-sub)', marginBottom: 5 }}>
              <span>பொருட்கள் மொத்தம் (Gross Total):</span>
              <span className="fw-600" style={{ color: 'var(--text-main)' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>

            {(parseFloat(oldGoldAmount) || 0) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#EF4444', marginBottom: 5 }}>
                <span>பழைய தங்கம் கழிப்பு (Old Gold {oldGoldWeight ? `[${oldGoldWeight}g]` : ''}):</span>
                <span className="fw-700">-₹{parseFloat(oldGoldAmount).toLocaleString('en-IN')}</span>
              </div>
            )}

            {(parseFloat(oldSilverAmount) || 0) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#EF4444', marginBottom: 5 }}>
                <span>பழைய வெள்ளி கழிப்பு (Old Silver {oldSilverWeight ? `[${oldSilverWeight}g]` : ''}):</span>
                <span className="fw-700">-₹{parseFloat(oldSilverAmount).toLocaleString('en-IN')}</span>
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(200, 169, 106, 0.12)',
              border: '1.5px solid var(--gold)',
              borderRadius: 10,
              padding: '10px 12px',
              marginTop: 8,
              marginBottom: 12
            }}>
              <div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>நிகர பில் தொகை</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>NET GRAND TOTAL</div>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>
                ₹{grandTotal.toLocaleString('en-IN')}
              </div>
            </div>

            <button
              className="btn btn-gold btn-full btn-lg"
              disabled={cart.length === 0 || loading}
              onClick={handleCheckout}
              style={{ height: '46px', fontSize: '14.5px', fontWeight: 800 }}
            >
              <Printer size={18} /> {loading ? 'செயலாக்கப்படுகிறது...' : 'விற்பனை முடி & பில் அச்சடி (Complete & Print Bill)'}
            </button>
          </div>
        </div>
      </div>

      {completedBill && (
        <BillModal
          bill={completedBill}
          onClose={() => setCompletedBill(null)}
        />
      )}
    </div>
  )
}

export default SellDashboard
