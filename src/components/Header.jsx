import React from 'react'
import { Menu, LogOut } from 'lucide-react'
import EagleLogo from './EagleLogo'

const Header = ({ username = 'Admin', onLogout, onMenuClick }) => {
  return (
    <header className="app-header">
      <div className="flex" style={{ gap: 10, alignItems: 'center' }}>
        {/* Mobile Hamburger Button */}
        <button
          className="btn btn-ghost menu-toggle-btn"
          onClick={onMenuClick}
          title="மெனு (Menu)"
          style={{ padding: '6px 8px', borderRadius: 8 }}
        >
          <Menu size={22} />
        </button>

        <div className="flex" style={{ gap: 10, alignItems: 'center' }}>
          <EagleLogo size={32} />
          <div>
            <span className="header-title">Eagle Silvers</span>
            <span className="header-subtitle hidden-mobile">Wholesale • நகை வணிக முறைமை</span>
          </div>
        </div>
      </div>

      <div className="header-actions">
        <div className="user-chip">
          <div className="user-avatar">
            {(username || 'A').charAt(0).toUpperCase()}
          </div>
          <span className="hidden-mobile">{username}</span>
        </div>

        <button
          className="btn btn-danger-ghost flex"
          onClick={onLogout}
          title="வெளியேறு (Logout)"
          style={{ gap: 4, padding: '6px 12px', height: '36px' }}
        >
          <LogOut size={15} />
          <span className="hidden-mobile">வெளியேறு</span>
        </button>
      </div>
    </header>
  )
}

export default Header
