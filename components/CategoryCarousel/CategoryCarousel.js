'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './CategoryCarousel.module.css';

const categories = [
  {
    id: 'clothing',
    label: 'Clothing',
    sub: 'Embroidered & Printed',
    img: '/images/482355758_1101778858631067_4742768198472964927_n.jpg',
    count: '80+ pieces',
    accent: '#D4540A',
  },
  {
    id: 'sarees',
    label: 'Sarees',
    sub: 'Silk & Woven',
    img: '/images/344564963_226480196663438_5172486391549468543_n.jpg',
    count: '30+ styles',
    accent: '#C2185B',
  },
  {
    id: 'jewellery',
    label: 'Jewellery',
    sub: 'Handmade & Artisan',
    img: '/images/483610494_1101778551964431_3889310886213084434_n.jpg',
    count: '40+ pieces',
    accent: '#E8A020',
  },
  {
    id: 'ornaments',
    label: 'Ornaments',
    sub: 'Decorative & Gifting',
    img: '/images/483863404_1101778795297740_3777906919581155195_n.jpg',
    count: '25+ items',
    accent: '#1A7A8C',
  },
  {
    id: 'scarves',
    label: 'Scarves & Dupattas',
    sub: 'Shawls & Wraps',
    img: '/images/483750119_1101778741964412_7630810925780805176_n.jpg',
    count: '20+ styles',
    accent: '#7B5EA7',
  },
  {
    id: 'home',
    label: 'Home Décor',
    sub: 'Artisan Home Pieces',
    img: '/images/483569554_1101779805297639_9124474548918100818_n.jpg',
    count: '15+ items',
    accent: '#2E7D32',
  },
];

export default function CategoryCarousel() {
  const sectionRef = useRef(null);
  const trackRef   = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reveals = el.querySelectorAll('.reveal, .reveal-stagger');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    reveals.forEach(r => observer.observe(r));
    return () => observer.disconnect();
  }, []);

  /* Drag-to-scroll */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let isDown = false, startX = 0, scrollLeft = 0;
    const down  = (e) => { isDown = true; startX = (e.pageX || e.touches[0].pageX) - track.offsetLeft; scrollLeft = track.scrollLeft; track.style.cursor = 'grabbing'; };
    const leave = ()  => { isDown = false; track.style.cursor = 'grab'; };
    const move  = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x    = (e.pageX || e.touches[0].pageX) - track.offsetLeft;
      const walk = (x - startX) * 1.6;
      track.scrollLeft = scrollLeft - walk;
    };
    track.addEventListener('mousedown',  down);
    track.addEventListener('mouseleave', leave);
    track.addEventListener('mouseup',    leave);
    track.addEventListener('mousemove',  move);
    track.addEventListener('touchstart', down,  { passive: true });
    track.addEventListener('touchend',   leave);
    track.addEventListener('touchmove',  move,  { passive: false });
    return () => {
      track.removeEventListener('mousedown',  down);
      track.removeEventListener('mouseleave', leave);
      track.removeEventListener('mouseup',    leave);
      track.removeEventListener('mousemove',  move);
      track.removeEventListener('touchstart', down);
      track.removeEventListener('touchend',   leave);
      track.removeEventListener('touchmove',  move);
    };
  }, []);

  return (
    <section id="categories" className={`${styles.section}`} ref={sectionRef} aria-labelledby="cat-heading">
      <div className="container">
        <div className={`${styles.header} reveal`}>
          <div>
            <p className="label" style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Browse by Category</p>
            <h2 id="cat-heading" className="display-md">Our Collections</h2>
          </div>
          <a href="/shop" className="btn-outline" id="cat-view-all">
            <span>View All</span>
          </a>
        </div>
      </div>

      {/* Full-bleed scrollable track */}
      <div className={styles.carouselOuter} role="region" aria-label="Category carousel">
        <div className={styles.track} ref={trackRef}>
          {categories.map((cat, i) => (
            <a
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className={styles.card}
              id={`cat-card-${cat.id}`}
              aria-label={`Browse ${cat.label}`}
              style={{ '--accent': cat.accent, '--delay': `${i * 0.08}s` }}
            >
              <div className={styles.imgWrap}>
                <Image
                  src={cat.img}
                  alt={`${cat.label} — Zuraira's Collections`}
                  fill
                  className={styles.img}
                  sizes="320px"
                />
                <div className={styles.imgOverlay} />
              </div>
              <div className={styles.cardBody}>
                <span className={styles.count}>{cat.count}</span>
                <h3 className={styles.cardLabel}>{cat.label}</h3>
                <p className={styles.cardSub}>{cat.sub}</p>
                <span className={styles.arrow}>→</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className={styles.dragHint} aria-hidden="true">
        <span>← Drag to explore →</span>
      </div>
    </section>
  );
}
