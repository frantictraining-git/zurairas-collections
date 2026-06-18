'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';

export default function Hero() {
  const heroRef    = useRef(null);
  const textRef    = useRef(null);
  const imgRef     = useRef(null);

  /* Subtle parallax on image panel */
  useEffect(() => {
    const onScroll = () => {
      if (!imgRef.current) return;
      const y = window.scrollY;
      imgRef.current.style.transform = `translateY(${y * 0.18}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Text entrance animation */
  useEffect(() => {
    if (!textRef.current) return;
    const children = textRef.current.querySelectorAll(`.${styles.animItem}`);
    children.forEach((el, i) => {
      el.style.transitionDelay = `${0.08 + i * 0.13}s`;
      setTimeout(() => el.classList.add(styles.visible), 80);
    });
  }, []);

  return (
    <section className={styles.hero} ref={heroRef} aria-label="Hero banner">
      {/* Decorative accent blobs */}
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      {/* Left — Text Content */}
      <div className={`${styles.content}`} ref={textRef}>
        <div className={`${styles.tagline} ${styles.animItem}`}>
          <span className="tag">Handcrafted in Toronto 🍁</span>
        </div>

        <h1 className={`${styles.headline} ${styles.animItem} display-xl`}>
          <span className={styles.lineWrap}>
            <em>Where</em> Art
          </span>
          <span className={styles.lineWrap}>
            Meets <span className={styles.accent}>Thread</span>
          </span>
        </h1>

        <p className={`${styles.sub} ${styles.animItem} body-lg`}>
          Exquisite embroidered clothing, handmade ornaments &amp; artisan jewellery.
          <br />Each piece a story — crafted with love, worn with pride.
        </p>

        <div className={`${styles.ctas} ${styles.animItem}`}>
          <a href="#arrivals" className="btn-primary" id="hero-shop-cta">
            <span>Explore Collection</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
          <a href="#story" className="btn-outline" id="hero-story-cta">
            <span>Our Story</span>
          </a>
        </div>

        {/* Stats bar */}
        <div className={`${styles.stats} ${styles.animItem}`}>
          <div className={styles.stat}>
            <strong>200+</strong>
            <span>Unique Pieces</span>
          </div>
          <div className={styles.statDivider} aria-hidden="true" />
          <div className={styles.stat}>
            <strong>100%</strong>
            <span>Handcrafted</span>
          </div>
          <div className={styles.statDivider} aria-hidden="true" />
          <div className={styles.stat}>
            <strong>CA</strong>
            <span>Ships Across Canada</span>
          </div>
        </div>
      </div>

      {/* Right — Image Panel */}
      <div className={styles.imgPanel}>
        <div className={styles.imgWrap} ref={imgRef}>
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=85&fit=crop"
            alt="Elegant fashion — Zuraira's Collections"
            fill
            priority
            fetchPriority="high"
            className={styles.bgImg}
            sizes="(max-width: 900px) 100vw, 50vw"
          />
          {/* Subtle light wash to lift whites */}
          <div className={styles.imgOverlay} />
        </div>

        {/* Floating card */}
        <div className={styles.floatCard}>
          <span className={styles.floatDot} />
          <div>
            <p className={styles.floatLabel}>New Arrival</p>
            <p className={styles.floatName}>Embroidered Collection</p>
          </div>
          <span className={styles.floatPrice}>From CAD 145</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollHint} aria-hidden="true">
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}
