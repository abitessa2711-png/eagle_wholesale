import React, { useState } from 'react'
import { Search, Trash2 } from 'lucide-react'

const SoldItems = ({ soldItems = [], onDeleteSale }) => {
  const [search, setSearch] = useState('')

  const filtered = soldItems.filter(s =>
    s.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    s.billId?.toLowerCase().includes(search.toLowerCase()) ||
    s.variant?.toLowerCase().includes(search.toLowerCase())
  )

  const totalSalesVal = filtered.reduce((acc, item) => acc + (item.total || 0), 0)

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-16">
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>விற்பனை வரலாறு (Sold Items History)</h2>
          <p className="text-sub">Total Sales Revenue: ₹{totalSalesVal.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="card mb-16" style={{ padding: '14px 18px' }}>
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-sub)' }} />
          <input
            type="text"
            placeholder="பில் எண் / வாடிக்கையாளர்..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '38px', height: '38px' }}
          />
        </div>
      </div>

      {/* Table - Fitted 100% to window without horizontal scroll cutoff */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table style={{ width: '100%', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={{ width: '6%', textAlign: 'center' }}>S.NO</th>
                <th style={{ width: '14%', textAlign: 'left' }}>பில் எண் (BILL ID)</th>
                <th style={{ width: '12%', textAlign: 'left' }}>தேதி (DATE)</th>
                <th style={{ width: '16%', textAlign: 'left' }}>வாடிக்கையாளர்</th>
                <th style={{ width: '22%', textAlign: 'left' }}>பொருள் (VARIANT)</th>
                <th style={{ width: '10%', textAlign: 'right' }}>எடை (WEIGHT)</th>
                <th style={{ width: '5%', textAlign: 'center' }}>QTY</th>
                <th style={{ width: '10%', textAlign: 'right' }}>மொத்தம்</th>
                <th style={{ width: '5%', textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td style={{ textAlign: 'center', color: 'var(--text-sub)', fontWeight: 600 }}>{idx + 1}</td>
                  <td className="fw-600" style={{ color: 'var(--secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.billId}</td>
                  <td style={{ fontSize: 11, color: 'var(--text-sub)' }}>
                    {new Date(item.date).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.customerName || 'Walk-in'}</td>
                  <td className="fw-600" style={{ color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.variant}</td>
                  <td style={{ textAlign: 'right' }}>{item.weight ? `${item.weight}g` : '-'}</td>
                  <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right' }} className="fw-700 text-gold">
                    ₹{item.total?.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn btn-danger-ghost"
                      style={{ padding: 4 }}
                      onClick={() => {
                        if (confirm('இந்தப் விற்பனைப் பதிவை நீக்க விரும்புகிறீர்களா? (Delete this sale entry?)')) {
                          onDeleteSale && onDeleteSale(item.id)
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: 36, color: 'var(--text-sub)' }}>விற்பனைப் பதிவுகள் எதுவும் இல்லை</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SoldItems
