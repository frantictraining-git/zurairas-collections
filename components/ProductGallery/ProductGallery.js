'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './ProductGallery.module.css';

export default function ProductGallery({ images, altText }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={styles.gallery} aria-label="Product Image Gallery">
      {/* Main Large Image */}
      <div className={styles.mainImgWrap}>
        <Image
          src={images[activeIndex]}
          alt={`${altText} - main view`}
          fill
          className={styles.img}
          priority
          sizes="(max-width: 900px) 100vw, 60vw"
        />
      </div>

      {/* Thumbnails */}
      <div className={styles.thumbnailGrid}>
        {images.map((imgSrc, i) => (
          <button 
            key={i} 
            className={`${styles.thumbWrap} ${i === activeIndex ? styles.activeThumb : ''}`}
            onClick={() => setActiveIndex(i)}
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={imgSrc}
              alt={`${altText} - thumbnail ${i + 1}`}
              fill
              className={styles.img}
              sizes="100px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
