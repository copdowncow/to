import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Copy } from 'lucide-react'
import { api } from '../lib/api'
import type { Order } from '../types'
import { Balloon } from '../components/Balloon'
import toast from 'react-hot-toast'

const STATUS: Record<string, { label: string; cls: string }> = {
  pending:   { label: '⏳ Ожидает подтверждения', cls: 'badge-yellow' },
  confirmed: { label: '✅ Подтверждён',            cls: 'badge-green'  },
  preparing: { label: '📦 Готовится',              cls: 'badge-blue'   },
  delivered: { label: '🚚 Доставлен',              cls: 'badge-green'  },
  cancelled: { label: '❌ Отменён',                cls: 'badge-red'    },
}

export function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    api.orders.get(id)
      .then(setOrder)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const copyId = () => {
    if (order) {
      navigator.clipboard.writeText(order.id)
      toast.success('Номер скопирован!')
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 24px', color: 'var(--text-muted)', gap: 12 }}>
      <div className="spinner" /> Загрузка заказа...
    </div>
  )

  if (!order) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Заказ не найден</p>
      <Link to="/"><button className="btn btn-primary">На главную</button></Link>
    </div>
  )

  const st = STATUS[order.status] || { label: order.status, cls: 'badge-yellow' }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>

      {/* Success icon */}
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(16,185,129,0.12)',
        border: '2px solid rgba(16,185,129,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 28px', color: '#10b981',
      }}>
        <CheckCircle size={38} />
      </div>

      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,5vw,44px)',
        fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 12,
      }}>
        Заказ оформлен!
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 36 }}>
        Мы получили ваш заказ и свяжемся по адресу <strong style={{ color: 'var(--text)' }}>{order.customer_email}</strong>
      </p>

      {/* Order card */}
      <div className="card" style={{ padding: 24, textAlign: 'left', marginBottom: 28 }}>

        {/* Order number */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg2)', borderRadius: 10, padding: '12px 16px', marginBottom: 20,
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>
              Номер заказа
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 13, letterSpacing: '1px' }}>
              #{order.id.slice(0, 8).toUpperCase()}
            </div>
          </div>
          <button
            onClick={copyId}
            className="btn btn-icon"
            title="Скопировать"
          >
            <Copy size={14} />
          </button>
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Покупатель', val: order.customer_name },
            { label: 'Email',      val: order.customer_email },
            order.customer_phone ? { label: 'Телефон', val: order.customer_phone } : null,
            order.delivery_address ? { label: 'Адрес', val: order.delivery_address } : null,
          ].filter(Boolean).map(row => row && (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
              <span style={{ fontWeight: 600, maxWidth: '60%', textAlign: 'right' }}>{row.val}</span>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
            <span style={{ color: 'var(--text-muted)' }}>Статус</span>
            <span className={`badge ${st.cls}`}>{st.label}</span>
          </div>
        </div>

        {/* Products */}
        {order.order_items && order.order_items.length > 0 && (
          <>
            <div className="divider" style={{ margin: '18px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {order.order_items.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {item.products && <Balloon color={item.products.color} size={28} />}
                  <div style={{ flex: 1, fontSize: 13 }}>
                    <div style={{ fontWeight: 600 }}>{item.products?.name ?? 'Шар'}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{item.quantity.toLocaleString()} шт</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{item.total_price.toFixed(2)} ₽</div>
                </div>
              ))}
            </div>
            <div className="divider" style={{ margin: '16px 0 12px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14 }}>Итого</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24, color: 'var(--accent2)' }}>
                {order.total_price.toFixed(2)} ₽
              </span>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/"><button className="btn btn-outline">На главную</button></Link>
        <Link to="/catalog"><button className="btn btn-primary">🎈 Заказать ещё</button></Link>
      </div>
    </div>
  )
}
