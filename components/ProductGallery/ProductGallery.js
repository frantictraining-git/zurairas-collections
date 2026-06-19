'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './ProductGallery.module.css';

export default function ProductGallery({ images, altText }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  return (
    <div className={styles.gallery} aria-label="Product Image Gallery">
      {/* Thumbnails on top */}
      <div className={styles.thumbnailGrid}>
        {images.map((imgSrc, i) => (
          <button 
            key={i} 
            className={`${styles.thumbWrap} ${i === activeIndex ? styles.activeThumb : ''}`}
            onMouseEnter={() => setActiveIndex(i)}
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

      {/* Main Large Image */}
      <div 
        className={styles.mainImgWrap} 
        onClick={() => setShowLightbox(true)}
        style={{ cursor: 'zoom-in' }}
      >
        <Image
          src={images[activeIndex]}
          alt={`${altText} - main view`}
          fill
          className={styles.img}
          priority
          sizes="(max-width: 900px) 100vw, 60vw"
        />
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div 
          className={styles.lightboxOverlay} 
          onClick={() => setShowLightbox(false)}
        >
          <button className={styles.lightboxClose} onClick={() => setShowLightbox(false)}>✕</button>
          <div className={styles.lightboxImgWrap}>
            <Image
              src={images[activeIndex]}
              alt={`${altText} - enlarged view`}
              fill
              className={styles.lightboxImg}
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
