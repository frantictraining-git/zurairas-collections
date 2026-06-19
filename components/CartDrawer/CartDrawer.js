'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div 
        className={`${styles.overlay} ${isCartOpen ? styles.open : ''}`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className={`${styles.drawer} ${isCartOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2>Your Bag</h2>
          <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>✕</button>
        </div>

        <div className={styles.body}>
          {cartItems.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Your shopping bag is empty.</p>
              <button className={styles.continueBtn} onClick={() => setIsCartOpen(false)}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {cartItems.map((item, idx) => (
                <div key={`${item.id}-${item.size}-${idx}`} className={styles.cartItem}>
                  <div className={styles.itemImg}>
                    <Image src={item.images[0]} alt={item.title} fill className={styles.img} sizes="100px" />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemTop}>
                      <div>
                        <h4>{item.title}</h4>
                        <p className={styles.itemSize}>Size: {item.size}</p>
                      </div>
                      <p className={styles.itemPrice}>CAD {item.price}</p>
                    </div>
                    
                    <div className={styles.itemBottom}>
                      <div className={styles.qtyControl}>
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>+</button>
                      </div>
                      <button 
                        className={styles.removeBtn} 
                        onClick={() => removeFromCart(item.id, item.size)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotal}>
              <span>Subtotal</span>
              <span>CAD {cartTotal}</span>
            </div>
            <p className={styles.taxesInfo}>Taxes and shipping calculated at checkout.</p>
            <Link href="/checkout" onClick={() => setIsCartOpen(false)} className={styles.checkoutBtn}>
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
