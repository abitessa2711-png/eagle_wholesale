import React, { useState } from 'react'
import EagleLogo from './EagleLogo'

const Signup = ({ onBack, onSignupSuccess }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSuccess(true)
    setTimeout(() => {
      onSignupSuccess()
    }, 1500)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#060B28', fontFamily: "'Noto Sans Tamil', 'Inter', sans-serif"
    }}>
      <div className="card" style={{ width: 420, maxWidth: '92vw', padding: 36, textAlign: 'center' }}>
        <div style={{ width: 70, height: 70, margin: '0 auto 16px', borderRadius: '50%', background: '#091036', border: '1.5px solid #E5B869', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EagleLogo size={46} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 6 }}>புதிய கணக்கு பதிவு</h2>
        <p style={{ fontSize: 12, color: 'var(--text-sub)', marginBottom: 24 }}>Eagle Silvers Wholesale ERP</p>

        {success ? (
          <div className="toast-success" style={{ justifyContent: 'center' }}>
            கணக்கு வெற்றிபெற உருவாக்கப்பட்டது!
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            <label>பெயர் (Full Name)</label>
            <input className="input-glass" placeholder="உங்கள் பெயர்" value={name} onChange={e => setName(e.target.value)} required style={{ marginBottom: 12 }} />

            <label>மின்னஞ்சல் (Email)</label>
            <input type="email" className="input-glass" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ marginBottom: 12 }} />

            <label>கடவுச்சொல் (Password)</label>
            <input type="password" className="input-glass" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ marginBottom: 20 }} />

            <button type="submit" className="btn btn-gold btn-full" style={{ marginBottom: 12 }}>
              பதிவு செய் (Register)
            </button>
            <button type="button" className="btn btn-ghost btn-full" onClick={onBack}>
              பின்செல் (Back to Login)
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Signup
