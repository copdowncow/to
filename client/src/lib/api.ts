import type { Product, CartSession, CartItem, Order, CreateOrderPayload } from '../types'

const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Ошибка сервера')
  return data as T
}

// ── Products ──────────────────────────────────────────
export const api = {
  products: {
    list: () => request<Product[]>('/products'),
    get: (id: string) => request<Product>(`/products/${id}`),
  },

  // ── Cart ──────────────────────────────────────────────
  cart: {
    get: (sessionKey: string) =>
      request<CartSession>(`/cart/${sessionKey}`),

    update: (sessionKey: string, items: CartItem[]) =>
      request<CartSession>(`/cart/${sessionKey}`, {
        method: 'PUT',
        body: JSON.stringify({ items }),
      }),

    clear: (sessionKey: string) =>
      request<{ success: boolean }>(`/cart/${sessionKey}`, {
        method: 'DELETE',
      }),
  },

  // ── Orders ────────────────────────────────────────────
  orders: {
    create: (payload: CreateOrderPayload) =>
      request<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    get: (id: string) => request<Order>(`/orders/${id}`),

    byEmail: (email: string) =>
      request<Order[]>(`/orders?email=${encodeURIComponent(email)}`),
  },
}
