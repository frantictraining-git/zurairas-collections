import Navbar   from '@/components/Navbar/Navbar';
import FeaturedSlider from '@/components/FeaturedSlider/FeaturedSlider';
import BrandStory         from '@/components/BrandStory/BrandStory';
import CategoryCarousel   from '@/components/CategoryCarousel/CategoryCarousel';
import NewArrivals        from '@/components/NewArrivals/NewArrivals';
import CraftsmanshipBanner from '@/components/CraftsmanshipBanner/CraftsmanshipBanner';
import Testimonials        from '@/components/Testimonials/Testimonials';
import Footer              from '@/components/Footer/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <FeaturedSlider />
        <BrandStory />
        <CategoryCarousel />
        <NewArrivals />
        <CraftsmanshipBanner />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
