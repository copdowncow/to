import React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { api } from '../lib/api'
import toast from 'react-hot-toast'
import { Balloon } from '../components/Balloon'

interface Form {
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  notes: string
}

export function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<Form>({
    customer_name: '', customer_email: '',
    customer_phone: '', delivery_address: '', notes: '',
  })

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customer_name.trim()) return toast.error('Укажите имя')
    if (!form.customer_email.trim()) return toast.error('Укажите email')
    if (items.length === 0) return toast.error('Корзина пуста!')

    setLoading(true)
    try {
      const order = await api.orders.create({ ...form, items })
      await clearCart()
      toast.success('🎈 Заказ оформлен!')
      navigate(`/order/${order.id}`)
    } catch (err: any) {
      toast.error(err.message || 'Ошибка при оформлении')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Корзина пуста</p>
      <Link to="/catalog"><button className="btn btn-primary">В каталог</button></Link>
    </div>
  )

  const inputField = (
    name: keyof Form,
    label: string,
    placeholder: string,
    type = 'text',
    required = false
  ) => (
    <div>
      <label className="label">{label}{required && ' *'}</label>
      <input
        className="input"
        name={name}
        type={type}
        value={form[name]}
        onChange={set}
        placeholder={placeholder}
        required={required}
      />
    </div>
  )

  return (
    <div className="page" style={{ maxWidth: 960 }}>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,4vw,40px)',
        fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 32,
      }}>
        Оформление заказа
      </h1>

      <form onSubmit={submit} style={{
        display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px',
        gap: 24, alignItems: 'start',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Contact */}
          <div className="card" style={{ padding: '24px 24px 28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, marginBottom: 20 }}>
              Контактные данные
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {inputField('customer_name', 'Ваше имя', 'Иван Иванов', 'text', true)}
              {inputField('customer_email', 'Email', 'ivan@example.com', 'email', true)}
              {inputField('customer_phone', 'Телефон', '+7 (999) 123-45-67', 'tel')}
            </div>
          </div>

          {/* Delivery */}
          <div className="card" style={{ padding: '24px 24px 28px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, marginBottom: 20 }}>
              Доставка
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {inputField('delivery_address', 'Адрес доставки', 'г. Москва, ул. Пушкина, д. 1')}
              <div>
                <label className="label">Комментарий</label>
                <textarea
                  className="input"
                  name="notes"
                  value={form.notes}
                  onChange={set}
                  placeholder="Особые пожелания, удобное время доставки..."
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ padding: '16px 24px', fontSize: 15, borderRadius: 14, opacity: loading ? 0.7 : 1 }}
          >
            {loading
              ? <><div className="spinner" style={{ width: 18, height: 18 }} /> Оформляем...</>
              : '🎈 Подтвердить заказ'
            }
          </button>
        </div>

        {/* Order summary */}
        <div className="card" style={{ padding: 22, position: 'sticky', top: 80 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, marginBottom: 16 }}>
            Ваш заказ
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {items.map(item => (
              <div key={item.product_id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Balloon color={item.product_color} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.product_name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {item.quantity.toLocaleString()} шт
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {item.total_price.toFixed(2)} ₽
                </div>
              </div>
            ))}
          </div>

          <div className="divider" style={{ marginBottom: 14 }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: 'var(--text-muted)' }}>
            <span>Шаров</span><span>{totalItems.toLocaleString()} шт</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14 }}>Сумма</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24, color: 'var(--accent2)' }}>
              {totalPrice.toFixed(2)} ₽
            </span>
          </div>
        </div>
      </form>
    </div>
  )
}
