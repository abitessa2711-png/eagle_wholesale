import React, { useState } from 'react'
import { Printer, X } from 'lucide-react'
import EagleLogo from './EagleLogo'

const numberToWords = (num) => {
  if (!num || isNaN(num)) return 'Zero Rupees Only'
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
                'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  
  const convertLessThanOneThousand = (n) => {
    if (n >= 100) {
      return ones[Math.floor(n / 100)] + ' Hundred ' + convertLessThanOneThousand(n % 100)
    }
    if (n >= 20) {
      return tens[Math.floor(n / 10)] + ' ' + ones[n % 10]
    }
    return ones[n]
  }

  const n = Math.floor(num)
  if (n === 0) return 'Zero Rupees Only'
  
  let result = ''
  if (Math.floor(n / 100000) > 0) {
    result += convertLessThanOneThousand(Math.floor(n / 100000)) + ' Lakh '
  }
  if (Math.floor((n % 100000) / 1000) > 0) {
    result += convertLessThanOneThousand(Math.floor((n % 100000) / 1000)) + ' Thousand '
  }
  if (n % 1000 > 0) {
    result += convertLessThanOneThousand(n % 1000)
  }
  return result.trim() + ' Rupees Only'
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
          <title>Eagle Silvers Bill - ${bill.billId || 'ESW'}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 5mm;
            }
            body {
              margin: 0;
              padding: 0;
              background: #FFFFFF;
              font-family: 'Noto Sans Tamil', -apple-system, sans-serif;
              color: #000000;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            * {
              box-sizing: border-box;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #000;
              padding: 4px 6px;
            }
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
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()} style={{ padding: '8px', zIndex: 99999 }}>
      <div className="modal-content" style={{ width: '100%', maxWidth: '840px', background: '#091036', maxHeight: '96vh', overflowY: 'auto' }}>
        {/* Header Action Bar */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
            விற்பனை ரசீது (Cash Bill / Tax Invoice Preview)
          </h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-gold" onClick={handlePrint} style={{ height: '36px', padding: '0 14px', fontSize: '13px' }}>
              <Printer size={15} /> அச்சடி (Print Bill)
            </button>
            <button className="btn btn-ghost" onClick={onClose} style={{ height: '36px', padding: '0 10px' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Gold, Silver, Old Gold & Old Silver Rate Input */}
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center', background: '#0A0E1A', flexWrap: 'wrap' }}>
          <div style={{ fontSize: 12, color: '#C8A96A', fontWeight: 700 }}>Today's Rate (பதிக்க):</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <label style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>Gold Rs/g:</label>
            <input
              type="number"
              placeholder="e.g. 7200"
              value={goldRate}
              onChange={e => setGoldRate(e.target.value)}
              style={{ width: 75, padding: '4px 6px', fontSize: 12, borderRadius: 4, border: '1px solid #C8A96A', background: '#0D1526', color: '#fff', height: 28 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <label style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>Silver Rs/g:</label>
            <input
              type="number"
              placeholder="e.g. 90"
              value={silverRate}
              onChange={e => setSilverRate(e.target.value)}
              style={{ width: 75, padding: '4px 6px', fontSize: 12, borderRadius: 4, border: '1px solid #888', background: '#0D1526', color: '#fff', height: 28 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <label style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>Old Gold Wt:</label>
            <input
              type="number"
              step="0.001"
              placeholder="e.g. 8.5"
              value={oldGoldWeight}
              onChange={e => setOldGoldWeight(e.target.value)}
              style={{ width: 75, padding: '4px 6px', fontSize: 12, borderRadius: 4, border: '1px solid #C8A96A', background: '#0D1526', color: '#fff', height: 28 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <label style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>Old Gold Less ₹:</label>
            <input
              type="number"
              placeholder="e.g. 2000"
              value={oldGoldAmount}
              onChange={e => setOldGoldAmount(e.target.value)}
              style={{ width: 75, padding: '4px 6px', fontSize: 12, borderRadius: 4, border: '1px solid #C8A96A', background: '#0D1526', color: '#fff', height: 28 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <label style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>Old Silver Wt:</label>
            <input
              type="number"
              step="0.001"
              placeholder="e.g. 25.5"
              value={oldSilverWeight}
              onChange={e => setOldSilverWeight(e.target.value)}
              style={{ width: 75, padding: '4px 6px', fontSize: 12, borderRadius: 4, border: '1px solid #888', background: '#0D1526', color: '#fff', height: 28 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <label style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap' }}>Old Silver Less ₹:</label>
            <input
              type="number"
              placeholder="e.g. 1500"
              value={oldSilverAmount}
              onChange={e => setOldSilverAmount(e.target.value)}
              style={{ width: 75, padding: '4px 6px', fontSize: 12, borderRadius: 4, border: '1px solid #C8A96A', background: '#0D1526', color: '#fff', height: 28 }}
            />
          </div>
        </div>

        {/* Preview Document Container */}
        <div className="bill-container" style={{ padding: '12px 6px', width: '100%', boxSizing: 'border-box', background: '#060B28' }}>
          <div id="printable-sales-bill" style={{ width: '100%' }}>
            <div className="bill-document" style={{
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

              {/* Header Phone Number — 100% visible on mobile */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9.5px', color: '#333', fontWeight: 700, marginBottom: 6, flexWrap: 'wrap', gap: 4 }}>
                <div style={{ color: '#0F3D34', fontWeight: 800 }}>ESTD: 2026</div>
                <div>Ph: +91 81480 03454, +91 73391 60876</div>
              </div>

              {/* Header: Shop Details */}
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
                    gap: 10,
                    flexWrap: 'wrap',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#0F3D34',
                    background: '#F5F9F5',
                    WebkitPrintColorAdjust: 'exact',
                    printColorAdjust: 'exact',
                    border: '1px solid #c8e0c8',
                    borderRadius: 4,
                    padding: '5px 10px',
                    marginBottom: 10
                  }}
                >
                  <span>Today's Rate / இன்றைய விலை:</span>
                  {goldRate && <span>Gold: Rs.{goldRate}/g</span>}
                  {silverRate && <span>Silver: Rs.{silverRate}/g</span>}
                  {(oldGoldAmount || oldGoldWeight) && (
                    <span>Old Gold: {oldGoldWeight ? `${oldGoldWeight}g` : ''} {oldGoldAmount ? `(-Rs.${oldGoldAmount})` : ''}</span>
                  )}
                  {(oldSilverAmount || oldSilverWeight) && (
                    <span>Old Silver: {oldSilverWeight ? `${oldSilverWeight}g` : ''} {oldSilverAmount ? `(-Rs.${oldSilverAmount})` : ''}</span>
                  )}
                </div>
              )}

              {/* Bill Meta Details — 2 Columns with wrap */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '10px',
                background: '#FAFAFA',
                fontSize: '10.5px',
                flexWrap: 'wrap',
                gap: 6
              }}>
                <div>
                  <div><strong>பில் எண் (Bill No):</strong> {bill.billId || 'ESW-101'}</div>
                  <div><strong>வாடிக்கையாளர் (To):</strong> {bill.customerName || 'வாடிக்கையாளர்'}</div>
                  {bill.mobile && <div><strong>செல்பேசி (Mobile):</strong> {bill.mobile}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div><strong>தேதி (Date):</strong> {new Date(bill.date || Date.now()).toLocaleDateString('en-IN')}</div>
                  <div><strong>விற்பனை வகை:</strong> Wholesale Cash</div>
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', fontSize: '10.5px' }}>
                <thead>
                  <tr style={{ background: '#0F3D34', color: '#FFFFFF' }}>
                    <th style={{ border: '1px solid #0F3D34', padding: '5px 4px', textAlign: 'center', width: '7%' }}>#</th>
                    <th style={{ border: '1px solid #0F3D34', padding: '5px 6px', textAlign: 'left', width: '38%' }}>பொருள் (Description)</th>
                    <th style={{ border: '1px solid #0F3D34', padding: '5px 4px', textAlign: 'right', width: '16%' }}>எடை (Wt)</th>
                    <th style={{ border: '1px solid #0F3D34', padding: '5px 4px', textAlign: 'center', width: '10%' }}>அளவு</th>
                    <th style={{ border: '1px solid #0F3D34', padding: '5px 4px', textAlign: 'right', width: '14%' }}>விலை</th>
                    <th style={{ border: '1px solid #0F3D34', padding: '5px 6px', textAlign: 'right', width: '15%' }}>தொகை (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <td style={{ border: '1px solid #ccc', padding: '4px', textAlign: 'center' }}>{idx + 1}</td>
                      <td style={{ border: '1px solid #ccc', padding: '4px 6px' }}>
                        <strong style={{ color: '#0F3D34' }}>{item.variant}</strong>
                        <div style={{ fontSize: '9px', color: '#666' }}>{item.category} {item.subcategory ? `• ${item.subcategory}` : ''} {item.detail ? `(${item.detail})` : ''}</div>
                      </td>
                      <td style={{ border: '1px solid #ccc', padding: '4px', textAlign: 'right' }}>
                        {(item.totalWeight || (item.quantity * (item.weight || 0))).toFixed(3)}g
                      </td>
                      <td style={{ border: '1px solid #ccc', padding: '4px', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ border: '1px solid #ccc', padding: '4px', textAlign: 'right' }}>
                        Rs.{(item.unitPrice || (item.totalAmount / item.quantity)).toLocaleString('en-IN')}
                      </td>
                      <td style={{ border: '1px solid #ccc', padding: '4px 6px', textAlign: 'right', fontWeight: 600 }}>
                        Rs.{((item.totalAmount || item.total) - (item.discountAmount || 0)).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary and Terms Box */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10, marginBottom: '10px' }}>
                {/* Terms Box */}
                <div style={{ border: '1px solid #ddd', borderRadius: 4, padding: '6px 8px', background: '#FAFAFA', fontSize: '9.5px', color: '#444' }}>
                  <div style={{ fontWeight: 800, color: '#0F3D34', marginBottom: 3 }}>குறிப்பு / Terms:</div>
                  <div style={{ lineHeight: 1.3 }}>
                    • 916 தங்க நகைகள் சிறந்த முறையில் ஆர்டரின் பேரில் செய்து தரப்படும்.<br/>
                    • பில் தொகைக்கு உரிய ரசீது உடன் கொண்டு வரவும்.<br/>
                    • செக் அல்லது பணப் பரிவர்த்தனைகள் அனைத்தும் சிவகாசி வரம்பிற்கு உட்பட்டது.
                  </div>
                </div>

                {/* Totals Breakdown */}
                <div style={{ border: '1px solid #0F3D34', borderRadius: 4, padding: '6px 10px', background: '#FAFDFB', fontSize: '10.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, color: '#444' }}>
                    <span>மொத்த எடை (Total Weight):</span>
                    <span style={{ fontWeight: 700 }}>{totalWeight.toFixed(3)} g</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, color: '#444' }}>
                    <span>மொத்த எண்ணிக்கை (Total Qty):</span>
                    <span style={{ fontWeight: 700 }}>{totalQty} pcs</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, color: '#444' }}>
                    <span>மொத்த மதிப்பு (Sub Total):</span>
                    <span style={{ fontWeight: 700 }}>Rs.{subTotal.toLocaleString('en-IN')}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, color: '#c00' }}>
                      <span>மொத்த தள்ளுபடி (Less Discount):</span>
                      <span>-Rs.{totalDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {(parseFloat(oldGoldAmount) || 0) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, color: '#c00', fontWeight: 700 }}>
                      <span>பழைய தங்கம் கழிப்பு (Less Old Gold {oldGoldWeight ? `[${oldGoldWeight}g]` : ''}):</span>
                      <span>-Rs.{parseFloat(oldGoldAmount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {(parseFloat(oldSilverAmount) || 0) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#c00', fontWeight: 700 }}>
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
                      margin: '0 -10px -6px -10px',
                      padding: '6px 10px',
                      borderRadius: '0 0 3px 3px'
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F3D34' }}>மொத்த பில் தொகை (Grand Total):</span>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F3D34', fontFamily: 'Outfit, sans-serif' }}>
                      Rs.{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount in words */}
              <div style={{ fontSize: '9.5px', color: '#555', fontStyle: 'italic', marginBottom: 8 }}>
                <strong>தொகை வார்த்தைகளில்:</strong> {numberToWords(grandTotal)}
              </div>

              {/* Signatures */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, paddingTop: 10, borderTop: '1px dashed #ccc', fontSize: '9.5px', color: '#333' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ height: 22 }} />
                  <div>வாடிக்கையாளர் கையொப்பம்</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ height: 22 }} />
                  <div>ஈகிள் சில்வர்ஸ் நிர்வாகம் (Authorized Signatory)</div>
                </div>
              </div>

              {/* Footer Terms */}
              <div style={{ textAlign: 'center', fontSize: '8.5px', color: '#777', marginTop: 8, borderTop: '1px solid #eee', paddingTop: 4 }}>
                • Terms &amp; Conditions: Gold and Silver goods purchased can be exchanged without any difference within 7 days from the date of purchase.
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default BillModal
