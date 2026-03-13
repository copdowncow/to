# 🎈 ШарыМаркет

Полноценный магазин воздушных шаров на **Express + React + Supabase**.  
Один запуск — сервер + клиент.

---

## 💰 Ценообразование
**100 шаров = 0.70 ₽** — единая цена для всех цветов.  
Кратность заказа: 100 штук.

---

## 🚀 Установка и запуск

### Шаг 1 — Клонировать и установить зависимости
```bash
# Установить все зависимости (корень + клиент)
npm run setup
```

Или вручную:
```bash
npm install
cd client && npm install && cd ..
```

---

### Шаг 2 — Настроить Supabase

1. Зайдите на [supabase.com](https://supabase.com) и создайте проект
2. Перейдите в **SQL Editor → New query**
3. Вставьте содержимое файла `database.sql` и нажмите **Run**
   - Создаст 4 таблицы: `products`, `orders`, `order_items`, `cart_sessions`
   - Добавит 10 цветов шаров
   - Настроит индексы и RLS

---

### Шаг 3 — Создать файл `.env`
```bash
cp .env.example .env
```

Откройте `.env` и заполните:
```env
SUPABASE_URL=https://ВАШ_ПРОЕКТ.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJh...  # Settings → API → service_role key
SUPABASE_ANON_KEY=eyJh...          # Settings → API → anon key
PORT=3000
NODE_ENV=production
```

> Ключи находятся в Supabase: **Settings → API**

---

### Шаг 4 — Запуск

#### Production (один запуск):
```bash
npm start
```
Откройте http://localhost:3000

#### Development (клиент + сервер отдельно):
```bash
npm run dev
```
- Сервер: http://localhost:3000
- Клиент: http://localhost:5173 (с hot-reload)

---

## 📁 Структура проекта

```
balloon-shop/
│
├── server/                     # Express сервер
│   ├── index.js                # Точка входа, middleware, static serve
│   ├── supabase.js             # Supabase клиент (service_role)
│   └── routes/
│       ├── products.js         # GET /api/products, GET /api/products/:id
│       ├── cart.js             # GET/PUT/DELETE /api/cart/:sessionKey
│       └── orders.js           # POST /api/orders, GET /api/orders/:id
│
├── client/                     # React клиент
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx      # Навигация с счётчиком корзины
│   │   │   ├── Footer.tsx      # Подвал
│   │   │   ├── ProductCard.tsx # Карточка товара с выбором кол-ва
│   │   │   └── Balloon.tsx     # SVG-шарик (переиспользуемый)
│   │   ├── pages/
│   │   │   ├── HomePage.tsx        # Главная с hero и фичами
│   │   │   ├── CatalogPage.tsx     # Каталог товаров
│   │   │   ├── CartPage.tsx        # Корзина
│   │   │   ├── CheckoutPage.tsx    # Оформление заказа
│   │   │   └── OrderSuccessPage.tsx # Подтверждение заказа
│   │   ├── hooks/
│   │   │   ├── useCart.ts      # Хук корзины (sync с сервером)
│   │   │   └── useProducts.ts  # Хук загрузки товаров
│   │   ├── lib/
│   │   │   ├── api.ts          # Все запросы к серверу
│   │   │   └── session.ts      # Ключ сессии (localStorage)
│   │   └── types/
│   │       └── index.ts        # TypeScript типы
│   ├── index.html
│   ├── vite.config.ts          # Proxy /api → localhost:3000
│   └── package.json
│
├── database.sql                # SQL для Supabase (запустить один раз)
├── .env.example                # Шаблон переменных окружения
├── package.json                # npm start / npm run dev
└── README.md
```

---

## 🔌 API эндпоинты

| Метод  | URL                       | Описание                      |
|--------|---------------------------|-------------------------------|
| GET    | `/api/health`             | Статус сервера                |
| GET    | `/api/products`           | Все активные товары           |
| GET    | `/api/products/:id`       | Один товар                    |
| GET    | `/api/cart/:sessionKey`   | Получить корзину              |
| PUT    | `/api/cart/:sessionKey`   | Обновить корзину              |
| DELETE | `/api/cart/:sessionKey`   | Очистить корзину              |
| POST   | `/api/orders`             | Создать заказ                 |
| GET    | `/api/orders/:id`         | Получить заказ по ID          |
| GET    | `/api/orders?email=...`   | Заказы по email               |

---

## 🛡️ Безопасность

- Цены валидируются **на сервере** из БД (клиент не может подделать цену)
- Остатки на складе проверяются при оформлении
- Кратность 100 штук принудительно применяется на сервере
- Helmet.js для HTTP заголовков
- CORS настроен только для dev-режима

---

## 🗄️ База данных

### Таблица `products`
| Поле | Тип | Описание |
|------|-----|----------|
| price_per_100 | NUMERIC | Цена за 100 шт = 0.70 |
| stock | INT | Остаток (уменьшается при заказе) |
| color | TEXT | HEX цвет шара |

### Таблица `orders`
| Поле | Тип | Описание |
|------|-----|----------|
| status | TEXT | pending / confirmed / preparing / delivered / cancelled |

---

## ⚙️ Технологии

| Слой | Технология |
|------|-----------|
| Сервер | Node.js + Express |
| База данных | Supabase (PostgreSQL) |
| Клиент | React 18 + TypeScript |
| Сборка | Vite 5 |
| Стили | Pure CSS (CSS Variables) |
| Роутинг | React Router v6 |
| Уведомления | react-hot-toast |
| Иконки | lucide-react |
