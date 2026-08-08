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

      {/* Table - Strictly aligned to window width with ZERO horizontal scrollbar */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ width: '100%', overflowX: 'hidden' }}>
          <table style={{ width: '100%', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={{ width: '5%', textAlign: 'center' }}>#</th>
                <th style={{ width: '25%', textAlign: 'left' }}>பொருள் (Variant)</th>
                <th style={{ width: '15%', textAlign: 'left' }}>பிரிவு</th>
                <th style={{ width: '15%', textAlign: 'left' }}>உட்பிரிவு</th>
                <th style={{ width: '12%', textAlign: 'right' }}>எடை (g)</th>
                <th style={{ width: '13%', textAlign: 'center' }}>எண்ணிக்கை</th>
                <th style={{ width: '15%', textAlign: 'right' }}>மொத்த எடை</th>
                {role === 'admin' && <th style={{ width: '60px', textAlign: 'center' }}></th>}
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
    </div>
  )
}

export default StockDashboard
