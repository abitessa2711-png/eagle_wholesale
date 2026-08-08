import React from 'react'

export default function EagleLogo({ size = 38, className = '' }) {
  return (
    <img
      src="/logo.jpg"
      alt="Eagle Silvers Wholesale Logo"
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        objectFit: 'cover',
        boxShadow: '0 0 10px rgba(229, 184, 105, 0.4)',
        border: '1.5px solid #E5B869',
        display: 'inline-block',
        flexShrink: 0
      }}
    />
  )
}
