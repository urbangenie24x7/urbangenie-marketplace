import { useState, useEffect } from 'react';
import { CartItem, Service } from '@/lib/firestore';
import { mockServices } from '@/lib/mockData';

interface LocalCartItem {
  id: string;
  service_id: string;
  quantity: number;
  services: Service;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<(CartItem | LocalCartItem)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      // Always use localStorage for mock implementation
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const cartWithServices = localCart.map((item: any) => {
        const service = mockServices.find(s => s.id === item.service_id);
        return {
          ...item,
          services: service
        };
      }).filter((item: any) => item.services);
      
      setCartItems(cartWithServices);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (serviceId: string) => {
    try {
      if (!serviceId) {
        console.error('Invalid service ID provided to addToCart');
        return;
      }
      const sanitizedServiceId = String(serviceId).substring(0, 50);
      console.log('Adding to cart, service ID:', sanitizedServiceId);
      
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = localCart.find((item: any) => item.service_id === serviceId);
      
      if (existingItem) {
        existingItem.quantity += 1;
        console.log('Updated existing item quantity');
      } else {
        const newItem = {
          id: Date.now().toString(),
          service_id: serviceId,
          quantity: 1
        };
        localCart.push(newItem);
        console.log('Added new item to cart');
      }
      
      localStorage.setItem('cart', JSON.stringify(localCart));
      const itemCount = localCart?.length || 0;
      console.log('Cart saved to localStorage, items count:', itemCount);
      
      await fetchCartItems();
      console.log('Cart items refreshed');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding item to cart. Please try again.');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!itemId || quantity < 0) {
      console.error('Invalid parameters for updateQuantity');
      return;
    }
    
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const item = localCart.find((item: any) => item.id === itemId);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(localCart));
      }
      
      await fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!itemId) {
      console.error('Invalid itemId for removeFromCart');
      return;
    }
    
    try {
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart = localCart.filter((item: any) => item.id !== itemId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      await fetchCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      localStorage.removeItem('cart');
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => 
    sum + (item.services?.price || 0) * item.quantity, 0
  );

  return {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
  };
};