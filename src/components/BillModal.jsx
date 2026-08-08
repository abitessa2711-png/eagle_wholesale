import React, { useState } from 'react'
import { Printer, X } from 'lucide-react'
import EagleLogo from './EagleLogo'

// Helper function to convert number to words
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

const BillModal = ({ bill, onClose }) => {
  if (!bill) return null

  const [goldRate, setGoldRate] = useState(bill.goldRate || '')
  const [silverRate, setSilverRate] = useState(bill.silverRate || '')
  const [oldGoldWeight, setOldGoldWeight] = useState(bill.oldGoldWeight || '')
  const [oldGoldAmount, setOldGoldAmount] = useState(bill.oldGoldAmount || '')
  const [oldSilverWeight, setOldSilverWeight] = useState(bill.oldSilverWeight || '')
  const [oldSilverAmount, setOldSilverAmount] = useState(bill.oldSilverAmount || '')

  const handlePrint = () => {
    const printElement = document.getElementById('printable-sales-bill')
    if (!printElement) return

    let iframe = document.getElementById('sales-bill-iframe')
    if (!iframe) {
      iframe = document.createElement('iframe')
      iframe.id = 'sales-bill-iframe'
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
          <title>Sales Invoice - ${bill.billId || 'ESW-Bill'}</title>
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

  const items = bill.items || []
  const subTotal = items.reduce((s, i) => s + (i.totalAmount || i.total || 0), 0)
  const totalDiscount = items.reduce((s, i) => s + (i.discountAmount || 0), 0)
  const totalWeight = items.reduce((s, i) => s + (i.totalWeight || i.weight || 0), 0)
  const totalQty = items.reduce((s, i) => s + (i.quantity || 0), 0)
  const grandTotal = Math.max(0, subTotal - totalDiscount - (parseFloat(oldGoldAmount) || 0) - (parseFloat(oldSilverAmount) || 0))

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ width: '820px', maxWidth: '94vw', background: '#091036' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF', fontFamily: 'Outfit, sans-serif' }}>விற்பனை ரசீது (Cash Bill / Tax Invoice Preview)</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-gold" onClick={handlePrint}>
              <Printer size={15} /> அச்சடி (Print Bill)
            </button>
            <button className="btn btn-ghost" onClick={onClose}>
              <X size={15} />
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
              style={{ width: 90, padding: '4px 8px', fontSize: 12, borderRadius: 4, border: '1px solid #C8A96A', background: '#0D1526', color: '#fff', height: 30 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>Silver (வெள்ளி) Rs/g:</label>
            <input
              type="number"
              placeholder="e.g. 90"
              value={silverRate}
              onChange={e => setSilverRate(e.target.value)}
              style={{ width: 90, padding: '4px 8px', fontSize: 12, borderRadius: 4, border: '1px solid #888', background: '#0D1526', color: '#fff', height: 30 }}
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
              style={{ width: 90, padding: '4px 8px', fontSize: 12, borderRadius: 4, border: '1px solid #888', background: '#0D1526', color: '#fff', height: 30 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>Old Gold (பழைய தங்கம்):</label>
            <input
              type="number"
              placeholder="e.g. 2000"
              value={oldGoldAmount}
              onChange={e => setOldGoldAmount(e.target.value)}
              style={{ width: 90, padding: '4px 8px', fontSize: 12, borderRadius: 4, border: '1px solid #C8A96A', background: '#0D1526', color: '#fff', height: 30 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>Old Silver (கழிப்பு ₹):</label>
            <input
              type="number"
              placeholder="e.g. 1500"
              value={oldSilverAmount}
              onChange={e => setOldSilverAmount(e.target.value)}
              style={{ width: 90, padding: '4px 8px', fontSize: 12, borderRadius: 4, border: '1px solid #C8A96A', background: '#0D1526', color: '#fff', height: 30 }}
            />
          </div>
        </div>

        <div className="bill-container" style={{ padding: '16px', display: 'flex', justifyContent: 'center', background: '#060B28' }}>
          <div id="printable-sales-bill" style={{ width: '100%' }}>
            <div style={{
              width: '100%',
              maxWidth: '195mm',
              minHeight: '250mm',
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
                      {/* Wholesale & Retail Shop — green badge, print-safe */}
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
                  background: '#F0F5F2',
                  textAlign: 'center'
                }}>
                  CASH BILL / TAX INVOICE
                </div>
              </div>

              {/* Gold, Silver, Old Gold & Old Silver Rate Row — no emoji */}
              {(goldRate || silverRate || oldGoldAmount || oldGoldWeight || oldSilverAmount || oldSilverWeight) && (
                <div
                  className="rate-row"
                  style={{
                    display: 'flex',
                    gap: 16,
                    flexWrap: 'wrap',
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
                  {(oldGoldAmount || oldGoldWeight) && (
                    <span>Old Gold (பழைய தங்கம்): {oldGoldWeight ? `${oldGoldWeight}g` : ''} {oldGoldAmount ? `(-Rs.${oldGoldAmount})` : ''}</span>
                  )}
                  {(oldSilverAmount || oldSilverWeight) && (
                    <span>Old Silver (பழைய வெள்ளி): {oldSilverWeight ? `${oldSilverWeight}g` : ''} {oldSilverAmount ? `(-Rs.${oldSilverAmount})` : ''}</span>
                  )}
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
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F3D34' }}>{bill.customerName || 'மாரி'}</div>
                  <div style={{ fontSize: '11px', color: '#333', marginTop: 2, fontWeight: 600 }}>செல் / Ph: {bill.mobile || '90909090'}</div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'flex-end', marginLeft: 'auto' }}>
                  <div style={{ fontSize: '12px', color: '#0F3D34', textAlign: 'right' }}>
                    <strong>பில் எண் / Bill No :</strong> <span style={{ fontWeight: 800 }}>{bill.billId || 'ESW-538758'}</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#444', textAlign: 'right' }}>
                    <strong>தேதி / Date :</strong> {new Date(bill.date || Date.now()).toLocaleDateString('en-IN')}, {new Date(bill.date || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Main Table */}
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1.5px solid #0F3D34',
                fontSize: '10.5px',
                marginBottom: 14,
                tableLayout: 'fixed'
              }}>
                <thead>
                  <tr style={{ background: '#0F3D34', color: '#FFFFFF', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                    <th style={{ padding: '8px 6px', borderRight: '1px solid #1a5c50', textAlign: 'left', width: '30%', color: '#FFFFFF', fontWeight: 700, background: '#0F3D34' }}>
                      பொருள் விவரம் (ITEM DETAILS)
                    </th>
                    <th style={{ padding: '8px 6px', borderRight: '1px solid #1a5c50', textAlign: 'center', width: '13%', color: '#FFFFFF', fontWeight: 700, background: '#0F3D34' }}>
                      எண்ணிக்கை (QTY)
                    </th>
                    <th style={{ padding: '8px 6px', borderRight: '1px solid #1a5c50', textAlign: 'right', width: '15%', color: '#FFFFFF', fontWeight: 700, background: '#0F3D34' }}>
                      எடை (GROSS WT)
                    </th>
                    <th style={{ padding: '8px 6px', borderRight: '1px solid #1a5c50', textAlign: 'right', width: '14%', color: '#FFFFFF', fontWeight: 700, background: '#0F3D34' }}>
                      மதிப்பு (GROSS RS)
                    </th>
                    <th style={{ padding: '8px 6px', borderRight: '1px solid #1a5c50', textAlign: 'right', width: '12%', color: '#FFFFFF', fontWeight: 700, background: '#0F3D34' }}>
                      தள்ளுபடி (DISC)
                    </th>
                    <th style={{ padding: '8px 6px', textAlign: 'right', width: '16%', color: '#FFFFFF', fontWeight: 700, background: '#0F3D34' }}>
                      நிகர மதிப்பு (NET VALUE)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #ddd', height: '34px' }}>
                      <td style={{ padding: '6px 8px', borderRight: '1px solid #ccc', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <div>{item.variant}</div>
                        {item.category && <div style={{ fontSize: '9px', color: '#666', marginTop: 1 }}>{item.category}</div>}
                      </td>
                      <td style={{ padding: '6px 8px', borderRight: '1px solid #ccc', textAlign: 'center' }}>{item.quantity} pcs</td>
                      <td style={{ padding: '6px 8px', borderRight: '1px solid #ccc', textAlign: 'right' }}>{(item.totalWeight || item.weight || 0).toFixed(3)} g</td>
                      <td style={{ padding: '6px 8px', borderRight: '1px solid #ccc', textAlign: 'right' }}>Rs.{(item.totalAmount || item.total).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '6px 8px', borderRight: '1px solid #ccc', textAlign: 'right', color: '#c00' }}>
                        {item.discountAmount > 0 ? `-Rs.${item.discountAmount}` : '-'}
                      </td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#0F3D34' }}>
                        Rs.{item.total?.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                  {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, i) => (
                    <tr key={`filler-${i}`} style={{ height: '28px', borderBottom: '1px solid #f5f5f5' }}>
                      <td style={{ borderRight: '1px solid #ccc' }}></td>
                      <td style={{ borderRight: '1px solid #ccc' }}></td>
                      <td style={{ borderRight: '1px solid #ccc' }}></td>
                      <td style={{ borderRight: '1px solid #ccc' }}></td>
                      <td style={{ borderRight: '1px solid #ccc' }}></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Footer: Terms + Totals */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#0F3D34', marginBottom: 4 }}>
                    குறிப்பு / Terms:
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#1a1a1a', lineHeight: 1.6, fontWeight: 700 }}>
                    <div>• 916 தங்க நகைகள் சிறந்த முறையில் ஆர்டரின் பேரில் செய்து தரப்படும்.</div>
                    <div>• வெள்ளி கொலுசுகளுக்கு செய்கூலி, சேதாரம் இல்லை.</div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#666' }}>ரூபாய் வார்த்தைகளில் / Amount in words:</div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#0F3D34', marginTop: 2 }}>
                      {numberToWords(grandTotal)}
                    </div>
                  </div>
                </div>

                <div style={{ border: '1px solid #0F3D34', borderRadius: 5, padding: '8px 12px', background: '#FAFDFB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, color: '#444' }}>
                    <span>மொத்த மதிப்பு (Sub Total):</span>
                    <span style={{ fontWeight: 600 }}>Rs.{subTotal.toLocaleString('en-IN')}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, color: '#c00' }}>
                      <span>மொத்த தள்ளுபடி (Less Discount):</span>
                      <span>-Rs.{totalDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {(parseFloat(oldGoldAmount) || 0) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, color: '#c00', fontWeight: 700 }}>
                      <span>பழைய தங்கம் கழிப்பு (Less Old Gold {oldGoldWeight ? `[${oldGoldWeight}g]` : ''}):</span>
                      <span>-Rs.{parseFloat(oldGoldAmount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {(parseFloat(oldSilverAmount) || 0) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, color: '#c00', fontWeight: 700 }}>
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
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F3D34' }}>மொத்த பில் தொகை (Grand Total):</span>
                    <span style={{ fontSize: '17px', fontWeight: 800, color: '#0F3D34', fontFamily: 'Outfit, sans-serif' }}>
                      Rs.{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thank You */}
              <div style={{ textAlign: 'center', margin: '14px 0 24px 0' }}>
                <div style={{ fontSize: '18px', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 700, color: '#0F3D34' }}>
                  Thank You
                </div>
              </div>

              {/* 3 Separated Signatures */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 10px', marginTop: 20 }}>
                <div style={{ width: '120px', textAlign: 'center', borderTop: '1px solid #555', paddingTop: 5 }}>
                  <span style={{ fontSize: '10px', color: '#333', fontWeight: 600 }}>Customer Signature</span>
                </div>
                <div style={{ width: '120px', textAlign: 'center', borderTop: '1px solid #555', paddingTop: 5 }}>
                  <span style={{ fontSize: '10px', color: '#333', fontWeight: 600 }}>Cashier</span>
                </div>
                <div style={{ width: '120px', textAlign: 'center', borderTop: '1px solid #555', paddingTop: 5 }}>
                  <span style={{ fontSize: '10px', color: '#333', fontWeight: 600 }}>Salesman</span>
                </div>
              </div>

              {/* Bottom Terms & Conditions Footer */}
              <div style={{ borderTop: '1px solid #0F3D34', marginTop: 16, paddingTop: 6, fontSize: '8.5px', color: '#111', fontWeight: 600, textAlign: 'center' }}>
                Terms &amp; Conditions: Gold and Silver goods purchased can be exchanged without any difference within 7 days from the date of purchase
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillModal
