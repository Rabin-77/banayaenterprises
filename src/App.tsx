import React, { useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { ShopProvider } from './context/ShopContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustHighlights } from './components/TrustHighlights';
import { ShopByCategory } from './components/ShopByCategory';
import { FeaturedProducts } from './components/FeaturedProducts';
import { WhyChooseUs } from './components/WhyChooseUs';
import { AboutSection } from './components/AboutSection';
import { PromoBanner } from './components/PromoBanner';
import { InstagramSection } from './components/InstagramSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';

// Interactive Modals & Drawers
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { AccountModal } from './components/AccountModal';
import { OrderTrackModal } from './components/OrderTrackModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ToastContainer } from './components/Toast';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { SplashScreen } from './components/SplashScreen';
import { ScrollProgressBar, ScrollToTopButton } from './components/ScrollReveal';
import { useShop } from './context/ShopContext';

function AppContent() {
  const { activeModal, setActiveModal } = useShop();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveModal(activeModal === 'search' ? null : 'search');
      } else if (e.key === 'Escape' && activeModal) {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, setActiveModal]);

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#FAF7F2] text-[#242A26] flex flex-col font-sans selection:bg-[#243D2F] selection:text-[#FAF7F2]">
      {/* Scroll Progress Indicator */}
      <ScrollProgressBar />

      {/* Brand Intro Splash Screen */}
      <SplashScreen />
      
      {/* Top Sticky Header */}
      <Header />

      {/* Main Content Sections */}
      <main className="flex-1 w-full overflow-x-clip">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Trust Highlights Feature Row */}
        <TrustHighlights />

        {/* 3. Shop by Category Grid */}
        <ShopByCategory />

        {/* 4. Featured & All Products Grid with Search, Filters & Sorting */}
        <FeaturedProducts />

        {/* 5. Why Choose Banaya Enterprise (6 Core Pillars) */}
        <WhyChooseUs />

        {/* 7. About Us Heritage Story */}
        <AboutSection />

        {/* 8. Special Wide Promotional Banner */}
        <PromoBanner />

        {/* 9. Instagram & Social Journey Gallery */}
        <InstagramSection />

        {/* 11. Newsletter Wellness Subscription */}
        <NewsletterSection />
      </main>

      {/* Professional Multi-Column Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <WishlistDrawer />
      <SearchModal />
      <AccountModal />
      <OrderTrackModal />
      <FloatingWhatsApp />
      <ScrollToTopButton />
      <ToastContainer />

      {/* Secure Restricted Admin Dashboard */}
      <AdminDashboardModal 
        isOpen={activeModal === 'admin'} 
        onClose={() => setActiveModal(null)} 
      />

    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ShopProvider>
        <AppContent />
      </ShopProvider>
    </MotionConfig>
  );
}
