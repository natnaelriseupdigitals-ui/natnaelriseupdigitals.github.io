import React, { useState, useEffect, useRef } from 'react';
import { Reveal } from '../components/Reveal';
import { ChevronLeft, ChevronRight, ArrowUpRight, MoveRight, ArrowLeft } from 'lucide-react';

// Data with 4:5 aspect ratio images and requested categories
const works = [
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
  { 
    id: 7, 
    title: "Raw Emotion", 
    category: "Portrait Photography", 
    client: "Time",
    year: "2024",
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=80", 
  },
  { 
    id: 8, 
    title: "Urban Chic", 
    category: "Fashion Photography", 
    client: "Zara",
    year: "2023",
    img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80", 
  },
];

export const Works: React.FC = () => {
  const [viewMode, setViewMode] = useState<'gallery' | 'carousel'>('gallery');
  const [activeIndex, setActiveIndex] = useState(0);

  // Drag Logic Refs
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  // Scroll to top when switching to gallery, but maintain position when opening carousel
  useEffect(() => {
    if (viewMode === 'gallery') {
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [viewMode]);

  const handleImageClick = (index: number) => {
    setActiveIndex(index);
    setViewMode('carousel');
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < works.length - 1) {
      setActiveIndex(prev => prev + 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode === 'carousel') {
          if (e.key === 'ArrowLeft') handlePrev();
          if (e.key === 'ArrowRight') handleNext();
          if (e.key === 'Escape') setViewMode('gallery');
      }
  };

  useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, viewMode]);

  // --- Mouse & Touch Handlers for Swipe ---

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    dragStartX.current = clientX;
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = dragStartX.current - clientX;
    
    // Threshold for swipe
    if (diff > 50) {
        handleNext();
    } else if (diff < -50) {
        handlePrev();
    }
  };

  return (
    <div className="bg-orbit-black min-h-screen w-full relative">
      
      {/* --- GALLERY VIEW --- */}
      <div 
        className={`w-full transition-opacity duration-500 ease-in-out ${viewMode === 'gallery' ? 'opacity-100' : 'opacity-0 pointer-events-none fixed inset-0'}`}
      >
          <div className="pt-24 pb-20 container mx-auto px-4 md:px-6">
              <Reveal width="100%">
                <div className="flex justify-between items-end mb-8 md:mb-16">
                    <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter text-white">
                        Selected<br />Works
                    </h1>
                    <div className="hidden md:block text-gray-400 text-sm tracking-widest uppercase">
                        Scroll to explore
                    </div>
                </div>
              </Reveal>

              {/* Mobile: 2-col grid with tight gap (Photos App style). Desktop: 4-col grid. */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
                  {works.map((work, index) => (
                      <Reveal key={work.id} delay={index * 0.05} width="100%">
                          <div 
                            onClick={() => handleImageClick(index)}
                            className="w-full group relative cursor-pointer overflow-hidden aspect-[4/5] bg-gray-900"
                          >
                              <img 
                                src={work.img} 
                                alt={work.title} 
                                className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-105 opacity-90 md:group-hover:opacity-100"
                              />
                              
                              {/* Overlay - Visible on Mobile (gradient), Hidden on Desktop until Hover */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                  <p className="text-orange-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 md:mb-2 md:transform md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300 delay-75">{work.category}</p>
                                  <h3 className="text-sm md:text-xl font-bold text-white uppercase tracking-tight md:transform md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300 delay-100">{work.title}</h3>
                              </div>
                          </div>
                      </Reveal>
                  ))}
              </div>
          </div>
      </div>


      {/* --- CAROUSEL VIEW --- */}
      <div 
        className={`fixed inset-0 z-50 bg-orbit-black flex flex-col justify-center overflow-hidden transition-all duration-500 ${viewMode === 'carousel' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
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

        {/* Mobile Scroll Indicator Overlay */}
        <div className={`md:hidden absolute right-6 top-[55%] z-40 pointer-events-none animate-pulse flex items-center gap-2 transition-opacity duration-500 ${viewMode === 'carousel' ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-xs font-bold uppercase tracking-widest text-white drop-shadow-md">Swipe</span>
            <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <MoveRight size={14} />
            </div>
        </div>

        {/* Background Ambience */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/40 via-black to-black z-0 pointer-events-none"></div>

        {/* Navigation / Header */}
        <div className="absolute top-0 left-0 w-full z-20 p-6 md:p-12 flex justify-between items-start pointer-events-none">
            {/* Pointer events auto on buttons */}
            <button 
                onClick={() => setViewMode('gallery')}
                className="group flex items-center gap-3 text-white uppercase tracking-widest text-sm font-bold hover:text-gray-300 transition-colors pointer-events-auto"
            >
                <div className="p-2 border border-white/20 rounded-full group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowLeft size={20} />
                </div>
                <span className="hidden md:inline">Back to Gallery</span>
            </button>

            <div className="text-right pointer-events-auto">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white opacity-80">
                    {works[activeIndex].category}
                </h2>
                <span className="text-white/40 text-sm font-mono tracking-widest block mt-2">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(works.length).padStart(2, '0')}
                </span>
            </div>
        </div>

        {/* Carousel Container */}
        <div className="relative z-10 w-full h-[70vh] md:h-[80vh] flex items-center mt-12 md:mt-0">
            
            {/* Left Arrow */}
            {activeIndex > 0 && (
            <button 
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="absolute left-4 md:left-12 z-30 p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 group hidden md:block"
            >
                <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            )}

            {/* Right Arrow */}
            {activeIndex < works.length - 1 && (
            <button 
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-4 md:right-12 z-30 p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 group hidden md:block"
            >
                <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
            </button>
            )}

            {/* Track */}
            <div 
                className="flex items-center transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] w-full will-change-transform"
                style={{ 
                    transform: `translateX(calc(var(--offset-start) - (var(--item-width) + var(--gap)) * ${activeIndex}))` 
                }}
            >
                {works.map((work, index) => (
                    <div 
                        key={work.id}
                        className={`
                            relative flex-shrink-0 
                            w-[var(--item-width)]
                            aspect-[4/5] 
                            mr-[var(--gap)]
                            transition-all duration-700 ease-out
                            ${index === activeIndex ? 'scale-100 opacity-100 grayscale-0' : 'scale-90 opacity-40 grayscale blur-[1px] cursor-pointer'}
                        `}
                        onClick={() => index !== activeIndex && setActiveIndex(index)}
                    >
                        <div className="w-full h-full overflow-hidden relative shadow-2xl shadow-black bg-gray-900">
                            <img 
                                src={work.img} 
                                alt={work.title} 
                                className="w-full h-full object-cover pointer-events-none" // prevent img drag
                            />
                            {/* Overlay */}
                            <div className={`absolute inset-0 bg-black/20 transition-opacity duration-500 ${index === activeIndex ? 'opacity-0' : 'opacity-100'}`}></div>
                            
                            {/* Project Info - Only visible on active */}
                            <div className={`absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end items-start transition-opacity duration-500 ${index === activeIndex ? 'opacity-100 delay-300' : 'opacity-0'}`}>
                                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">{work.title}</h2>
                                <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-300 uppercase tracking-widest">
                                    <span>{work.client}</span>
                                    <span className="w-1 h-1 bg-white rounded-full"></span>
                                    <span>{work.year}</span>
                                </div>
                                
                                <button className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white border-b border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-all pointer-events-auto">
                                    View Full Case <ArrowUpRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden justify-center px-6 items-center w-full absolute bottom-8 z-30 pointer-events-none">
            <div className="flex gap-2 pointer-events-auto">
                {works.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-gray-700'}`}
                    />
                ))}
            </div>
        </div>

      </div>

    </div>
  );
};