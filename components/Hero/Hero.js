'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';

export default function Hero() {
  const heroRef    = useRef(null);
  const textRef    = useRef(null);
  const imgRef     = useRef(null);

  /* Parallax on scroll */
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      const y = window.scrollY;
      if (imgRef.current) imgRef.current.style.transform = `translateY(${y * 0.35}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Text entrance animation */
  useEffect(() => {
    if (!textRef.current) return;
    const children = textRef.current.querySelectorAll(`.${styles.animItem}`);
    children.forEach((el, i) => {
      el.style.transitionDelay = `${0.1 + i * 0.12}s`;
      setTimeout(() => el.classList.add(styles.visible), 80);
    });
  }, []);

  return (
    <section className={styles.hero} ref={heroRef} aria-label="Hero banner">
      {/* Parallax Background Image */}
      <div className={styles.imgWrap} ref={imgRef}>
        <Image
          src="/images/482347239_1101778775297742_5147514746175651940_n.jpg"
          alt="Zuraira's Collections — Handcrafted embroidered garments"
          fill
          priority
          fetchPriority="high"
          className={styles.bgImg}
          sizes="100vw"
        />
        <div className={styles.overlay} />
      </div>

      {/* Floating accent shapes */}
      <div className={styles.shape1} aria-hidden="true" />
      <div className={styles.shape2} aria-hidden="true" />

      {/* Content */}
      <div className={`${styles.content} container`} ref={textRef}>
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
          <div className={styles.divider} aria-hidden="true" />
          <div className={styles.stat}>
            <strong>100%</strong>
            <span>Handcrafted</span>
          </div>
          <div className={styles.divider} aria-hidden="true" />
          <div className={styles.stat}>
            <strong>CA</strong>
            <span>Ships Across Canada</span>
          </div>
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
