'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

export default function SuccessPage() {
  const { setCartItems } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!cleared && sessionId) {
      // The user successfully paid, so we must empty their cart!
      setCartItems([]);
      localStorage.removeItem('zuraira_cart');
      setCleared(true);
    }
  }, [sessionId, cleared, setCartItems]);

  return (
    <>
      <Navbar />
      <main className={styles.successContainer}>
        <div className={styles.card}>
          <div className={styles.icon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          
          <h1 className={styles.title}>Thank You For Your Order!</h1>
          
          <p className={styles.message}>
            Your payment was completely successful and your luxury item is now secured. 
            We have emailed your receipt and order details. Our artisans will begin preparing your shipment immediately.
          </p>

          <div className={styles.buttonGroup}>
            <Link href="/shop" className={styles.shopBtn}>
              Continue Shopping
            </Link>
            <Link href="/" className={styles.orderBtn}>
              Return Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
