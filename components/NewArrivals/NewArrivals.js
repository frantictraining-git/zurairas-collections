'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './NewArrivals.module.css';

export default function NewArrivals() {
  const sectionRef = useRef(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    // 1. Fetch Live Products
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // 2. Count items added in the last 30 days for the eyebrow
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          const newItemsCount = data.filter(p => new Date(p.createdAt) > thirtyDaysAgo).length;
          setNewCount(newItemsCount);
          
          // 3. Keep the 4 absolute newest items for the grid display
          setRecentProducts(data.slice(0, 4));
        }
      })
      .catch(console.error);

    // Intersection Observer for scroll animations
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
          <div className={styles.headerText}>
            <p className={styles.eyebrow}>{newCount > 0 ? `${newCount} NEW ITEMS` : 'NEW ARRIVALS'}</p>
            <h2 id="arrivals-heading" className={styles.headline}>New In</h2>
          </div>
          <a href="/shop?sort=new" className={styles.shopNow} id="arrivals-view-all">
            Shop now
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </a>
        </div>

        {/* Product Grid */}
        <div className={`${styles.grid} reveal-stagger`}>
          {recentProducts.map((p) => {
            const hasDiscount = p.discountPercentage > 0;
            const discountedPrice = p.price - (p.price * (p.discountPercentage / 100));
            const tagText = hasDiscount ? `-${p.discountPercentage}%` : 'New';
            const tagColor = hasDiscount ? '#C2185B' : '#D4540A';
            const imageUrl = p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/400x600';

            return (
              <article key={p.id} className={styles.card} id={`product-${p.id}`}>
                <Link href={`/product/${p.id}`} className={styles.imgWrap} aria-label={`View ${p.title}`}>
                  {/* Tag */}
                  <span
                    className={styles.badge}
                    style={{ background: tagColor }}
                  >
                    {tagText}
                  </span>

                  {/* Image */}
                  <Image
                    src={imageUrl}
                    alt={p.title}
                    fill
                    className={styles.img}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Quick action overlay */}
                  <div className={styles.overlay}>
                    <button className={styles.quickAdd} aria-label={`Quick add ${p.title} to cart`} id={`qa-${p.id}`} onClick={(e) => e.preventDefault()}>
                      <span>+ Add to Cart</span>
                    </button>
                  </div>
                </Link>

                {/* Card info */}
                <div className={styles.info}>
                  <p className={styles.cat}>{p.category}</p>
                  <h3 className={styles.name}>
                    <Link href={`/product/${p.id}`}>{p.title}</Link>
                  </h3>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>
                      {hasDiscount ? (
                        <>
                          <span style={{ textDecoration: 'line-through', marginRight: '8px', fontSize: '0.85em', opacity: 0.6 }}>CAD {p.price.toFixed(2)}</span>
                          CAD {discountedPrice.toFixed(2)}
                        </>
                      ) : (
                        `CAD ${p.price.toFixed(2)}`
                      )}
                    </span>
                    <button className={styles.wishlist} aria-label={`Wishlist ${p.title}`} id={`wl-${p.id}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
