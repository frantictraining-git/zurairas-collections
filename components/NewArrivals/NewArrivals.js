'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './NewArrivals.module.css';

const products = [
  {
    id: 'p1',
    name: 'Crimson Embroidered Kameez',
    category: 'Clothing',
    price: 'CAD 145',
    img: '/images/482357944_1101778611964425_180619261892956500_n.jpg',
    tag: 'New',
    tagColor: '#D4540A',
  },
  {
    id: 'p2',
    name: 'Mustard Mirror-Work 3-Piece',
    category: 'Clothing',
    price: 'CAD 195',
    img: '/images/482347239_1101778775297742_5147514746175651940_n.jpg',
    tag: 'Bestseller',
    tagColor: '#C2185B',
  },
  {
    id: 'p3',
    name: 'Midnight Tasselled Ensemble',
    category: 'Clothing',
    price: 'CAD 175',
    img: '/images/483678605_1101778541964432_6893988421919644056_n.jpg',
    tag: 'New',
    tagColor: '#D4540A',
  },
  {
    id: 'p4',
    name: 'Blossom Silk Saree',
    category: 'Sarees',
    price: 'CAD 220',
    img: '/images/344564963_226480196663438_5172486391549468543_n.jpg',
    tag: 'Limited',
    tagColor: '#E8A020',
  },
];

export default function NewArrivals() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reveals = el.querySelectorAll('.reveal, .reveal-stagger');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    reveals.forEach(r => observer.observe(r));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="arrivals" className={`${styles.section} section`} ref={sectionRef} aria-labelledby="arrivals-heading">
      <div className="container">
        {/* Header */}
        <div className={`${styles.header} reveal`}>
          <div>
            <p className="label" style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Fresh In</p>
            <h2 id="arrivals-heading" className="display-md">New Arrivals</h2>
          </div>
          <a href="/shop?sort=new" className="btn-outline" id="arrivals-view-all">
            <span>See All</span>
          </a>
        </div>

        {/* Product Grid */}
        <div className={`${styles.grid} reveal-stagger`}>
          {products.map((p) => (
            <article key={p.id} className={styles.card} id={`product-${p.id}`}>
              <a href={`/product/${p.id}`} className={styles.imgWrap} aria-label={`View ${p.name}`}>
                {/* Tag */}
                <span
                  className={styles.badge}
                  style={{ background: p.tagColor }}
                >
                  {p.tag}
                </span>

                {/* Image */}
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  className={styles.img}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Quick action overlay */}
                <div className={styles.overlay}>
                  <button className={styles.quickAdd} aria-label={`Quick add ${p.name} to cart`} id={`qa-${p.id}`}>
                    <span>+ Add to Cart</span>
                  </button>
                </div>
              </a>

              {/* Card info */}
              <div className={styles.info}>
                <p className={styles.cat}>{p.category}</p>
                <h3 className={styles.name}>
                  <a href={`/product/${p.id}`}>{p.name}</a>
                </h3>
                <div className={styles.priceRow}>
                  <span className={styles.price}>{p.price}</span>
                  <button className={styles.wishlist} aria-label={`Wishlist ${p.name}`} id={`wl-${p.id}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
