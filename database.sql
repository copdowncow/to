-- ================================================================
-- BALLOON SHOP — ПОЛНАЯ СХЕМА БАЗЫ ДАННЫХ
-- Запустите в Supabase: SQL Editor → New query → Paste → Run
-- ================================================================

-- Таблица товаров
CREATE TABLE IF NOT EXISTS products (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL,
  description     TEXT,
  color           TEXT NOT NULL,
  price_per_100   NUMERIC(10,2) NOT NULL DEFAULT 0.70,
  image_url       TEXT,
  stock           INT NOT NULL DEFAULT 0,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Таблица заказов
CREATE TABLE IF NOT EXISTS orders (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name     TEXT NOT NULL,
  customer_email    TEXT NOT NULL,
  customer_phone    TEXT,
  delivery_address  TEXT,
  total_price       NUMERIC(10,2) NOT NULL,
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','confirmed','preparing','delivered','cancelled')),
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Позиции заказа
CREATE TABLE IF NOT EXISTS order_items (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id        UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id      UUID REFERENCES products(id),
  quantity        INT NOT NULL CHECK (quantity > 0),
  quantity_per_100 NUMERIC(10,2) NOT NULL,
  unit_price      NUMERIC(10,2) NOT NULL,
  total_price     NUMERIC(10,2) NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Корзины (сессии)
CREATE TABLE IF NOT EXISTS cart_sessions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_key TEXT UNIQUE NOT NULL,
  items       JSONB DEFAULT '[]',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Индексы ────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_active     ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_email        ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status       ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_orderid ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_key            ON cart_sessions(session_key);

-- ── Триггер updated_at ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at      ON products;
DROP TRIGGER IF EXISTS trg_orders_updated_at        ON orders;
DROP TRIGGER IF EXISTS trg_cart_sessions_updated_at ON cart_sessions;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_cart_sessions_updated_at
  BEFORE UPDATE ON cart_sessions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Данные: 10 цветов шаров ────────────────────────────────────
INSERT INTO products (name, description, color, price_per_100, stock) VALUES
  ('Красные шары',      'Яркие красные латексные шары диаметром 30 см. Идеальны для любого праздника.',          '#EF233C', 0.70, 10000),
  ('Синие шары',        'Насыщенные синие шары 30 см. Отлично смотрятся в сочетании с белыми и золотыми.',       '#3B82F6', 0.70, 10000),
  ('Золотые шары',      'Блестящие золотые металлик-шары. Создают атмосферу роскоши и торжества.',               '#F59E0B', 0.70,  6000),
  ('Белые шары',        'Нежные белые шары — универсальный выбор для свадеб, юбилеев и корпоративов.',           '#F0F0F0', 0.70, 12000),
  ('Розовые шары',      'Нежно-розовые шары 30 см. Прекрасно подходят для девичников и дней рождения.',          '#EC4899', 0.70,  8000),
  ('Зелёные шары',      'Сочные зелёные шары. Создают природную, свежую атмосферу на любом мероприятии.',        '#10B981', 0.70,  8000),
  ('Фиолетовые шары',   'Элегантные фиолетовые шары. Придают мероприятию загадочность и изысканность.',          '#8B5CF6', 0.70,  6000),
  ('Оранжевые шары',    'Яркие оранжевые шары — отличный выбор для осенних праздников и Хэллоуина.',             '#F97316', 0.70,  7000),
  ('Серебряные шары',   'Серебряные металлик-шары. Создают современный, стильный декор для любого события.',     '#94A3B8', 0.70,  5000),
  ('Чёрные шары',       'Стильные чёрные шары для изысканного декора. Идеальны для строгих мероприятий.',        '#1F2937', 0.70,  4000)
ON CONFLICT DO NOTHING;

-- ── RLS (Row Level Security) ────────────────────────────────────
ALTER TABLE products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_sessions ENABLE ROW LEVEL SECURITY;

-- Публичное чтение активных товаров
DROP POLICY IF EXISTS "products_read" ON products;
CREATE POLICY "products_read" ON products
  FOR SELECT USING (is_active = true);

-- Сервер (service_role) управляет товарами через bypass RLS
-- Заказы: создание и чтение открыты (сервер валидирует)
DROP POLICY IF EXISTS "orders_insert" ON orders;
DROP POLICY IF EXISTS "orders_select" ON orders;
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_select" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "order_items_insert" ON order_items;
DROP POLICY IF EXISTS "order_items_select" ON order_items;
CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "order_items_select" ON order_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "cart_all" ON cart_sessions;
CREATE POLICY "cart_all" ON cart_sessions FOR ALL USING (true) WITH CHECK (true);

-- ── Готово! ────────────────────────────────────────────────────
-- Проверьте данные:
-- SELECT * FROM products;
-- SELECT COUNT(*) FROM products; -- должно быть 10
