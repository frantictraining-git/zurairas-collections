'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import styles from './YouMayAlsoLike.module.css';

export default function YouMayAlsoLike({ products }) {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className={styles.ymalSection}>
      <h3 className={styles.title}>You May Also Like</h3>
      
      <div className={styles.carouselWrap}>
        <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={scrollLeft} aria-label="Previous">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        
        <div className={styles.carousel} ref={scrollRef}>
          {products.map(item => (
            <Link href={`/product/${item.id}`} key={item.id} className={styles.card}>
              <div className={styles.imageWrap}>
                <Image 
                  src={item.images[0]} 
                  alt={item.title} 
                  fill 
                  className={styles.image} 
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                <button className={styles.wishlistBtn} aria-label="Add to wishlist">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
              </div>
              <div className={styles.info}>
                <p className={styles.collection}>Trunkshow</p>
                <p className={styles.designer}>{item.designer || "ZURAIRA'S COLLECTIONS"}</p>
                <h4 className={styles.name}>{item.title}</h4>
                <p className={styles.price}>{item.formattedPrice}</p>
              </div>
            </Link>
          ))}
        </div>

        <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={scrollRight} aria-label="Next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </section>
  );
}
