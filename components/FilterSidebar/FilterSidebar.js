'use client';

import { useState } from 'react';
import styles from './FilterSidebar.module.css';

export default function FilterSidebar({ 
  categories, currentCategory, setCategory, 
  colors, currentColor, setColor,
  currentPrice, setPrice,
  isMobileOpen, setMobileOpen 
}) {
  const [openSection, setOpenSection] = useState('category'); // default open

  const toggleSection = (sec) => {
    setOpenSection(prev => prev === sec ? null : sec);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`${styles.mobileOverlay} ${isMobileOpen ? styles.open : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside className={`${styles.sidebar} ${isMobileOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.header}>
          <h2>Filter & Sort</h2>
          <button className={styles.closeBtn} onClick={() => setMobileOpen(false)}>✕</button>
        </div>

        <div className={styles.filterSection}>
          <button className={styles.accordionBtn} onClick={() => toggleSection('category')}>
            <span>Category</span>
            <span className={styles.icon}>{openSection === 'category' ? '−' : '+'}</span>
          </button>
          
          {openSection === 'category' && (
            <div className={styles.accordionContent}>
              <label className={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="category" 
                  checked={currentCategory === 'All'}
                  onChange={() => setCategory('All')} 
                />
                <span className={styles.radioText}>All Items</span>
              </label>
              {categories.map(cat => (
                <label key={cat} className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="category" 
                    checked={currentCategory === cat}
                    onChange={() => setCategory(cat)} 
                  />
                  <span className={styles.radioText}>{cat}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className={styles.filterSection}>
          <button className={styles.accordionBtn} onClick={() => toggleSection('color')}>
            <span>Color</span>
            <span className={styles.icon}>{openSection === 'color' ? '−' : '+'}</span>
          </button>
          
          {openSection === 'color' && (
            <div className={styles.accordionContent}>
              <label className={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="color" 
                  checked={currentColor === 'All'}
                  onChange={() => setColor('All')} 
                />
                <span className={styles.radioText}>All Colors</span>
              </label>
              {colors.map(col => (
                <label key={col} className={styles.radioLabel}>
                  <input 
                    type="radio" 
                    name="color" 
                    checked={currentColor === col}
                    onChange={() => setColor(col)} 
                  />
                  <span className={styles.radioText}>{col}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className={styles.filterSection}>
          <button className={styles.accordionBtn} onClick={() => toggleSection('price')}>
            <span>Price</span>
            <span className={styles.icon}>{openSection === 'price' ? '−' : '+'}</span>
          </button>
          
          {openSection === 'price' && (
            <div className={styles.accordionContent}>
              <label className={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="price" 
                  checked={currentPrice === 'All'}
                  onChange={() => setPrice('All')} 
                />
                <span className={styles.radioText}>All Prices</span>
              </label>
              <label className={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="price" 
                  checked={currentPrice === 'Under $100'}
                  onChange={() => setPrice('Under $100')} 
                />
                <span className={styles.radioText}>Under $100</span>
              </label>
              <label className={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="price" 
                  checked={currentPrice === '$100 - $200'}
                  onChange={() => setPrice('$100 - $200')} 
                />
                <span className={styles.radioText}>$100 - $200</span>
              </label>
              <label className={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="price" 
                  checked={currentPrice === 'Over $200'}
                  onChange={() => setPrice('Over $200')} 
                />
                <span className={styles.radioText}>Over $200</span>
              </label>
            </div>
          )}
        </div>

      </aside>
    </>
  );
}
