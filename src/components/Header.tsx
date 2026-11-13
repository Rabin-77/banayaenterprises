import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X, Sparkles, Phone, ShieldCheck, ChevronRight, Truck, KeyRound } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Header: React.FC = () => {
  const { cartCount, wishlist, setActiveModal, setSelectedCategory, setSearchQuery } = useShop();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleNavClick = (sectionId: string, categoryFilter?: string) => {
    if (categoryFilter) {
      setSelectedCategory(categoryFilter);
    }
    scrollToSection(sectionId);
  };

  return (
    <>
      {/* Modern Top Notification Bar */}
      <div id="top-announcement-bar" className="bg-[#064E3B] text-emerald-50 text-xs py-2 px-4 border-b border-emerald-800/60 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <span className="inline-flex items-center gap-1 bg-emerald-800/90 text-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide">
              <Sparkles className="w-3 h-3 text-amber-300" />
              SPECIAL OFFER
            </span>
            <span className="text-emerald-100 text-xs">
              Free Express Shipping on orders above ₹499 • Use coupon <strong className="text-amber-300 font-bold tracking-wide">BANAYANA10</strong> for 10% OFF
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-emerald-200 text-xs">
            <button 
              onClick={() => setActiveModal('admin')} 
              className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 font-bold bg-emerald-900/50 px-2.5 py-0.5 rounded-full border border-emerald-700/60"
              title="Restricted Staff & Admin Management Portal"
            >
              <KeyRound className="w-3 h-3 text-amber-300" /> Admin Portal
            </button>
            <span className="text-emerald-700">|</span>
            <button 
              onClick={() => setActiveModal('trackOrder')} 
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5 text-emerald-300" /> Track Order
            </button>
            <span className="text-emerald-700">|</span>
            <a href="tel:+918838598172" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-300" /> +91 883 859 8172
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        id="main-header"
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs py-3 border-b border-slate-200'
            : 'bg-white py-4 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Mobile Menu Toggle & Search button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                id="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <button
                id="mobile-search-btn"
                onClick={() => setActiveModal('search')}
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center">
              <a
                href="#hero"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('hero');
                }}
                className="group flex items-center gap-3 focus:outline-none"
              >
                <div className="w-11 h-11 rounded-full overflow-hidden bg-white border border-slate-200/80 shadow-xs flex items-center justify-center p-0.5 group-hover:scale-105 transition-all duration-200 shrink-0">
                  <img
                    src="/images/banaya_logo.png"
                    alt="Banaya Enterprises"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-2xl tracking-tight text-slate-900 leading-none">
                    Banaya<span className="text-[#064E3B]">.</span>Enterprises
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase mt-0.5">
                    Pure & Natural Living
                  </span>
                </div>
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              <button
                onClick={() => handleNavClick('hero')}
                className="text-slate-700 hover:text-[#064E3B] font-medium text-sm transition-colors cursor-pointer py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#059669] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('shop-products')}
                className="text-slate-700 hover:text-[#064E3B] font-medium text-sm transition-colors cursor-pointer py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#059669] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                Shop All
              </button>
              <button
                onClick={() => handleNavClick('categories-section')}
                className="text-slate-700 hover:text-[#064E3B] font-medium text-sm transition-colors cursor-pointer py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#059669] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                Categories
              </button>
              <button
                onClick={() => handleNavClick('why-choose-us')}
                className="text-slate-700 hover:text-[#064E3B] font-medium text-sm transition-colors cursor-pointer py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#059669] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                Why Choose Us
              </button>
              <button
                onClick={() => handleNavClick('about-us')}
                className="text-slate-700 hover:text-[#064E3B] font-medium text-sm transition-colors cursor-pointer py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#059669] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                Our Story
              </button>
              <button
                onClick={() => handleNavClick('contact-footer')}
                className="text-slate-700 hover:text-[#064E3B] font-medium text-sm transition-colors cursor-pointer py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#059669] after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                Contact
              </button>
            </nav>

            {/* Right Action Icons & Search Box */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Desktop Search Button Bar */}
              <button
                id="header-search-btn"
                onClick={() => setActiveModal('search')}
                className="hidden xl:flex items-center gap-3 bg-slate-100/80 hover:bg-slate-100 text-slate-500 hover:text-slate-800 px-3.5 py-2 rounded-full text-xs transition-all border border-slate-200/80 cursor-pointer w-48 justify-between shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span>Search products...</span>
                </div>
                <span className="text-[10px] bg-white text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 font-mono">⌘K</span>
              </button>

              <button
                id="header-search-icon-btn"
                onClick={() => setActiveModal('search')}
                className="xl:hidden flex items-center justify-center w-10 h-10 rounded-xl text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Trigger */}
              <button
                id="header-wishlist-btn"
                onClick={() => setActiveModal('wishlist')}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-90 transition-all duration-150 cursor-pointer"
                title="Your Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span key={wishlist.length} className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs animate-badgePop">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* User Account Trigger */}
              <button
                id="header-account-btn"
                onClick={() => setActiveModal('account')}
                className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-90 transition-all duration-150 cursor-pointer"
                title="My Account & Orders"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Shopping Bag Trigger */}
              <button
                id="header-cart-btn"
                onClick={() => setActiveModal('cart')}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-90 transition-all duration-150 cursor-pointer"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span key={cartCount} className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-[#064E3B] text-amber-300 text-[11px] font-bold rounded-full flex items-center justify-center px-1 shadow-xs border-2 border-white animate-badgePop">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Shop CTA */}
              <button
                id="header-shop-now-cta"
                onClick={() => handleNavClick('shop-products')}
                className="hidden sm:inline-flex items-center gap-2 bg-[#064E3B] hover:bg-[#047857] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer ml-1"
              >
                <span>Shop Now</span>
                <ChevronRight className="w-4 h-4 text-emerald-300" />
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-fadeIn shadow-lg">
            <div className="grid grid-cols-2 gap-2 pt-2 pb-2">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  handleNavClick('shop-products');
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-xs text-left"
              >
                <span>All Products</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('honey-sweeteners');
                  handleNavClick('shop-products');
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium text-xs text-left"
              >
                <span>Wild Raw Honey</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="flex flex-col space-y-1 border-t border-slate-100 pt-3">
              <button
                onClick={() => handleNavClick('hero')}
                className="text-left py-2 px-3 text-slate-700 font-medium text-sm hover:bg-slate-50 rounded-lg transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('shop-products')}
                className="text-left py-2 px-3 text-slate-700 font-medium text-sm hover:bg-slate-50 rounded-lg transition-colors"
              >
                Shop Catalog
              </button>
              <button
                onClick={() => handleNavClick('categories-section')}
                className="text-left py-2 px-3 text-slate-700 font-medium text-sm hover:bg-slate-50 rounded-lg transition-colors"
              >
                Categories
              </button>
              <button
                onClick={() => handleNavClick('why-choose-us')}
                className="text-left py-2 px-3 text-slate-700 font-medium text-sm hover:bg-slate-50 rounded-lg transition-colors"
              >
                Why Choose Us
              </button>
              <button
                onClick={() => handleNavClick('about-us')}
                className="text-left py-2 px-3 text-slate-700 font-medium text-sm hover:bg-slate-50 rounded-lg transition-colors"
              >
                Our Heritage Story
              </button>
              <button
                onClick={() => handleNavClick('contact-footer')}
                className="text-left py-2 px-3 text-slate-700 font-medium text-sm hover:bg-slate-50 rounded-lg transition-colors"
              >
                Customer Support
              </button>
            </div>

            <div className="pt-2 space-y-2">
              <a
                href="tel:+918838598172"
                className="w-full py-2.5 px-3 bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-800 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Call +91 883 859 8172
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveModal('admin');
                }}
                className="w-full py-2.5 px-3 bg-slate-900 text-amber-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs"
              >
                <KeyRound className="w-4 h-4 text-amber-300" />
                Admin Management Portal
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
