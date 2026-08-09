import React, { useState } from 'react'
import { Wrench, Plus, Search, CheckCircle, Trash2, Printer, X } from 'lucide-react'
import EagleLogo from './EagleLogo'

function numberToWords(num) {
  if (!num || num === 0) return 'ZERO RUPEES ONLY'
  const a = ['', 'ONE ', 'TWO ', 'THREE ', 'FOUR ', 'FIVE ', 'SIX ', 'SEVEN ', 'EIGHT ', 'NINE ', 'TEN ', 'ELEVEN ', 'TWELVE ', 'THIRTEEN ', 'FOURTEEN ', 'FIFTEEN ', 'SIXTEEN ', 'SEVENTEEN ', 'EIGHTEEN ', 'NINETEEN ']
  const b = ['', '', 'TWENTY ', 'THIRTY ', 'FORTY ', 'FIFTY ', 'SIXTY ', 'SEVENTY ', 'EIGHTY ', 'NINETY ']

  function inWords(n) {
    if ((n = n.toString()).length > 9) return 'overflow'
    let nArr = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)
    if (!nArr) return ''
    let str = ''
    str += (nArr[1] != 0) ? (a[Number(nArr[1])] || b[nArr[1][0]] + ' ' + a[nArr[1][1]]) + 'CRORE ' : ''
    str += (nArr[2] != 0) ? (a[Number(nArr[2])] || b[nArr[2][0]] + ' ' + a[nArr[2][1]]) + 'LAKH ' : ''
    str += (nArr[3] != 0) ? (a[Number(nArr[3])] || b[nArr[3][0]] + ' ' + a[nArr[3][1]]) + 'THOUSAND ' : ''
    str += (nArr[4] != 0) ? (a[Number(nArr[4])] || b[nArr[4][0]] + ' ' + a[nArr[4][1]]) + 'HUNDRED ' : ''
    str += (nArr[5] != 0) ? ((str != '') ? 'AND ' : '') + (a[Number(nArr[5])] || b[nArr[5][0]] + ' ' + a[nArr[5][1]]) : ''
    return str
  }

  return `RUPEES ${inWords(Math.round(num))}ONLY`
}

