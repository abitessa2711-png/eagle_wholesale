import React, { useState } from 'react'
import { Package, Trash2, Search } from 'lucide-react'

const StockDashboard = ({ products = [], onDelete, role = 'admin' }) => {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))

  const filtered = products.filter(p => {
    const matchesSearch = p.variant?.toLowerCase().includes(search.toLowerCase()) ||
                          p.category?.toLowerCase().includes(search.toLowerCase()) ||
                          p.detail?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-16">
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>இருப்பு பட்டியல் (Stock List)</h2>
          <p className="text-sub">Total {products.length} Products in Inventory</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="card mb-16" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-sub)' }} />
            <input
              type="text"
              placeholder="தேடுக... (Search item, category...)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '38px', height: '40px' }}
            />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ width: '200px', height: '40px' }}>
            <option value="">அனைத்து பிரிவுகள் (All Categories)</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Desktop View Table (hidden on mobile) */}
      <div className="desktop-table-view card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          <table style={{ minWidth: '640px' }}>
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>#</th>
                <th style={{ minWidth: '160px', textAlign: 'left' }}>பொருள் (Variant)</th>
                <th style={{ minWidth: '100px', textAlign: 'left' }}>பிரிவு</th>
                <th style={{ minWidth: '100px', textAlign: 'left' }}>உட்பிரிவு</th>
                <th style={{ minWidth: '80px', textAlign: 'right' }}>எடை (g)</th>
                <th style={{ minWidth: '80px', textAlign: 'center' }}>எண்ணிக்கை</th>
                <th style={{ minWidth: '90px', textAlign: 'right' }}>மொத்த எடை</th>
                {role === 'admin' && <th style={{ width: '50px', textAlign: 'center' }}></th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => {
                const unitWeight = p.weight || 0
                const qty = p.quantity || 0
                const totalWt = qty * unitWeight

                return (
                  <tr key={p.id || idx}>
                    <td style={{ textAlign: 'center', color: 'var(--text-sub)' }}>{idx + 1}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <div className="fw-600" style={{ color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.variant}</div>
                      {p.detail && <div style={{ fontSize: 11, color: 'var(--text-sub)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.detail}</div>}
                    </td>
                    <td><span className="badge badge-blue">{p.category}</span></td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.subcategory || '-'}</td>
                    <td style={{ textAlign: 'right' }}>{unitWeight > 0 ? `${unitWeight}g` : '-'}</td>
                    <td style={{ textAlign: 'center' }}><span className="text-gold fw-600">{qty} pcs</span></td>
                    <td style={{ textAlign: 'right' }} className="fw-700 text-gold">
                      {totalWt > 0 ? `${totalWt.toFixed(2)}g` : '-'}
                    </td>
                    {role === 'admin' && (
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="btn btn-danger-ghost"
                          onClick={() => onDelete && onDelete(p.id)}
                          title="நீக்கு (Delete)"
                          style={{ padding: '4px' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    )}
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: 36, color: 'var(--text-sub)' }}>பொருட்கள் எதுவும் இல்லை</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View Cards (100% Full Width, ZERO Sideways Scroll) */}
      <div className="mobile-card-list">
        {filtered.map((p, idx) => {
          const unitWeight = p.weight || 0
          const qty = p.quantity || 0
          const totalWt = qty * unitWeight

          return (
            <div key={p.id || idx} className="mobile-item-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ flex: 1, paddingRight: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-sub)', fontWeight: 700 }}>#{idx + 1}</span>
                    <span className="fw-700" style={{ fontSize: '15px', color: 'var(--text-main)' }}>{p.variant}</span>
                    <span className="badge badge-blue">{p.category}</span>
                  </div>
                  {(p.subcategory || p.detail) && (
                    <div style={{ fontSize: '12px', color: 'var(--text-sub)' }}>
                      {p.subcategory} {p.detail ? `• ${p.detail}` : ''}
                    </div>
                  )}
                </div>
                {role === 'admin' && (
                  <button
                    className="btn btn-danger-ghost"
                    onClick={() => {
                      if (confirm(`"${p.variant}" இருப்பை நீக்க விரும்புகிறீர்களா?`)) {
                        onDelete && onDelete(p.id)
                      }
                    }}
                    title="நீக்கு (Delete)"
                    style={{ padding: '6px 8px', height: '32px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* 3 Metric Box */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1.2fr',
                gap: 6,
                background: 'rgba(26, 61, 99, 0.06)',
                border: '1px solid rgba(26, 61, 99, 0.10)',
                borderRadius: 10,
                padding: '8px 10px',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-sub)' }}>தனி எடை</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>{unitWeight > 0 ? `${unitWeight}g` : '-'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-sub)' }}>எண்ணிக்கை</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{qty} pcs</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-sub)' }}>மொத்த எடை</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1A3D63' }}>{totalWt > 0 ? `${totalWt.toFixed(2)}g` : '-'}</div>
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 30, color: 'var(--text-sub)' }}>
            பொருட்கள் எதுவும் இல்லை
          </div>
        )}
      </div>
    </div>
  )
}

export default StockDashboard
