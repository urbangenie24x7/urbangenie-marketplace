export interface Product {
  id: string
  name: string
  price: number
  category: string
  vendor: string
}

export interface User {
  id: string
  email: string
  role: 'customer' | 'vendor' | 'admin'
}

export interface Order {
  id: string
  userId: string
  products: Product[]
  total: number
  status: string
}