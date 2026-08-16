import React, { useState, useEffect } from 'react'
import { ShoppingBag, Plus, Trash2, AlertTriangle, Printer, Search } from 'lucide-react'
import BillModal from './BillModal'

const SellDashboard = ({ products = [], processSale }) => {
  const [customerName, setCustomerName] = useState('')
  const [mobile, setMobile]             = useState('')
  const [goldRate, setGoldRate]         = useState('')
  const [silverRate, setSilverRate]     = useState('')
  const [oldGoldAmount, setOldGoldAmount] = useState('')
  const [oldSilverAmount, setOldSilverAmount] = useState('')
  const [cart, setCart]                 = useState([])
  
  // Step-by-step Category / Subcategory / Variant / Detail Filters (like AddStock)
  const [filterCat, setFilterCat]       = useState('')
  const [filterSubcat, setFilterSubcat] = useState('')
  const [filterVariant, setFilterVariant] = useState('')
  const [filterDetail, setFilterDetail] = useState('')
  
  const [weightFilter, setWeightFilter] = useState('')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [sellQty, setSellQty]           = useState('1')
  const [sellWeight, setSellWeight]     = useState('')
  const [grossAmount, setGrossAmount]   = useState('')
  const [discount, setDiscount]         = useState('0')
  const [completedBill, setCompletedBill] = useState(null)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  // In-stock products with remaining weight > 0
  const availableStock = products.filter(p => (p.weight || 0) > 0.001)

  // Cascading Dropdown Options from current Stock
  const availableCats = [...new Set(availableStock.map(p => p.category).filter(Boolean))]

  const availableSubcats = filterCat
    ? [...new Set(availableStock.filter(p => p.category === filterCat).map(p => p.subcategory).filter(Boolean))]
    : []

  const availableVariants = filterCat
    ? [...new Set(availableStock.filter(p => p.category === filterCat && (!filterSubcat || p.subcategory === filterSubcat)).map(p => p.variant).filter(Boolean))]
    : []

  const availableDetails = (filterCat && filterVariant)
    ? [...new Set(availableStock.filter(p => p.category === filterCat && (!filterSubcat || p.subcategory === filterSubcat) && p.variant === filterVariant).map(p => p.detail).filter(Boolean))]
    : []

  // When step-by-step filters change, auto-match product
  useEffect(() => {
    if (filterCat && filterVariant) {
      const match = availableStock.find(p => 
        p.category === filterCat &&
        (!filterSubcat || p.subcategory === filterSubcat) &&
        p.variant === filterVariant &&
        (!filterDetail || p.detail === filterDetail)
      )
      if (match) {
        setSelectedProductId(match.id)
      } else {
        setSelectedProductId('')
      }
    }
  }, [filterCat, filterSubcat, filterVariant, filterDetail, products])

  const selectedProd = products.find(p => String(p.id) === String(selectedProductId))

  const existingCartQty = selectedProd
    ? cart.filter(i => String(i.productId) === String(selectedProd.id)).reduce((s, i) => s + (i.quantity || 0), 0)
    : 0

  const existingCartWeight = selectedProd
    ? cart.filter(i => String(i.productId) === String(selectedProd.id)).reduce((s, i) => s + (i.totalWeight || 0), 0)
    : 0

  const availWeight = selectedProd ? Math.max(0, (selectedProd.weight || 0) - existingCartWeight) : 0
  const availQty = selectedProd ? Math.max(0, (selectedProd.quantity || 1) - existingCartQty) : 0

  const parsedQty = parseInt(sellQty) || 0
  const parsedWeight = parseFloat(sellWeight) || 0

  const isQtyOver = selectedProd && parsedQty > availQty
  const isWeightOver = selectedProd && parsedWeight > (availWeight + 0.0001)

  const handleProductChange = (prodId) => {
    setSelectedProductId(prodId)
    const p = products.find(i => String(i.id) === String(prodId))
    if (p) {
      setFilterCat(p.category || '')
      setFilterSubcat(p.subcategory || '')
      setFilterVariant(p.variant || '')
      setFilterDetail(p.detail || '')
    }
    setError('')
    setSellWeight('')
  }

  const handleQtyChange = (qtyVal) => {
    setSellQty(qtyVal)
    setError('')
  }

  // Weight & Name Matching Search Filter
  const searchMatchedProducts = availableStock.filter(p => {
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
    if (!selectedProductId || !selectedProd) {
      setError('தயவுசெய்து பொருளைத் தேர்ந்தெடுக்கவும் (Please select product via filters or search)')
      return
    }

    const qty = parseInt(sellQty) || 1
    const weightVal = parseFloat(sellWeight) || 0
    const gross = parseFloat(grossAmount) || 0
    const disc = parseFloat(discount) || 0

    if (qty <= 0) {
      setError('தயவுசெய்து சரியான எண்ணிக்கையை உள்ளிடவும் (Enter valid quantity)')
      return
    }

    if (qty > availQty) {
      setError(`இருப்பில் போதுமான எண்ணிக்கை இல்லை! (இருப்பில்: ${availQty} pcs மட்டுமே)`)
      return
    }

    if (weightVal <= 0) {
      setError('தயவுசெய்து விற்பனை எடையை (Sale Weight in g) உள்ளிடவும்')
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
    setFilterCat('')
    setFilterSubcat('')
    setFilterVariant('')
    setFilterDetail('')
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
      const billData = await processSale(
        customerName,
        mobile,
        cart,
        goldRate,
        silverRate,
        oldSilverAmount,
        '', // oldSilverWeight removed
        oldGoldAmount,
        ''  // oldGoldWeight removed
      )
      setCompletedBill(billData)
      setCart([])
      setCustomerName('')
      setMobile('')
      setGoldRate('')
      setSilverRate('')
      setOldGoldAmount('')
      setOldSilverAmount('')
      setFilterCat('')
      setFilterSubcat('')
      setFilterVariant('')
      setFilterDetail('')
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
          <p className="text-sub">Wholesale Billing, Category-Wise Stock Filtering &amp; Real-time Deductions</p>
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

          {/* Section 2: Today's Rates & Old Metals Deductions (Weights Removed as requested) */}
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

          <div className="responsive-grid-2" style={{ marginBottom: 14 }}>
            <div className="form-group">
              <label>பழைய தங்கம் கழிப்பு (Old Gold Less ₹)</label>
              <input
                type="number"
                placeholder="0"
                value={oldGoldAmount}
                onChange={e => setOldGoldAmount(e.target.value)}
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

          {/* Section 3: Step-by-Step Product Selection (Exact structure like Add Stock) */}
          <div className="card-title" style={{ fontSize: '14.5px', marginBottom: 12, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            3. பொருள் சேர்த்தல் (Add Product to Bill)
          </div>

          {/* Quick Search Bar */}
          <div className="form-group" style={{ marginBottom: 12 }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Search size={14} /> விரைவுத் தேடல் (Quick Search by Weight g / Name)
            </label>
            <input
              type="text"
              placeholder="எ.கா. 1.5, 30, 600, கொலுசு, 10 inch..."
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
                    <span style={{ fontSize: '11px', color: 'var(--text-sub)', marginLeft: 6 }}>({p.category} {p.detail ? `• ${p.detail}` : ''})</span>
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: 700, color: 'var(--gold)', fontSize: '12.5px' }}>
                    {p.quantity} pcs | {p.weight?.toFixed(3)}g
                  </div>
                </div>
              ))}
              {searchMatchedProducts.length === 0 && (
                <div style={{ fontSize: '12px', color: 'var(--text-sub)', textAlign: 'center', padding: 8 }}>
                  பொருட்கள் எதுவும் இல்லை
                </div>
              )}
            </div>
          )}

          {/* Step 1 & 2: Category & Subcategory Filter Dropdowns */}
          <div className="responsive-grid-2" style={{ marginBottom: 12 }}>
            <div className="form-group">
              <label>1. முக்கியப் பிரிவு (Category) *</label>
              <select
                value={filterCat}
                onChange={e => {
                  setFilterCat(e.target.value)
                  setFilterSubcat('')
                  setFilterVariant('')
                  setFilterDetail('')
                  setSelectedProductId('')
                  setError('')
                }}
              >
                <option value="">— பிரிவு தேர்வு செய்க —</option>
                {availableCats.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>2. துணைப் பிரிவு (Subcategory)</label>
              <select
                value={filterSubcat}
                onChange={e => {
                  setFilterSubcat(e.target.value)
                  setFilterVariant('')
                  setFilterDetail('')
                  setSelectedProductId('')
                }}
                disabled={!filterCat || availableSubcats.length === 0}
              >
                <option value="">— அனைத்து துணைப்பிரிவுகள் —</option>
                {availableSubcats.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Step 3 & 4: Variant & Detail Filter Dropdowns */}
          <div className="responsive-grid-2" style={{ marginBottom: 12 }}>
            <div className="form-group">
              <label>3. மாடல் / அளவு (Variant / Size) *</label>
              <select
                value={filterVariant}
                onChange={e => {
                  setFilterVariant(e.target.value)
                  setFilterDetail('')
                  setError('')
                }}
                disabled={!filterCat || availableVariants.length === 0}
              >
                <option value="">— மாடல் / அளவு தேர்வு —</option>
                {availableVariants.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>4. கூடுதல் விபரம் / முத்து (Detail / Pearl)</label>
              <select
                value={filterDetail}
                onChange={e => {
                  setFilterDetail(e.target.value)
                  setError('')
                }}
                disabled={!filterVariant || availableDetails.length === 0}
              >
                <option value="">— அனைத்து விபரங்கள் —</option>
                {availableDetails.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Live Stock Status Banner */}
          {selectedProd ? (
            <div style={{
              background: availWeight > 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${availWeight > 0 ? '#10B981' : '#EF4444'}`,
              borderRadius: 8,
              padding: '8px 12px',
              marginBottom: 12,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 4
            }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                {selectedProd.variant} {selectedProd.detail ? `(${selectedProd.detail})` : ''}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: availWeight > 0 ? '#10B981' : '#EF4444' }}>
                இருப்பு: {availQty} pcs | {availWeight.toFixed(3)}g
              </span>
            </div>
          ) : filterCat && filterVariant ? (
            <div style={{ fontSize: '12px', color: 'var(--gold)', marginBottom: 10 }}>
              💡 விபரத்தை (Detail) தேர்வு செய்து அல்லது நேரடி பொருளைத் தேர்ந்தெடுக்கவும்.
            </div>
          ) : null}

          {/* Step 5 & 6: Sale Quantity & Sale Weight */}
          <div className="responsive-grid-2" style={{ marginBottom: 12 }}>
            <div className="form-group">
              <label>5. விற்பனை எண்ணிக்கை (Sale Qty pcs) *</label>
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
              <label style={{ color: isWeightOver ? '#EF4444' : undefined }}>
                6. விற்பனை எடை (Sale Weight in g) *
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

          {/* Step 7 & 8: Gross Amount & Discount */}
          <div className="responsive-grid-2" style={{ marginBottom: 14 }}>
            <div className="form-group">
              <label>7. மொத்த விலை (Gross Amount ₹) *</label>
              <input
                type="number"
                placeholder="எ.கா. 13500"
                value={grossAmount}
                onChange={e => setGrossAmount(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>8. தள்ளுபடி (Discount ₹)</label>
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
            disabled={!selectedProductId || isWeightOver || isQtyOver}
            style={{ height: '44px', fontSize: '14.5px', fontWeight: 700, opacity: (!selectedProductId || isWeightOver || isQtyOver) ? 0.6 : 1, cursor: (!selectedProductId || isWeightOver || isQtyOver) ? 'not-allowed' : 'pointer' }}
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
                        <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>
                          {item.category} {item.detail ? `• ${item.detail}` : ''}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>
                        {item.quantity} pcs
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
                <span>பழைய தங்கம் கழிப்பு (Old Gold Less):</span>
                <span className="fw-700">-₹{parseFloat(oldGoldAmount).toLocaleString('en-IN')}</span>
              </div>
            )}

            {(parseFloat(oldSilverAmount) || 0) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#EF4444', marginBottom: 5 }}>
                <span>பழைய வெள்ளி கழிப்பு (Old Silver Less):</span>
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
