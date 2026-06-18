'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({ theme: 'current', setTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('current');

  useEffect(() => {
    // Load saved preference
    const saved = localStorage.getItem('zc-theme');
    if (saved === 'nap' || saved === 'moda' || saved === 'current') setTheme(saved);
  }, []);

  useEffect(() => {
    // Apply theme class to <html>
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('zc-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
