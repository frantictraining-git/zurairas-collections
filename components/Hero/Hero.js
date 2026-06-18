'use client';

import { useTheme } from '@/components/ThemeProvider/ThemeProvider';
import HeroCurrent from './HeroCurrent';
import HeroModa from './HeroModa';
import HeroNAP from './HeroNAP';

export default function Hero() {
  const { theme } = useTheme();

  if (theme === 'moda') {
    return <HeroModa />;
  }
  
  if (theme === 'nap') {
    return <HeroNAP />;
  }

  // Default / "Current" theme
  return <HeroCurrent />;
}
