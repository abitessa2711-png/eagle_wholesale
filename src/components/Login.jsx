import React, { useState } from 'react'
import EagleLogo from './EagleLogo'

const Login = ({ onLogin, onShowSignup }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('தயவுசெய்து மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்')
      return
    }
    if (email.trim().toLowerCase() === 'admin@eagle.com' && password === 'eagle@admin') {
      onLogin({
        id: 'eagle-admin',
        name: 'Eagle Admin',
        email: 'admin@eagle.com',
        role: 'admin',
        token: 'eagle-token'
      })
    } else {
      setError('தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்!')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(-45deg, #0A1931, #1A3D63, #2C5A88, #4A7FA7, #0A1931)',
      backgroundSize: '400% 400%',
      animation: 'animatedOcean 14s ease infinite'
    }}>
      {/* Inject Keyframe Animations */}
      <style>{`
        @keyframes animatedOcean {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(60px, -40px) scale(1.15); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-50px, 50px) scale(1.2); }
        }
      `}</style>

      {/* Ambient Animated Glowing Glass Orbs */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '20%',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(179, 207, 229, 0.35) 0%, rgba(74, 127, 167, 0.1) 70%, transparent 100%)',
        filter: 'blur(50px)',
        animation: 'floatOrb1 10s ease-in-out infinite',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '20%',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(26, 61, 99, 0.5) 0%, rgba(10, 25, 49, 0.2) 70%, transparent 100%)',
        filter: 'blur(60px)',
        animation: 'floatOrb2 12s ease-in-out infinite',
        zIndex: 0
      }} />

      {/* Grid line overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(246, 250, 253, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(246, 250, 253, 0.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        zIndex: 1
      }} />

      {/* Glassmorphism Login Card */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '390px',
        background: 'rgba(10, 25, 49, 0.78)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderRadius: '30px',
        border: '1px solid rgba(179, 207, 229, 0.25)',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(179, 207, 229, 0.35)',
        padding: '46px 38px 40px',
        textAlign: 'center',
        color: '#F6FAFD'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
          <EagleLogo size={78} />
        </div>

        <h1 style={{
          fontSize: '26px',
          fontWeight: 800,
          color: '#F6FAFD',
          fontFamily: 'Outfit, sans-serif',
          marginBottom: '3px',
          letterSpacing: '0.3px',
          textShadow: '0 2px 10px rgba(0,0,0,0.4)'
        }}>
          ஈகிள் சில்வர்ஸ்
        </h1>

        <div style={{
          fontSize: '11.5px',
          fontWeight: 800,
          color: '#B3CFE5',
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          marginBottom: '28px'
        }}>
          Wholesale &amp; Retail Shop
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.25)',
            color: '#FFD2D2',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '12px',
            padding: '10px 12px',
            fontSize: '12.5px',
            marginBottom: '18px',
            backdropFilter: 'blur(6px)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              color: '#B3CFE5',
              marginBottom: '6px'
            }}>
              மின்னஞ்சல் (Email)
            </label>
            <input
              type="email"
              placeholder="admin@eagle.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              required
              style={{
                width: '100%',
                height: '46px',
                padding: '0 16px',
                borderRadius: '12px',
                border: '1px solid rgba(179, 207, 229, 0.22)',
                background: 'rgba(26, 61, 99, 0.55)',
                color: '#F6FAFD',
                fontSize: '14px',
                fontFamily: "'Inter', sans-serif",
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={e => { e.target.style.borderColor = '#B3CFE5'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 127, 167, 0.35)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(179, 207, 229, 0.22)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={{ marginBottom: '26px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 700,
              color: '#B3CFE5',
              marginBottom: '6px'
            }}>
              கடவுச்சொல் (Password)
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              required
              style={{
                width: '100%',
                height: '46px',
                padding: '0 16px',
                borderRadius: '12px',
                border: '1px solid rgba(179, 207, 229, 0.22)',
                background: 'rgba(26, 61, 99, 0.55)',
                color: '#F6FAFD',
                fontSize: '14px',
                fontFamily: "'Inter', sans-serif",
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={e => { e.target.style.borderColor = '#B3CFE5'; e.target.style.boxShadow = '0 0 0 3px rgba(74, 127, 167, 0.35)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(179, 207, 229, 0.22)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <button type="submit" style={{
            width: '100%',
            height: '48px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #1A3D63 0%, #4A7FA7 100%)',
            color: '#F6FAFD',
            fontSize: '15px',
            fontWeight: 800,
            fontFamily: "'Noto Sans Tamil', 'Outfit', sans-serif",
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: '0 8px 24px rgba(10, 25, 49, 0.45)',
            letterSpacing: '0.3px'
          }}
          onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 30px rgba(10, 25, 49, 0.65)'; }}
          onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 24px rgba(10, 25, 49, 0.45)'; }}
          >
            உள்நுழை (Login)
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          borderTop: '1px solid rgba(179, 207, 229, 0.15)',
          paddingTop: '16px'
        }}>
          <div style={{ fontSize: '12.5px', color: '#B3CFE5' }}>
            புதிய கணக்கு?{' '}
            <span
              onClick={onShowSignup}
              style={{ color: '#F6FAFD', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
            >
              பதிவு செய்
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
