import Image from 'next/image';
import styles from './ProductGallery.module.css';

export default function ProductGallery({ images, altText }) {
  // If images is an array of strings
  return (
    <div className={styles.gallery} aria-label="Product Image Gallery">
      {images.map((imgSrc, i) => (
        <div key={i} className={styles.imgWrap}>
          <Image
            src={imgSrc}
            alt={`${altText} - view ${i + 1}`}
            fill
            className={styles.img}
            priority={i === 0} // prioritize loading the first image
            sizes="(max-width: 900px) 100vw, 60vw"
          />
        </div>
      ))}
    </div>
  );
}
