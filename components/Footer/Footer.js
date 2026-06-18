'use client';

import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* ─── Top Block (Newsletter) ─── */}
      <div className={styles.topBlock}>
        <div className={styles.container}>
          <div className={styles.topGrid}>
            
            {/* Left side: Newsletter */}
            <div>
              <h3 className={styles.newsTitle}>Enjoy 10% off your next order on ZURAIRA'S COLLECTIONS</h3>
              <p className={styles.newsDesc}>
                Claim your exclusive discount code when you subscribe to our brand content. <a href="#terms" style={{textDecoration: 'underline'}}>T&Cs</a> and exclusions apply.
              </p>
              <a href="#what" className={styles.newsLink}>What will I receive?</a>
              
              <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="your@address.com" 
                  className={styles.input} 
                  required
                />
                <button type="submit" className={styles.submit}>Sign Up</button>
              </form>
              
              <div className={styles.socials}>
                {/* Youtube */}
                <a href="#" aria-label="YouTube"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
                {/* Facebook */}
                <a href="#" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                {/* Twitter / X */}
                <a href="#" aria-label="X"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg></a>
                {/* Instagram */}
                <a href="#" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
              </div>
            </div>

            {/* Right side: Help & Location */}
            <div>
              <h4 className={styles.helpTitle}>NEED HELP?</h4>
              <p className={styles.helpDesc}>
                For any enquiries please visit <a href="/care">Customer Care</a>.
              </p>

              <h4 className={styles.helpTitle}>LOCATION</h4>
              <div className={styles.location}>
                <span role="img" aria-label="Canada">🇨🇦</span> Canada
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─── Bottom Block (Links) ─── */}
      <div className={styles.bottomBlock}>
        <div className={styles.container}>
          <div className={styles.linksGrid}>
            
            {/* Col 1 */}
            <div>
              <h4 className={styles.colTitle}>CUSTOMER CARE</h4>
              <ul className={styles.linkList}>
                <li><a href="#">Track an Order</a></li>
                <li><a href="#">Return an Item</a></li>
                <li><a href="#" style={{textDecoration: 'underline'}}>Contact Us</a></li>
                <li><a href="#">Exchanges & Returns</a></li>
                <li><a href="#">Delivery</a></li>
                <li><a href="#">Payment</a></li>
                <li><a href="#">Terms & Conditions</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className={styles.colTitle}>ABOUT US</h4>
              <ul className={styles.linkList}>
                <li><a href="#">About ZURAIRA'S COLLECTIONS</a></li>
                <li><a href="#">People & Planet</a></li>
                <li><a href="#">Sustainability Strategy</a></li>
                <li><a href="#">Rewards</a></li>
                <li><a href="#">Affiliates</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className={styles.colTitle}>GET THE APP</h4>
              <div className={styles.qrWrap}>
                <div className={styles.qrCode}>
                  {/* Fake QR pattern for design */}
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1">
                    <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h2v2h-2zM15 15h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2zM13 17h2v2h-2zM15 19h2v2h-2zM17 17h2v2h-2zM19 19h2v2h-2zM15 13h2v2h-2z"/>
                  </svg>
                </div>
                <p className={styles.qrText}>Scan the QR code with your iOS or Android smartphone to download the app</p>
              </div>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className={styles.colTitle}>ACCEPTS</h4>
              <div className={styles.paymentIcons}>
                <span className={styles.payIcon} style={{padding: '0 8px', fontSize:'0.7rem', border:'1px solid #ddd', display:'flex', alignItems:'center'}}>PayPal</span>
                <span className={styles.payIcon} style={{padding: '0 8px', fontSize:'0.7rem', border:'1px solid #ddd', display:'flex', alignItems:'center'}}>VISA</span>
                <span className={styles.payIcon} style={{padding: '0 8px', fontSize:'0.7rem', border:'1px solid #ddd', display:'flex', alignItems:'center'}}>MasterCard</span>
                <span className={styles.payIcon} style={{padding: '0 8px', fontSize:'0.7rem', border:'1px solid #ddd', display:'flex', alignItems:'center'}}>Amex</span>
                <span className={styles.payIcon} style={{padding: '0 8px', fontSize:'0.7rem', border:'1px solid #ddd', display:'flex', alignItems:'center'}}>Apple Pay</span>
              </div>
            </div>

          </div>

          <div className={styles.brandLine}>
            <h4 className={styles.brandName}>ZURAIRA'S COLLECTIONS</h4>
            <p className={styles.brandDesc}>Shop the finest handcrafted South Asian luxury designs & be dressed for any occasion</p>
            <a href="#" className={styles.brandLink}>Visit ZURAIRASCOLLECTIONS.COM</a>
          </div>

        </div>
      </div>
    </footer>
  );
}
