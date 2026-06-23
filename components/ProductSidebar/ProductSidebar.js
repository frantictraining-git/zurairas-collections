'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '@/context/CartContext';
import styles from './ProductSidebar.module.css';

export default function ProductSidebar({ product }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [openAccordion, setOpenAccordion] = useState('story'); // Default open
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  
  const { addToCart } = useCart();

  const sizes = ['S', 'M', 'L', 'XL'];

  const toggleAccordion = (id) => {
    setOpenAccordion(prev => prev === id ? null : id);
  };

  return (
    <div className={styles.sidebar}>
      {/* Product Header */}
      <p className={styles.designer}>{product.category || product.designer || "ZURAIRA's COLLECTIONS"}</p>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className={styles.title}>{product.title}</h1>
        {product.discountPercentage > 0 && (
          <span className={styles.discountBadge}>
            -{product.discountPercentage}%
          </span>
        )}
      </div>

      <div className={styles.priceContainer}>
        {product.discountPercentage > 0 ? (
          <>
            <span className={styles.originalPrice}>CAD {product.price.toFixed(2)}</span>
            <span className={styles.discountedPrice}>CAD {(product.price - (product.price * (product.discountPercentage / 100))).toFixed(2)}</span>
          </>
        ) : (
          <p className={styles.price}>CAD {product.price?.toFixed(2)}</p>
        )}
      </div>

      {/* Sizing */}
      <div className={styles.sizeSection}>
        <div className={styles.sizeLabel}>
          <span>Select Size</span>
          <span className={styles.sizeGuide} onClick={() => setShowSizeGuide(true)}>Size Guide</span>
        </div>
        <div className={styles.sizeGrid}>
          {sizes.map(size => (
            <button 
              key={size}
              className={`${styles.sizeBtn} ${selectedSize === size ? styles.selected : ''} ${sizeError && !selectedSize ? styles.errorShake : ''}`}
              onClick={() => {
                setSelectedSize(size);
                setSizeError(false);
              }}
            >
              {size}
            </button>
          ))}
        </div>
        {sizeError && <p style={{ color: '#d32f2f', fontSize: '0.8rem', marginTop: '0.5rem', fontFamily: 'Inter' }}>Please select a size first.</p>}
      </div>

      {/* Add to Bag */}
      <button 
        className={styles.addBtn}
        onClick={() => {
          if (!selectedSize) {
            setSizeError(true);
            return;
          }
          addToCart(product, selectedSize);
        }}
      >
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

      {/* Size Guide Modal / Slide-out Drawer */}
      {showSizeGuide && typeof document !== 'undefined' && createPortal(
        <div className={styles.modalOverlay} onClick={() => setShowSizeGuide(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowSizeGuide(false)}>✕</button>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '1rem' }}>Size Guide</h2>
            <table className={styles.sizeTable}>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Bust (in)</th>
                  <th>Waist (in)</th>
                  <th>Hips (in)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>S</td><td>34</td><td>26</td><td>36</td></tr>
                <tr><td>M</td><td>36</td><td>28</td><td>38</td></tr>
                <tr><td>L</td><td>38</td><td>30</td><td>40</td></tr>
                <tr><td>XL</td><td>40</td><td>32</td><td>42</td></tr>
              </tbody>
            </table>
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>Measurements are approximate. Please allow 1-2cm difference due to manual measurement.</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
