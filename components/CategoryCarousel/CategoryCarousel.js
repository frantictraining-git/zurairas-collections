'use client';

import { useEffect, useRef, useState } from 'react';
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
    img: '/images/483610494_1101778551964431_3889330886213084434_n.jpg',
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
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const scrollToSlide = (index) => {
    if (!trackRef.current) return;
    setCurrentSlide(index);
    const trackWidth = trackRef.current.clientWidth;
    trackRef.current.scrollTo({
      left: index * trackWidth,
      behavior: 'smooth'
    });
  };

  const nextSlide = () => {
    if (currentSlide < categories.length - 1) scrollToSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) scrollToSlide(currentSlide - 1);
  };

  /* Drag/Swipe logic to detect left/right swipe and change slide */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let startX = 0, isDragging = false;

    const down = (e) => {
      isDragging = true;
      startX = e.pageX || e.touches[0].pageX;
    };

    const up = (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.pageX || (e.changedTouches ? e.changedTouches[0].pageX : startX);
      const diff = startX - endX;

      if (diff > 50 && currentSlide < categories.length - 1) {
        scrollToSlide(currentSlide + 1);
      } else if (diff < -50 && currentSlide > 0) {
        scrollToSlide(currentSlide - 1);
      } else {
        // snap back
        scrollToSlide(currentSlide);
      }
    };

    track.addEventListener('mousedown', down);
    track.addEventListener('mouseup', up);
    track.addEventListener('mouseleave', () => { if(isDragging) { isDragging = false; scrollToSlide(currentSlide); } });
    track.addEventListener('touchstart', down, { passive: true });
    track.addEventListener('touchend', up);

    return () => {
      track.removeEventListener('mousedown', down);
      track.removeEventListener('mouseup', up);
      track.removeEventListener('mouseleave', () => {});
      track.removeEventListener('touchstart', down);
      track.removeEventListener('touchend', up);
    };
  }, [currentSlide]);

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
                  sizes="100vw"
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

      <div className={styles.controls}>
        <button 
          className={styles.arrowBtn} 
          onClick={prevSlide} 
          disabled={currentSlide === 0}
          aria-label="Previous category"
          style={{ opacity: currentSlide === 0 ? 0.3 : 1 }}
        >
          ←
        </button>
        <div className={styles.dots}>
          {categories.map((_, idx) => (
            <button
              key={idx}
              className={`${styles.dot} ${currentSlide === idx ? styles.active : ''}`}
              onClick={() => scrollToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <button 
          className={styles.arrowBtn} 
          onClick={nextSlide} 
          disabled={currentSlide === categories.length - 1}
          aria-label="Next category"
          style={{ opacity: currentSlide === categories.length - 1 ? 0.3 : 1 }}
        >
          →
        </button>
      </div>
    </section>
  );
}
