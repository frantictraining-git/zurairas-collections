'use client';

import { useEffect, useState, Suspense } from 'react';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

function SuccessContent() {
  const { setCartItems } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!cleared && (sessionId || orderId)) {
      setCartItems([]);
      localStorage.removeItem('zuraira_cart');
      setCleared(true);
    }
  }, [sessionId, orderId, cleared, setCartItems]);

  const isETransfer = !!orderId;

  return (
    <div className={styles.card}>
      <div className={styles.icon}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      
      <h1 className={styles.title}>
        {isETransfer ? 'Your Order is Reserved!' : 'Thank You For Your Order!'}
      </h1>
      
      {isETransfer ? (
        <div className={styles.message} style={{textAlign: 'left', background: '#fff8f0', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e8d5b7'}}>
          <p style={{fontWeight: '600', marginBottom: '0.5rem', color: '#5c3d1e'}}>Almost done! Here are your E-Transfer instructions:</p>
          <p style={{marginBottom: '0.5rem'}}>1. Send your payment to <strong>payments@zurairas-collections.com</strong></p>
          <p style={{marginBottom: '0.5rem'}}>2. Include your reference number in the message: <strong>{orderId}</strong></p>
          <p style={{fontSize: '0.9rem', opacity: 0.8, marginTop: '1rem'}}>
            Your items have been temporarily reserved. They will be held for 24 hours awaiting your payment.
            We have also sent an email with these details.
          </p>
        </div>
      ) : (
        <p className={styles.message}>
          Your payment was completely successful and your luxury item is now secured. 
          We have emailed your receipt and order details. Our artisans will begin preparing your shipment immediately.
        </p>
      )}

      <div className={styles.buttonGroup}>
        <Link href="/shop" className={styles.shopBtn}>
          Continue Shopping
        </Link>
        <Link href="/" className={styles.orderBtn}>
          Return Home
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <>
      <Navbar />
      <main className={styles.successContainer}>
        <Suspense fallback={<div>Loading...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
