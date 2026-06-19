'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './FeaturedSlider.module.css';

const slides = [
  {
    id: 1,
    bgColor: '#983038', /* Moda red/crimson */
    leftImg: '/images/483678605_1101778541964432_6893988421919644056_n.jpg',
    rightImg: '/images/482357944_1101778611964425_180619261892956500_n.jpg',
    eyebrow: "FESTIVE '27",
    title: 'CRIMSON\nCLASSICS',
    desc: 'Bold hues and traditional embroidery across a suite of evening standouts.',
    btnText: 'SHOP THE EDIT'
  },
  {
    id: 2,
    bgColor: '#165D4F', /* Moda emerald green */
    leftImg: '/images/482347239_1101778775297742_5147514746175651940_n.jpg',
    rightImg: '/images/483495657_1101778798631073_460459356663882868_n.jpg',
    eyebrow: 'NEXT SEASON, NOW',
    title: 'EARTHY\nTONES',
    desc: 'Intricate detailing meets modern South Asian silhouettes.',
    btnText: 'DISCOVER MORE'
  },
  {
    id: 3,
    bgColor: '#DF8D72', /* Moda salmon/terracotta */
    leftImg: '/images/483610494_1101778551964431_3889330886213084434_n.jpg',
    rightImg: '/images/482360128_1101778791964407_3154841043440657627_n.jpg',
    eyebrow: 'NEW STYLES ADDED',
    title: 'UP TO\n40% OFF',
    desc: 'Shop the season\'s most coveted handcrafted pieces in the Designer Sale.',
    btnText: 'SHOP SALE'
  }
];

export default function FeaturedSlider() {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto-play
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className={styles.sliderSection} aria-label="Featured Collections Slider">
      <div className={styles.slidesContainer}>
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`${styles.slide} ${index === current ? styles.active : ''}`}
            aria-hidden={index !== current}
          >
            {/* Left Image Pane */}
            <div className={styles.leftImgPane}>
              <Image 
                src={slide.leftImg} 
                alt="Featured look left" 
                fill 
                className={styles.bgImg}
                sizes="(max-width: 900px) 0vw, 30vw"
              />
            </div>

            {/* Center Color Pane */}
            <div className={styles.centerPane} style={{ backgroundColor: slide.bgColor }}>
              <p className={styles.eyebrow}>{slide.eyebrow}</p>
              <h2 className={styles.title}>{slide.title}</h2>
              <p className={styles.desc}>{slide.desc}</p>
              <a href="#shop" className={styles.shopBtn}>{slide.btnText}</a>
            </div>

            {/* Right Image Pane */}
            <div className={styles.rightImgPane}>
              <Image 
                src={slide.rightImg} 
                alt="Featured look right" 
                fill 
                className={styles.bgImg}
                sizes="(max-width: 900px) 100vw, 30vw"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prevSlide} aria-label="Previous slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={nextSlide} aria-label="Next slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className={styles.dots}>
        {slides.map((_, index) => (
          <button 
            key={index}
            className={`${styles.dot} ${index === current ? styles.active : ''}`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
