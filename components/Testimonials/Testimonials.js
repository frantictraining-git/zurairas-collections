'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    id: 't1',
    quote: "I ordered a custom embroidered kameez and it was absolutely breathtaking. The craftsmanship is like nothing I've seen outside of Pakistan. Zuraira's is my go-to in Toronto.",
    author: 'Sana M.',
    location: 'Mississauga, ON',
    initials: 'SM',
    color: '#D4540A',
  },
  {
    id: 't2',
    quote: "The saree I received was even more beautiful in person. The colours are rich, the fabric is luxurious, and delivery was super quick. Highly recommend to anyone who loves authentic South Asian fashion!",
    author: 'Priya K.',
    location: 'Scarborough, ON',
    initials: 'PK',
    color: '#C2185B',
  },
  {
    id: 't3',
    quote: "I bought handmade ornaments as Eid gifts and everyone was amazed. Each piece felt so personal and thoughtfully made. Zuraira's truly brings artisan craftsmanship to Canada.",
    author: 'Fatima R.',
    location: 'Brampton, ON',
    initials: 'FR',
    color: '#1A7A8C',
  },
  {
    id: 't4',
    quote: "The dupatta I ordered has the most stunning embroidery — I've gotten so many compliments. This is where tradition meets elegance. Love love love this brand!",
    author: 'Nadia H.',
    location: 'Toronto, ON',
    initials: 'NH',
    color: '#7B5EA7',
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);

  const goTo = (i) => {
    if (animating || i === active) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(i);
      setAnimating(false);
    }, 300);
  };

  const next = () => goTo((active + 1) % testimonials.length);
  const prev = () => goTo((active - 1 + testimonials.length) % testimonials.length);

  /* Auto-rotate */
  useEffect(() => {
    intervalRef.current = setInterval(next, 6000);
    return () => clearInterval(intervalRef.current);
  }, [active]);

  /* Reveal */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.15 }
    );
    el.querySelectorAll('.reveal').forEach(r => observer.observe(r));
    return () => observer.disconnect();
  }, []);

  const t = testimonials[active];

  return (
    <section className={`${styles.section} section`} ref={sectionRef} aria-labelledby="reviews-heading">
      <div className="container">
        <div className={`${styles.header} reveal`}>
          <p className="label" style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Customer Love</p>
          <h2 id="reviews-heading" className="display-md">What Our Customers Say</h2>
        </div>

        <div className={`${styles.slider} reveal`}>
          {/* Quote mark */}
          <div className={styles.quoteMark} aria-hidden="true">&ldquo;</div>

          {/* Quote */}
          <blockquote
            className={`${styles.quote} ${animating ? styles.fadeOut : styles.fadeIn}`}
            key={t.id}
          >
            <p className={styles.quoteText}>{t.quote}</p>
            <footer className={styles.author}>
              <div className={styles.avatar} style={{ background: t.color }}>
                {t.initials}
              </div>
              <div>
                <cite className={styles.name}>{t.author}</cite>
                <span className={styles.loc}>{t.location}</span>
              </div>
            </footer>
          </blockquote>

          {/* Stars */}
          <div className={styles.stars} aria-label="5 stars">
            {'★★★★★'.split('').map((s, i) => (
              <span key={i} className={styles.star}>{s}</span>
            ))}
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            <button
              className={styles.arrow}
              onClick={prev}
              aria-label="Previous testimonial"
              id="testimonial-prev"
            >
              ←
            </button>
            <div className={styles.dots} role="tablist">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
                  onClick={() => goTo(i)}
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Testimonial ${i + 1}`}
                  id={`testimonial-dot-${i}`}
                />
              ))}
            </div>
            <button
              className={styles.arrow}
              onClick={next}
              aria-label="Next testimonial"
              id="testimonial-next"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
