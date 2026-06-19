'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();

  const taxes = cartTotal * 0.13; // 13% tax mock
  const shipping = cartTotal > 0 ? 15 : 0;
  const finalTotal = cartTotal + taxes + shipping;

  const [isLoading, setIsLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const handleStripeCheckout = async () => {
    setIsLoading(true);
    setCheckoutError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems })
      });

      const data = await res.json();

      if (!res.ok) {
        // This hits if the item sold out (OCC triggers)
        setCheckoutError(data.message || 'Something went wrong');
        setIsLoading(false);
        return;
      }

      // Redirect to Stripe Secure Checkout
      window.location.href = data.url;

    } catch (err) {
      setCheckoutError('Failed to initiate checkout');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.checkoutContainer}>
        {cartItems.length === 0 ? (
          <div className={styles.emptyState}>
            <h1>Your Bag is Empty</h1>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link href="/shop" className={styles.shopBtn}>Continue Shopping</Link>
          </div>
        ) : (
          <div className={styles.checkoutLayout}>
            {/* Left: Forms */}
            <div className={styles.formCol}>
              <div className={styles.expressCheckout}>
                <p>Express Checkout</p>
                <div className={styles.expressButtons}>
                  <button className={`${styles.expressBtn} ${styles.applePay}`}>Apple Pay</button>
                  <button className={`${styles.expressBtn} ${styles.paypalPay}`}>PayPal</button>
                  <button className={`${styles.expressBtn} ${styles.googlePay}`}>Google Pay</button>
                </div>
                <div className={styles.divider}>
                  <span>OR</span>
                </div>
              </div>

              <h2 className={styles.sectionTitle}>Secure Payment</h2>
              <p className={styles.paymentNote}>
                You will be redirected to our secure Stripe checkout portal to complete your payment.
                Our system will automatically verify inventory availability before charging your card.
              </p>
              
              {checkoutError && (
                <div style={{ backgroundColor: '#fce8e8', color: '#c92a2a', padding: '1rem', borderRadius: '6px', marginBottom: '1rem', border: '1px solid #f8caca' }}>
                  <strong>Error: </strong> {checkoutError}
                </div>
              )}

              <button 
                onClick={handleStripeCheckout} 
                disabled={isLoading}
                className={styles.payBtn}
              >
                {isLoading ? 'Verifying Inventory...' : `Proceed to Secure Checkout (CAD ${finalTotal.toFixed(2)})`}
              </button>
            </div>

            {/* Right: Order Summary */}
            <div className={styles.summaryCol}>
              <div className={styles.stickySummary}>
                <h2 className={styles.sectionTitle}>Order Summary</h2>
                <div className={styles.itemsList}>
                  {cartItems.map((item, idx) => (
                    <div key={`${item.id}-${item.size}-${idx}`} className={styles.summaryItem}>
                      <div className={styles.itemImgWrap}>
                        <Image src={item.images[0]} alt={item.title} fill className={styles.itemImg} />
                        <span className={styles.itemQty}>{item.quantity}</span>
                      </div>
                      <div className={styles.itemDetails}>
                        <h4>{item.title}</h4>
                        <p>Size: {item.size}</p>
                      </div>
                      <div className={styles.itemPrice}>
                        CAD {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className={styles.costBreakdown}>
                  <div className={styles.costRow}>
                    <span>Subtotal</span>
                    <span>CAD {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className={styles.costRow}>
                    <span>Shipping</span>
                    <span>CAD {shipping.toFixed(2)}</span>
                  </div>
                  <div className={styles.costRow}>
                    <span>Estimated Taxes</span>
                    <span>CAD {taxes.toFixed(2)}</span>
                  </div>
                  <div className={styles.costTotal}>
                    <span>Total</span>
                    <span>CAD {finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
