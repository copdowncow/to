import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { Balloon } from '../components/Balloon'

export function CartPage() {
  const { items, loading, totalPrice, totalItems, updateQuantity, removeFromCart } = useCart()

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12, color: 'var(--text-muted)' }}>
      <div className="spinner" /> Загрузка корзины...
    </div>
  )

  if (items.length === 0) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center', padding: 24 }}>
      <ShoppingBag size={56} color="var(--text-muted)" style={{ marginBottom: 24, opacity: 0.4 }} />
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, marginBottom: 10 }}>
        Корзина пуста
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32, maxWidth: 320 }}>
        Выберите шары из каталога и добавьте в корзину
      </p>
      <Link to="/catalog">
        <button className="btn btn-primary btn-lg">
          Перейти в каталог <ArrowRight size={18} />
        </button>
      </Link>
    </div>
  )

  return (
    <div className="page">
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 40px)',
        fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 32,
      }}>
        Корзина
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) 320px',
        gap: 24, alignItems: 'start',
      }}>
        {/* Items list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map(item => (
            <div key={item.product_id} className="card" style={{
              padding: '18px 20px',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <Balloon color={item.product_color} size={44} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800, marginBottom: 3 }}>
                  {item.product_name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {item.price_per_100.toFixed(2)} ₽ / 100 шт
                </div>
              </div>

              {/* Qty controls */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--bg2)', borderRadius: 10, padding: '6px 10px',
                border: '1px solid var(--border)',
              }}>
                <button
                  className="btn btn-icon"
                  onClick={() => updateQuantity(item.product_id, item.quantity - 100)}
                  style={{ width: 28, height: 28, borderRadius: 7 }}
                >
                  <Minus size={12} />
                </button>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800,
                  minWidth: 72, textAlign: 'center',
                }}>
                  {item.quantity.toLocaleString()} шт
                </span>
                <button
                  className="btn btn-icon"
                  onClick={() => updateQuantity(item.product_id, item.quantity + 100)}
                  style={{ width: 28, height: 28, borderRadius: 7 }}
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Line total */}
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16,
                minWidth: 76, textAlign: 'right',
              }}>
                {item.total_price.toFixed(2)} ₽
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.product_id)}
                style={{
                  width: 34, height: 34, borderRadius: 9, border: '1px solid rgba(255,77,109,0.25)',
                  background: 'rgba(255,77,109,0.08)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,77,109,0.2)'
                  e.currentTarget.style.borderColor = 'var(--accent)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,77,109,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(255,77,109,0.25)'
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {/* Continue shopping */}
          <Link to="/catalog" style={{ fontSize: 13, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            ← Продолжить покупки
          </Link>
        </div>

        {/* Summary sidebar */}
        <div className="card" style={{ padding: 24, position: 'sticky', top: 80 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, marginBottom: 20 }}>
            Итого
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Позиций', val: `${items.length}` },
              { label: 'Всего шаров', val: `${totalItems.toLocaleString()} шт` },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span>{val}</span>
              </div>
            ))}
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15 }}>Сумма</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 26, color: 'var(--accent2)' }}>
                {totalPrice.toFixed(2)} ₽
              </span>
            </div>
          </div>

          {/* Calc helper */}
          <div style={{
            background: 'var(--bg2)', borderRadius: 10, padding: '10px 14px',
            fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5,
          }}>
            {totalItems.toLocaleString()} шт ÷ 100 × 0.70 = <strong style={{ color: 'var(--text)' }}>{totalPrice.toFixed(2)} ₽</strong>
          </div>

          <Link to="/checkout">
            <button className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15, borderRadius: 12 }}>
              Оформить заказ <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
