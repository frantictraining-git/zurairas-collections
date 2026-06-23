'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './BrandStory.module.css';

export default function BrandStory() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reveals = el.querySelectorAll('.reveal, .reveal-stagger');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.15 }
    );
    reveals.forEach(r => observer.observe(r));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="story" className={`${styles.story} section`} ref={sectionRef} aria-labelledby="story-heading">
      <div className="container">
        <div className={styles.grid}>

          {/* Left — images */}
          <div className={`${styles.imageStack} reveal`}>
            <div className={styles.imgMain}>
              <Image
                src="/images/483678605_1101778541964432_6893988421919644056_n.jpg"
                alt="Zuraira's handcrafted embroidered garment"
                fill
                className={styles.img}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className={styles.imgSecond}>
              <Image
                src="/images/344564963_226480196663438_5172486391549468543_n.jpg"
                alt="Rich silk saree from Zuraira's Collections"
                fill
                className={styles.img}
                sizes="(max-width: 768px) 100vw, 30vw"
              />
            </div>
            <div className={styles.floatBadge}>
              <span>Est.</span>
              <strong>Toronto</strong>
              <span>Canada 🍁</span>
            </div>
          </div>

          {/* Right — text */}
          <div className={styles.textSide}>
            <p className={`label reveal`} style={{ color: 'var(--color-primary)' }}>Our Story</p>

            <h2 id="story-heading" className={`display-md reveal`} style={{ marginBlock: '1rem 1.5rem' }}>
              Every stitch tells<br />
              <em style={{ fontStyle: 'italic', color: 'var(--color-primary)' }}>a thousand stories</em>
            </h2>

            <div className={`${styles.textBlock} reveal`}>
              <p className="body-lg">
                Zuraira&apos;s Collections was born from a deep love for artisanal craftsmanship and
                the rich textile heritage of South Asia — brought to life in the heart of Toronto.
              </p>
              <p className="body-lg" style={{ marginTop: '1rem' }}>
                Each piece in our collection is carefully handpicked or handcrafted — from vibrant
                embroidered kameez and silk sarees, to ornate handmade jewellery, decorative ornaments,
                and artisan home décor. We believe beauty should be felt, not just seen.
              </p>
            </div>

            <div className={`${styles.pillars} reveal-stagger`}>
              {[
                { label: 'Handcrafted', desc: 'Every piece made by hand with care' },
                { label: 'Authentic', desc: 'True to heritage, made with integrity' },
                { label: 'Artisan-Made', desc: 'Supporting skilled artisans' },
              ].map(p => (
                <div key={p.label} className={styles.pillar}>
                  <strong>{p.label}</strong>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>

            <div className={`reveal`} style={{ marginTop: '2.5rem' }}>
              <a href="#categories" className="btn-primary" id="story-explore-btn">
                <span>Explore Collections</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
