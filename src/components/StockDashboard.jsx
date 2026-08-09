import React, { useState } from 'react'
import { Search, Trash2, Package } from 'lucide-react'

const StockDashboard = ({ products = [], onDelete, role = 'admin' }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))]

  const filtered = products.filter(p => {
    const matchesSearch = 
      p.variant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subcategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.detail?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory
    return matchesSearch && matchesCat
  })

  // Total Statistics
  const totalStockQty = products.filter(p => p.category !== 'கொடி').reduce((sum, p) => sum + (p.quantity || 0), 0)
  const totalStockRolls = products.filter(p => p.category === 'கொடி').length
  const totalStockWeight = products.reduce((sum, p) => sum + (p.weight || 0), 0)

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      <div className="flex-between mb-16">
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>
            இருப்புப் பட்டியல் (Stock Inventory)
          </h2>
          <p className="text-sub">
            மொத்த சரக்கு: <strong style={{ color: 'var(--text-main)' }}>{totalStockQty} pcs {totalStockRolls > 0 ? `+ ${totalStockRolls} ரோல்` : ''}</strong> | மொத்த எடை: <strong style={{ color: 'var(--text-main)' }}>{totalStockWeight.toFixed(3)}g</strong>
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card mb-16" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-sub)' }} />
            <input
              type="text"
              placeholder="தேடுக (பொருள், வகை, விபரம்)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 36, height: 38, fontSize: '13px' }}
            />
          </div>

          <div style={{ minWidth: '140px' }}>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              style={{ height: 38, fontSize: '13px' }}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'அனைத்துப் பிரிவுகள்' : c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="card desktop-table-view" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-wrap">
          <table style={{ minWidth: '600px' }}>
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>#</th>
                <th style={{ minWidth: '160px', textAlign: 'left' }}>பொருள் (Variant)</th>
                <th style={{ minWidth: '100px', textAlign: 'left' }}>பிரிவு</th>
                <th style={{ minWidth: '100px', textAlign: 'left' }}>உட்பிரிவு</th>
                <th style={{ minWidth: '90px', textAlign: 'center' }}>அளவு</th>
                <th style={{ minWidth: '110px', textAlign: 'right' }}>மொத்த எடை (Total Wt)</th>
                {role === 'admin' && <th style={{ width: '50px', textAlign: 'center' }}></th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => {
                const totalWt = p.weight || 0
                const qty = p.quantity || 0
                const isKodi = p.category === 'கொடி'

                return (
                  <tr key={p.id || idx}>
                    <td style={{ textAlign: 'center', color: 'var(--text-sub)' }}>{idx + 1}</td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <div className="fw-600" style={{ color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.variant}</div>
                      {p.detail && <div style={{ fontSize: 11, color: 'var(--text-sub)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.detail}</div>}
                    </td>
                    <td><span className="badge badge-blue">{p.category}</span></td>
                    <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.subcategory || '-'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="text-gold fw-600">{isKodi ? '1 ரோல்' : `${qty} pcs`}</span>
                    </td>
                    <td style={{ textAlign: 'right' }} className="fw-700 text-gold">
                      {totalWt > 0 ? `${totalWt.toFixed(3)}g` : '-'}
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
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: 36, color: 'var(--text-sub)' }}>பொருட்கள் எதுவும் இல்லை</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View Cards */}
      <div className="mobile-card-list">
        {filtered.map((p, idx) => {
          const totalWt = p.weight || 0
          const qty = p.quantity || 0
          const isKodi = p.category === 'கொடி'

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
                    onClick={() => onDelete && onDelete(p.id)}
                    title="நீக்கு"
                    style={{ padding: '4px 8px', height: '28px' }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {/* 2-Metric Highlight */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, background: 'rgba(26, 61, 99, 0.05)', padding: '8px 10px', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-sub)' }}>அளவு (Stock Format)</div>
                  <div className="fw-700" style={{ fontSize: '13px', color: 'var(--text-main)' }}>{isKodi ? '🌀 1 ரோல்' : `${qty} pcs`}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-sub)' }}>மொத்த எடை (Weight)</div>
                  <div className="fw-700 text-gold" style={{ fontSize: '13px' }}>{totalWt > 0 ? `${totalWt.toFixed(3)}g` : '-'}</div>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 36, color: 'var(--text-sub)' }}>
            <Package size={28} opacity={0.3} style={{ margin: '0 auto 8px' }} />
            <div>பொருட்கள் எதுவும் இல்லை</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StockDashboard
