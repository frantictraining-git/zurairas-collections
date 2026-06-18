'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Newsletter.module.css';

export default function Newsletter() {
  const [email, setEmail]         = useState('');
  const [status, setStatus]       = useState('idle'); // idle | loading | success | error
  const sectionRef                = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.2 }
    );
    el.querySelectorAll('.reveal').forEach(r => observer.observe(r));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    /* Firebase integration will be added in Phase 5 */
    await new Promise(r => setTimeout(r, 1200));
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <section className={`${styles.section} section`} ref={sectionRef} aria-labelledby="newsletter-heading">
      <div className="container">
        <div className={styles.card}>
          {/* Decorative elements */}
          <div className={styles.blob1} aria-hidden="true" />
          <div className={styles.blob2} aria-hidden="true" />

          <div className={styles.inner}>
            <div className={`${styles.textSide} reveal`}>
              <p className="label" style={{ color: 'var(--color-accent)', marginBottom: '0.7rem' }}>
                Stay in the Loop
              </p>
              <h2 id="newsletter-heading" className="display-md" style={{ color: '#fff' }}>
                New drops, straight<br />
                <span style={{ color: 'var(--color-accent)' }}>to your inbox</span>
              </h2>
              <p className="body-lg" style={{ color: 'rgba(255,255,255,0.72)', marginTop: '1rem' }}>
                Be the first to know about new collections, exclusive pieces,
                and artisan stories from Zuraira&apos;s Collections.
              </p>

              <ul className={styles.perks}>
                {['Early access to new arrivals', 'Exclusive subscriber discounts', 'Behind-the-scenes artisan stories'].map(p => (
                  <li key={p}>
                    <span className={styles.check}>✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${styles.formSide} reveal`}>
              {status === 'success' ? (
                <div className={styles.successBox}>
                  <span className={styles.successIcon}>🎉</span>
                  <h3>You&apos;re on the list!</h3>
                  <p>Thank you for subscribing. Watch your inbox for beautiful things.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                  <label htmlFor="newsletter-email" className={styles.formLabel}>
                    Your email address
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`${styles.input} ${status === 'error' ? styles.inputError : ''}`}
                      required
                      autoComplete="email"
                      aria-describedby="newsletter-hint"
                    />
                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={status === 'loading'}
                      id="newsletter-submit"
                    >
                      {status === 'loading' ? (
                        <span className={styles.spinner} aria-label="Submitting…" />
                      ) : (
                        <span>Subscribe</span>
                      )}
                    </button>
                  </div>
                  {status === 'error' && (
                    <p className={styles.errMsg} role="alert" id="newsletter-hint">
                      Please enter a valid email address.
                    </p>
                  )}
                  <p className={styles.privacyNote} id={status !== 'error' ? 'newsletter-hint' : undefined}>
                    No spam, ever. Unsubscribe anytime. 🍁
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
