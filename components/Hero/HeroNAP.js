'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './HeroNAP.module.css';

export default function HeroNAP() {
  const textRef = useRef(null);

  /* Entrance animation */
  useEffect(() => {
    if (!textRef.current) return;
    const children = textRef.current.querySelectorAll(`.${styles.animItem}`);
    children.forEach((el, i) => {
      el.style.transitionDelay = `${0.2 + i * 0.15}s`;
      setTimeout(() => el.classList.add(styles.visible), 100);
    });
  }, []);

  return (
    <section className={styles.hero} aria-label="Hero banner (Net-a-Porter style)">
      <div className={styles.grid}>
        {/* Left Column: Image */}
        <div className={styles.imageCol}>
          <div className={styles.imgWrap}>
            <Image
              src="https://images.unsplash.com/photo-1550614000-4b95dd244e47?w=1600&q=85&fit=crop"
              alt="Editorial fashion — Net-a-Porter inspired"
              fill
              priority
              fetchPriority="high"
              className={styles.bgImg}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Right Column: Text */}
        <div className={styles.textCol} ref={textRef}>
          <p className={`${styles.brand} ${styles.animItem}`}>
            Zuraira's Collections
          </p>

          <h1 className={`${styles.headline} ${styles.animItem}`}>
            The Art Of<br />
            Embroidery
          </h1>

          <p className={`${styles.sub} ${styles.animItem}`}>
            Explore our curated edit of handcrafted garments, ornaments, and jewellery. Minimalist luxury meets South Asian heritage.
          </p>

          <div className={`${styles.ctas} ${styles.animItem}`}>
            <a href="#arrivals" className="btn-primary" style={{ padding: '0.8rem 2.5rem', width: '100%', textAlign: 'center' }}>
              SHOP THE EDIT
            </a>
            <a href="#story" className="btn-outline" style={{ padding: '0.8rem 2.5rem', width: '100%', textAlign: 'center' }}>
              DISCOVER MORE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
