require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')

const productsRouter = require('./routes/products')
const cartRouter = require('./routes/cart')
const ordersRouter = require('./routes/orders')

// Проверка переменных окружения
const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
const missing = required.filter(k => !process.env[k])
if (missing.length) {
  console.error('\n❌ Отсутствуют переменные окружения:', missing.join(', '))
  console.error('📝 Скопируйте .env.example в .env и заполните значения\n')
  process.exit(1)
}

const app = express()
const PORT = process.env.PORT || 3000
const isDev = process.env.NODE_ENV !== 'production'

// Middleware
app.use(morgan(isDev ? 'dev' : 'combined'))
app.use(cors({ origin: isDev ? 'http://localhost:5173' : false }))
app.use(helmet({
  contentSecurityPolicy: false // для dev
}))
app.use(express.json({ limit: '1mb' }))

// API роуты
app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', ordersRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Статика клиента (production)
const clientBuild = path.join(__dirname, '../client/dist')
app.use(express.static(clientBuild))
app.get('*', (req, res) => {
  const index = path.join(clientBuild, 'index.html')
  res.sendFile(index, err => {
    if (err) res.status(200).send(`
      <h2>🎈 ШарыМаркет сервер запущен!</h2>
      <p>API доступен: <a href="/api/health">/api/health</a></p>
      <p>В dev режиме фронтенд на порту 5173</p>
      <p>Для production запустите: <code>npm start</code></p>
    `)
  })
})

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Внутренняя ошибка сервера' })
})

app.listen(PORT, () => {
  console.log(`\n🎈 ШарыМаркет запущен!`)
  console.log(`   → http://localhost:${PORT}`)
  console.log(`   → API: http://localhost:${PORT}/api/health\n`)
})
