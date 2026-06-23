'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './ShopGrid.module.css';

export default function ShopGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No products found for this category.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((item) => {
        const hasDiscount = item.discountPercentage > 0;
        const discountedPrice = item.price - (item.price * (item.discountPercentage / 100));
        
        return (
        <Link href={`/product/${item.id}`} key={item.id} className={styles.card}>
          <div className={styles.imageWrap}>
            <Image
              src={item.images?.[0] || 'https://via.placeholder.com/400x600'}
              alt={item.title}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {hasDiscount && (
              <span className={styles.discountBadge}>
                -{item.discountPercentage}%
              </span>
            )}
            {!hasDiscount && item.tag && (
              <span 
                className={styles.badge}
                style={{ backgroundColor: item.tagColor || '#000' }}
              >
                {item.tag}
              </span>
            )}
          </div>
          <div className={styles.info}>
            <p className={styles.designer}>{item.category || item.designer}</p>
            <h3 className={styles.name}>{item.title}</h3>
            <div className={styles.priceContainer}>
              {hasDiscount ? (
                <>
                  <span className={styles.originalPrice}>CAD {item.price.toFixed(2)}</span>
                  <span className={styles.discountedPrice}>CAD {discountedPrice.toFixed(2)}</span>
                </>
              ) : (
                <p className={styles.price}>CAD {item.price.toFixed(2)}</p>
              )}
            </div>
          </div>
        </Link>
      )})}
    </div>
  );
}
