'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './HeroModa.module.css';

export default function HeroModa() {
  const textRef = useRef(null);
  const imgRef = useRef(null);

  /* Subtle parallax for the tall image */
  useEffect(() => {
    const onScroll = () => {
      if (!imgRef.current) return;
      const y = window.scrollY;
      imgRef.current.style.transform = `translateY(${y * 0.15}px) scale(1.02)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Entrance animation */
  useEffect(() => {
    if (!textRef.current) return;
    const children = textRef.current.querySelectorAll(`.${styles.animItem}`);
    children.forEach((el, i) => {
      el.style.transitionDelay = `${0.1 + i * 0.15}s`;
      setTimeout(() => el.classList.add(styles.visible), 100);
    });
  }, []);

  return (
    <section className={styles.hero} aria-label="Hero banner (Moda Operandi style)">
      
      {/* Tall Editorial Image */}
      <div className={styles.imgWrap}>
        <Image
          ref={imgRef}
          src="https://images.unsplash.com/photo-1550614000-4b95dd244e47?w=1600&q=85&fit=crop"
          alt="Exquisite fashion — Moda Operandi inspired"
          fill
          priority
          fetchPriority="high"
          className={styles.bgImg}
          sizes="100vw"
        />
      </div>

      {/* Content Below/Overlapping */}
      <div className={styles.content} ref={textRef}>
        <p className={`${styles.tagline} ${styles.animItem}`}>
          The Resort Collection
        </p>

        <h1 className={`${styles.headline} ${styles.animItem}`}>
          WHAT'S NEW
        </h1>

        <p className={`${styles.sub} ${styles.animItem}`}>
          Discover the latest arrivals in handcrafted luxury. From exquisite embroidered garments to artisan ornaments, every piece tells a story.
        </p>

        <div className={`${styles.ctas} ${styles.animItem}`}>
          <a href="#arrivals" className="btn-primary" style={{ padding: '0.8rem 2.5rem' }}>
            SHOP NOW
          </a>
          <a href="#story" className="btn-outline" style={{ padding: '0.8rem 2.5rem' }}>
            EXPLORE THE EDIT
          </a>
        </div>
      </div>
    </section>
  );
}
