import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'Delivery & Returns | Zuraira\'s Collections',
  description: 'Shipping rates, delivery times, and return policy for Zuraira\'s Collections.',
};

export default function ShippingPage() {
  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Delivery &amp; Returns</h1>
      </section>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Standard Delivery</h2>
          <p>
            Standard shipping is available across Canada for a flat rate of <strong>CAD $15.00</strong>.
            Orders are typically delivered within <strong>5–10 business days</strong> from the date of
            dispatch. Free standard shipping is offered on all orders over CAD $200.
          </p>
          <p>
            Please allow 1–2 business days for order processing and packaging before your item is dispatched.
            You will receive a shipping confirmation email with a tracking number once your order is on its way.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Express Delivery</h2>
          <p>
            Need your order sooner? Express shipping is available at checkout for an additional fee based
            on your location. Express orders are prioritised and typically arrive within <strong>2–4 business
            days</strong> of dispatch.
          </p>
          <p>
            Express shipping rates are calculated at checkout based on your delivery address and the weight
            of your order.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Tracking Your Order</h2>
          <p>
            Once your order has been dispatched, you will receive an email containing your tracking number
            and a link to monitor your parcel in real time. If you have not received a tracking email within
            3 business days of placing your order, please contact us at{' '}
            <a href="mailto:hello@zurairas.ca" className={styles.accent}>hello@zurairas.ca</a>.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Returns Policy</h2>
          <p>
            We accept returns within <strong>14 days</strong> of the delivery date. To be eligible for a
            return, items must be unworn, unwashed, and returned in their original condition with all tags
            and packaging intact.
          </p>
          <p>
            Sale items and items marked as final sale are not eligible for return. To begin a return,
            please email us at{' '}
            <a href="mailto:hello@zurairas.ca" className={styles.accent}>hello@zurairas.ca</a> with your
            order number. Refunds are issued to your original payment method within 5–7 business days of
            us receiving the return.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
