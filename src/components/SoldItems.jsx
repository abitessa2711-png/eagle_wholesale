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
  const totalSalesWeight = filtered.reduce((acc, item) => acc + (item.weight || 0), 0)
  const totalSalesQty = filtered.reduce((acc, item) => acc + (item.quantity || 0), 0)

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      <div className="flex-between mb-16">
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>
            விற்பனை வரலாறு (Sold Items History)
          </h2>
          <p className="text-sub">
            மொத்த விற்பனை: <strong style={{ color: 'var(--text-main)' }}>₹{totalSalesVal.toLocaleString('en-IN')}</strong> | எடை: <strong style={{ color: 'var(--text-main)' }}>{totalSalesWeight.toFixed(3)}g</strong> | அளவு: <strong style={{ color: 'var(--text-main)' }}>{totalSalesQty} pcs</strong>
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card mb-16" style={{ padding: '12px 16px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-sub)' }} />
          <input
            type="text"
            placeholder="பில் எண் / வாடிக்கையாளர் / பொருள்..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '38px', height: '38px', fontSize: '13.5px' }}
          />
        </div>
      </div>

      {/* Desktop View Table (Proportionally Spaced with Compact Layout) */}
      <div className="desktop-table-view card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table style={{ width: '100%', minWidth: '640px' }}>
            <thead>
              <tr>
                <th style={{ width: '38px', textAlign: 'center' }}>#</th>
                <th style={{ width: '90px', textAlign: 'left' }}>பில் எண்</th>
                <th style={{ width: '85px', textAlign: 'left' }}>தேதி</th>
                <th style={{ width: '130px', textAlign: 'left' }}>வாடிக்கையாளர்</th>
                <th style={{ width: '160px', textAlign: 'left' }}>பொருள் (Variant)</th>
                <th style={{ width: '65px', textAlign: 'center' }}>அளவு</th>
                <th style={{ width: '85px', textAlign: 'right' }}>எடை (g)</th>
                <th style={{ width: '100px', textAlign: 'right' }}>பில் தொகை</th>
                <th style={{ width: '40px', textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td style={{ textAlign: 'center', color: 'var(--text-sub)', fontWeight: 600 }}>{idx + 1}</td>
                  <td className="fw-600" style={{ color: 'var(--secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.billId}
                  </td>
                  <td style={{ fontSize: 11.5, color: 'var(--text-sub)' }}>
                    {new Date(item.date).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--text-main)' }}>
                    {item.customerName || 'Walk-in'}
                  </td>
                  <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span className="fw-600" style={{ color: 'var(--text-main)' }}>{item.variant}</span>
                    {item.category && <span style={{ fontSize: 11, color: 'var(--text-sub)', display: 'block' }}>{item.category}</span>}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.quantity} pcs</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{item.weight ? `${item.weight.toFixed(3)}g` : '-'}</td>
                  <td style={{ textAlign: 'right' }} className="fw-700 text-gold">
                    ₹{item.total?.toLocaleString('en-IN')}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn btn-danger-ghost"
                      style={{ padding: '4px' }}
                      title="நீக்கு (Delete)"
                      onClick={() => {
                        if (confirm('இந்தப் விற்பனைப் பதிவை நீக்க விரும்புகிறீர்களா? நீக்கினால் இதன் அளவு மற்றும் எடை மீண்டும் நேரடி இருப்பில் சேர்க்கப்படும். (Delete this sale entry & restore stock to inventory?)')) {
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

      {/* Mobile View Cards (100% Full Width, Compact & Zero Sideways Scroll) */}
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
                <div className="fw-700" style={{ fontSize: '14.5px', color: 'var(--text-main)' }}>{item.variant}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-sub)' }}>
                  👤 {item.customerName || 'Walk-in'} {item.category ? `• ${item.category}` : ''}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-sub)' }}>பில் தொகை</div>
                <div style={{ fontSize: '15.5px', fontWeight: 800, color: '#1A3D63' }}>₹{item.total?.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border)', paddingTop: 6 }}>
              <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>
                எடை: <strong style={{ color: 'var(--text-main)' }}>{item.weight ? `${item.weight.toFixed(3)}g` : '-'}</strong> | அளவு: <strong style={{ color: 'var(--text-main)' }}>{item.quantity} pcs</strong>
              </div>
              <button
                className="btn btn-danger-ghost"
                style={{ padding: '4px 8px', height: '28px', fontSize: '11px' }}
                onClick={() => {
                  if (confirm('இந்தப் விற்பனைப் பதிவை நீக்க விரும்புகிறீர்களா? நீக்கினால் இதன் அளவு மற்றும் எடை மீண்டும் நேரடி இருப்பில் சேர்க்கப்படும். (Delete this sale entry & restore stock to inventory?)')) {
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
