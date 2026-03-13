import React from 'react'
interface BalloonProps {
  color: string
  size?: number
  animate?: boolean
  style?: React.CSSProperties
}

export function Balloon({ color, size = 80, animate = false, style }: BalloonProps) {
  const w = size
  const h = size * 1.2

  return (
    <div style={{
      width: w, height: h + 24,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      animation: animate ? 'float 3.5s ease-in-out infinite' : undefined,
      ...style,
    }}>
      {/* Balloon body */}
      <div style={{
        width: w, height: h,
        background: `radial-gradient(ellipse at 38% 32%, ${lighten(color, 0.45)} 0%, ${color} 55%, ${darken(color, 0.25)} 100%)`,
        borderRadius: '50% 50% 48% 52% / 58% 58% 42% 42%',
        boxShadow: `0 8px 28px ${color}66`,
        position: 'relative',
        flexShrink: 0,
      }}>
        {/* Shine */}
        <div style={{
          position: 'absolute', top: '18%', left: '24%',
          width: '22%', height: '14%',
          background: 'rgba(255,255,255,0.45)',
          borderRadius: '50%',
          transform: 'rotate(-30deg)',
        }} />
        {/* Knot */}
        <div style={{
          position: 'absolute', bottom: -5, left: '50%',
          transform: 'translateX(-50%)',
          width: 8, height: 8,
          background: darken(color, 0.2),
          borderRadius: '50% 50% 40% 40%',
        }} />
      </div>
      {/* String */}
      <div style={{
        width: 1.5, height: 22,
        background: 'rgba(255,255,255,0.25)',
      }} />
    </div>
  )
}

function lighten(hex: string, amount: number): string {
  try {
    const num = parseInt(hex.replace('#', ''), 16)
    const r = Math.min(255, (num >> 16) + Math.round(255 * amount))
    const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * amount))
    const b = Math.min(255, (num & 0xff) + Math.round(255 * amount))
    return `rgb(${r},${g},${b})`
  } catch { return hex }
}

function darken(hex: string, amount: number): string {
  try {
    const num = parseInt(hex.replace('#', ''), 16)
    const r = Math.max(0, (num >> 16) - Math.round(255 * amount))
    const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * amount))
    const b = Math.max(0, (num & 0xff) - Math.round(255 * amount))
    return `rgb(${r},${g},${b})`
  } catch { return hex }
}
