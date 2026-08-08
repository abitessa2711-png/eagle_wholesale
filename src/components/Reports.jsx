import React from 'react'
import { BarChart2, TrendingUp, Package } from 'lucide-react'

const Reports = ({ products = [], soldItems = [], role = 'admin' }) => {
  const totalStockWeight = products.reduce((s, p) => s + ((p.quantity || 0) * (p.weight || 0)), 0)
  const totalStockQty    = products.reduce((s, p) => s + (p.quantity || 0), 0)
  
  const totalSalesRevenue = soldItems.reduce((s, i) => s + (i.total || 0), 0)
  const totalSoldWeight   = soldItems.reduce((s, i) => s + (i.weight || 0), 0)
  const totalSoldQty      = soldItems.reduce((s, i) => s + (i.quantity || 0), 0)

  // Category breakdown
  const categoryStats = {}
  products.forEach(p => {
    const cat = p.category || 'Uncategorized'
    if (!categoryStats[cat]) {
      categoryStats[cat] = { qty: 0, weight: 0 }
    }
    categoryStats[cat].qty += (p.quantity || 0)
    categoryStats[cat].weight += ((p.quantity || 0) * (p.weight || 0))
  })

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-16">
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>சேவை பதிவேடு & அறிக்கைகள் (Reports & Service Log)</h2>
          <p className="text-sub">Inventory Analytics & Financial Overview</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon"><Package size={22} /></div>
          <div className="stat-value">{totalStockQty} pcs</div>
          <div className="stat-label">இருப்பு சுருக்கம்</div>
          <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>{totalStockWeight.toFixed(2)}g total weight</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><TrendingUp size={22} /></div>
          <div className="stat-value">₹{totalSalesRevenue.toLocaleString('en-IN')}</div>
          <div className="stat-label">விற்பனை வருவாய்</div>
          <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>{totalSoldQty} pcs | {totalSoldWeight.toFixed(2)}g sold</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><BarChart2 size={22} /></div>
          <div className="stat-value">{Object.keys(categoryStats).length}</div>
          <div className="stat-label">பிரிவுகள் (Categories)</div>
          <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>Active product lines</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">பிரிவு வாரியாக இருப்பு (Category Breakdown)</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>பிரிவு பெயர் (Category)</th>
                <th>எண்ணிக்கை (Total Qty)</th>
                <th style={{ textAlign: 'right' }}>மொத்த எடை (Total Weight)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(categoryStats).map(([cat, stat], idx) => (
                <tr key={cat}>
                  <td style={{ color: 'var(--text-sub)' }}>{idx + 1}</td>
                  <td className="fw-600" style={{ color: 'var(--text-main)' }}>{cat}</td>
                  <td><span className="badge badge-blue">{stat.qty} pcs</span></td>
                  <td style={{ textAlign: 'right' }} className="fw-700 text-gold">{stat.weight.toFixed(2)}g</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Reports
