import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Works } from './pages/Works';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Store } from './pages/Store';
import { Cart } from './pages/Cart';
import { Page } from './types';

// --- ASSET CONFIGURATION ---
const BACKGROUND_ASSETS = {
    videos: [], 
    images: [
        "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80", 
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80", 
    ]
};

const GlobalHeroVideo = ({ currentPage }: { currentPage: Page }) => {
    const shouldShow = currentPage === Page.HOME || currentPage === Page.ABOUT;
    // Streamable Embed: Autoplay, Mute, Loop, No Controls
    const videoId = "siftry";
    const embedUrl = `https://streamable.com/e/${videoId}?autoplay=1&muted=1&loop=1&controls=0&nocontrols=1`;

    return (
        <div className={`fixed inset-0 w-full h-full z-0 transition-opacity duration-1000 ${shouldShow ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-orbit-black via-transparent to-transparent z-10 pointer-events-none"></div>
            
            {/* Object Cover Simulation for Iframe */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                 {/* 
                    Mobile Zoom Logic: 
                    On portrait screens (e.g., phones), a 16:9 video needs to be scaled up to cover the height.
                    Height = 100vh. Width must be approx 177.7vh to maintain ratio.
                    We use a very large width calculation to ensure coverage and "zoom" effect.
                 */}
                 <iframe
                    src={embedUrl}
                    className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[350vh] h-[100vh] md:w-[120vw] md:h-[120vh]"
                    style={{ maxWidth: 'none', maxHeight: 'none' }}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title="Hero Video"
                />
            </div>
        </div>
    );
};

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavHidden, setIsNavHidden] = useState(false);

  useEffect(() => {
    const loadCriticalAssets = async () => {
      try {
        // Simulating load time for the "App experience" + Image preloading
        const imagePromises = BACKGROUND_ASSETS.images.map(src => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(true);
                img.src = src;
            });
        });
        
        const minTimePromise = new Promise(resolve => setTimeout(resolve, 2000));
        await Promise.all([...imagePromises, minTimePromise]);
      } catch (e) {
        console.error("Asset loading error", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadCriticalAssets();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Ensure nav is visible when changing pages unless the new page explicitly hides it
    setIsNavHidden(false); 
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME: return <Home setPage={setCurrentPage} setNavHidden={setIsNavHidden} />;
      case Page.WORKS: return <Works setNavHidden={setIsNavHidden} />;
      case Page.ABOUT: return <About />;
      case Page.CONTACT: return <Contact />;
      case Page.STORE: return <Store setPage={setCurrentPage} />;
      case Page.CART: return <Cart setPage={setCurrentPage} />;
      default: return <Home setPage={setCurrentPage} setNavHidden={setIsNavHidden} />;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-orbit-black z-[100] flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter animate-pulse">
                Cian<span className="text-gray-500">Cinematic</span>
            </h1>
            <div className="mt-4 w-48 h-[2px] bg-gray-800 mx-auto overflow-hidden">
                <div className="h-full bg-white animate-[loading_1.5s_ease-in-out_infinite]"></div>
            </div>
            <p className="text-xs text-gray-600 uppercase tracking-widest mt-4 animate-pulse">Loading Experience...</p>
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
    <div className="min-h-screen bg-orbit-black text-white selection:bg-white selection:text-black font-sans overflow-x-hidden relative">
      <Navbar currentPage={currentPage} setPage={setCurrentPage} isHidden={isNavHidden} />
      <GlobalHeroVideo currentPage={currentPage} />
      <main className="w-full relative z-10">
        {renderPage()}
      </main>
      <Footer setPage={setCurrentPage} />
    </div>
  );
}

export default App;