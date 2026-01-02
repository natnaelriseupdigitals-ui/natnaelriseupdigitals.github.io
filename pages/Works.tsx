import React, { useState, useEffect, useRef } from 'react';
import { Reveal } from '../components/Reveal';
import { Button } from '../components/Button';
import { ChevronLeft, ChevronRight, ArrowLeft, Play, Volume2, VolumeX, MoveRight } from 'lucide-react';

// --- DATA CONFIGURATION ---

interface WorkItem {
  id: number;
  title: string;
  category: string;
  client: string;
  year: string;
  videoId: string;
  type: 'vertical' | 'horizontal';
}

interface WorksProps {
    setNavHidden: (hidden: boolean) => void;
}

const getEmbedUrl = (id: string) => {
    return `https://streamable.com/e/${id}?autoplay=1&muted=1&loop=1&controls=0&nocontrols=1`;
};

const verticalWorks: WorkItem[] = [
  { id: 101, title: "River's Edge", category: "Serenity", client: "Nature", year: "2024", videoId: "pb0fxp", type: 'vertical' },
  { id: 102, title: "Canyon Light", category: "Wanderlust", client: "Travel", year: "2024", videoId: "y5mp7j", type: 'vertical' },
  { id: 103, title: "Glacial Peak", category: "Altitude", client: "Expedition", year: "2023", videoId: "d43o1n", type: 'vertical' },
  { id: 104, title: "Forest Path", category: "Discovery", client: "Wilderness", year: "2024", videoId: "x2jdkm", type: 'vertical' }
];

const horizontalWorks: WorkItem[] = [
  { id: 201, title: "Nordic Silence", category: "Expedition", client: "Travel", year: "2024", videoId: "hitjx8", type: 'horizontal' },
  { id: 202, title: "Azure Depths", category: "Underwater", client: "Ocean", year: "2024", videoId: "wkdb2d", type: 'horizontal' },
  { id: 203, title: "Highland Mist", category: "Atmosphere", client: "Nature", year: "2023", videoId: "gyb59m", type: 'horizontal' }
];

