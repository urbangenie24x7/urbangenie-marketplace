import { useState, useEffect } from 'react'

export const useOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  return { orders, loading }
}