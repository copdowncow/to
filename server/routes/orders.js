const express = require('express')
const router = express.Router()
const { supabase } = require('../supabase')

// POST /api/orders — создать заказ
router.post('/', async (req, res) => {
  const { customer_name, customer_email, customer_phone, delivery_address, notes, items } = req.body

  // Валидация
  if (!customer_name || !customer_name.trim()) {
    return res.status(400).json({ error: 'Укажите имя' })
  }
  if (!customer_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) {
    return res.status(400).json({ error: 'Укажите корректный email' })
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Корзина пуста' })
  }

  // Верифицируем цены по товарам из БД
  const productIds = items.map(i => i.product_id)
  const { data: dbProducts, error: prodErr } = await supabase
    .from('products')
    .select('id, price_per_100, stock, is_active')
    .in('id', productIds)

  if (prodErr) return res.status(500).json({ error: prodErr.message })

  const productMap = {}
  dbProducts.forEach(p => { productMap[p.id] = p })

  // Проверяем наличие и считаем честную цену
  const orderItems = []
  let totalPrice = 0

  for (const item of items) {
    const product = productMap[item.product_id]
    if (!product) return res.status(400).json({ error: `Товар ${item.product_id} не найден` })
    if (!product.is_active) return res.status(400).json({ error: `Товар недоступен` })

    const qty = Math.max(100, Math.round(item.quantity / 100) * 100)
    if (qty > product.stock) {
      return res.status(400).json({ error: `Недостаточно товара на складе` })
    }

    const itemTotal = parseFloat(((qty / 100) * product.price_per_100).toFixed(2))
    totalPrice += itemTotal

    orderItems.push({
      product_id: item.product_id,
      quantity: qty,
      quantity_per_100: qty / 100,
      unit_price: product.price_per_100,
      total_price: itemTotal
    })
  }

  totalPrice = parseFloat(totalPrice.toFixed(2))

  // Создаём заказ
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      customer_name: customer_name.trim(),
      customer_email: customer_email.trim().toLowerCase(),
      customer_phone: customer_phone ? customer_phone.trim() : null,
      delivery_address: delivery_address ? delivery_address.trim() : null,
      notes: notes ? notes.trim() : null,
      total_price: totalPrice,
      status: 'pending'
    })
    .select()
    .single()

  if (orderErr) return res.status(500).json({ error: orderErr.message })

  // Добавляем позиции
  const itemsWithOrderId = orderItems.map(i => ({ ...i, order_id: order.id }))
  const { error: itemsErr } = await supabase
    .from('order_items')
    .insert(itemsWithOrderId)

  if (itemsErr) return res.status(500).json({ error: itemsErr.message })

  // Уменьшаем stock
  for (const item of orderItems) {
    const prod = productMap[item.product_id]
    await supabase
      .from('products')
      .update({ stock: prod.stock - item.quantity })
      .eq('id', item.product_id)
  }

  res.status(201).json({ ...order, items: itemsWithOrderId })
})

// GET /api/orders/:id — получить заказ
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products ( name, color )
      )
    `)
    .eq('id', req.params.id)
    .single()

  if (error || !data) return res.status(404).json({ error: 'Заказ не найден' })
  res.json(data)
})

// GET /api/orders?email=xxx — заказы по email
router.get('/', async (req, res) => {
  const { email } = req.query
  if (!email) return res.status(400).json({ error: 'Укажите email' })

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_email', email.toLowerCase())
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

module.exports = router
