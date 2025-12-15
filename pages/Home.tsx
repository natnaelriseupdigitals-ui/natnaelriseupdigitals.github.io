import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../types';
import { Reveal } from '../components/Reveal';
import { Aperture, Film, Heart, ArrowRight, ChevronLeft, ChevronRight, Grid, ArrowUpRight, MoveRight, ArrowDown, ArrowLeft } from 'lucide-react';

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
  
  // Drag to Scroll State
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Refs for animation loop values to avoid dependency cycles
  const isDraggingRef = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const animationFrameId = useRef<number>(0);
  const lastInteractionTime = useRef<number>(0);
  
  // React State for UI updates (cursor, clicks)
  const [isDraggingState, setIsDraggingState] = useState(false);
  
  // Custom Cursor State
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showDragCursor, setShowDragCursor] = useState(false);

  // Modal Swipe Logic
  const modalDragStartX = useRef(0);
  const isModalDragging = useRef(false);

  // --- Keyboard Navigation ---
  const handlePrev = () => {
    if (selectedWorkIndex !== null) {
      setSelectedWorkIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
    }
  };

  const handleNext = () => {
    if (selectedWorkIndex !== null) {
      setSelectedWorkIndex((prev) => (prev !== null && prev < featuredWorks.length - 1 ? prev + 1 : prev));
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedWorkIndex !== null) {
          if (e.key === 'ArrowLeft') handlePrev();
          if (e.key === 'ArrowRight') handleNext();
          if (e.key === 'Escape') setSelectedWorkIndex(null);
      }
  };

  useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedWorkIndex]);


  // --- Auto Scroll & Drag Logic ---
  useEffect(() => {
    const animate = () => {
        const scrollContainer = scrollContainerRef.current;
        // Only scroll if not dragging AND 2 seconds passed since last interaction
        if (scrollContainer && !isDraggingRef.current && Date.now() - lastInteractionTime.current > 2000) {
            // Auto-scroll speed
            scrollContainer.scrollLeft += 1; // 1px per frame (approx 60px/sec)

            // Infinite loop reset
            const maxScroll = scrollContainer.scrollWidth / 2;
            
            if (scrollContainer.scrollLeft >= maxScroll) {
                scrollContainer.scrollLeft = 0;
            } else if (scrollContainer.scrollLeft <= 0) {
                 // allow dragging backwards to loop
            }
        }
        animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId.current);
  }, []);

  // --- Mouse Handlers (Desktop) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
    lastInteractionTime.current = Date.now();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    lastInteractionTime.current = Date.now();
    if (isDraggingState) {
        setTimeout(() => setIsDraggingState(false), 50);
    } else {
        setIsDraggingState(false);
    }
  };
  
  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    setIsDraggingState(false);
    setShowDragCursor(false);
    lastInteractionTime.current = Date.now();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });

    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    
    // Check if user moved mouse enough to consider it a drag
    if (Math.abs(x - startX.current) > 5) {
        setIsDraggingState(true);
        lastInteractionTime.current = Date.now();
        
        const walk = (x - startX.current) * 2; // Drag speed multiplier
        let targetScroll = scrollLeft.current - walk;
        const maxScroll = scrollContainerRef.current.scrollWidth / 2;

        if (targetScroll >= maxScroll) {
            targetScroll = targetScroll - maxScroll;
            scrollLeft.current = scrollLeft.current - maxScroll; 
        } else if (targetScroll <= 0) {
            targetScroll = targetScroll + maxScroll;
            scrollLeft.current = scrollLeft.current + maxScroll;
        }

        scrollContainerRef.current.scrollLeft = targetScroll;
    }
  };

  // --- Touch Handlers (Mobile) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    lastInteractionTime.current = Date.now();
    // For touch, we track pageX directly to calculate delta for click vs drag detection
    startX.current = e.touches[0].pageX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    lastInteractionTime.current = Date.now();
    
    // Check distance to determine if this is a drag (blocks clicks)
    // We allow native scrolling to handle the movement, we just track state
    const currentX = e.touches[0].pageX;
    if (Math.abs(currentX - startX.current) > 10) {
        setIsDraggingState(true);
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    lastInteractionTime.current = Date.now();
    
    if (isDraggingState) {
        // Was dragging, prevent click
        setTimeout(() => setIsDraggingState(false), 50);
    } else {
        // Was a tap, allow click immediately
        setIsDraggingState(false);
    }
  };

  // --- Modal Swipe Handlers ---
  const handleModalMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isModalDragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    modalDragStartX.current = clientX;
  };

  const handleModalMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isModalDragging.current) return;
    isModalDragging.current = false;
    
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = modalDragStartX.current - clientX;
    
    if (diff > 50) {
        handleNext();
    } else if (diff < -50) {
        handlePrev();
    }
  };

  const handleWorkClick = (index: number) => {
    if (!isDraggingState) {
        setSelectedWorkIndex(index);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full bg-black">
            <div className="absolute inset-0 bg-black/40 z-10 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-orbit-black via-transparent to-transparent z-10"></div>
            
            <video 
                autoPlay 
                muted 
                loop 
                playsInline
                poster="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1920&q=80"
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

            {/* "Engineered." - Larger, Clean, Wide Tracking */}
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
         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
            <div className="flex flex-col items-center gap-2">
                {/* Added pl-[0.3em] to visually center the text due to wide tracking */}
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

      {/* Featured Work Scrolling Section */}
      <section 
        className="py-20 bg-orbit-gray relative overflow-hidden" 
        onMouseEnter={() => setShowDragCursor(true)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="container mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
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

        {/* Custom Drag Cursor (Desktop) */}
        {/* Render conditionally based on showDragCursor to ensure it doesn't float elsewhere */}
        <div 
            className={`hidden md:flex fixed z-[60] w-24 h-24 bg-white rounded-full items-center justify-center pointer-events-none transition-transform duration-200 ease-out mix-blend-difference ${showDragCursor ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
            style={{ 
                left: cursorPos.x, 
                top: cursorPos.y,
                transform: `translate(-50%, -50%) scale(${showDragCursor ? 1 : 0})`
            }}
        >
            <span className="text-black font-black text-sm tracking-widest uppercase">Drag</span>
        </div>

        {/* Mobile Scroll Indicator Overlay */}
        <div className="md:hidden absolute right-6 top-[280px] z-20 pointer-events-none animate-pulse flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-white drop-shadow-md">Drag</span>
            <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <MoveRight size={14} />
            </div>
        </div>

        {/* Draggable Strip */}
        <div 
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full overflow-x-auto hide-scrollbar cursor-none active:cursor-grabbing touch-pan-x"
            style={{ userSelect: 'none', WebkitOverflowScrolling: 'touch' }} 
        >
            <div className="flex w-max px-6 md:px-0">
                {/* 
                  We render the list twice to allow for infinite scrolling effect.
                  JS detects when we hit the end of the first list and snaps back to 0.
                */}
                {[...featuredWorks, ...featuredWorks].map((work, index) => (
                    <div 
                        key={`${work.id}-${index}`}
                        onClick={() => handleWorkClick(index % featuredWorks.length)}
                        className={`
                            relative w-[300px] md:w-[400px] aspect-[4/5] mr-6 md:mx-4 
                            overflow-hidden bg-gray-900 flex-shrink-0 transition-transform duration-300 
                            ${isDraggingState ? 'scale-[0.98]' : 'hover:scale-[1.02]'}
                        `}
                    >
                        <img 
                            src={work.img} 
                            alt={work.title} 
                            draggable={false}
                            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                             <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-1">{work.category}</p>
                             <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{work.title}</h3>
                        </div>
                    </div>
                ))}
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
         <div className="relative w-full flex overflow-x-hidden">
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


      {/* --- CAROUSEL MODAL (Same as Works.tsx) --- */}
       <div 
        className={`fixed inset-0 z-[60] bg-orbit-black flex flex-col justify-center overflow-hidden transition-all duration-500 ${selectedWorkIndex !== null ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onMouseDown={handleModalMouseDown}
        onMouseUp={handleModalMouseUp}
        onTouchStart={handleModalMouseDown}
        onTouchEnd={handleModalMouseUp}
      >
        <style>{`
            :root {
            /* Carousel specific variables for 4:5 Aspect Ratio */
            --item-width: 80vw;
            --gap: 5vw;
            --offset-start: 10vw; /* (100 - 80) / 2 */
            }
            @media (min-width: 768px) {
            :root {
                --item-width: 35vw; /* Narrower width for portrait images on desktop to fit height */
                --gap: 6vw;
                --offset-start: 32.5vw; /* (100 - 35) / 2 */
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
                {/* Matches text logic from Works page ("Back to Gallery"), but here it effectively closes the modal */}
                <span className="hidden md:inline">Back to Gallery</span>
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
            {selectedWorkIndex !== null && selectedWorkIndex > 0 && (
            <button 
                onClick={handlePrev}
                className="absolute left-4 md:left-12 z-30 p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 group hidden md:block"
            >
                <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            )}

            {/* Right Arrow */}
            {selectedWorkIndex !== null && selectedWorkIndex < featuredWorks.length - 1 && (
            <button 
                onClick={handleNext}
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
                            {/* Overlay */}
                            <div className={`absolute inset-0 bg-black/20 transition-opacity duration-500 ${index === selectedWorkIndex ? 'opacity-0' : 'opacity-100'}`}></div>
                            
                            {/* Project Info - Only visible on active */}
                            <div className={`absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end items-start transition-opacity duration-500 ${index === selectedWorkIndex ? 'opacity-100 delay-300' : 'opacity-0'}`}>
                                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">{work.title}</h2>
                                <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-300 uppercase tracking-widest">
                                    <span>{work.client}</span>
                                    <span className="w-1 h-1 bg-white rounded-full"></span>
                                    <span>{work.year}</span>
                                </div>
                                
                                <button className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white border-b border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-all">
                                    View Full Case <ArrowUpRight size={14} />
                                </button>
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