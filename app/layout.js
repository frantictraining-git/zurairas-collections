import './globals.css';
import './themes.css';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';

export const metadata = {
  title: "Zuraira's Collections | Handcrafted Clothing & Ornaments — Toronto, Canada",
  description:
    "Discover Zuraira's Collections — premium handcrafted clothing, embroidered garments, jewellery, scarves, home décor and ornaments. Artisan-made, shipped across Canada.",
  keywords: "handcrafted clothing, embroidered, South Asian fashion, Toronto, Canada, ornaments, jewellery, handmade",
  openGraph: {
    title: "Zuraira's Collections",
    description: "Premium handcrafted clothing & ornaments from Toronto, Canada.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="moda">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
