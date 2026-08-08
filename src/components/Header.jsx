import React from 'react'
import { Menu, LogOut } from 'lucide-react'
import EagleLogo from './EagleLogo'

const Header = ({ username = 'Admin', onLogout, onMenuClick }) => {
  return (
    <header className="app-header">
      <div className="flex" style={{ gap: 12 }}>


        <div className="flex" style={{ gap: 10 }}>
          <EagleLogo size={32} />
          <div>
            <span className="header-title">Eagle Silvers Wholesale</span>
            <span className="header-subtitle hidden-mobile">நகை வணிக முறைமை</span>
          </div>
        </div>
      </div>

      <div className="header-actions">
        <div className="user-chip">
          <div className="user-avatar">
            {username.charAt(0).toUpperCase()}
          </div>
          <span>{username}</span>
        </div>

        <button
          className="btn btn-danger-ghost flex"
          onClick={onLogout}
          title="வெளியேறு (Logout)"
          style={{ gap: 4 }}
        >
          <LogOut size={15} />
          <span>வெளியேறு</span>
        </button>
      </div>
    </header>
  )
}

export default Header
