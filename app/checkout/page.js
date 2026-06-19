'use client';

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
              <h2 className={styles.sectionTitle}>Contact Information</h2>
              <input type="email" placeholder="Email Address" className={styles.input} />

              <h2 className={styles.sectionTitle}>Shipping Address</h2>
              <div className={styles.row}>
                <input type="text" placeholder="First Name" className={styles.input} />
                <input type="text" placeholder="Last Name" className={styles.input} />
              </div>
              <input type="text" placeholder="Address" className={styles.input} />
              <input type="text" placeholder="Apartment, suite, etc. (optional)" className={styles.input} />
              <div className={styles.row}>
                <input type="text" placeholder="City" className={styles.input} />
                <input type="text" placeholder="Postal Code" className={styles.input} />
              </div>

              <h2 className={styles.sectionTitle}>Payment</h2>
              <p className={styles.paymentNote}>This is a secure 128-bit SSL encrypted payment.</p>
              <input type="text" placeholder="Card Number" className={styles.input} />
              <div className={styles.row}>
                <input type="text" placeholder="Expiration Date (MM/YY)" className={styles.input} />
                <input type="text" placeholder="Security Code (CVV)" className={styles.input} />
              </div>
              <input type="text" placeholder="Name on Card" className={styles.input} />

              <button className={styles.payBtn}>Pay CAD {finalTotal.toFixed(2)}</button>
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
