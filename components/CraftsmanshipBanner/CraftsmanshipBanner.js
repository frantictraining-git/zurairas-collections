'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './CraftsmanshipBanner.module.css';

export default function CraftsmanshipBanner() {
  const imgRef  = useRef(null);
  const elRef   = useRef(null);

  /* Parallax */
  useEffect(() => {
    const onScroll = () => {
      if (!elRef.current || !imgRef.current) return;
      const rect   = elRef.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      imgRef.current.style.transform = `translateY(${center * 0.25}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Reveal */
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const reveals = el.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.2 }
    );
    reveals.forEach(r => observer.observe(r));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.banner} ref={elRef} aria-label="Craftsmanship feature">
      {/* Parallax image */}
      <div className={styles.imgContainer} ref={imgRef}>
        <Image
          src="/images/483863404_1101778851964401_7035531470983658274_n.jpg"
          alt="Detail of handcrafted embroidery — Zuraira's Collections"
          fill
          className={styles.img}
          sizes="100vw"
        />
        <div className={styles.overlay} />
      </div>

      {/* Content */}
      <div className={`${styles.content} container`}>
        <div className={styles.inner}>
          <p className={`label reveal`} style={{ color: 'var(--color-accent)' }}>The Art of Craft</p>

          <h2 className={`${styles.headline} reveal`}>
            Made by hand.<br />
            <span>Worn with soul.</span>
          </h2>

          <p className={`${styles.body} body-lg reveal`}>
            Every thread, every bead, every stitch is placed with intention.
            Our artisans pour decades of skill into each creation —
            making every Zuraira&apos;s piece a wearable work of art.
          </p>

          <div className={`${styles.features} reveal`}>
            {[
              ['✦', 'Hand-Embroidered'],
              ['◈', 'Ethically Sourced'],
              ['✿', 'Unique Designs'],
            ].map(([icon, text]) => (
              <div key={text} className={styles.feature}>
                <span className={styles.fIcon}>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <a href="/shop" className={`${styles.cta} reveal`} id="craft-shop-btn">
            <span>Shop the Collection</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