const ServicePrintModal = ({ service, onClose }) => {
  if (!service) return null

  const [goldRate, setGoldRate] = useState('')
  const [silverRate, setSilverRate] = useState('')
  const [oldSilverWeight, setOldSilverWeight] = useState(service.oldSilverWeight || '')
  const [oldSilverAmount, setOldSilverAmount] = useState(service.oldSilverAmount || '')

  const handlePrint = () => {
    const printElement = document.getElementById('printable-service-bill')
    if (!printElement) return

    let iframe = document.getElementById('service-bill-iframe')
    if (!iframe) {
      iframe = document.createElement('iframe')
      iframe.id = 'service-bill-iframe'
      iframe.style.position = 'fixed'
      iframe.style.right = '0'
      iframe.style.bottom = '0'
      iframe.style.width = '0'
      iframe.style.height = '0'
      iframe.style.border = '0'
      document.body.appendChild(iframe)
    }

    const doc = iframe.contentWindow.document
    doc.open()
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Service Receipt - SVC-${service.id?.slice(-6) || '977255'}</title>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600;700;800&family=Outfit:wght@600;700;800&display=swap">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; letter-spacing: 0px !important; }
            body { font-family: 'Noto Sans Tamil', -apple-system, sans-serif; background: #ffffff; color: #1E1E1E; padding: 8mm; font-size: 11px; }
            @page { size: A4 portrait; margin: 5mm; }
            table { width: 100%; border-collapse: collapse; border: 1.5px solid #0F3D34; }
            th { background: #0F3D34 !important; color: #ffffff !important; font-weight: 700; font-size: 10.5px; padding: 8px 6px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            td { border: 1px solid #ccc; padding: 6px 8px; font-size: 11px; }
            .ws-badge { background: #0F3D34 !important; color: #ffffff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .rate-row { background: #F5F9F5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .total-footer { background: #EAEFEA !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          </style>
        </head>
        <body>
          ${printElement.innerHTML}
        </body>
      </html>
    `)
    doc.close()

    setTimeout(() => {
      iframe.contentWindow.focus()
      iframe.contentWindow.print()
    }, 250)
  }

  const netServiceFee = Math.max(0, (service.amount || 0) - (parseFloat(oldSilverAmount) || 0))

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()} style={{ padding: '8px', zIndex: 99999 }}>
      <div className="modal-content" style={{ width: '780px', maxWidth: '96vw', background: '#091036', maxHeight: '96vh', overflowY: 'auto' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
            சேவை ரசீது அச்சிடுதல் (Service Slip Preview)
          </h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-gold" onClick={handlePrint} style={{ height: '34px', padding: '0 12px', fontSize: '12.5px' }}>
              <Printer size={14} /> அச்சிடு (Print)
            </button>
            <button className="btn btn-ghost" onClick={onClose} style={{ height: '34px', padding: '0 8px' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Gold, Silver & Old Silver Rate Input */}
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center', background: '#0A0E1A', flexWrap: 'wrap' }}>
          <div style={{ fontSize: 12, color: '#C8A96A', fontWeight: 700 }}>Today's Rate:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <label style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>Gold Rs/g:</label>
            <input
              type="number"
              placeholder="7200"
              value={goldRate}
              onChange={e => setGoldRate(e.target.value)}
              style={{ width: 75, padding: '4px 6px', fontSize: 12, borderRadius: 4, border: '1px solid #C8A96A', background: '#0D1526', color: '#fff', height: 28 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <label style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>Silver Rs/g:</label>
            <input
              type="number"
              placeholder="90"
              value={silverRate}
              onChange={e => setSilverRate(e.target.value)}
              style={{ width: 75, padding: '4px 6px', fontSize: 12, borderRadius: 4, border: '1px solid #888', background: '#0D1526', color: '#fff', height: 28 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <label style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>Old Silver Wt:</label>
            <input
              type="number"
              step="0.001"
              placeholder="25.5"
              value={oldSilverWeight}
              onChange={e => setOldSilverWeight(e.target.value)}
              style={{ width: 75, padding: '4px 6px', fontSize: 12, borderRadius: 4, border: '1px solid #888', background: '#0D1526', color: '#fff', height: 28 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <label style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>Old Silver Less ₹:</label>
            <input
              type="number"
              placeholder="1500"
              value={oldSilverAmount}
              onChange={e => setOldSilverAmount(e.target.value)}
              style={{ width: 75, padding: '4px 6px', fontSize: 12, borderRadius: 4, border: '1px solid #C8A96A', background: '#0D1526', color: '#fff', height: 28 }}
            />
          </div>
        </div>

        <div className="bill-container" style={{ padding: '12px 6px', background: '#060B28', display: 'flex', justifyContent: 'center' }}>
          <div id="printable-service-bill" style={{ width: '100%' }}>
            <div style={{
              width: '100%',
              maxWidth: '100%',
              background: '#FFFFFF',
              padding: '14px 12px',
              color: '#1E1E1E',
              fontFamily: "'Noto Sans Tamil', -apple-system, sans-serif",
              fontSize: '11px',
              border: '1.5px solid #0F3D34',
              boxSizing: 'border-box',
              margin: '0 auto',
              letterSpacing: '0px'
            }}>

              {/* Header Phone Number */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9.5px', color: '#333', fontWeight: 700, marginBottom: 6, flexWrap: 'wrap' }}>
                <div style={{ color: '#0F3D34', fontWeight: 800 }}>ESTD: 2026</div>
                <div>Ph: +91 81480 03454, +91 73391 60876</div>
              </div>

              {/* Shop Title & Logo Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2.5px solid #0F3D34', paddingBottom: 8, marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <EagleLogo size={42} />
                    <div>
                      <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F3D34', margin: 0, lineHeight: 1.1 }}>
                        ஈகிள் சில்வர்ஸ்
                      </h1>
                      <div
                        className="ws-badge"
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          color: '#FFFFFF',
                          background: '#0F3D34',
                          WebkitPrintColorAdjust: 'exact',
                          printColorAdjust: 'exact',
                          display: 'inline-block',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          marginTop: 3
                        }}
                      >
                        Wholesale &amp; Retail Shop
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#444', marginTop: 4 }}>
                    8 - வடக்கு ரத வீதி, டவுன் போலீஸ் ஸ்டேஷன் ரோடு, சிவகாசி.
                  </div>
                </div>

                <div style={{
                  border: '1.5px solid #0F3D34',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontWeight: 800,
                  color: '#0F3D34',
                  fontSize: '11px',
                  background: '#F0F5F2'
                }}>
                  SERVICE RECEIPT / சேவை பில்
                </div>
              </div>

              {/* Gold & Silver Rate Row */}
              {(goldRate || silverRate) && (
                <div
                  className="rate-row"
                  style={{
                    display: 'flex',
                    gap: 12,
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#0F3D34',
                    background: '#F5F9F5',
                    WebkitPrintColorAdjust: 'exact',
                    printColorAdjust: 'exact',
                    border: '1px solid #c8e0c8',
                    borderRadius: 4,
                    padding: '5px 10px',
                    marginBottom: 10,
                    flexWrap: 'wrap'
                  }}
                >
                  <span>Today's Rate:</span>
                  {goldRate && <span>Gold: Rs.{goldRate}/g</span>}
                  {silverRate && <span>Silver: Rs.{silverRate}/g</span>}
                </div>
              )}

              {/* Customer Info Box */}
              <div style={{
                border: '1px solid #0F3D34',
                borderRadius: 4,
                padding: '8px 10px',
                marginBottom: 10,
                display: 'flex',
                justifyContent: 'space-between',
                background: '#F9FBF9',
                flexWrap: 'wrap',
                gap: 6
              }}>
                <div>
                  <div style={{ fontSize: '9px', color: '#666' }}>வாடிக்கையாளர் (Customer):</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F3D34' }}>{service.customerName || service.notes || 'மாரி'}</div>
                  {service.mobile && <div style={{ fontSize: '10.5px', color: '#333', fontWeight: 600 }}>Ph: {service.mobile}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11.5px', color: '#0F3D34' }}>
                    <strong>பில் எண்:</strong> <span style={{ fontWeight: 800 }}>SVC-{service.id?.slice(-6) || '572173'}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#444' }}>
                    <strong>தேதி:</strong> {service.date}
                  </div>
                </div>
              </div>

              {/* Service Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #0F3D34', fontSize: '10.5px', marginBottom: 10 }}>
                <thead>
                  <tr style={{ background: '#0F3D34', color: '#FFFFFF' }}>
                    <th style={{ padding: '6px 6px', textAlign: 'left', width: '42%' }}>பொருள் விவரம் (ITEM)</th>
                    <th style={{ padding: '6px 6px', textAlign: 'center', width: '24%' }}>சேவை வகை</th>
                    <th style={{ padding: '6px 6px', textAlign: 'right', width: '16%' }}>எடை (Wt)</th>
                    <th style={{ padding: '6px 6px', textAlign: 'right', width: '18%' }}>கட்டணம் (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px 6px', fontWeight: 700, color: '#0F3D34' }}>{service.itemName}</td>
                    <td style={{ padding: '6px 6px', textAlign: 'center' }}>{service.serviceType}</td>
                    <td style={{ padding: '6px 6px', textAlign: 'right', fontWeight: 600 }}>{service.weight ? `${service.weight.toFixed(3)}g` : '-'}</td>
                    <td style={{ padding: '6px 6px', textAlign: 'right', fontWeight: 700, color: '#0F3D34' }}>Rs.{service.amount?.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>

              {/* Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div style={{ fontSize: '9.5px', color: '#444', lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 700, color: '#0F3D34' }}>நிபந்தனைகள்:</div>
                  <div>• 916 தங்க நகைகள் சிறந்த முறையில் ஆர்டரின் பேரில் செய்து தரப்படும்.</div>
                  <div>• வெள்ளி கொலுசுகளுக்கு செய்கூலி, சேதாரம் இல்லை.</div>
                </div>

                <div style={{ border: '1px solid #0F3D34', borderRadius: 4, padding: '6px 10px', background: '#FAFDFB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span>சேவை கட்டணம்:</span>
                    <span style={{ fontWeight: 600 }}>Rs.{service.amount?.toLocaleString('en-IN')}</span>
                  </div>
                  {(parseFloat(oldSilverAmount) || 0) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#c00', fontWeight: 700 }}>
                      <span>பழைய வெள்ளி கழிப்பு:</span>
                      <span>-Rs.{parseFloat(oldSilverAmount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div
                    style={{
                      borderTop: '1.5px solid #0F3D34',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#EAEFEA',
                      margin: '0 -10px -6px -10px',
                      padding: '6px 10px',
                      borderRadius: '0 0 3px 3px'
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F3D34' }}>மொத்த கட்டணம்:</span>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F3D34' }}>Rs.{netServiceFee.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 8, borderTop: '1px dashed #ccc', fontSize: '9px', color: '#333' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ height: 18 }} />
                  <div>வாடிக்கையாளர் கையொப்பம்</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ height: 18 }} />
                  <div>ஈகிள் சில்வர்ஸ் (Authorized Signatory)</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ServiceLog = ({ serviceEntries = [], onAddService, onDeleteService }) => {
  const [customerName, setCustomerName] = useState('')
  const [mobile, setMobile]             = useState('')
  const [date, setDate]                 = useState(new Date().toISOString().split('T')[0])
  const [itemName, setItemName]         = useState('')
  const [serviceType, setServiceType]   = useState('Polish (மெருகு)')
  const [weight, setWeight]             = useState('')
  const [amount, setAmount]             = useState('')
  const [notes, setNotes]               = useState('')
  const [search, setSearch]             = useState('')
  const [loading, setLoading]           = useState(false)
  const [success, setSuccess]           = useState(false)
  const [printService, setPrintService] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!itemName || !amount) {
      alert('தயவுசெய்து பொருள் பெயர் மற்றும் தொகையை உள்ளிடவும்')
      return
    }
    setLoading(true)
    try {
      await onAddService({
        customerName: customerName || 'Walk-in Customer',
        mobile,
        date,
        itemName,
        serviceType,
        weight: parseFloat(weight || 0),
        amount: parseFloat(amount || 0),
        notes,
        status: 'Completed'
      })
      setCustomerName('')
      setMobile('')
      setItemName('')
      setWeight('')
      setAmount('')
      setNotes('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      alert('சேமிப்பதில் பிழை: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const filtered = serviceEntries.filter(s =>
    s.itemName?.toLowerCase().includes(search.toLowerCase()) ||
    s.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    s.mobile?.includes(search) ||
    s.serviceType?.toLowerCase().includes(search.toLowerCase()) ||
    s.notes?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      <div className="flex-between mb-16">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>
            சேவை பதிவேடு (Service Log)
          </h2>
          <p className="text-sub">Jewellery Polish, Repair &amp; Cleaning Service Register</p>
        </div>
      </div>

      {success && (
        <div className="toast-success mb-14" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid #10B981', borderRadius: 10 }}>
          <CheckCircle size={18} /> <span>சேவை பதிவு வெற்றிகரமாக சேமிக்கப்பட்டது! (Service logged successfully!)</span>
        </div>
      )}

      <div className="layout-split-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left Form */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <div className="card-title" style={{ fontSize: '15px', marginBottom: 14 }}>
            1. புதிய சேவை பதிவு (New Service Entry)
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div className="form-group">
                <label>சேவை தேதி (Date) *</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>பொருள் பெயர் (Item Name) *</label>
                <input type="text" placeholder="எ.கா. வெள்ளி கொலுசு..." value={itemName} onChange={e => setItemName(e.target.value)} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 12 }}>
              <label>சேவை வகை (Service Type) *</label>
              <select value={serviceType} onChange={e => setServiceType(e.target.value)} required>
                <option value="Polish (மெருகு)">Polish (மெருகு)</option>
                <option value="Repair (பழுதுபார்க்கும் சேவை)">Repair (பழுதுபார்க்கும் சேவை)</option>
                <option value="Cleaning (சுத்தம் செய்தல்)">Cleaning (சுத்தம் செய்தல்)</option>
                <option value="Resizing (அளவு மாற்றுதல்)">Resizing (அளவு மாற்றுதல்)</option>
                <option value="Stones Setting (கற்கள் பதித்தல்)">Stones Setting (கற்கள் பதித்தல்)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div className="form-group">
                <label>எடை (Weight in g)</label>
                <input type="number" step="0.001" placeholder="0.000" value={weight} onChange={e => setWeight(e.target.value)} />
              </div>
              <div className="form-group">
                <label>கட்டணம் (Service Fee ₹) *</label>
                <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>கூடுதல் குறிப்பு (Note / Detail)</label>
              <input type="text" placeholder="குறிப்புகள்..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-gold btn-full btn-lg" disabled={loading} style={{ height: '46px', fontSize: '15px', fontWeight: 800 }}>
              <Plus size={16} /> {loading ? 'சேமிக்கப்படுகிறது...' : '+ சேவை பதிவேட்டில் சேர் (Save Entry)'}
            </button>
          </form>
        </div>

        {/* Right Service History List */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="card-title" style={{ fontSize: '15px', margin: 0 }}>
              2. சேவை வரலாறு (Service Records)
            </div>
            <span className="badge badge-blue">{filtered.length} பதிவுகள்</span>
          </div>

          <div style={{ position: 'relative', marginBottom: 12 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-sub)' }} />
            <input
              type="text"
              placeholder="தேடுக (பொருள், பெயர், எண்)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 34, height: 36, fontSize: '13px' }}
            />
          </div>

          {/* Desktop Table View */}
          <div className="desktop-table-view">
            <div className="table-wrap" style={{ maxHeight: '380px', overflowY: 'auto' }}>
              <table style={{ width: '100%', minWidth: '460px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '75px', textAlign: 'left' }}>தேதி</th>
                    <th style={{ textAlign: 'left' }}>பொருள் / பெயர்</th>
                    <th style={{ width: '90px', textAlign: 'center' }}>சேவை</th>
                    <th style={{ width: '80px', textAlign: 'right' }}>கட்டணம்</th>
                    <th style={{ width: '60px', textAlign: 'center' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, idx) => (
                    <tr key={s.id || idx}>
                      <td style={{ fontSize: 11.5, color: 'var(--text-sub)' }}>{s.date}</td>
                      <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <div className="fw-600" style={{ color: 'var(--text-main)', fontSize: '13px' }}>{s.itemName}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-sub)' }}>
                          {s.customerName || 'Walk-in'} {s.weight ? `• ${s.weight}g` : ''}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="badge badge-blue" style={{ fontSize: '10.5px' }}>{s.serviceType?.split(' ')[0]}</span>
                      </td>
                      <td style={{ textAlign: 'right' }} className="fw-700 text-gold">
                        ₹{s.amount?.toLocaleString('en-IN')}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                          <button className="btn btn-ghost" onClick={() => setPrintService(s)} title="அச்சிடு" style={{ padding: '3px 6px', height: 26 }}>
                            <Printer size={13} />
                          </button>
                          <button className="btn-danger-ghost" onClick={() => onDeleteService && onDeleteService(s.id)} title="நீக்கு" style={{ padding: '3px 6px', height: 26 }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: 36, color: 'var(--text-sub)' }}>
                        <div style={{ marginBottom: 6 }}><Wrench size={24} opacity={0.3} /></div>
                        <div>சேவை பதிவுகள் எதுவும் இல்லை</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="mobile-card-list">
            {filtered.map((s, idx) => (
              <div key={s.id || idx} className="mobile-item-card" style={{ padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div className="fw-700" style={{ fontSize: '14px', color: 'var(--text-main)' }}>{s.itemName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>{s.date}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-sub)' }}>
                    👤 {s.customerName || 'Walk-in'} {s.weight ? `• ${s.weight}g` : ''}
                  </div>
                  <span className="badge badge-blue" style={{ fontSize: '10px' }}>{s.serviceType?.split(' ')[0]}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border)', paddingTop: 6 }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#1A3D63' }}>
                    ₹{s.amount?.toLocaleString('en-IN')}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost" onClick={() => setPrintService(s)} style={{ padding: '3px 8px', height: 26, fontSize: '11px' }}>
                      <Printer size={12} /> பில்
                    </button>
                    <button className="btn-danger-ghost" onClick={() => onDeleteService && onDeleteService(s.id)} style={{ padding: '3px 8px', height: 26, fontSize: '11px' }}>
                      <Trash2 size={12} /> நீக்கு
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-sub)' }}>
                சேவை பதிவுகள் எதுவும் இல்லை
              </div>
            )}
          </div>

        </div>
      </div>

      <ServicePrintModal service={printService} onClose={() => setPrintService(null)} />
    </div>
  )
}

export default ServiceLog
