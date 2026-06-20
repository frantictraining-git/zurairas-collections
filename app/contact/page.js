'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';

export default function ContactPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', subject: 'General Enquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate send (wire up to email service later e.g. Resend, Nodemailer)
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <>
      <Navbar />
      <div className={styles.contactPage}>

        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>Zuraira&apos;s Collections</p>
            <h1 className={styles.heroTitle}>We&apos;d Love to<br />Hear From You</h1>
            <p className={styles.heroSub}>
              Whether you have a question about sizing, a custom order, or simply want to say hello — we are here for you.
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className={styles.container}>

          {/* Left — Info */}
          <div className={styles.infoCol}>
            <h2>Get in Touch</h2>
            <p>
              Every piece in our collection is crafted with love and attention to detail.
              If you need help choosing the perfect outfit, want to place a custom order,
              or have any questions at all, please reach out — we reply within 24 hours.
            </p>

            <div className={styles.infoBlocks}>
              <div className={styles.infoBlock}>
                <div className={styles.infoIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className={styles.infoText}>
                  <h4>Email Us</h4>
                  <a href="mailto:hello@zurairas-collections.com">hello@zurairas-collections.com</a>
                </div>
              </div>

              <div className={styles.infoBlock}>
                <div className={styles.infoIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"></path>
                  </svg>
                </div>
                <div className={styles.infoText}>
                  <h4>WhatsApp</h4>
                  <a href="https://wa.me/447700900000" target="_blank" rel="noreferrer">+44 7700 900000</a>
                  <p>Mon – Sat, 10am – 7pm</p>
                </div>
              </div>

              <div className={styles.infoBlock}>
                <div className={styles.infoIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <div className={styles.infoText}>
                  <h4>Instagram</h4>
                  <a href="https://instagram.com/zurairas.collections" target="_blank" rel="noreferrer">@zurairas.collections</a>
                </div>
              </div>
            </div>

            {/* E-Transfer Card */}
            <div className={styles.etransferCard}>
              <h4>💛 Pay via Interac E-Transfer</h4>
              <p>
                We gladly accept Interac E-Transfer for Canadian customers.
                Simply send your payment to:
              </p>
              <a
                href="mailto:payments@zurairas-collections.com"
                className={styles.etransferEmail}
              >
                payments@zurairas-collections.com
              </a>
              <p style={{ marginTop: '0.75rem' }}>
                Please include your <strong>order items and size</strong> in the message field.
                Once received, we will confirm and dispatch your order within 1–2 business days.
              </p>
            </div>
          </div>

          {/* Right — Form */}
          <div className={styles.formCard}>
            {submitted ? (
              <div className={styles.successMsg}>
                <div className={styles.successIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3>Message Received</h3>
                <p>Thank you for reaching out. We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className={styles.formTitle}>Send a Message</h2>
                <p className={styles.formSub}>We read every message personally.</p>

                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label htmlFor="firstName">First Name</label>
                    <input id="firstName" name="firstName" type="text" required placeholder="Aisha" value={form.firstName} onChange={handleChange} />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="lastName">Last Name</label>
                    <input id="lastName" name="lastName" type="text" required placeholder="Khan" value={form.lastName} onChange={handleChange} />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="email">Email Address</label>
                  <input id="email" name="email" type="email" required placeholder="you@example.com" value={form.email} onChange={handleChange} />
                </div>

                <div className={styles.field}>
                  <label htmlFor="subject">Subject</label>
                  <select id="subject" name="subject" value={form.subject} onChange={handleChange}>
                    <option>General Enquiry</option>
                    <option>Custom Order</option>
                    <option>Sizing Help</option>
                    <option>E-Transfer Payment</option>
                    <option>Order Status</option>
                    <option>Returns &amp; Exchanges</option>
                    <option>Wholesale</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="message">Your Message</label>
                  <textarea id="message" name="message" required placeholder="Tell us how we can help..." value={form.message} onChange={handleChange} />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
