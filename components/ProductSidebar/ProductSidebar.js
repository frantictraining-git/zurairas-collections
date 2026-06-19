'use client';

import { useState } from 'react';
import styles from './ProductSidebar.module.css';

export default function ProductSidebar({ product }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [openAccordion, setOpenAccordion] = useState('story'); // Default open

  const sizes = ['S', 'M', 'L', 'XL'];

  const toggleAccordion = (id) => {
    setOpenAccordion(prev => prev === id ? null : id);
  };

  return (
    <div className={styles.sidebar}>
      {/* Product Header */}
      <p className={styles.designer}>{product.designer || "ZURAIRA's COLLECTIONS"}</p>
      <h1 className={styles.title}>{product.title}</h1>
      <p className={styles.price}>{product.price}</p>

      {/* Sizing */}
      <div className={styles.sizeSection}>
        <div className={styles.sizeLabel}>
          <span>Select Size</span>
          <span className={styles.sizeGuide}>Size Guide</span>
        </div>
        <div className={styles.sizeGrid}>
          {sizes.map(size => (
            <button 
              key={size}
              className={`${styles.sizeBtn} ${selectedSize === size ? styles.selected : ''}`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Add to Bag */}
      <button className={styles.addBtn}>
        Add To Bag
      </button>

      {/* Accordions */}
      <div className={styles.accordion}>
        {/* Story */}
        <div className={styles.accordionItem}>
          <button className={styles.accordionBtn} onClick={() => toggleAccordion('story')}>
            <span>The Story</span>
            <span className={styles.accordionIcon}>{openAccordion === 'story' ? '−' : '+'}</span>
          </button>
          {openAccordion === 'story' && (
            <div className={styles.accordionContent}>
              {product.story || "Handcrafted with precision, this piece embodies the rich heritage of South Asian craftsmanship mixed with modern elegance."}
            </div>
          )}
        </div>

        {/* Details & Care */}
        <div className={styles.accordionItem}>
          <button className={styles.accordionBtn} onClick={() => toggleAccordion('details')}>
            <span>Details & Care</span>
            <span className={styles.accordionIcon}>{openAccordion === 'details' ? '−' : '+'}</span>
          </button>
          {openAccordion === 'details' && (
            <div className={styles.accordionContent}>
              <ul style={{ paddingLeft: '1rem', listStyle: 'disc' }}>
                <li>Material: Silk Blend / Pure Cotton</li>
                <li>Care: Dry clean only</li>
                <li>Hand-embroidered details</li>
                <li>Made in Canada</li>
              </ul>
            </div>
          )}
        </div>

        {/* Delivery & Returns */}
        <div className={styles.accordionItem}>
          <button className={styles.accordionBtn} onClick={() => toggleAccordion('delivery')}>
            <span>Delivery & Returns</span>
            <span className={styles.accordionIcon}>{openAccordion === 'delivery' ? '−' : '+'}</span>
          </button>
          {openAccordion === 'delivery' && (
            <div className={styles.accordionContent}>
              <p>Standard delivery within 3-5 business days. Free returns within 14 days of receipt.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
