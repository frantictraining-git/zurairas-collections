import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ProductGallery from '@/components/ProductGallery/ProductGallery';
import ProductSidebar from '@/components/ProductSidebar/ProductSidebar';
import { products } from '@/lib/data';
import styles from './page.module.css';

export default function ProductPage({ params }) {
  // Find product by id, fallback to first product if not found
  const product = products.find(p => p.id === params.id) || products[0];

  return (
    <>
      <Navbar />
      <main className={styles.pdpContainer}>
        {/* Left Side: Scrolling Gallery */}
        <div className={styles.leftCol}>
          <ProductGallery images={product.images} altText={product.title} />
        </div>

        {/* Right Side: Sticky Info Panel */}
        <div className={styles.rightCol}>
          <div className={styles.stickyWrap}>
            <ProductSidebar product={product} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
