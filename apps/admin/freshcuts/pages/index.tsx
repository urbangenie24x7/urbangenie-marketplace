import { useState, useEffect } from 'react'

export default function FreshCutsAdmin() {
  const [stats, setStats] = useState({ products: 0, orders: 0, vendors: 0 })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">FreshCuts Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Products</h3>
          <p className="text-2xl">{stats.products}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Orders</h3>
          <p className="text-2xl">{stats.orders}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Vendors</h3>
          <p className="text-2xl">{stats.vendors}</p>
        </div>
      </div>
      <nav className="space-x-4">
        <a href="/products" className="bg-blue-500 text-white px-4 py-2 rounded">Products</a>
        <a href="/orders" className="bg-green-500 text-white px-4 py-2 rounded">Orders</a>
        <a href="/vendors" className="bg-purple-500 text-white px-4 py-2 rounded">Vendors</a>
        <a href="/payments" className="bg-orange-500 text-white px-4 py-2 rounded">Payments</a>
      </nav>
    </div>
  )
}