import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'Customer Care | Zuraira\'s Collections',
  description: 'Everything you need to know about returns, delivery, payments, and contacting Zuraira\'s Collections.',
};

export default function CarePage() {
  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Customer Care</h1>
      </section>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Returns &amp; Exchanges</h2>
          <p>
            We want you to love every piece you receive. If for any reason you are not completely satisfied,
            we accept returns within <strong>14 days</strong> of delivery. Items must be unworn, unwashed,
            and in their original packaging with all tags attached.
          </p>
          <p>
            To initiate a return, please contact us at{' '}
            <a href="mailto:hello@zurairas.ca" className={styles.accent}>hello@zurairas.ca</a> with your
            order number and reason for return. Refunds are processed within 5–7 business days of receiving
            the returned item.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Delivery</h2>
          <p>
            All orders are shipped across Canada. Standard delivery takes <strong>5–10 business days</strong>{' '}
            from the date of dispatch. Express shipping options are available at checkout for faster delivery.
          </p>
          <p>
            Once your order has shipped, you will receive a tracking number via email so you can follow your
            parcel every step of the way. Please allow 1–2 business days for processing before dispatch.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Payment</h2>
          <p>
            We accept all major credit and debit cards securely through <strong>Stripe</strong>. We also
            accept <strong>Interac E-Transfer</strong> for customers who prefer direct bank payments — simply
            select E-Transfer at checkout and follow the instructions provided.
          </p>
          <p>
            All transactions are encrypted and processed securely. We do not store your payment information.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Contact Us</h2>
          <p>
            Have a question or need assistance? We&apos;d love to hear from you. Visit our{' '}
            <Link href="/contact" className={styles.accent}>Contact page</Link> to send us a message,
            or reach us directly at{' '}
            <a href="mailto:hello@zurairas.ca" className={styles.accent}>hello@zurairas.ca</a>.
          </p>
          <p>
            Our team typically responds within 1–2 business days. We are here to help you with sizing,
            styling advice, order queries, and anything else you may need.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
