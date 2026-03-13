const express = require('express')
const router = express.Router()
const { supabase } = require('../supabase')

// GET /api/products — все активные товары
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// GET /api/products/:id — один товар
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error) return res.status(404).json({ error: 'Товар не найден' })
  res.json(data)
})

module.exports = router
