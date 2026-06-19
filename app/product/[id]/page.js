import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ProductGallery from '@/components/ProductGallery/ProductGallery';
import ProductSidebar from '@/components/ProductSidebar/ProductSidebar';
import YouMayAlsoLike from '@/components/YouMayAlsoLike/YouMayAlsoLike';
import { products } from '@/lib/data';
import styles from './page.module.css';

export default async function ProductPage({ params }) {
  const { id } = await params;
  // Find product by id, fallback to first product if not found
  const product = products.find(p => p.id === id) || products[0];

  const recommendations = products.filter(p => p.id !== product.id).slice(0, 6);

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
      
      <YouMayAlsoLike products={recommendations} />
      
      <Footer />
    </>
  );
}
