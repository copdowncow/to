import React from 'react'
import { useState } from 'react'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Product } from '../types'
import { useCart } from '../hooks/useCart'
import { Balloon } from './Balloon'

interface Props { product: Product }

export function ProductCard({ product }: Props) {
  const [qty, setQty] = useState(100)
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)

  const price = parseFloat(((qty / 100) * product.price_per_100).toFixed(2))

  const dec = () => setQty(q => Math.max(100, q - 100))
  const inc = () => setQty(q => q + 100)

  const handleAdd = async () => {
    setAdding(true)
    await addToCart(product, qty)
    toast.success(`🎈 ${qty} шт добавлено!`)
    setAdding(false)
  }

  return (
    <div className="card" style={{ overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-5px)'
        el.style.boxShadow = `0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px ${product.color}44`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = ''
        el.style.boxShadow = ''
      }}
    >
      {/* Preview area */}
      <div style={{
        height: 160,
        background: `radial-gradient(ellipse at 50% 80%, ${product.color}33 0%, transparent 70%), var(--bg2)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${product.color}22, transparent 70%)`,
        }} />
        <Balloon color={product.color} size={76} animate />
        {/* Stock badge */}
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          border: '1px solid var(--border2)',
          borderRadius: 8, padding: '3px 10px',
          fontSize: 11, fontWeight: 700, color: 'var(--text-muted)',
        }}>
          {product.stock.toLocaleString()} шт
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 18px 20px' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800,
          marginBottom: 4, letterSpacing: '-0.3px',
        }}>{product.name}</h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>
          {product.description || 'Латексный шар 30 см'}
        </p>

        {/* Price tag */}
        <div className="badge badge-yellow" style={{ marginBottom: 14, fontSize: 13 }}>
          <strong>{product.price_per_100.toFixed(2)} ₽</strong>
          <span style={{ fontWeight: 400, opacity: 0.7 }}> / 100 шт</span>
        </div>

        {/* Qty selector */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
          background: 'var(--bg2)', borderRadius: 10, padding: '6px 10px',
          border: '1px solid var(--border)',
        }}>
          <button className="btn-icon btn" onClick={dec} style={{ width: 28, height: 28, fontSize: 14 }}>
            <Minus size={12} />
          </button>
          <div style={{
            flex: 1, textAlign: 'center',
            fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800,
          }}>
            {qty.toLocaleString()} шт
          </div>
          <button className="btn-icon btn" onClick={inc} style={{ width: 28, height: 28 }}>
            <Plus size={12} />
          </button>
        </div>

        {/* Total */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 14, fontSize: 13,
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Итого:</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16 }}>
            {price.toFixed(2)} ₽
          </span>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleAdd}
          disabled={adding}
          style={{
            width: '100%',
            background: adding
              ? 'var(--card2)'
              : `linear-gradient(135deg, ${product.color}dd, ${product.color})`,
            color: '#fff',
            opacity: adding ? 0.7 : 1,
          }}
        >
          {adding
            ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Добавляем...</>
            : <><ShoppingCart size={14} /> В корзину</>
          }
        </button>
      </div>
    </div>
  )
}
