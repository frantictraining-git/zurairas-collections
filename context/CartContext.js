'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { doc, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  
  // Timer states
  const [cartExpiresAt, setCartExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(''); // e.g. "09:59"

  // Initialize Session ID and load cart
  useEffect(() => {
    let id = localStorage.getItem('zuraira_session_id');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('zuraira_session_id', id);
    }
    setSessionId(id);

    const saved = localStorage.getItem('zuraira_cart');
    const savedExpiry = localStorage.getItem('zuraira_cart_expiry');
    
    if (saved) {
      try { setCartItems(JSON.parse(saved)); } catch (e) { }
    }
    if (savedExpiry) {
      setCartExpiresAt(parseInt(savedExpiry, 10));
    }
  }, []);

  // Save to local storage when cart changes
  useEffect(() => {
    localStorage.setItem('zuraira_cart', JSON.stringify(cartItems));
    if (cartExpiresAt) {
      localStorage.setItem('zuraira_cart_expiry', cartExpiresAt.toString());
    }
  }, [cartItems, cartExpiresAt]);

  // Countdown Timer Logic
  useEffect(() => {
    if (!cartExpiresAt || cartItems.length === 0) {
      setTimeLeft('');
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const distance = cartExpiresAt - now;

      if (distance <= 0) {
        // Timer Expired!
        clearInterval(interval);
        setTimeLeft('00:00');
        setCartItems([]); // Clear cart
        setCartExpiresAt(null);
        localStorage.removeItem('zuraira_cart_expiry');
        alert("Your 5-minute reservation has expired and your cart has been cleared.");
      } else {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cartExpiresAt, cartItems.length]);

  const addToCart = async (product, size) => {
    if (!sessionId) return;
    
    try {
      const productRef = doc(db, 'products', product.id);
      
      await runTransaction(db, async (transaction) => {
        const productDoc = await transaction.get(productRef);
        if (!productDoc.exists()) {
          throw new Error("Product does not exist!");
        }
        
        const data = productDoc.data();
        const stock = data.stock || 0;
        const reservedUntil = data.reservedUntil || 0;
        const reservedBy = data.reservedBy || null;
        const now = Date.now();

        // Check if out of stock AND actively reserved by someone else
        if (stock <= 0 && reservedUntil > now && reservedBy !== sessionId) {
          throw new Error("This item is currently reserved in another customer's cart.");
        }

        // Lock for 5 minutes
        const newExpiry = now + 5 * 60 * 1000;
        transaction.update(productRef, {
          reservedUntil: newExpiry,
          reservedBy: sessionId
        });
        
        // Update local context expiry
        setCartExpiresAt(newExpiry);
      });

      // If transaction succeeds, add to local state
      setCartItems(prev => {
        const existingItem = prev.find(item => item.id === product.id && item.size === size);
        if (existingItem) {
          return prev.map(item => 
            item.id === product.id && item.size === size 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          );
        }
        // Use either title or name based on data structure
        const prodTitle = product.title || product.name || 'Product';
        return [...prev, { ...product, title: prodTitle, size, quantity: 1 }];
      });
      setIsCartOpen(true); 

    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to add item to cart.");
    }
  };

  const removeFromCart = (id, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id, size, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => 
      prev.map(item => 
        item.id === id && item.size === size 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen,
      timeLeft
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
