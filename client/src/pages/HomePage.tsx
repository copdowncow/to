import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Truck, Star } from 'lucide-react'
import { Balloon } from '../components/Balloon'

const COLORS = ['#ff4d6d', '#ffd60a', '#4361ee', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#ffffff']

export function HomePage() {
  return (
    <div>
      {/* ── Hero ────────────────────────────────────────── */}
      <section style={{
        minHeight: '92vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center',
        padding: '64px 24px', position: 'relative', overflow: 'hidden',
      }}>
        {/* BG glow blobs */}
        {[
          { color: '#ff4d6d', x: '15%', y: '20%', s: 340 },
          { color: '#4361ee', x: '80%', y: '15%', s: 280 },
          { color: '#ffd60a', x: '70%', y: '75%', s: 220 },
          { color: '#8b5cf6', x: '20%', y: '80%', s: 260 },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute', width: b.s, height: b.s,
            borderRadius: '50%', background: b.color,
            opacity: 0.06, filter: 'blur(80px)',
            top: b.y, left: b.x, transform: 'translate(-50%,-50%)',
            pointerEvents: 'none',
          }} />
        ))}

        {/* Floating balloons (decorative) */}
        {COLORS.slice(0, 6).map((color, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${[8, 75, 18, 82, 40, 65][i]}%`,
            left: `${[3, 4, 92, 90, 96, 96][i]}%`,
            opacity: 0.22,
            animationDelay: `${i * 0.4}s`,
          }}>
            <Balloon color={color} size={32 + i * 6} animate />
          </div>
        ))}

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 780 }}>
          <div className="badge badge-yellow fade-up" style={{ marginBottom: 28 }}>
            🎉 Лучшая оптовая цена · Быстрая доставка
          </div>

          <h1 className="fade-up-2" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(38px, 8vw, 84px)',
            fontWeight: 900, lineHeight: 1.04,
            letterSpacing: '-3px', marginBottom: 24,
          }}>
            100 шаров<br />
            <span style={{
              background: 'linear-gradient(130deg, #ff4d6d 30%, #ffd60a)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>за 0.70 ₽</span>
          </h1>

          <p className="fade-up-3" style={{
            fontSize: 18, color: 'var(--text-muted)',
            maxWidth: 480, margin: '0 auto 44px', lineHeight: 1.7,
          }}>
            Воздушные шары оптом и в розницу. 10 цветов в наличии.
            Фиксированная цена — без скрытых наценок.
          </p>

          <div className="fade-up-3" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/catalog">
              <button className="btn btn-primary btn-lg">
                Смотреть каталог <ArrowRight size={18} />
              </button>
            </Link>
            <Link to="/cart">
              <button className="btn btn-outline btn-lg">
                Моя корзина
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Price callout ────────────────────────────────── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{
          maxWidth: 960, margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(255,77,109,0.1), rgba(255,214,10,0.08))',
          border: '1px solid rgba(255,77,109,0.2)',
          borderRadius: 24, padding: '52px 40px', textAlign: 'center',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: -12, marginBottom: 28 }}>
            {COLORS.slice(0, 8).map((c, i) => (
              <div key={i} style={{ marginLeft: i > 0 ? -10 : 0, zIndex: i }}>
                <Balloon color={c} size={42} />
              </div>
            ))}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 4vw, 52px)',
            fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 12,
          }}>
            100 шаров = <span style={{ color: 'var(--accent2)' }}>0.70 ₽</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
            Единая фиксированная цена для всех 10 цветов. Кратность заказа — 100 штук.
            Чем больше заказ — тем выгоднее доставка.
          </p>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{
          maxWidth: 1000, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
        }}>
          {[
            { icon: <Zap size={22} />, color: '#ffd60a', title: 'Мгновенный заказ', desc: 'Оформление за 2 минуты без регистрации. Просто выберите шары и заполните форму.' },
            { icon: <Shield size={22} />, color: '#4361ee', title: 'Гарантия качества', desc: 'Каждая партия проходит проверку. Латексные шары 30 см от проверенных производителей.' },
            { icon: <Truck size={22} />, color: '#10b981', title: 'Быстрая доставка', desc: 'Доставка по всей России за 1–3 дня. Самовывоз или курьер — ваш выбор.' },
            { icon: <Star size={22} />, color: '#ff4d6d', title: '10 цветов', desc: 'Красный, синий, золото, белый, розовый, зелёный, фиолетовый, оранжевый, серебро, чёрный.' },
          ].map((f, i) => (
            <div key={i} className="card" style={{ padding: '28px 24px' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, marginBottom: 16,
                background: f.color + '1a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: f.color,
              }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, marginBottom: 8 }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={{ padding: '0 24px 100px', textAlign: 'center' }}>
        <Link to="/catalog">
          <button className="btn btn-primary btn-lg" style={{ fontSize: 16 }}>
            🎈 Заказать шары <ArrowRight size={20} />
          </button>
        </Link>
      </section>
    </div>
  )
}
