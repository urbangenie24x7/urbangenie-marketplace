import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface SimpleCartItem {
  id: string;
  service_id: string;
  quantity: number;
  title: string;
  price: number;
  image_url: string;
  duration: string;
}

interface CartContextType {
  cartItems: SimpleCartItem[];
  addToCart: (service: any) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<SimpleCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const userId = user?.uid || null;
    
    // If user changed, clear cart and load new user's cart
    if (currentUserId !== userId) {
      if (currentUserId !== null) {
        // User switched, clear current cart
        setCartItems([]);
      }
      setCurrentUserId(userId);
      loadCart(userId);
    }
  }, [user, currentUserId]);

  const loadCart = (userId: string | null) => {
    try {
      const cartKey = userId ? `simple_cart_${userId}` : 'simple_cart_guest';
      const saved = localStorage.getItem(cartKey);
      if (saved) {
        setCartItems(JSON.parse(saved));
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = (items: SimpleCartItem[]) => {
    try {
      const cartKey = currentUserId ? `simple_cart_${currentUserId}` : 'simple_cart_guest';
      localStorage.setItem(cartKey, JSON.stringify(items));
      setCartItems(items);
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (service: any) => {
    console.log('Adding to cart:', service);
    const existingItem = cartItems.find(item => item.service_id === service.id);
    
    if (existingItem) {
      const updated = cartItems.map(item =>
        item.service_id === service.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveCart(updated);
    } else {
      const newItem: SimpleCartItem = {
        id: Date.now().toString(),
        service_id: service.id,
        quantity: 1,
        title: service.title,
        price: service.price,
        image_url: service.image_url || service.image || '',
        duration: service.duration
      };
      saveCart([...cartItems, newItem]);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    const updated = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const removeFromCart = (itemId: string) => {
    const updated = cartItems.filter(item => item.id !== itemId);
    saveCart(updated);
  };

  const clearCart = () => {
    const cartKey = currentUserId ? `simple_cart_${currentUserId}` : 'simple_cart_guest';
    localStorage.removeItem(cartKey);
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      subtotal,
      itemCount,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};