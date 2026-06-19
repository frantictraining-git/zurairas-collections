import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ProductGallery from '@/components/ProductGallery/ProductGallery';
import ProductSidebar from '@/components/ProductSidebar/ProductSidebar';
import styles from './page.module.css';

// Mock database for now
const productDatabase = {
  'p1': {
    title: 'Crimson Embroidered Kameez',
    price: 'CAD 145',
    designer: "ZURAIRA'S COLLECTIONS",
    images: [
      '/images/482357944_1101778611964425_180619261892956500_n.jpg',
      '/images/483863404_1101778795297740_3777906919581155195_n.jpg',
      '/images/482355758_1101778858631067_4742768198472964927_n.jpg'
    ],
    story: "Handcrafted with precision, this crimson ensemble embodies the rich heritage of South Asian craftsmanship mixed with modern elegance."
  },
  'p2': {
    title: 'Mustard Mirror-Work 3-Piece',
    price: 'CAD 195',
    designer: "ZURAIRA'S COLLECTIONS",
    images: [
      '/images/482347239_1101778775297742_5147514746175651940_n.jpg',
      '/images/483678605_1101778541964432_6893988421919644056_n.jpg',
      '/images/483495657_1101778798631073_460459356663882868_n.jpg'
    ],
    story: "A vibrant mustard set adorned with intricate mirror work, perfect for festive occasions."
  },
  'p3': {
    title: 'Midnight Tasselled Ensemble',
    price: 'CAD 175',
    designer: "ZURAIRA'S COLLECTIONS",
    images: [
      '/images/483678605_1101778541964432_6893988421919644056_n.jpg',
      '/images/483750119_1101778741964412_7630810925780805176_n.jpg',
      '/images/482360128_1101778791964407_3154841043440657627_n.jpg'
    ],
    story: "Dark, moody, and impossibly elegant. Features delicate tassels and a free-flowing silhouette."
  },
  'p4': {
    title: 'Blossom Silk Saree',
    price: 'CAD 220',
    designer: "ZURAIRA'S COLLECTIONS",
    images: [
      '/images/344564963_226480196663438_5172486391549468543_n.jpg',
      '/images/483569554_1101779805297639_9124474548918100818_n.jpg',
      '/images/483610494_1101778551964431_3889330886213084434_n.jpg'
    ],
    story: "Woven from the finest silk, this saree features blooming floral motifs and an exquisite drape."
  }
};

export default function ProductPage({ params }) {
  // If product not found, fallback to a default (e.g. p1) or 404
  const product = productDatabase[params.id] || productDatabase['p1'];

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
