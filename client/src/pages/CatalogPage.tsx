
import React from 'react'
import { useProducts } from '../hooks/useProducts'
import { ProductCard } from '../components/ProductCard'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../hooks/useCart'

export function CatalogPage() {
  const { products, loading, error } = useProducts()
  const { totalItems, totalPrice } = useCart()

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: 40, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="badge badge-yellow" style={{ marginBottom: 12 }}>
            🎈 Все цвета по единой цене
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 44px)',
            fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 10,
          }}>Каталог шаров</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, maxWidth: 480 }}>
            100 шаров любого цвета — <strong style={{ color: 'var(--accent2)' }}>0.70 ₽</strong>.
            Кратность: 100 штук. Шаги по 100.
          </p>
        </div>

        {/* Floating cart summary */}
        {totalItems > 0 && (
          <Link to="/cart">
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--card)', border: '1px solid var(--border2)',
              borderRadius: 16, padding: '14px 20px',
              transition: 'border-color 0.2s', cursor: 'pointer',
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.borderColor = '#ff4d6d')}
            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
            >
              <ShoppingCart size={18} color="var(--accent)" />
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>В корзине</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800 }}>
                  {totalItems.toLocaleString()} шт · {totalPrice.toFixed(2)} ₽
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Skeletons */}
      {loading && (
        <div className="grid-products">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 380 }} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{
          background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.25)',
          borderRadius: 16, padding: '36px 28px', maxWidth: 560,
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: 8, color: 'var(--accent)' }}>
            Ошибка загрузки
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>{error}</p>
          <div style={{
            background: 'var(--bg2)', borderRadius: 10, padding: '12px 16px',
            fontSize: 13, color: 'var(--text-muted)',
          }}>
            💡 Убедитесь, что файл <code style={{ color: 'var(--accent2)' }}>.env</code> заполнен
            и SQL миграция выполнена в Supabase
          </div>
        </div>
      )}

      {/* Products grid */}
      {!loading && !error && products.length > 0 && (
        <>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
            Найдено товаров: <strong style={{ color: 'var(--text)' }}>{products.length}</strong>
          </div>
          <div className="grid-products">
            {products.map((product, i) => (
              <div key={product.id} className="fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty */}
      {!loading && !error && products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎈</div>
          <p style={{ fontSize: 18, fontWeight: 600 }}>Товары не найдены</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>
            Запустите SQL миграцию в Supabase для добавления товаров
          </p>
        </div>
      )}
    </div>
  )
}
