'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import FilterSidebar from '@/components/FilterSidebar/FilterSidebar';
import ShopGrid from '@/components/ShopGrid/ShopGrid';
import { products } from '@/lib/data';
import styles from './page.module.css';

// Declared outside ShopPage to avoid re-creating component on every render
function PaginationControls({ totalPages, currentPage, setCurrentPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className={styles.pagination}>
      <button 
        className={styles.pageBtn} 
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
      >
        Prev
      </button>
      <span className={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </span>
      <button 
        className={styles.pageBtn} 
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
      >
        Next
      </button>
    </div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  // Read the ?category= param from the URL (e.g. /shop?category=Jewellery)
  const urlCategory = searchParams.get('category');
  const initialCategory = urlCategory
    ? products.find(p => p.category.toLowerCase() === urlCategory.toLowerCase())?.category || 'All'
    : 'All';

  const [currentCategory, setCategory] = useState(initialCategory);
  const [currentColor, setColor] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);

  const ITEMS_PER_PAGE = 4;

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats);
  }, []);

  const colors = useMemo(() => {
    const cols = new Set(products.map(p => p.color).filter(Boolean));
    return Array.from(cols);
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (currentCategory !== 'All') filtered = filtered.filter(p => p.category === currentCategory);
    if (currentColor !== 'All') filtered = filtered.filter(p => p.color === currentColor);
    return filtered;
  }, [currentCategory, currentColor]);

  useMemo(() => { setCurrentPage(1); }, [currentCategory, currentColor]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
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
            colors={colors}
            currentColor={currentColor}
            setColor={setColor}
            isMobileOpen={isMobileFilterOpen}
            setMobileOpen={setMobileFilterOpen}
          />
        </div>
        <div className={styles.gridCol}>
          <div className={styles.topPagination}>
            <PaginationControls totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </div>

          <ShopGrid products={paginatedProducts} />
          
          <div className={styles.bottomPagination}>
            <PaginationControls totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div style={{ padding: '8rem', textAlign: 'center' }}>Loading collection...</div>}>
        <ShopContent />
      </Suspense>
      <Footer />
    </>
  );
}
