import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../hooks/useCart'

export function Navbar() {
  const { totalItems } = useCart()
  const { pathname } = useLocation()

  const isActive = (p: string) => pathname === p

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10,10,20,0.88)',
      backdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 64,
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 900,
          background: 'linear-gradient(135deg, #ff4d6d, #ffd60a)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px',
        }}>🎈 ШарыМаркет</Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: 4 }}>
          {[
            { to: '/', label: 'Главная' },
            { to: '/catalog', label: 'Каталог' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{
              padding: '7px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600,
              transition: 'all 0.15s',
              background: isActive(to) ? 'rgba(255,77,109,0.12)' : 'transparent',
              color: isActive(to) ? 'var(--accent)' : 'var(--text-muted)',
              border: isActive(to) ? '1px solid rgba(255,77,109,0.25)' : '1px solid transparent',
            }}>{label}</Link>
          ))}
        </nav>

        {/* Cart */}
        <Link to="/cart">
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 18px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg,#ff4d6d,#ff6b35)',
            color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}>
            <ShoppingCart size={16} />
            <span className="hide-mobile">Корзина</span>
            {totalItems > 0 && (
              <span style={{
                background: '#ffd60a', color: '#000',
                borderRadius: '50%', width: 20, height: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800,
              }}>
                {totalItems > 9999 ? '9k+' : totalItems > 999 ? Math.floor(totalItems / 100) + 'h' : totalItems}
              </span>
            )}
          </button>
        </Link>
      </div>
    </header>
  )
}
