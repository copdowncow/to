const express = require('express')
const router = express.Router()
const { supabase } = require('../supabase')

// GET /api/cart/:sessionKey
router.get('/:sessionKey', async (req, res) => {
  const { data, error } = await supabase
    .from('cart_sessions')
    .select('*')
    .eq('session_key', req.params.sessionKey)
    .single()

  if (error || !data) {
    // Создаём новую сессию
    const { data: newSession, error: createErr } = await supabase
      .from('cart_sessions')
      .insert({ session_key: req.params.sessionKey, items: [] })
      .select()
      .single()

    if (createErr) return res.status(500).json({ error: createErr.message })
    return res.json(newSession)
  }

  res.json(data)
})

// PUT /api/cart/:sessionKey — обновить корзину
router.put('/:sessionKey', async (req, res) => {
  const { items } = req.body
  if (!Array.isArray(items)) return res.status(400).json({ error: 'items должен быть массивом' })

  // Пересчитываем цены на сервере
  const PRICE_PER_100 = 0.70
  const validatedItems = items.map(item => ({
    product_id: item.product_id,
    product_name: item.product_name,
    product_color: item.product_color,
    quantity: Math.max(100, Math.round(item.quantity / 100) * 100), // кратно 100
    price_per_100: PRICE_PER_100,
    total_price: parseFloat(((Math.round(item.quantity / 100) * 100) / 100 * PRICE_PER_100).toFixed(2))
  }))

  const { data, error } = await supabase
    .from('cart_sessions')
    .upsert({
      session_key: req.params.sessionKey,
      items: validatedItems
    }, { onConflict: 'session_key' })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// DELETE /api/cart/:sessionKey — очистить корзину
router.delete('/:sessionKey', async (req, res) => {
  const { error } = await supabase
    .from('cart_sessions')
    .update({ items: [] })
    .eq('session_key', req.params.sessionKey)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ success: true })
})

module.exports = router
