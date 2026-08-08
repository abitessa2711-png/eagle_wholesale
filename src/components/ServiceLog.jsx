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
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ width: '780px', maxWidth: '94vw', background: '#091036' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', fontFamily: 'Outfit, sans-serif' }}>சேவை ரசீது அச்சிடுதல் (Service Slip Preview)</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-gold" onClick={handlePrint}>
              <Printer size={14} /> அச்சிடு (Print)
            </button>
            <button className="btn btn-ghost" onClick={onClose}>
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Gold, Silver & Old Silver Rate Input */}
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 14, alignItems: 'center', background: '#0A0E1A', flexWrap: 'wrap' }}>
          <div style={{ fontSize: 12, color: '#C8A96A', fontWeight: 700 }}>Today's Rate (பதிக்க):</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>Gold (தங்கம்) Rs/g:</label>
            <input
              type="number"
              placeholder="e.g. 7200"
              value={goldRate}
              onChange={e => setGoldRate(e.target.value)}
              style={{ width: 85, padding: '4px 8px', fontSize: 12, borderRadius: 4, border: '1px solid #C8A96A', background: '#0D1526', color: '#fff', height: 30 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>Silver (வெள்ளி) Rs/g:</label>
            <input
              type="number"
              placeholder="e.g. 90"
              value={silverRate}
              onChange={e => setSilverRate(e.target.value)}
              style={{ width: 85, padding: '4px 8px', fontSize: 12, borderRadius: 4, border: '1px solid #888', background: '#0D1526', color: '#fff', height: 30 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>Old Silver Wt (g):</label>
            <input
              type="number"
              step="0.001"
              placeholder="e.g. 25.5"
              value={oldSilverWeight}
              onChange={e => setOldSilverWeight(e.target.value)}
              style={{ width: 85, padding: '4px 8px', fontSize: 12, borderRadius: 4, border: '1px solid #888', background: '#0D1526', color: '#fff', height: 30 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>Old Silver (கழிப்பு ₹):</label>
            <input
              type="number"
              placeholder="e.g. 1500"
              value={oldSilverAmount}
              onChange={e => setOldSilverAmount(e.target.value)}
              style={{ width: 85, padding: '4px 8px', fontSize: 12, borderRadius: 4, border: '1px solid #C8A96A', background: '#0D1526', color: '#fff', height: 30 }}
            />
          </div>
        </div>

        <div className="bill-container" style={{ padding: '16px', background: '#060B28', display: 'flex', justifyContent: 'center' }}>
          <div id="printable-service-bill" style={{ width: '100%' }}>
            <div style={{
              width: '100%',
              maxWidth: '190mm',
              minHeight: '240mm',
              background: '#FFFFFF',
              padding: '12mm 14mm',
              color: '#1E1E1E',
              fontFamily: "'Noto Sans Tamil', sans-serif",
              fontSize: '11px',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
              margin: '0 auto',
              letterSpacing: '0px'
            }}>

              {/* Header Phone Number — Right Top, no emoji */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '9.5px', color: '#333', fontWeight: 700, marginBottom: 6 }}>
                <div>Ph: +91 81480 03454, +91 73391 60876</div>
              </div>

              {/* Shop Title & Logo Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2.5px solid #0F3D34', paddingBottom: 8, marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <EagleLogo size={48} />
                    <div>
                      <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0F3D34', margin: 0, lineHeight: 1.1 }}>
                        ஈகிள் சில்வர்ஸ்
                      </h1>
                      {/* Wholesale & Retail Shop badge — print-safe green highlight */}
                      <div
                        className="ws-badge"
                        style={{
                          fontSize: '12px',
                          fontWeight: 800,
                          color: '#FFFFFF',
                          background: '#0F3D34',
                          WebkitPrintColorAdjust: 'exact',
                          printColorAdjust: 'exact',
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '3px',
                          marginTop: 4
                        }}
                      >
                        Wholesale &amp; Retail Shop
                      </div>
                    </div>
                  </div>
                  {/* Address — no emoji */}
                  <div style={{ fontSize: '9.5px', color: '#444', marginTop: 5 }}>
                    8 - வடக்கு ரத வீதி, டவுன் போலீஸ் ஸ்டேஷன் ரோடு, சிவகாசி.
                  </div>
                </div>

                <div style={{
                  border: '1.5px solid #0F3D34',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontWeight: 800,
                  color: '#0F3D34',
                  fontSize: '11.5px',
                  background: '#F0F5F2'
                }}>
                  SERVICE RECEIPT / சேவை பில்
                </div>
              </div>

              {/* Gold & Silver Rate Row — no emoji */}
              {(goldRate || silverRate) && (
                <div
                  className="rate-row"
                  style={{
                    display: 'flex',
                    gap: 20,
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#0F3D34',
                    background: '#F5F9F5',
                    WebkitPrintColorAdjust: 'exact',
                    printColorAdjust: 'exact',
                    border: '1px solid #c8e0c8',
                    borderRadius: 4,
                    padding: '5px 12px',
                    marginBottom: 10
                  }}
                >
                  <span>Today's Rate / இன்றைய விலை:</span>
                  {goldRate && <span>Gold (தங்கம்): Rs.{goldRate}/g</span>}
                  {silverRate && <span>Silver (வெள்ளி): Rs.{silverRate}/g</span>}
                </div>
              )}

              {/* Customer Info Box */}
              <div style={{
                border: '1px solid #0F3D34',
                borderRadius: 4,
                padding: '10px 14px',
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                background: '#F9FBF9'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '9.5px', color: '#666', marginBottom: 2 }}>வாடிக்கையாளர் விவரம் / Customer Info:</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F3D34' }}>{service.customerName || service.notes || 'மாரி'}</div>
                  <div style={{ fontSize: '11px', color: '#333', marginTop: 2, fontWeight: 600 }}>செல் / Ph: {service.mobile || '90909090'}</div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'flex-end', marginLeft: 'auto' }}>
                  <div style={{ fontSize: '12px', color: '#0F3D34', textAlign: 'right' }}>
                    <strong>பில் எண் / Receipt No :</strong> <span style={{ fontWeight: 800 }}>SVC-{service.id?.slice(-6) || '572173'}</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#444', textAlign: 'right' }}>
                    <strong>தேதி / Date :</strong> {service.date}
                  </div>
                </div>
              </div>

              {/* Service Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1.5px solid #0F3D34', fontSize: '10.5px', marginBottom: 14, tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ background: '#0F3D34', color: '#FFFFFF', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                    <th style={{ padding: '8px 6px', borderRight: '1px solid #1a5c50', textAlign: 'left', width: '40%', color: '#FFFFFF', fontWeight: 700, background: '#0F3D34' }}>
                      பொருள் விவரம் (ITEM DETAILS)
                    </th>
                    <th style={{ padding: '8px 6px', borderRight: '1px solid #1a5c50', textAlign: 'center', width: '25%', color: '#FFFFFF', fontWeight: 700, background: '#0F3D34' }}>
                      சேவை வகை (SERVICE TYPE)
                    </th>
                    <th style={{ padding: '8px 6px', borderRight: '1px solid #1a5c50', textAlign: 'right', width: '18%', color: '#FFFFFF', fontWeight: 700, background: '#0F3D34' }}>
                      எடை (WEIGHT)
                    </th>
                    <th style={{ padding: '8px 6px', textAlign: 'right', width: '17%', color: '#FFFFFF', fontWeight: 700, background: '#0F3D34' }}>
                      கட்டணம் (FEE)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ height: '36px' }}>
                    <td style={{ padding: '6px 8px', borderRight: '1px solid #ccc', fontWeight: 700, color: '#0F3D34' }}>
                      {service.itemName}
                    </td>
                    <td style={{ padding: '6px 8px', borderRight: '1px solid #ccc', textAlign: 'center' }}>
                      {service.serviceType}
                    </td>
                    <td style={{ padding: '6px 8px', borderRight: '1px solid #ccc', textAlign: 'right', fontWeight: 600 }}>
                      {service.weight ? `${service.weight.toFixed(3)} g` : '-'}
                    </td>
                    <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#0F3D34' }}>
                      Rs.{service.amount?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Summary & Instructions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14, marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#0F3D34', marginBottom: 4 }}>
                    நிபந்தனைகள் / Instructions:
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#1a1a1a', lineHeight: 1.6, fontWeight: 700 }}>
                    <div>• 916 தங்க நகைகள் சிறந்த முறையில் ஆர்டரின் பேரில் செய்து தரப்படும்.</div>
                    <div>• வெள்ளி கொலுசுகளுக்கு செய்கூலி, சேதாரம் இல்லை.</div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#666' }}>வார்த்தைகளில் / Amount in words:</div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#0F3D34', marginTop: 2 }}>
                      {numberToWords(service.amount || 0)}
                    </div>
                  </div>
                </div>

                <div style={{ border: '1px solid #0F3D34', borderRadius: 5, padding: '8px 12px', background: '#FAFDFB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#444' }}>
                    <span>நகை எடை (Weight):</span>
                    <span style={{ fontWeight: 600 }}>{service.weight ? `${service.weight.toFixed(3)} g` : '-'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#444' }}>
                    <span>சேவை கட்டணம் (Fee):</span>
                    <span style={{ fontWeight: 600 }}>Rs.{service.amount?.toLocaleString('en-IN')}</span>
                  </div>
                  {(parseFloat(oldSilverAmount) || 0) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: '#c00', fontWeight: 700 }}>
                      <span>பழைய வெள்ளி கழிப்பு (Less Old Silver {oldSilverWeight ? `[${oldSilverWeight}g]` : ''}):</span>
                      <span>-Rs.{parseFloat(oldSilverAmount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div
                    className="total-footer"
                    style={{
                      borderTop: '1.5px solid #0F3D34',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#EAEFEA',
                      WebkitPrintColorAdjust: 'exact',
                      printColorAdjust: 'exact',
                      margin: '0 -12px -8px -12px',
                      padding: '8px 12px',
                      borderRadius: '0 0 4px 4px'
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F3D34' }}>மொத்த கட்டணம் (Net Fee):</span>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#0F3D34', fontFamily: 'Outfit, sans-serif' }}>
                      Rs.{netServiceFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thank You */}
              <div style={{ textAlign: 'center', margin: '16px 0 24px 0' }}>
                <div style={{ fontSize: '18px', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 700, color: '#0F3D34' }}>
                  Thank You
                </div>
              </div>

              {/* 2 Separated Signatures */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 20px', marginTop: 20 }}>
                <div style={{ width: '150px', textAlign: 'center', borderTop: '1px solid #555', paddingTop: 5 }}>
                  <span style={{ fontSize: '10px', color: '#333', fontWeight: 600 }}>Customer Signature</span>
                </div>
                <div style={{ width: '150px', textAlign: 'center', borderTop: '1px solid #555', paddingTop: 5 }}>
                  <span style={{ fontSize: '10px', color: '#333', fontWeight: 600 }}>Authorized Signatory</span>
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
    <div className="animate-fade-in">
      <div className="flex-between mb-16">
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>சேவை பதிவேடு (Service Log)</h2>
          <p className="text-sub">Polish & Repair Service Log — Eagle Silvers Wholesale</p>
        </div>
      </div>

      {success && (
        <div className="toast-success mb-14">
          <CheckCircle size={18} /> சேவை பதிவு வெற்றிகரமாக சேமிக்கப்பட்டது!
        </div>
      )}

      <div className="layout-split-grid">
        <div className="card">
          <div className="card-title">புதிய சேவை பதிவு (New Service Entry)</div>
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
                <label>செல் (Mobile No)</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div className="form-group">
                <label>தேதி (Date) *</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>பொருள் (Item Name) *</label>
                <input type="text" placeholder="எ.கா. தங்க வளையல்..." value={itemName} onChange={e => setItemName(e.target.value)} required />
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
                <label>எடை — g</label>
                <input type="number" step="0.001" placeholder="0.000" value={weight} onChange={e => setWeight(e.target.value)} />
              </div>
              <div className="form-group">
                <label>தொகை (Rs.) *</label>
                <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>கூடுதல் குறிப்பு (Note / Detail)</label>
              <input type="text" placeholder="கூடுதல் விவரம்..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-gold btn-full btn-lg" disabled={loading}>
              <Plus size={16} /> {loading ? 'சேமிக்கப்படுகிறது...' : '+ சேவை சேர் (Save Entry)'}
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px 10px', borderBottom: '1px solid var(--border)', display: 'flex', justify: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>
              சேவை வரலாறு (Service History)
            </div>
            <span className="badge badge-blue">{filtered.length} பதிவுகள்</span>
          </div>
          <div style={{ padding: '10px 14px', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-sub)' }} />
            <input type="text" placeholder="பொருள், பெயர் அல்லது மொபைல் தேட..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34, height: 36 }} />
          </div>
          <div className="table-wrap" style={{ maxHeight: '380px', overflowY: 'auto' }}>
            <table style={{ minWidth: '560px' }}>
              <thead>
                <tr>
                  <th style={{ minWidth: '90px', textAlign: 'left' }}>தேதி (DATE)</th>
                  <th style={{ minWidth: '160px', textAlign: 'left' }}>பொருள் / வாடிக்கையாளர்</th>
                  <th style={{ minWidth: '120px', textAlign: 'left' }}>சேவை (SERVICE)</th>
                  <th style={{ minWidth: '90px', textAlign: 'right' }}>தொகை</th>
                  <th style={{ width: '50px', textAlign: 'center' }}>செயல்</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => (
                  <tr key={s.id || idx}>
                    <td style={{ fontSize: 11, color: 'var(--text-sub)' }}>{s.date}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <div className="fw-600" style={{ color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.itemName}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-sub)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.customerName || 'Walk-in'} {s.mobile ? `(${s.mobile})` : ''} {s.notes ? `• ${s.notes}` : ''}
                      </div>
                    </td>
                    <td><span className="badge badge-blue">{s.serviceType?.split(' ')[0]}</span></td>
                    <td style={{ textAlign: 'right' }} className="fw-700 text-gold">Rs.{s.amount?.toLocaleString('en-IN')}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                        <button className="btn btn-ghost" onClick={() => setPrintService(s)} title="சேவை ரசீது அச்சிடு" style={{ padding: '2px 6px', height: 26, fontSize: 11 }}>
                          <Printer size={12} />
                        </button>
                        <button className="btn-danger-ghost" onClick={() => onDeleteService && onDeleteService(s.id)} title="நீக்கு" style={{ padding: '2px 6px', height: 26 }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: 36, color: 'var(--text-sub)' }}>
                      <div style={{ marginBottom: 6 }}><Wrench size={28} opacity={0.3} /></div>
                      <div>சேவை பதிவுகள் இல்லை</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ServicePrintModal service={printService} onClose={() => setPrintService(null)} />
    </div>
  )
}

export default ServiceLog
