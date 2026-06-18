import Navbar   from '@/components/Navbar/Navbar';
import Hero      from '@/components/Hero/Hero';
import BrandStory         from '@/components/BrandStory/BrandStory';
import CategoryCarousel   from '@/components/CategoryCarousel/CategoryCarousel';
import NewArrivals        from '@/components/NewArrivals/NewArrivals';
import CraftsmanshipBanner from '@/components/CraftsmanshipBanner/CraftsmanshipBanner';
import Testimonials        from '@/components/Testimonials/Testimonials';
import Newsletter          from '@/components/Newsletter/Newsletter';
import Footer              from '@/components/Footer/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BrandStory />
        <CategoryCarousel />
        <NewArrivals />
        <CraftsmanshipBanner />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
