export interface Product {
  id: string
  name: string
  description: string | null
  color: string
  price_per_100: number
  image_url: string | null
  stock: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CartItem {
  product_id: string
  product_name: string
  product_color: string
  quantity: number
  price_per_100: number
  total_price: number
}

export interface CartSession {
  id: string
  session_key: string
  items: CartItem[]
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  delivery_address: string | null
  total_price: number
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled'
  notes: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItemWithProduct[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  quantity_per_100: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface OrderItemWithProduct extends OrderItem {
  products: { name: string; color: string } | null
}

export interface CreateOrderPayload {
  customer_name: string
  customer_email: string
  customer_phone?: string
  delivery_address?: string
  notes?: string
  items: CartItem[]
}
