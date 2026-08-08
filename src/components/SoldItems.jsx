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

      {/* Desktop View Table (hidden on mobile) */}
      <div className="desktop-table-view card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table style={{ minWidth: '680px' }}>
            <thead>
              <tr>
                <th style={{ width: '45px', textAlign: 'center' }}>S.NO</th>
                <th style={{ minWidth: '100px', textAlign: 'left' }}>பில் எண் (BILL ID)</th>
                <th style={{ minWidth: '95px', textAlign: 'left' }}>தேதி (DATE)</th>
                <th style={{ minWidth: '110px', textAlign: 'left' }}>வாடிக்கையாளர்</th>
                <th style={{ minWidth: '130px', textAlign: 'left' }}>பொருள் (VARIANT)</th>
                <th style={{ minWidth: '85px', textAlign: 'right' }}>எடை (WEIGHT)</th>
                <th style={{ minWidth: '55px', textAlign: 'center' }}>QTY</th>
                <th style={{ minWidth: '90px', textAlign: 'right' }}>மொத்தம்</th>
                <th style={{ width: '45px', textAlign: 'center' }}></th>
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

      {/* Mobile View Cards (100% Full Width, ZERO Sideways Scroll) */}
      <div className="mobile-card-list">
        {filtered.map((item, idx) => (
          <div key={item.id || idx} className="mobile-item-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '11px', color: 'var(--text-sub)', fontWeight: 700 }}>#{idx + 1}</span>
                <span className="fw-700" style={{ fontSize: '13px', color: 'var(--secondary)' }}>{item.billId}</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-sub)' }}>
                {new Date(item.date).toLocaleDateString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div className="fw-700" style={{ fontSize: '15px', color: 'var(--text-main)' }}>{item.variant}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-sub)' }}>
                  👤 {item.customerName || 'Walk-in'} {item.category ? `• ${item.category}` : ''}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-sub)' }}>பில் தொகை</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#1A3D63' }}>₹{item.total?.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border)', paddingTop: 6 }}>
              <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>
                எடை: <strong style={{ color: 'var(--text-main)' }}>{item.weight ? `${item.weight}g` : '-'}</strong> | அளவு: <strong style={{ color: 'var(--text-main)' }}>{item.quantity} pcs</strong>
              </div>
              <button
                className="btn btn-danger-ghost"
                style={{ padding: '4px 8px', height: '28px', fontSize: '11px' }}
                onClick={() => {
                  if (confirm('இந்தப் விற்பனைப் பதிவை நீக்க விரும்புகிறீர்களா? (Delete this sale entry?)')) {
                    onDeleteSale && onDeleteSale(item.id)
                  }
                }}
              >
                <Trash2 size={13} /> நீக்கு
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 30, color: 'var(--text-sub)' }}>
            விற்பனைப் பதிவுகள் எதுவும் இல்லை
          </div>
        )}
      </div>
    </div>
  )
}

export default SoldItems
