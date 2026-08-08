import React from 'react'
import { Package, TrendingUp, AlertTriangle } from 'lucide-react'

const Dashboard = ({ products = [], sales = [], setActiveTab }) => {
  // Aggregate Stats
  const totalWeight = products.reduce((s, p) => s + ((p.quantity || 0) * (p.weight || 0)), 0)
  const totalQty    = products.reduce((s, p) => s + (p.quantity || 0), 0)
  
  const productGroups = {};
  products.forEach(p => {
    const key = `${p.category}-${p.subcategory}-${p.variant}`;
    if (!productGroups[key]) {
      productGroups[key] = { ...p, totalQuantity: 0, totalWeight: 0 };
    }
    productGroups[key].totalQuantity += (p.quantity || 0);
    productGroups[key].totalWeight += ((p.quantity || 0) * (p.weight || 0));
  });
  
  const lowStock = Object.values(productGroups).filter(g => g.totalQuantity < 3);
  
  const todayStr = new Date().toISOString().split('T')[0]
  const todaysSales = sales.filter(s => (s.date && s.date.split('T')[0]) === todayStr)
  
  const todayRevenue = todaysSales.reduce((s, i) => s + (i.total || 0), 0)

  const cards = [
    { label: 'இருப்பு விபரம்', sub: 'Total Stock (Qty | Wt)', value: `${totalQty} pcs | ${totalWeight.toFixed(2)}g`, icon: <Package size={22} />, color: 'var(--gold)' },
    { label: 'இன்றைய விற்பனை', sub: "Today's Net Total", value: `₹${todayRevenue.toLocaleString('en-IN')}`, icon: <TrendingUp size={22} />, color: 'var(--success)' },
    { label: 'குறைந்த இருப்பு', sub: 'Low Stock Alerts', value: lowStock.length, icon: <AlertTriangle size={22} />, color: 'var(--danger)' },
  ]

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-16">
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>நிர்வாகத் திரை</h2>
          <p className="text-sub">Eagle Silvers Wholesale — Business Overview & Real-time Statistics</p>
        </div>
      </div>

      {/* 3 Distinct Stat Cards with Borders & Boxes */}
      <div className="stat-cards-grid">
        {cards.map((c, i) => (
          <div key={i} className="card stat-card" style={{ padding: '20px 22px', borderRadius: '14px', position: 'relative' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '14px', background: 'rgba(43, 92, 146, 0.35)',
              border: '1px solid rgba(179, 205, 224, 0.2)', color: c.color
            }}>
              {c.icon}
            </div>
            <div className="stat-value" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', margin: '4px 0 2px', fontFamily: 'Outfit, sans-serif' }}>
              {c.value}
            </div>
            <div className="stat-label" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-sub)' }}>
              {c.label}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(163, 194, 224, 0.6)', marginTop: '2px' }}>
              {c.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-panels-grid">
        {/* Recent Items */}
        <div className="card">
          <div className="card-title">சமீபத்திய வரவு (Recently Added Stock)</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '45%', textAlign: 'left' }}>ITEM</th>
                  <th style={{ width: '25%', textAlign: 'left' }}>CATEGORY</th>
                  <th style={{ width: '30%', textAlign: 'right' }}>STOCK QTY | WT</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(-5).reverse().map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="fw-600" style={{ color: 'var(--text-main)' }}>{p.variant}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-sub)' }}>{p.detail}</div>
                    </td>
                    <td><span className="badge badge-blue">{p.category}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="text-gold fw-600">{p.quantity} pcs | {(p.quantity * p.weight).toFixed(2)}g</span>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: 30, color: 'var(--text-sub)' }}>தகவல் இல்லை</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock */}
        <div className="card">
          <div className="card-title">குறைந்த இருப்பு எச்சரிக்கை (Low Stock)</div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {lowStock.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-sub)' }}>
                அனைத்தும் சரியாக உள்ளது!
              </div>
            ) : (
              lowStock.map((p, idx) => (
                <div key={idx} className="flex-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div className="fw-600" style={{ fontSize: 14, color: 'var(--text-main)' }}>{p.variant}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-sub)' }}>{p.category} - {p.subcategory}</div>
                  </div>
                  <div className="text-danger fw-700">{p.totalQuantity} pcs | {p.totalWeight.toFixed(2)}g</div>
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
