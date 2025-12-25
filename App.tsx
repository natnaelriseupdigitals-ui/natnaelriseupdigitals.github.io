import React, { useState, useEffect, useRef } from 'react';
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
const CRITICAL_ASSETS = [
    "https://www.dropbox.com/scl/fi/8n8x2l0ehc1d7fxai8aoh/this-one-took-a-while-inspo-from-scoobafiles-tylerbaileytravel-travel-nature.mp4?rlkey=g4jizjr8vfgqih1z01c9cbeu8&st=aolhwlws&raw=1",
    "https://www.dropbox.com/scl/fi/07gehbamxu1153uwfzu3e/home-.-horizontal.mp4?rlkey=p7lqi0wglmiwsxgy1wy64jbrq&st=g5vajvz6&raw=1",
    "https://www.dropbox.com/scl/fi/85hdwt3zp14t906l471rb/more-like-these-Or-the-pov-vids-horizontal.mp4?rlkey=yaqwfzz8mjo8xonmztt9lk8py&st=xufsz2at&raw=1",
    "https://www.dropbox.com/scl/fi/gvz4m0i4qt6tmhuwtszeu/purple-frames-cinematography-ocean-beach-sunset-horizontal.mp4?rlkey=okqprv70ip1yf0lonxl8i3fqy&st=wd4elu9s&raw=1",
    "https://www.dropbox.com/scl/fi/opah137bqtjtg4gb0kboq/drifting.mp4?rlkey=swzdq9ktnrgyw19ypehiif5qt&st=dbwsvnt5&raw=1",
    "https://www.dropbox.com/scl/fi/x9evw26r2tb2gad8xgdc3/one-of-the-best-sunsets-I-ve-ever-seen-1.mp4?rlkey=lrfx2usxs0q3enpkuu8j0yp45&st=dzu6xf1r&raw=1",
    "https://www.dropbox.com/scl/fi/1z2ekv7ryjusshq00r6r9/spring-has-finally-come-around-in-Aus.mp4?rlkey=rixpg341bipzjbtbwq23pvzmq&st=vzpziorp&raw=1",
    "https://www.dropbox.com/scl/fi/4ikzitd8c2dyc30d6ksee/one-hell-of-a-camp-spot.mp4?rlkey=iwdbpto7b36x849v7v45ukg6e&st=do5mcpxw&raw=1"
];

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
    const videoRef = useRef<HTMLVideoElement>(null);
    const shouldShow = currentPage === Page.HOME || currentPage === Page.ABOUT;

    useEffect(() => {
        if (videoRef.current) {
            if (shouldShow) {
                videoRef.current.play().catch(() => {});
            } else {
                videoRef.current.pause();
            }
        }
    }, [shouldShow]);

    return (
        <div className={`fixed inset-0 w-full h-full z-0 transition-opacity duration-1000 ${shouldShow ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-orbit-black via-transparent to-transparent z-10"></div>
            <video
                ref={videoRef}
                src="https://www.dropbox.com/scl/fi/8n8x2l0ehc1d7fxai8aoh/this-one-took-a-while-inspo-from-scoobafiles-tylerbaileytravel-travel-nature.mp4?rlkey=g4jizjr8vfgqih1z01c9cbeu8&st=aolhwlws&raw=1"
                autoPlay
                muted
                loop
                playsInline
                webkit-playsinline="true"
                className="w-full h-full object-cover scale-110"
                style={{ pointerEvents: 'none' }}
            />
        </div>
    );
};

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCriticalAssets = async () => {
      try {
        const videoPromises = CRITICAL_ASSETS.map(src => {
            return new Promise((resolve) => {
                const video = document.createElement('video');
                video.addEventListener('canplaythrough', () => resolve(true), { once: true });
                video.addEventListener('error', () => resolve(true), { once: true });
                setTimeout(() => { if (video.readyState >= 2) resolve(true); }, 4000);
                video.src = src;
                video.preload = 'auto';
                video.muted = true;
                video.load();
            });
        });
        const minTimePromise = new Promise(resolve => setTimeout(resolve, 2000));
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 10000));
        await Promise.race([Promise.all([...videoPromises, minTimePromise]), timeoutPromise]);
      } catch (e) {
        console.error("Critical asset loading error", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadCriticalAssets();
  }, []);

  useEffect(() => {
    if (!isLoading) {
        BACKGROUND_ASSETS.images.forEach(src => { const img = new Image(); img.src = src; });
    }
  }, [isLoading]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME: return <Home setPage={setCurrentPage} />;
      case Page.WORKS: return <Works />;
      case Page.ABOUT: return <About />;
      case Page.CONTACT: return <Contact />;
      case Page.STORE: return <Store setPage={setCurrentPage} />;
      case Page.CART: return <Cart setPage={setCurrentPage} />;
      default: return <Home setPage={setCurrentPage} />;
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
      <Navbar currentPage={currentPage} setPage={setCurrentPage} />
      <GlobalHeroVideo currentPage={currentPage} />
      <main className="w-full relative z-10">
        {renderPage()}
      </main>
      <Footer setPage={setCurrentPage} />
    </div>
  );
}

export default App;