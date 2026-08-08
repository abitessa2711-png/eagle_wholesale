import React from 'react'
import { LayoutDashboard, Warehouse, PlusCircle, ShoppingBag, History, RefreshCw, Wrench, X } from 'lucide-react'
import EagleLogo from './EagleLogo'

const Sidebar = ({ activeTab, setActiveTab, role = 'admin', isOpen = false, onClose }) => {
  const navItems = [
    { id: 'dashboard',   label: 'முகப்பு',           sub: 'Dashboard',    icon: LayoutDashboard },
    { id: 'stock',       label: 'இருப்பு',           sub: 'Stock List',   icon: Warehouse },
    { id: 'add',         label: 'சேர்க்கை',         sub: 'Add Stock',    icon: PlusCircle },
    { id: 'sell',        label: 'விற்பனை / பில்',    sub: 'Sell & Bill',  icon: ShoppingBag },
    { id: 'sold',        label: 'விற்பனை வரலாறு', sub: 'Sold Items',  icon: History },
    { id: 'old_buyback', label: 'பழைய நகை கொள்முதல்', sub: 'Old Item Buyback', icon: RefreshCw },
    { id: 'reports',     label: 'சேவை பதிவேடு',     sub: 'Service Log',  icon: Wrench },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <EagleLogo size={36} />
          <div>
            <div className="sidebar-brand-name">Eagle Silvers</div>
            <div className="sidebar-brand-sub">WHOLESALE JEWELLERY</div>
          </div>
          {isOpen && (
            <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <div
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id)
                  if (onClose) onClose()
                }}
              >
                <Icon size={18} />
                <div>
                  <div style={{ lineHeight: 1.2 }}>{item.label}</div>
                  <div style={{ fontSize: '10px', opacity: 0.6, marginTop: '1px' }}>{item.sub}</div>
                </div>
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="online-dot" />
          <div>
            <div style={{ fontWeight: 600, color: '#FFFFFF' }}>நிர்வாகி (Admin)</div>
            <div style={{ fontSize: '10px', opacity: 0.6 }}>Eagle Silvers Wholesale</div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
