
import React from 'react'
export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '28px 24px',
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontSize: 13,
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 12, fontWeight: 700,
        background: 'linear-gradient(135deg,#ff4d6d,#ffd60a)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        marginBottom: 6,
      }}>
        🎈 ШарыМаркет
      </div>
      <div>© {new Date().getFullYear()} · 100 шаров = <strong style={{ color: 'var(--accent2)' }}>0.70 ₽</strong> · Все права защищены</div>
    </footer>
  )
}
