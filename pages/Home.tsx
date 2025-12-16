import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../types';
import { Reveal } from '../components/Reveal';
import { Aperture, Film, Heart, ArrowRight, ChevronLeft, ChevronRight, ArrowDown, ArrowUpRight, ArrowLeft } from 'lucide-react';

interface HomeProps {
  setPage: (page: Page) => void;
}

// Reusing data structure for consistency with Works page
const featuredWorks = [
  { 
    id: 1, 
    title: "Eternal Vows", 
    category: "Wedding Photography", 
    client: "Private",
    year: "2024",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80", 
  },
  { 
    id: 2, 
    title: "Neon Gaze", 
    category: "Portrait Photography", 
    client: "Editorial",
    year: "2023",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80", 
  },
  { 
    id: 3, 
    title: "Lost in Tokyo", 
    category: "Travel Photography", 
    client: "Condé Nast",
    year: "2023",
    img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80", 
  },
  { 
    id: 4, 
    title: "Silk & Shadow", 
    category: "Fashion Photography", 
    client: "Vogue",
    year: "2024",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80", 
  },
  { 
    id: 5, 
    title: "Alpine Silence", 
    category: "Travel Photography", 
    client: "Nat Geo",
    year: "2024",
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80", 
  },
  { 
    id: 6, 
    title: "Golden Hour", 
    category: "Wedding Photography", 
    client: "Private",
    year: "2023",
    img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80", 
  },
];

