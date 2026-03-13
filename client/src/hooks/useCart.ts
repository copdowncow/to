import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import { getSessionKey } from '../lib/session'
import type { CartItem, Product } from '../types'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const sessionKey = getSessionKey()

  useEffect(() => {
    api.cart.get(sessionKey)
      .then(s => setItems(s.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [sessionKey])

  const save = useCallback(async (newItems: CartItem[]) => {
    setItems(newItems)
    try {
      const updated = await api.cart.update(sessionKey, newItems)
      setItems(updated.items || newItems)
    } catch (e) {
      console.error('Cart save error:', e)
    }
  }, [sessionKey])

  const addToCart = useCallback(async (product: Product, quantity: number) => {
    const qty = Math.max(100, Math.round(quantity / 100) * 100)
    const existing = items.find(i => i.product_id === product.id)
    let newItems: CartItem[]
    if (existing) {
      newItems = items.map(i =>
        i.product_id === product.id
          ? { ...i, quantity: i.quantity + qty, total_price: parseFloat(((i.quantity + qty) / 100 * product.price_per_100).toFixed(2)) }
          : i
      )
    } else {
      newItems = [...items, {
        product_id: product.id,
        product_name: product.name,
        product_color: product.color,
        quantity: qty,
        price_per_100: product.price_per_100,
        total_price: parseFloat((qty / 100 * product.price_per_100).toFixed(2))
      }]
    }
    await save(newItems)
  }, [items, save])

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    const qty = Math.round(quantity / 100) * 100
    if (qty <= 0) {
      await save(items.filter(i => i.product_id !== productId))
      return
    }
    await save(items.map(i =>
      i.product_id === productId
        ? { ...i, quantity: qty, total_price: parseFloat((qty / 100 * i.price_per_100).toFixed(2)) }
        : i
    ))
  }, [items, save])

  const removeFromCart = useCallback(async (productId: string) => {
    await save(items.filter(i => i.product_id !== productId))
  }, [items, save])

  const clearCart = useCallback(async () => {
    setItems([])
    await api.cart.clear(sessionKey)
  }, [sessionKey])

  const totalItems = items.reduce((a, i) => a + i.quantity, 0)
  const totalPrice = parseFloat(items.reduce((a, i) => a + i.total_price, 0).toFixed(2))

  return { items, loading, totalItems, totalPrice, addToCart, updateQuantity, removeFromCart, clearCart }
}
