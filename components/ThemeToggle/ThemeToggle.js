'use client';

import { useTheme } from '@/components/ThemeProvider/ThemeProvider';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isModa = theme === 'moda';

  return (
    <div className={styles.wrapper} role="group" aria-label="Design theme switcher">
      <span className={styles.label}>Style</span>

      <div className={styles.toggle}>
        <button
          className={`${styles.btn} ${isModa ? styles.active : ''}`}
          onClick={() => setTheme('moda')}
          aria-pressed={isModa}
          id="theme-moda-btn"
          title="Moda Operandi style — warm editorial"
        >
          <span className={styles.dot} />
          Moda
        </button>

        <button
          className={`${styles.btn} ${!isModa ? styles.active : ''}`}
          onClick={() => setTheme('nap')}
          aria-pressed={!isModa}
          id="theme-nap-btn"
          title="Net-a-Porter style — pure monochrome"
        >
          <span className={styles.dot} />
          NAP
        </button>
      </div>

      <span className={styles.hint}>
        {isModa ? 'Warm Editorial' : 'Pure Minimal'}
      </span>
    </div>
  );
}
