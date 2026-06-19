'use client';

import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'Collections', href: '#categories' },
  { label: 'New Arrivals', href: '#arrivals' },
  { label: 'Our Story', href: '#story' },
  { label: 'Contact', href: '#footer' },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const navRef                    = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      ref={navRef}
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuActive : ''}`}
    >
      <div className={styles.inner}>
        {/* Logo */}
        <a href="/" className={styles.logo} aria-label="Zuraira's Collections Home">
          <span className={styles.logoZ}>Z</span>
          <span className={styles.logoText}>uraira&apos;s</span>
          <span className={styles.logoDot}> ✦ </span>
          <span className={styles.logoSub}>Collections</span>
        </a>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav} aria-label="Main navigation">
          <ul>
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={styles.navLink}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Actions */}
        <div className={styles.actions}>
          <a href="/shop" className={styles.shopBtn} id="nav-shop-btn">
            <span>Shop Now</span>
          </a>

          <button
            className={styles.cartBtn}
            aria-label={`Shopping cart, ${cartCount} items`}
            id="nav-cart-btn"
            onClick={() => setIsCartOpen(true)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </button>

          {/* Hamburger */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
            id="nav-hamburger"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ''}`} aria-hidden={!menuOpen}>
        <nav>
          <ul>
            {navLinks.map((link, i) => (
              <li key={link.label} style={{ '--delay': `${i * 0.06}s` }}>
                <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li style={{ '--delay': `${navLinks.length * 0.06}s` }}>
              <a href="/shop" className={styles.mobileShopLink}>Shop Now →</a>
            </li>
          </ul>
        </nav>
        <p className={styles.mobileTagline}>Handcrafted with love · Toronto, Canada 🍁</p>
      </div>
    </header>
  );
}
