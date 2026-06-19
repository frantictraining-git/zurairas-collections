'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import FilterSidebar from '@/components/FilterSidebar/FilterSidebar';
import ShopGrid from '@/components/ShopGrid/ShopGrid';
import { products } from '@/lib/data';
import styles from './page.module.css';

export default function ShopPage() {
  const [currentCategory, setCategory] = useState('All');
  const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Derive categories from products
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats);
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (currentCategory === 'All') return products;
    return products.filter(p => p.category === currentCategory);
  }, [currentCategory]);

  return (
    <>
      <Navbar />
      <main className={styles.shopContainer}>
        <div className={styles.shopHeader}>
          <h1>The Resort Collection</h1>
          <p className={styles.count}>{filteredProducts.length} Items</p>
          <button 
            className={styles.mobileFilterBtn}
            onClick={() => setMobileFilterOpen(true)}
          >
            Filter & Sort
          </button>
        </div>

        <div className={styles.shopLayout}>
          <div className={styles.sidebarCol}>
            <FilterSidebar 
              categories={categories}
              currentCategory={currentCategory}
              setCategory={setCategory}
              isMobileOpen={isMobileFilterOpen}
              setMobileOpen={setMobileFilterOpen}
            />
          </div>
          <div className={styles.gridCol}>
            <ShopGrid products={filteredProducts} />
            
            {/* Load More Button */}
            {filteredProducts.length > 0 && (
              <div className={styles.loadMoreWrap}>
                <button className={styles.loadMoreBtn}>Load More</button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
