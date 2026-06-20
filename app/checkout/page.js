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
  const [email, setEmail] = useState('');

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

  const handleETransferCheckout = async (itemsToCheckout) => {
    if (!email || !email.includes('@')) {
      setCheckoutError('Please enter a valid email address for E-Transfer tracking.');
      return;
    }
    setIsLoading(true);
    setCheckoutError('');

    try {
      const res = await fetch('/api/checkout-etransfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: itemsToCheckout, email })
      });

      const data = await res.json();

      if (res.status === 409) {
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

      // Redirect to Success page with order_id
      window.location.href = `/success?order_id=${data.orderId}`;

    } catch (err) {
      setCheckoutError('Failed to initiate E-Transfer. Please try again.');
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

              {/* E-Transfer Option */}
              <div className={styles.etransferOption}>
                <div className={styles.etransferHeader}>
                  <span className={styles.etransferBadge}>🍁 Canadian Customers</span>
                  <h3>Pay via Interac E-Transfer</h3>
                </div>
                <p style={{marginBottom: '1rem'}}>
                  Send your payment to{' '}
                  <a href="mailto:payments@zurairas-collections.com">
                    payments@zurairas-collections.com
                  </a>{'. '}
                  Please provide your email below so we can link your payment and send your receipt.
                </p>
                <div className={styles.etransferForm}>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address" 
                    className={styles.emailInput}
                  />
                  <button 
                    className={styles.etransferBtn}
                    onClick={() => soldOutItems.length > 0 ? handleETransferCheckout(availableItems) : handleETransferCheckout(cartItems)}
                    disabled={isLoading || availableItems.length === 0}
                  >
                    {isLoading ? 'Processing...' : `Place E-Transfer Order (CAD ${finalTotal.toFixed(2)})`}
                  </button>
                </div>
              </div>

              <div className={styles.divider} style={{ margin: '1.5rem 0' }}>
                <span>OR PAY BY CARD</span>
              </div>

              <div className={styles.cardIconsWrap}>
                <div className={styles.cardIconsRow}>
                  {/* Visa */}
                  <svg viewBox="0 0 32 20" width="40" height="26" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="20" rx="3" fill="#1434CB"/><path d="M12.56 14.5l2.06-8h1.34l-2.06 8h-1.34zm6.81-7.85c-.32-.1-.83-.24-1.51-.24-1.63 0-2.77.86-2.78 2.08-.02.9.82 1.4 1.45 1.7.64.31.86.51.86.79 0 .42-.51.62-1 .62-.57 0-1-.13-1.42-.31l-.2-.09-.23 1.39c.35.15.99.28 1.66.29 1.74 0 2.87-.85 2.89-2.13.01-1.12-1.61-1.18-1.64-1.69-.02-.25.22-.52.74-.59.26-.03.88-.06 1.42.18l.2.09.21-1.35zm3.43 5.48h1.22l-1.07-5.5h-1.03c-.28 0-.47.1-.58.38l-2.07 5.12h1.41s.24-.65.28-.79h1.74c.03.14.1.79.1.79zm-1.1-2.06c.09-.24.44-1.16.44-1.16-.01.01.09-.25.14-.4l.08.38s.22 1.05.26 1.18h-.92zm-9.08-3.42l-1.31 5.5h-1.4L11.5 6.65h1.37s.24 4.5.24 4.5h.02s1.08-4.5 1.08-4.5h1.35l-1.94 5.5h-1.4z" fill="#fff"/></svg>
                  {/* Mastercard */}
                  <svg viewBox="0 0 32 20" width="40" height="26" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="20" rx="3" fill="#1A1F71"/><circle cx="12" cy="10" r="5" fill="#EB001B"/><circle cx="20" cy="10" r="5" fill="#F79E1B"/><path d="M16 14.12A5 5 0 0116 5.88a5 5 0 010 8.24z" fill="#FF5F00"/></svg>
                  {/* Amex */}
                  <svg viewBox="0 0 32 20" width="40" height="26" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="20" rx="3" fill="#006FCF"/><path d="M11.66 12.87l1.08-2.6h1.7l1.08 2.6h-3.86zm1.96-4.73h-2.1l-2.58 6h1.2l.46-1.1h2.8l.45 1.1h1.2l-2.53-6zM15.4 14.14V8.14h1.4l1.37 3.32 1.35-3.32h1.4v6h-1.14v-3.72l-1.17 2.87h-.85l-1.17-2.87v3.72H15.4zM22.5 14.14V8.14h3.5v1h-2.35v1.27h2v1h-2v1.73h2.4v1H22.5z" fill="#fff"/></svg>
                  {/* Apple Pay */}
                  <svg viewBox="0 0 40 20" width="52" height="26" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="20" rx="3" fill="#000"/><path d="M11.75 14.5c-1.3 0-2.34-.35-3.1-.96a5.55 5.55 0 01-1.92-2.73h1.16c.3.82.8 1.47 1.48 1.94.67.47 1.47.7 2.38.7 1.16 0 2.05-.33 2.65-.96.61-.63.92-1.46.92-2.48V8.65h1.13v1.36h.05c-.32-.46-.77-.85-1.34-1.12a4.4 4.4 0 00-2.02-.45c-1.22 0-2.25.43-3.1 1.29-.85.86-1.27 1.97-1.27 3.33 0 1.34.42 2.45 1.25 3.3.84.85 1.86 1.28 3.09 1.28.84 0 1.55-.17 2.15-.53a3.52 3.52 0 001.37-1.4h-.05v1.65H16.4V9.92c0-1.23-.38-2.18-1.14-2.83-.75-.66-1.77-.98-3.04-.98-1.29 0-2.32.32-3.1.96-.77.64-1.26 1.54-1.46 2.7h1.1c.18-.84.55-1.48 1.1-1.93.57-.45 1.33-.67 2.27-.67 1.02 0 1.8.25 2.33.74.52.48.78 1.19.78 2.1v.6h-2.15c-1.5 0-2.65.34-3.46 1.03-.8.68-1.2 1.6-1.2 2.76 0 .93.31 1.69.94 2.28.62.59 1.48.88 2.58.88zm.27-.93c-.8 0-1.42-.2-1.85-.62-.43-.43-.65-.97-.65-1.63 0-.7.27-1.24.81-1.62.55-.38 1.35-.57 2.41-.57h2v1.54c0 .88-.3 1.56-.91 2.05-.62.5-1.4.74-2.35.74v.1zm8.38 5.62l3.4-9.33h-1.23l-2.8 7.82h-.05l-1.07-3.16h1.8v-.95h-2.92v.95h.14l2.06 5.56-1.58 4.2h1.17l1.08-5.1zm4.98-9.1c.96 0 1.68.22 2.16.68.49.46.73 1.13.73 2.03v.68H24v2.7c0 1.06.27 1.8.8 2.2.53.42 1.3.62 2.3.62 1.25 0 2.23-.32 2.92-.95v-1.06c-.52.54-1.27.82-2.26.82h-.24c-.58 0-1.01-.15-1.3-.46-.28-.32-.42-.8-.42-1.45v-2h3.25V9.92h-3.25V7.78h-1.12v2.14H24v.95h.72v-.78zm1.05 1.8h2.08v1.07h-2.08V11.9z" fill="#fff"/><path d="M5.4 7.57A2.16 2.16 0 006.4 5.7c-1.03-.02-1.95.6-2.48 1.45-.48.74-.75 1.68-.53 2.59a2.02 2.02 0 002-1.5v-.67h.01zm.97 1.16c-1.35 0-2.43.76-3.08.76-.66 0-1.6-.74-2.65-.72-1.36.02-2.62.8-3.32 2.02-1.44 2.52-.37 6.25 1.04 8.3 .68 1 1.5 2.12 2.58 2.08 1.05-.04 1.46-.68 2.73-.68 1.27 0 1.63.68 2.75.66 1.15-.02 1.85-1.03 2.54-2.04.79-1.16 1.12-2.28 1.14-2.34-.02-.01-2.17-.83-2.2-3.31-.02-2.08 1.7-3.07 1.78-3.12-1-1.44-2.52-1.6-3.05-1.63h-.25v.02z" fill="#fff"/></svg>
                </div>
              </div>

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
