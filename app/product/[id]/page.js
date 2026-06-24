import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ProductSidebar from '@/components/ProductSidebar/ProductSidebar';
import ProductGallery from '@/components/ProductGallery/ProductGallery';
import YouMayAlsoLike from '@/components/YouMayAlsoLike/YouMayAlsoLike';
import { products } from '@/lib/data';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import styles from './page.module.css';

export default async function ProductPage({ params }) {
  const { id } = await params;
  
  await dbConnect();
  
  // Find product by id from database
  let product = await Product.findOne({ id }).lean();
  
  // Fallback to static if not in DB yet (for prototype transition)
  if (!product) {
    product = products.find(p => p.id === id) || products[0];
  } else {
    // Stringify _id for client components
    product._id = product._id.toString();
  }

  // Get recommendations
  const dbRecommendations = await Product.find({ id: { $ne: product.id } }).limit(6).lean();
  const recommendations = dbRecommendations.map(p => ({...p, _id: p._id.toString()}));

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
