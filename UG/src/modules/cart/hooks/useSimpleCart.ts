import { useState, useEffect } from 'react';

interface SimpleCartItem {
  id: string;
  service_id: string;
  quantity: number;
  title: string;
  price: number;
  image_url: string;
  duration: string;
}

export const useSimpleCart = () => {
  const [cartItems, setCartItems] = useState<SimpleCartItem[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      const saved = localStorage.getItem('simple_cart');
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = (items: SimpleCartItem[]) => {
    try {
      const itemCount = items?.length || 0;
      console.log('Saving cart to localStorage, items count:', itemCount);
      localStorage.setItem('simple_cart', JSON.stringify(items));
      setCartItems(items);
      console.log('Cart saved successfully, items count:', itemCount);
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (service: any) => {
    console.log('=== ADD TO CART CALLED ===');
    // Validate and sanitize service data
    if (!service?.id) {
      console.error('Invalid service provided to addToCart');
      return;
    }
    const serviceId = String(service.id).substring(0, 50);
    const serviceTitle = String(service.title || 'Unknown').substring(0, 100);
    console.log('Service ID:', serviceId, 'Title:', serviceTitle);
    console.log('Current cart items count:', cartItems.length);
    
    const existingItem = cartItems.find(item => item.service_id === service.id);
    console.log('Existing item found:', !!existingItem);
    
    if (existingItem) {
      const updated = cartItems.map(item =>
        item.service_id === service.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      console.log('Updated cart items count:', updated.length);
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
      console.log('New item created with ID:', newItem.id);
      const newCart = [...cartItems, newItem];
      console.log('New cart items count:', newCart.length);
      saveCart(newCart);
    }
    
    console.log('=== ADD TO CART COMPLETE ===');
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (!itemId || quantity < 0) {
      console.error('Invalid parameters for updateQuantity');
      return;
    }
    
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
    if (!itemId) {
      console.error('Invalid itemId for removeFromCart');
      return;
    }
    
    const updated = cartItems.filter(item => item.id !== itemId);
    saveCart(updated);
  };

  const clearCart = () => {
    localStorage.removeItem('simple_cart');
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    itemCount,
    loading: false
  };
};