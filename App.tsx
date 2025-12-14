import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Works } from './pages/Works';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Page } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Preloader Simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return <Home setPage={setCurrentPage} />;
      case Page.WORKS:
        return <Works />;
      case Page.ABOUT:
        return <About />;
      case Page.CONTACT:
        return <Contact />;
      default:
        return <Home setPage={setCurrentPage} />;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter animate-pulse">
                Orbit<span className="text-gray-500">Visuals</span>
            </h1>
            <div className="mt-4 w-48 h-[2px] bg-gray-800 mx-auto overflow-hidden">
                <div className="h-full bg-white animate-[loading_1.5s_ease-in-out_infinite]"></div>
            </div>
        </div>
        <style>{`
            @keyframes loading {
                0% { width: 0%; transform: translateX(-100%); }
                50% { width: 100%; transform: translateX(0); }
                100% { width: 0%; transform: translateX(100%); }
            }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orbit-black text-white selection:bg-white selection:text-black font-sans">
      <Navbar currentPage={currentPage} setPage={setCurrentPage} />
      
      <main className="transition-opacity duration-500 ease-in-out">
        {renderPage()}
      </main>

      <Footer setPage={setCurrentPage} />
    </div>
  );
}

export default App;