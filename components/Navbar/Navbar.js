'use client';

import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'Collections', href: '/#categories' },
  { label: 'New Arrivals', href: '/#arrivals' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const { cartCount, cartItems, cartTotal, setIsCartOpen, removeFromCart } = useCart();
  const navRef                    = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNavClick = (e, href) => {
    // Only intercept anchor links (smooth scroll). Let real page links navigate normally.
    if (!href.startsWith('#')) return;
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
        <Link href="/" className={styles.logo} aria-label="Zuraira&apos;s Collections Home">
          <span className={styles.logoZ}>Z</span>
          <span className={styles.logoText}>uraira&apos;s</span>
          <span className={styles.logoDot}> ✦ </span>
          <span className={styles.logoSub}>Collections</span>
        </Link>

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

          <div className={styles.cartWrap}>
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

            {/* Mini Cart Popup (Hover) */}
            {cartItems.length > 0 && (
              <div className={styles.miniCartPopup}>
                <div className={styles.miniCartHeader}>
                  <h4>Available Now</h4>
                </div>
                <div className={styles.miniCartItems}>
                  {cartItems.slice(0, 3).map((item, idx) => (
                    <div key={idx} className={styles.miniCartItem}>
                      <div className={styles.miniCartImgWrap}>
                        <img src={item.images[0]} alt={item.title} className={styles.miniCartImg} />
                      </div>
                      <div className={styles.miniCartInfo}>
                        <div className={styles.mcTitleRow}>
                          <p className={styles.mcDesigner}>{item.designer || "ZURAIRA'S COLLECTIONS"}</p>
                          <button 
                            className={styles.mcRemoveBtn} 
                            onClick={(e) => { e.stopPropagation(); removeFromCart(item.id, item.size); }}
                            aria-label="Remove item"
                          >
                            ✕
                          </button>
                        </div>
                        <p className={styles.mcName}>{item.title}</p>
                        <p className={styles.mcColor}>Color: {item.color || 'Default'}</p>
                        <p className={styles.mcPrice}>${item.price.toFixed(2)}</p>
                        <div className={styles.mcSizeRow}>
                          <span>Size: {item.size}</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                        {item.quantity === 1 && <p className={styles.mcAlert}>Only 1 Left!</p>}
                      </div>
                    </div>
                  ))}
                  {cartItems.length > 3 && (
                    <p className={styles.mcMore}>+ {cartItems.length - 3} more items...</p>
                  )}
                </div>
                <div className={styles.miniCartFooter}>
                  <div className={styles.mcSubtotal}>
                    <span>Order Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className={styles.mcEst}>
                    <span className={styles.mcEstLabel}>Est. Pay Today 
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    </span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button 
                    className={styles.mcCheckoutBtn}
                    onClick={() => setIsCartOpen(true)}
                  >
                    Go To My Shopping Bag
                  </button>
                </div>
              </div>
            )}
          </div>

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
