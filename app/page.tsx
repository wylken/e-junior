import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import BlogSection from '@/components/home/BlogSection';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <BlogSection />
      <Footer />
    </main>
  );
}