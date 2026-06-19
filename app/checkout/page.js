'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';

export default function CheckoutPage() {
  const { cartItems, setCartItems, cartTotal } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [soldOutItems, setSoldOutItems] = useState([]); // [{id, size, title}]

  // Helper: is this cart item sold out?
  const isSoldOut = (item) =>
    soldOutItems.some((s) => s.id === item.id && s.size === item.size);

  // Available items only (excluding sold-out ones)
  const availableItems = cartItems.filter((item) => !isSoldOut(item));

  const availableTotal = availableItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxes = availableTotal * 0.13;
  const shipping = availableTotal > 0 ? 15 : 0;
  const finalTotal = availableTotal + taxes + shipping;

  const handleStripeCheckout = async (itemsToCheckout) => {
    setIsLoading(true);
    setCheckoutError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: itemsToCheckout })
      });

      const data = await res.json();

      if (res.status === 409) {
        // Some items are sold out — mark them visually and let the user decide
        setSoldOutItems(data.soldOutItems || []);
        setCheckoutError(data.message || 'Some items are unavailable.');
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        setCheckoutError(data.message || 'Something went wrong.');
        setIsLoading(false);
        return;
      }

      // Redirect to Stripe Secure Checkout
      window.location.href = data.url;

    } catch (err) {
      setCheckoutError('Failed to initiate checkout. Please try again.');
      setIsLoading(false);
    }
  };

  // Remove sold-out items from cart and proceed with the rest
  const proceedWithRemaining = () => {
    setCartItems(availableItems);
    setSoldOutItems([]);
    setCheckoutError('');
    handleStripeCheckout(availableItems);
  };

  return (
    <>
      <Navbar />
      <main className={styles.checkoutContainer}>
        {cartItems.length === 0 ? (
          <div className={styles.emptyState}>
            <h1>Your Bag is Empty</h1>
            <p>Looks like you haven&apos;t added anything to your cart yet.</p>
            <Link href="/shop" className={styles.shopBtn}>Continue Shopping</Link>
          </div>
        ) : (
          <div className={styles.checkoutLayout}>
            {/* Left: Payment */}
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
                <div className={styles.errorCard}>
                  <svg className={styles.errorIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <div className={styles.errorContent}>
                    <h4>
                      {availableItems.length === 0
                        ? 'Your Bag Has Been Claimed'
                        : 'A Piece Has Just Been Claimed'}
                    </h4>
                    <p>{checkoutError}</p>
                  </div>
                </div>
              )}

              <button
                onClick={() =>
                  soldOutItems.length > 0
                    ? proceedWithRemaining()
                    : handleStripeCheckout(cartItems)
                }
                disabled={isLoading || availableItems.length === 0}
                className={styles.payBtn}
              >
                {isLoading
                  ? 'Verifying Inventory...'
                  : availableItems.length === 0
                    ? 'No Items Available'
                    : soldOutItems.length > 0
                      ? `Proceed with ${availableItems.length} Remaining Piece${availableItems.length > 1 ? 's' : ''} (CAD ${finalTotal.toFixed(2)})`
                      : `Proceed to Secure Checkout (CAD ${finalTotal.toFixed(2)})`}
              </button>
            </div>

            {/* Right: Order Summary */}
            <div className={styles.summaryCol}>
              <div className={styles.stickySummary}>
                <h2 className={styles.sectionTitle}>Order Summary</h2>
                <div className={styles.itemsList}>
                  {cartItems.map((item, idx) => {
                    const soldOut = isSoldOut(item);
                    return (
                      <div
                        key={`${item.id}-${item.size}-${idx}`}
                        className={`${styles.summaryItem} ${soldOut ? styles.soldOutItem : ''}`}
                      >
                        <div className={styles.itemImgWrap}>
                          <Image src={item.images[0]} alt={item.title} fill className={styles.itemImg} />
                          <span className={styles.itemQty}>{item.quantity}</span>
                        </div>
                        <div className={styles.itemDetails}>
                          <h4>{item.title}</h4>
                          <p>Size: {item.size}</p>
                          {soldOut && <span className={styles.soldOutTag}>Claimed</span>}
                        </div>
                        <div className={styles.itemPrice}>
                          {soldOut
                            ? <s style={{ opacity: 0.4 }}>CAD {(item.price * item.quantity).toFixed(2)}</s>
                            : `CAD ${(item.price * item.quantity).toFixed(2)}`}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.costBreakdown}>
                  <div className={styles.costRow}>
                    <span>Subtotal</span>
                    <span>CAD {availableTotal.toFixed(2)}</span>
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
