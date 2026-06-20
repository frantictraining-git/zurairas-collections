import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'Our Story | Zuraira\'s Collections',
  description: 'Learn about the story behind Zuraira\'s Collections — a Canadian South Asian luxury boutique founded with love.',
};

export default function OurStoryPage() {
  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Our Story</h1>
      </section>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Where It All Began</h2>
          <p>
            Zuraira&apos;s Collections was born from a deep love of South Asian heritage and a desire to bring
            the finest in luxury ethnic fashion to Canadian women. Founded by a passionate curator with roots
            spanning the subcontinent, our boutique is a celebration of craftsmanship, culture, and elegance
            — curated specifically for the modern South Asian woman living abroad.
          </p>
          <p>
            Every piece in our collection is hand-selected with intention, sourced directly from skilled artisans
            and renowned designers who carry generations of tradition in their work. From intricate embroidery
            to luxurious fabrics, each garment tells a story of heritage that transcends borders.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Our Mission</h2>
          <p>
            We believe that every woman deserves to feel connected to her roots — whether she is dressing for
            a wedding, an Eid celebration, or simply honouring the beauty of her culture on an ordinary day.
            Zuraira&apos;s Collections exists to make that connection effortless, beautiful, and deeply personal.
          </p>
          <p>
            Based in Canada, we are proud to serve the South Asian diaspora with a curated boutique experience
            that blends the grandeur of traditional couture with the convenience of modern shopping. Welcome to
            our world — we are so glad you are here.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
