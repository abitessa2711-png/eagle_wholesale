import React from 'react'
import { Package, TrendingUp, AlertTriangle } from 'lucide-react'

const Dashboard = ({ products = [], sales = [], setActiveTab }) => {
  // Aggregate Stats (Wholesale Batch Weights)
  const totalWeight = products.reduce((s, p) => s + (p.weight || 0), 0)
  const totalQty    = products.reduce((s, p) => s + (p.quantity || 0), 0)
  
  const productGroups = {};
  products.forEach(p => {
    const key = `${p.category}-${p.subcategory}-${p.variant}`;
    if (!productGroups[key]) {
      productGroups[key] = { ...p, totalQuantity: 0, totalWeight: 0 };
    }
    productGroups[key].totalQuantity += (p.quantity || 0);
    productGroups[key].totalWeight += (p.weight || 0);
  });
  
  const lowStock = Object.values(productGroups).filter(g => g.totalQuantity < 3);
  
  const todayStr = new Date().toISOString().split('T')[0]
  const todaysSales = sales.filter(s => (s.date && s.date.split('T')[0]) === todayStr)
  
  const todayRevenue = todaysSales.reduce((s, i) => s + (i.total || 0), 0)

  const cards = [
    { label: 'இருப்பு விபரம்', sub: 'Total Stock in Hand', value: `${totalQty} pcs | ${totalWeight.toFixed(2)}g`, icon: <Package size={20} />, color: 'var(--gold)' },
    { label: 'இன்றைய விற்பனை', sub: "Today's Revenue", value: `₹${todayRevenue.toLocaleString('en-IN')}`, icon: <TrendingUp size={20} />, color: 'var(--success)' },
    { label: 'குறைந்த இருப்பு', sub: 'Low Stock Alerts', value: `${lowStock.length} வகைகள்`, icon: <AlertTriangle size={20} />, color: 'var(--danger)' },
  ]

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      <div className="flex-between mb-16">
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>
            முகப்புத் திரை (Dashboard)
          </h2>
          <p className="text-sub">Eagle Silvers Wholesale — Real-time Business Overview</p>
        </div>
      </div>

      {/* 3 Stat Cards */}
      <div className="stat-cards-grid" style={{ marginBottom: 16 }}>
        {cards.map((c, i) => (
          <div key={i} className="card stat-card" style={{ padding: '14px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(43, 92, 146, 0.25)',
              border: '1px solid rgba(179, 205, 224, 0.2)', color: c.color
            }}>
              {c.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="stat-value" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2, fontFamily: 'Outfit, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.value}
              </div>
              <div className="stat-label" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-sub)', marginTop: 2 }}>
                {c.label}
              </div>
              <div style={{ fontSize: '10.5px', color: 'rgba(163, 194, 224, 0.6)' }}>
                {c.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-panels-grid">
        {/* Recent Items */}
        <div className="card" style={{ padding: '16px 18px' }}>
          <div className="card-title" style={{ fontSize: '14.5px', marginBottom: 12 }}>
            சமீபத்திய வரவு (Recently Added Stock)
          </div>

          {/* Desktop Table */}
          <div className="desktop-table-view">
            <div className="table-wrap">
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: '45%', textAlign: 'left' }}>ITEM</th>
                    <th style={{ width: '25%', textAlign: 'left' }}>CATEGORY</th>
                    <th style={{ width: '30%', textAlign: 'right' }}>STOCK</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(-5).reverse().map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className="fw-600" style={{ color: 'var(--text-main)', fontSize: '13px' }}>{p.variant}</div>
                        {p.detail && <div style={{ fontSize: 11, color: 'var(--text-sub)' }}>{p.detail}</div>}
                      </td>
                      <td><span className="badge badge-blue">{p.category}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="text-gold fw-600">{p.quantity} pcs | {(p.weight || 0).toFixed(2)}g</span>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan="3" style={{ textAlign: 'center', padding: 24, color: 'var(--text-sub)' }}>சரக்கு விவரங்கள் எதுவும் இல்லை</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List */}
          <div className="mobile-card-list">
            {products.slice(-5).reverse().map(p => (
              <div key={p.id} className="mobile-item-card" style={{ padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span className="fw-700" style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>{p.variant}</span>
                  <span className="badge badge-blue" style={{ fontSize: '10px' }}>{p.category}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: 'var(--text-sub)' }}>
                  <span>{p.subcategory || p.detail || '-'}</span>
                  <span className="fw-700 text-gold">{p.quantity} pcs | {(p.weight || 0).toFixed(2)}g</span>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-sub)', fontSize: '12.5px' }}>
                சரக்கு விவரங்கள் எதுவும் இல்லை
              </div>
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="card" style={{ padding: '16px 18px' }}>
          <div className="card-title" style={{ fontSize: '14.5px', marginBottom: 12 }}>
            குறைந்த இருப்பு எச்சரிக்கை (Low Stock)
          </div>
          <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
            {lowStock.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 16px', color: 'var(--text-sub)', fontSize: '13px' }}>
                அனைத்துப் பொருட்களும் போதுமான அளவில் உள்ளன!
              </div>
            ) : (
              lowStock.map((p, idx) => (
                <div key={idx} className="flex-between" style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div className="fw-600" style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>{p.variant}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>{p.category} {p.subcategory ? `• ${p.subcategory}` : ''}</div>
                  </div>
                  <div className="text-danger fw-700" style={{ fontSize: '13px' }}>{p.totalQuantity} pcs | {p.totalWeight.toFixed(2)}g</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
