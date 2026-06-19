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
      {products.map((item) => (
        <Link href={`/product/${item.id}`} key={item.id} className={styles.card}>
          <div className={styles.imageWrap}>
            <Image
              src={item.images[0]}
              alt={item.title}
              fill
              className={styles.image}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {item.tag && (
              <span 
                className={styles.badge}
                style={{ backgroundColor: item.tagColor || '#000' }}
              >
                {item.tag}
              </span>
            )}
          </div>
          <div className={styles.info}>
            <p className={styles.designer}>{item.designer}</p>
            <h3 className={styles.name}>{item.title}</h3>
            <p className={styles.price}>{item.formattedPrice}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
