import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { Menu, X, ShoppingCart } from 'lucide-react';

interface NavbarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work', value: Page.WORKS },
    { label: 'About', value: Page.ABOUT },
    { label: 'Store', value: Page.STORE },
    { label: 'Contact', value: Page.CONTACT },
  ];

  const handleNavClick = (page: Page) => {
    setPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled || mobileMenuOpen ? 'bg-orbit-black/90 backdrop-blur-md py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center relative z-50">
        {/* Logo */}
        <div 
          className="cursor-pointer group"
          onClick={() => handleNavClick(Page.HOME)}
        >
          <h1 className="text-2xl font-black tracking-tighter uppercase text-white group-hover:opacity-80 transition-opacity">
            Cian<span className="text-gray-400 font-light">Cinematic</span>
          </h1>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.value)}
              className={`text-sm uppercase tracking-widest hover:text-white transition-colors duration-300 relative group ${
                currentPage === link.value ? 'text-white' : 'text-gray-400'
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-2 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full ${currentPage === link.value ? 'w-full' : ''}`}></span>
            </button>
          ))}
          <button onClick={() => handleNavClick(Page.CART)} className="text-white hover:text-gray-300 transition-colors relative">
            <ShoppingCart size={20} strokeWidth={1.5} />
            {/* Optional dot if item in cart */}
            {/* <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div> */}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={() => handleNavClick(Page.CART)} className="text-white">
            <ShoppingCart size={20} strokeWidth={1.5} />
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 flex flex-col justify-center items-center space-y-8 transition-transform duration-500 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '0', height: '100vh', width: '100vw' }}
      >
        <button onClick={() => handleNavClick(Page.HOME)} className="text-3xl font-bold uppercase tracking-tighter text-white">Home</button>
        {navLinks.map((link) => (
          <button
            key={link.label}
            onClick={() => handleNavClick(link.value)}
            className={`text-3xl font-bold uppercase tracking-tighter transition-colors ${
              currentPage === link.value ? 'text-white' : 'text-gray-500'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </nav>
  );
};