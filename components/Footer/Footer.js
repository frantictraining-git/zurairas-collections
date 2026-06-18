import styles from './Footer.module.css';

const footerLinks = {
  Shop: [
    { label: 'Clothing',       href: '/shop?category=clothing' },
    { label: 'Sarees',         href: '/shop?category=sarees' },
    { label: 'Jewellery',      href: '/shop?category=jewellery' },
    { label: 'Ornaments',      href: '/shop?category=ornaments' },
    { label: 'Scarves',        href: '/shop?category=scarves' },
    { label: 'Home Décor',     href: '/shop?category=home' },
  ],
  Help: [
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Size Guide',          href: '/size-guide' },
    { label: 'FAQ',                 href: '/faq' },
    { label: 'Contact Us',          href: '/contact' },
  ],
  Company: [
    { label: 'Our Story',      href: '#story' },
    { label: 'Artisan Network', href: '/artisans' },
    { label: 'Sustainability',  href: '/sustainability' },
    { label: 'Privacy Policy',  href: '/privacy' },
  ],
};

const socials = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'Pinterest',
    href: 'https://pinterest.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.12 9.43 7.57 11.27-.1-.9-.2-2.28 0-3.26.18-.83 1.2-5.08 1.2-5.08s-.3-.62-.3-1.54c0-1.45.84-2.53 1.88-2.53.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.87 3.48-.25 1.04.52 1.89 1.54 1.89 1.85 0 3.27-1.95 3.27-4.76 0-2.49-1.79-4.23-4.34-4.23-2.96 0-4.69 2.22-4.69 4.51 0 .89.34 1.85.77 2.37.08.1.09.19.07.29-.08.32-.25 1.04-.29 1.18-.05.19-.16.23-.37.14C4.7 16.17 3.8 14.2 3.8 12.58c0-3.63 2.64-6.97 7.61-6.97 4 0 7.1 2.85 7.1 6.65 0 3.96-2.5 7.15-5.97 7.15-1.17 0-2.26-.61-2.63-1.33l-.72 2.67c-.26.99-1 2.23-1.48 2.99.5.15 1.03.23 1.57.23C18.63 24 24 18.63 24 12S18.63 0 12 0z"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      {/* Top section */}
      <div className={`${styles.top} container`}>
        {/* Brand column */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoZ}>Z</span>
            <span>uraira&apos;s</span>
            <span className={styles.logoSub}> Collections</span>
          </div>
          <p className={styles.tagline}>
            Handcrafted with love from the heart of Toronto.
            Where every piece tells a story, and every stitch carries a soul.
          </p>
          <p className={styles.location}>
            📍 Toronto, Ontario, Canada 🍁
          </p>
          {/* Social links */}
          <div className={styles.socials}>
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                className={styles.social}
                aria-label={`Follow on ${s.label}`}
                target="_blank"
                rel="noopener noreferrer"
                id={`footer-social-${s.label.toLowerCase()}`}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading} className={styles.linkCol}>
            <h3 className={styles.colHeading}>{heading}</h3>
            <ul>
              {links.map(l => (
                <li key={l.label}>
                  <a href={l.href} className={styles.link}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Bottom bar */}
      <div className={`${styles.bottom} container`}>
        <p>© {new Date().getFullYear()} Zuraira&apos;s Collections. All rights reserved.</p>
        <p className={styles.madeWith}>
          Made with ❤️ in Toronto, Canada 🍁
        </p>
        <div className={styles.payIcons}>
          <span title="Visa">VISA</span>
          <span title="Mastercard">MC</span>
          <span title="PayPal">PP</span>
          <span title="Interac">e-Transfer</span>
        </div>
      </div>
    </footer>
  );
}