// --- Custom Media Control Overlay ---
const MediaControls = ({ isMuted, toggleMute }: { isMuted: boolean, toggleMute: () => void }) => {
    const [visible, setVisible] = useState(true);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleInteraction = () => {
        setVisible(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setVisible(false), 2000);
    };

    useEffect(() => {
        handleInteraction();
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }
    }, []);

    return (
        <div 
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto cursor-pointer" 
            onClick={(e) => { e.stopPropagation(); toggleMute(); handleInteraction(); }}
        >
            <div 
                className={`w-20 h-20 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-500 transform ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            >
                {isMuted ? <VolumeX size={32} className="text-white" /> : <Volume2 size={32} className="text-white" />}
            </div>
            
            <div className={`absolute bottom-20 text-xs font-bold uppercase tracking-widest text-white/80 bg-black/50 px-3 py-1 rounded-full transition-opacity duration-500 ${visible && isMuted ? 'opacity-100' : 'opacity-0'}`}>
                Tap to Unmute
            </div>
        </div>
    );
};


export const Works: React.FC<WorksProps> = ({ setNavHidden }) => {
  const [viewMode, setViewMode] = useState<'gallery' | 'carousel'>('gallery');
  const [activeSection, setActiveSection] = useState<'vertical' | 'horizontal'>('vertical');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false); 

  // Ref to track active iframe for volume control
  const activeIframeRef = useRef<HTMLIFrameElement>(null);

  // Drag Logic Refs
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  // --- SCROLL LOCK & NAVBAR HIDE HOOK ---
  useEffect(() => {
    if (viewMode === 'carousel') {
        document.body.style.overflow = 'hidden';
        setNavHidden(true);
    } else {
        document.body.style.overflow = '';
        setNavHidden(false);
    }
    return () => { 
        document.body.style.overflow = ''; 
        setNavHidden(false);
    };
  }, [viewMode, setNavHidden]);

  useEffect(() => {
    if (viewMode === 'gallery') {
       window.scrollTo({ top: 0, behavior: 'smooth' });
       setIsMuted(true);
    } else {
        setIsMuted(false);
    }
  }, [viewMode]);

  const handleWorkClick = (index: number, type: 'vertical' | 'horizontal') => {
    setActiveSection(type);
    setActiveIndex(index);
    setViewMode('carousel');
    setIsMuted(false);
  };

  const currentWorks = activeSection === 'vertical' ? verticalWorks : horizontalWorks;

  const handlePrev = () => { if (activeIndex > 0) setActiveIndex(prev => prev - 1); };
  const handleNext = () => { if (activeIndex < currentWorks.length - 1) setActiveIndex(prev => prev + 1); };

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
  }, [activeIndex, viewMode, currentWorks]);

  // Handle Audio State Change via PostMessage for Streamable
  useEffect(() => {
    if (activeIframeRef.current && activeIframeRef.current.contentWindow) {
        const method = isMuted ? 'mute' : 'unmute';
        activeIframeRef.current.contentWindow.postMessage(JSON.stringify({ method }), '*');
    }
  }, [isMuted, activeIndex]);

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
    // Increased threshold to 75px to ensure one swipe = one video
    if (diff > 75) handleNext(); else if (diff < -75) handlePrev();
  };

  return (
    <div className="bg-orbit-black min-h-screen w-full relative z-20">
      
      {/* --- GALLERY VIEW --- */}
      <div className={`w-full transition-opacity duration-500 ease-in-out ${viewMode === 'gallery' ? 'opacity-100' : 'opacity-0 pointer-events-none fixed inset-0'}`}>
          <div className="pt-24 pb-20 container mx-auto px-4 md:px-6">
              <Reveal width="100%">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter text-white">
                            Selected<br />Works
                        </h1>
                    </div>
                </div>
              </Reveal>

              {/* VERTICAL SECTION (Shorts) */}
              <div className="mb-20">
                  <Reveal>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-8 h-[1px] bg-white/50"></div>
                        <h3 className="text-xl font-bold uppercase tracking-widest text-white">Nature Reels</h3>
                    </div>
                  </Reveal>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                      {verticalWorks.map((work, index) => (
                          <Reveal key={work.id} delay={index * 0.1} width="100%">
                              <div onClick={() => handleWorkClick(index, 'vertical')} className="group relative cursor-pointer overflow-hidden aspect-[9/16] bg-gray-900 rounded-2xl border border-white/5 shadow-2xl transition-all duration-300 hover:border-white/20">
                                  <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                                      <iframe 
                                        src={getEmbedUrl(work.videoId)}
                                        className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none" 
                                        allow="autoplay; encrypted-media"
                                        allowFullScreen
                                      />
                                  </div>
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 transition-opacity duration-300">
                                      <p className="text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-1">{work.category}</p>
                                      <h3 className="text-sm md:text-lg font-bold text-white uppercase tracking-tight">{work.title}</h3>
                                  </div>
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                          <Play size={20} fill="white" className="ml-1" />
                                      </div>
                                  </div>
                              </div>
                          </Reveal>
                      ))}
                  </div>
              </div>

              {/* HORIZONTAL SECTION (Films) */}
              <div className="mb-20">
                  <Reveal>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-8 h-[1px] bg-white/50"></div>
                        <h3 className="text-xl font-bold uppercase tracking-widest text-white">Expeditions</h3>
                    </div>
                  </Reveal>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                      {horizontalWorks.map((work, index) => (
                          <Reveal key={work.id} delay={index * 0.1} width="100%">
                              <div onClick={() => handleWorkClick(index, 'horizontal')} className="group relative cursor-pointer overflow-hidden aspect-video bg-gray-900 rounded-2xl border border-white/5 shadow-2xl transition-all duration-300 hover:border-white/20">
                                  <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                                      <iframe 
                                        src={getEmbedUrl(work.videoId)}
                                        className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none" 
                                        allow="autoplay; encrypted-media"
                                        allowFullScreen
                                      />
                                  </div>
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 transition-opacity duration-300">
                                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">{work.category}</p>
                                        <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">{work.title}</h3>
                                      </div>
                                  </div>
                              </div>
                          </Reveal>
                      ))}
                   </div>
              </div>
          </div>
      </div>


      {/* --- CAROUSEL VIEW --- */}
      {/* Z-Index 100 to cover Navbar */}
      <div 
        className={`fixed inset-0 z-[100] bg-orbit-black flex flex-col justify-center overflow-hidden transition-all duration-500 ${viewMode === 'carousel' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp}
      >
        <style>{`
            :root {
                --item-width: ${activeSection === 'vertical' ? '80vw' : '90vw'};
                --gap: 5vw;
                --offset-start: ${activeSection === 'vertical' ? '10vw' : '5vw'};
            }
            @media (min-width: 768px) {
                :root {
                    --item-width: ${activeSection === 'vertical' ? 'calc(85vh * 9 / 16)' : '65vw'};
                    --gap: 6vw;
                    --offset-start: ${activeSection === 'vertical' ? 'calc(50vw - (85vh * 9 / 16) / 2)' : '17.5vw'};
                }
            }
        `}</style>

        {/* Mobile Swipe Hint */}
        <div className={`md:hidden absolute right-6 top-[55%] z-40 pointer-events-none animate-pulse flex items-center gap-2 transition-opacity duration-500 ${viewMode === 'carousel' ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-xs font-bold uppercase tracking-widest text-white drop-shadow-md">Swipe</span>
            <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center bg-black/30 backdrop-blur-sm"><MoveRight size={14} /></div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/40 via-black to-black z-0 pointer-events-none"></div>

        {/* Navigation / Header - Replaces Global Navbar */}
        <div className="absolute top-0 left-0 w-full z-[101] p-6 md:p-12 flex justify-between items-start pointer-events-none">
            <button onClick={() => setViewMode('gallery')} className="group flex items-center gap-3 text-white uppercase tracking-widest text-sm font-bold hover:text-gray-300 transition-colors pointer-events-auto">
                <div className="p-2 border border-white/20 rounded-full group-hover:bg-white group-hover:text-black transition-all bg-black/20 backdrop-blur-sm"><ArrowLeft size={20} /></div>
                <span className="hidden md:inline">Back to Gallery</span>
            </button>
            <div className="pointer-events-auto flex items-center gap-4 max-w-[50%]">
                <div className="text-right">
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white opacity-80 truncate">{currentWorks[activeIndex].category}</h2>
                    <span className="text-white/40 text-sm font-mono tracking-widest block mt-2">{String(activeIndex + 1).padStart(2, '0')} / {String(currentWorks.length).padStart(2, '0')}</span>
                </div>
            </div>
        </div>

        {/* Carousel */}
        <div className="relative z-10 w-full h-[70vh] md:h-[90vh] flex items-center mt-12 md:mt-0">
            {activeIndex > 0 && (
            <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="absolute left-4 md:left-12 z-30 p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 group hidden md:block">
                <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            )}
            {activeIndex < currentWorks.length - 1 && (
            <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="absolute right-4 md:right-12 z-30 p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 group hidden md:block">
                <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
            </button>
            )}

            <div className="flex items-center transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] w-full will-change-transform" style={{ transform: `translateX(calc(var(--offset-start) - (var(--item-width) + var(--gap)) * ${activeIndex}))` }}>
                {currentWorks.map((work, index) => (
                    <div key={work.id} className={`relative flex-shrink-0 w-[var(--item-width)] ${activeSection === 'vertical' ? 'aspect-[9/16]' : 'aspect-video'} mr-[var(--gap)] transition-all duration-700 ease-out ${index === activeIndex ? 'scale-100 opacity-100 grayscale-0' : 'scale-90 opacity-40 grayscale blur-[1px] cursor-pointer'}`} onClick={() => index !== activeIndex && setActiveIndex(index)}>
                        <div className="w-full h-full overflow-hidden relative shadow-2xl shadow-black bg-gray-900 border border-white/10 rounded-2xl">
                             <div className="absolute inset-0 w-full h-full overflow-hidden">
                                <iframe 
                                    ref={index === activeIndex ? activeIframeRef : null}
                                    src={getEmbedUrl(work.videoId)}
                                    className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none" 
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />
                             </div>
                            
                            {/* ACTIVE VIDEO OVERLAY - Custom Controls */}
                            {index === activeIndex && (
                                <MediaControls isMuted={isMuted} toggleMute={() => setIsMuted(!isMuted)} />
                            )}

                            <div className={`absolute inset-0 bg-black/20 transition-opacity duration-500 ${index === activeIndex ? 'opacity-0' : 'opacity-100'}`}></div>
                            
                            <div className={`absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end items-start transition-opacity duration-500 ${index === activeIndex ? 'opacity-100 delay-300 pointer-events-none' : 'opacity-0'}`}>
                                {/* UPDATE: Conditional Font Size based on activeSection type */}
                                <h2 className={`${activeSection === 'vertical' ? 'text-2xl md:text-3xl' : 'text-3xl md:text-5xl'} font-black text-white uppercase tracking-tighter mb-2`}>{work.title}</h2>
                                <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-300 uppercase tracking-widest">
                                    <span>{work.client}</span><span className="w-1 h-1 bg-white rounded-full"></span><span>{work.year}</span>
                                </div>
                                {/* UPDATE: Margin adjusted for vertical videos */}
                                <div className={`${activeSection === 'vertical' ? 'mt-4' : 'mt-6'} pointer-events-auto`}>
                                    <Button variant="primary" icon="diagonal">View Full Case</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Mobile Dots */}
        <div className="flex md:hidden justify-center px-6 items-center w-full absolute bottom-8 z-30 pointer-events-none">
            <div className="flex gap-2 pointer-events-auto">
                {currentWorks.map((_, idx) => (
                    <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-gray-700'}`} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};