export const Home: React.FC<HomeProps> = ({ setPage }) => {
  const [selectedWorkIndex, setSelectedWorkIndex] = useState<number | null>(null);
  
  // --- Infinite Carousel State ---
  const [activeIndex, setActiveIndex] = useState(10000);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoPlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    // Ensure video plays
    if (videoRef.current) {
        videoRef.current.defaultMuted = true;
        videoRef.current.muted = true;
        videoRef.current.play().catch(e => console.error("Video autoplay blocked:", e));
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto Switch
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
        setActiveIndex(prev => prev + 1);
    }, 1000); // 1 second interval

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  // Helper to get actual data index
  const getVisibleData = (index: number) => {
      const dataIndex = (index % featuredWorks.length + featuredWorks.length) % featuredWorks.length;
      return featuredWorks[dataIndex];
  };

  const handleManualInteraction = (action: () => void) => {
      action();
      setIsAutoPlay(false);
      
      if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
      
      // Resume after 3 seconds
      autoPlayTimeoutRef.current = setTimeout(() => {
          setIsAutoPlay(true);
      }, 3000);
  };

  const handlePrev = () => handleManualInteraction(() => setActiveIndex(prev => prev - 1));
  const handleNext = () => handleManualInteraction(() => setActiveIndex(prev => prev + 1));

  // --- Modal Navigation ---
  const handleModalPrev = () => {
    if (selectedWorkIndex !== null) {
      setSelectedWorkIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
    }
  };

  const handleModalNext = () => {
    if (selectedWorkIndex !== null) {
      setSelectedWorkIndex((prev) => (prev !== null && prev < featuredWorks.length - 1 ? prev + 1 : prev));
    }
  };

  const isMobile = windowWidth < 768;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full bg-black">
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-orbit-black via-transparent to-transparent z-10"></div>
            
            <video 
                ref={videoRef}
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-full object-cover scale-110 opacity-80"
            >
                <source src="https://www.dropbox.com/scl/fi/tz20d2xwyzl770wkhehkx/IMG_0669-2.mp4?rlkey=wptpf6cnzoz5vbjvzkfh2si8t&st=r71hja1x&raw=1" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center items-start text-left pt-12 md:pt-20">
            <Reveal delay={0.2}>
                <h1 className="text-[13vw] md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter uppercase mb-4">
                    Cinematic<br />
                    Visuals.
                </h1>
            </Reveal>

            <Reveal delay={0.4}>
                <div className="flex items-center gap-6 mt-2 mb-10 ml-2">
                    <div className="w-16 h-[2px] bg-white"></div>
                    <p className="text-xl md:text-3xl font-bold text-white uppercase tracking-[0.6em] md:tracking-[0.8em] pl-2">
                        Engineered.
                    </p>
                </div>
            </Reveal>
            
            <Reveal delay={0.6}>
                <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mb-0 font-light leading-relaxed">
                    We craft high impact video and photography for brands that dare to stand out. 
                    Fast paced, emotive, and unforgettable.
                </p>
            </Reveal>
        </div>

        {/* Scroll Indicator */}
         <div className="absolute bottom-10 left-0 w-full flex justify-center z-20">
            <div className="flex flex-col items-center gap-2 animate-bounce">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold pl-[0.3em]">Scroll</span>
                <ArrowDown className="text-white/50" size={20} />
            </div>
         </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-32 bg-orbit-black relative">
        <div className="container mx-auto px-6">
            <Reveal>
                <h2 className="text-3xl md:text-4xl font-bold mb-12 md:mb-16 uppercase tracking-tight">What We Do</h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                {[
                    { title: "Moments", icon: Aperture, desc: "We capture the moments that take your breath away and stay with you forever." },
                    { title: "Stories", icon: Film, desc: "Every image tells a story that moves, inspires, and lingers." },
                    { title: "Emotion", icon: Heart, desc: "Raw, real, unforgettable feelings frozen in time." }
                ].map((service, index) => (
                    <Reveal key={index} delay={index * 0.2}>
                        <div className="group border-t border-gray-800 pt-6 md:pt-8 hover:border-white transition-colors duration-500">
                            <service.icon className="w-10 h-10 md:w-12 md:h-12 mb-4 md:mb-6 text-gray-400 group-hover:text-white transition-colors" strokeWidth={1} />
                            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{service.title}</h3>
                            <p className="text-gray-400 leading-relaxed font-light text-sm md:text-base">{service.desc}</p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
      </section>

      {/* Featured Work - Main Container */}
      <section className="py-20 bg-orbit-gray relative overflow-hidden">
        <div className="container mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-30">
            <Reveal>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">Featured Work</h2>
            </Reveal>
            <Reveal delay={0.2}>
                <button 
                    onClick={() => setPage(Page.WORKS)}
                    className="hidden md:flex items-center text-sm font-bold uppercase tracking-widest hover:text-gray-300 transition-colors"
                >
                    View All Projects <ArrowRight className="ml-2 w-4 h-4" />
                </button>
            </Reveal>
        </div>

        {/* --- UNIFIED CAROUSEL (Mobile & Desktop) --- */}
        <div className="relative h-[500px] md:h-[600px] w-full flex items-center justify-center perspective-1000">
            
            {/* Arrows */}
            <button 
                onClick={handlePrev}
                className="absolute left-4 md:left-12 z-40 p-2 md:p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 group"
            >
                <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform md:w-8 md:h-8" />
            </button>
            <button 
                onClick={handleNext}
                className="absolute right-4 md:right-12 z-40 p-2 md:p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 group"
            >
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform md:w-8 md:h-8" />
            </button>

            {/* Track Items */}
            <div className="relative w-full h-full">
                {[-2, -1, 0, 1, 2].map((offset) => {
                    const index = activeIndex + offset;
                    const work = getVisibleData(index);
                    const isCenter = offset === 0;
                    
                    // Responsive Scaling & Spacing
                    // Desktop: Fixed pixel values
                    // Mobile: Viewport width based values
                    const spacing = isMobile ? windowWidth * 0.65 : 450; 
                    const itemWidth = isMobile ? '65vw' : '400px';

                    const xPos = offset * spacing;
                    
                    let scale = isCenter ? 1.15 : (Math.abs(offset) === 1 ? 0.9 : 0.8);
                    let opacity = isCenter ? 1 : (Math.abs(offset) === 1 ? 0.6 : 0.3);
                    let zIndex = isCenter ? 20 : (Math.abs(offset) === 1 ? 10 : 0);
                    let blur = isCenter ? 0 : (Math.abs(offset) === 1 ? 1 : 2);

                    return (
                        <div
                            key={index}
                            onClick={() => isCenter && setSelectedWorkIndex((index % featuredWorks.length + featuredWorks.length) % featuredWorks.length)}
                            className="absolute top-1/2 left-1/2 bg-gray-900 shadow-2xl shadow-black cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                            style={{
                                width: itemWidth,
                                aspectRatio: '4/5',
                                transform: `translate(-50%, -50%) translateX(${xPos}px) scale(${scale})`,
                                opacity: opacity,
                                zIndex: zIndex,
                                filter: `grayscale(${isCenter ? '0%' : '100%'}) blur(${blur}px)`,
                            }}
                        >
                            <div className="w-full h-full relative overflow-hidden group rounded-sm">
                                <img 
                                    src={work.img} 
                                    alt={work.title} 
                                    className="w-full h-full object-cover" 
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-6 md:p-8 transition-opacity duration-300 ${isCenter ? 'opacity-100' : 'opacity-0'}`}>
                                    <p className="text-orange-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">{work.category}</p>
                                    <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight">{work.title}</h3>
                                    <div className="flex items-center gap-2 mt-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/80">
                                        <span>View Case</span> <ArrowUpRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="container mx-auto px-6 mt-8 flex justify-center md:hidden">
            <button 
                onClick={() => setPage(Page.WORKS)}
                className="flex items-center text-sm font-bold uppercase tracking-widest border border-white/20 px-6 py-3 rounded hover:bg-white hover:text-black transition-all"
            >
                View All Projects
            </button>
        </div>
      </section>

      {/* Marquee / Brand Ticker */}
      <section className="py-12 md:py-16 border-y border-gray-900 overflow-hidden bg-black">
         <div className="relative w-full flex overflow-x-hidden hide-scrollbar">
            <div className="animate-marquee whitespace-nowrap">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <span key={i} className="text-2xl md:text-4xl font-bold text-white/30 uppercase tracking-[0.2em] px-12 md:px-20 select-none">
                        Create • Inspire • Disrupt • 
                    </span>
                ))}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <span key={`dup-${i}`} className="text-2xl md:text-4xl font-bold text-white/30 uppercase tracking-[0.2em] px-12 md:px-20 select-none">
                        Create • Inspire • Disrupt • 
                    </span>
                ))}
            </div>
         </div>
      </section>


      {/* --- CAROUSEL MODAL (Kept same) --- */}
       <div 
        className={`fixed inset-0 z-[60] bg-orbit-black flex flex-col justify-center overflow-hidden transition-all duration-500 ${selectedWorkIndex !== null ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
        <style>{`
            :root {
            --item-width: 80vw;
            --gap: 5vw;
            --offset-start: 10vw;
            }
            @media (min-width: 768px) {
            :root {
                --item-width: 35vw;
                --gap: 6vw;
                --offset-start: 32.5vw;
            }
            }
        `}</style>

        {/* Background Ambience */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/40 via-black to-black z-0 pointer-events-none"></div>

        {/* Navigation / Header */}
        <div className="absolute top-0 left-0 w-full z-20 p-6 md:p-12 flex justify-between items-start">
            <button 
                onClick={() => setSelectedWorkIndex(null)}
                className="group flex items-center gap-3 text-white uppercase tracking-widest text-sm font-bold hover:text-gray-300 transition-colors"
            >
                <div className="p-2 border border-white/20 rounded-full group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowLeft size={20} />
                </div>
                <span className="hidden md:inline">Close</span>
            </button>

            {selectedWorkIndex !== null && (
                <div className="text-right">
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white opacity-80">
                        {featuredWorks[selectedWorkIndex].category}
                    </h2>
                    <span className="text-white/40 text-sm font-mono tracking-widest block mt-2">
                        {String(selectedWorkIndex + 1).padStart(2, '0')} / {String(featuredWorks.length).padStart(2, '0')}
                    </span>
                </div>
            )}
        </div>

        {/* Carousel Container */}
        <div className="relative z-10 w-full h-[70vh] md:h-[80vh] flex items-center mt-12 md:mt-0">
            
            {/* Left Arrow */}
            {selectedWorkIndex !== null && (
            <button 
                onClick={handleModalPrev}
                className="absolute left-4 md:left-12 z-30 p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 group hidden md:block"
            >
                <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            )}

            {/* Right Arrow */}
            {selectedWorkIndex !== null && (
            <button 
                onClick={handleModalNext}
                className="absolute right-4 md:right-12 z-30 p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 group hidden md:block"
            >
                <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
            </button>
            )}

            {/* Track */}
            <div 
                className="flex items-center transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] w-full will-change-transform"
                style={{ 
                    transform: selectedWorkIndex !== null ? `translateX(calc(var(--offset-start) - (var(--item-width) + var(--gap)) * ${selectedWorkIndex}))` : 'translateX(0)'
                }}
            >
                {featuredWorks.map((work, index) => (
                    <div 
                        key={`modal-${work.id}`}
                        className={`
                            relative flex-shrink-0 
                            w-[var(--item-width)]
                            aspect-[4/5] 
                            mr-[var(--gap)]
                            transition-all duration-700 ease-out
                            ${index === selectedWorkIndex ? 'scale-100 opacity-100 grayscale-0' : 'scale-90 opacity-40 grayscale blur-[1px] cursor-pointer'}
                        `}
                        onClick={() => index !== selectedWorkIndex && setSelectedWorkIndex(index)}
                    >
                        <div className="w-full h-full overflow-hidden relative shadow-2xl shadow-black bg-gray-900">
                            <img 
                                src={work.img} 
                                alt={work.title} 
                                className="w-full h-full object-cover"
                            />
                            <div className={`absolute inset-0 bg-black/20 transition-opacity duration-500 ${index === selectedWorkIndex ? 'opacity-0' : 'opacity-100'}`}></div>
                            
                            <div className={`absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end items-start transition-opacity duration-500 ${index === selectedWorkIndex ? 'opacity-100 delay-300' : 'opacity-0'}`}>
                                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">{work.title}</h2>
                                <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-300 uppercase tracking-widest">
                                    <span>{work.client}</span>
                                    <span className="w-1 h-1 bg-white rounded-full"></span>
                                    <span>{work.year}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
      
      <style>{`
        .animate-marquee {
            display: flex;
            animation: marquee 25s linear infinite;
        }
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};