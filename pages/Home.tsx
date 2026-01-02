import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../types';
import { Reveal } from '../components/Reveal';
import { Button } from '../components/Button';
import { Aperture, Film, Heart, ArrowDown, ArrowUpRight, ArrowLeft, Volume2, VolumeX, Play, ChevronLeft, ChevronRight, MoveRight } from 'lucide-react';

interface HomeProps {
  setPage: (page: Page) => void;
  setNavHidden: (hidden: boolean) => void;
}

// Helper to generate clean embed URL for Streamable
const getEmbedUrl = (id: string) => {
    return `https://streamable.com/e/${id}?autoplay=1&muted=1&loop=1&controls=0&nocontrols=1`;
};

const horizontalWorks = [
  { id: 1, title: "Nordic Silence", category: "Expedition", client: "Travel", year: "2024", videoId: "hitjx8" },
  { id: 2, title: "Azure Depths", category: "Underwater", client: "Ocean", year: "2024", videoId: "wkdb2d" },
  { id: 3, title: "Highland Mist", category: "Atmosphere", client: "Nature", year: "2023", videoId: "gyb59m" },
];

const verticalWorks = [
  { id: 101, title: "River's Edge", category: "Serenity", client: "Nature", year: "2024", videoId: "pb0fxp" },
  { id: 102, title: "Canyon Light", category: "Wanderlust", client: "Travel", year: "2024", videoId: "y5mp7j" },
  { id: 103, title: "Glacial Peak", category: "Altitude", client: "Expedition", year: "2023", videoId: "d43o1n" },
  { id: 104, title: "Forest Path", category: "Discovery", client: "Wilderness", year: "2024", videoId: "x2jdkm" }
];

const CarouselVideoItem = ({ videoId, shouldPlay }: { videoId: string, shouldPlay: boolean }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    
    // Streamable uses Player.js format for postMessage
    useEffect(() => {
        if (!iframeRef.current || !iframeRef.current.contentWindow) return;
        const method = shouldPlay ? 'play' : 'pause';
        // Streamable / Player.js message format
        iframeRef.current.contentWindow.postMessage(JSON.stringify({ method }), '*');
    }, [shouldPlay]);

    return (
        <div className="w-full h-full relative overflow-hidden pointer-events-none">
             <iframe 
                ref={iframeRef}
                src={getEmbedUrl(videoId)}
                className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none" 
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Featured Video"
            />
        </div>
    );
};

export const Home: React.FC<HomeProps> = ({ setPage, setNavHidden }) => {
  const [selectedWorkIndex, setSelectedWorkIndex] = useState<number | null>(null);
  const [modalDataSource, setModalDataSource] = useState<'horizontal' | 'vertical'>('horizontal');
  const [activeIndex, setActiveIndex] = useState(3000);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoPlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMuted, setIsMuted] = useState(false); // Used for Modal

  // Ref to control the active modal iframe
  const modalIframeRef = useRef<HTMLIFrameElement>(null);

  // Drag Logic Refs
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => { setActiveIndex(prev => prev + 1); }, 3000); 
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  // --- SCROLL LOCK & NAVBAR HIDE HOOK ---
  useEffect(() => {
    if (selectedWorkIndex !== null) {
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
  }, [selectedWorkIndex, setNavHidden]);

  const getVisibleData = (index: number) => {
      const dataIndex = (index % horizontalWorks.length + horizontalWorks.length) % horizontalWorks.length;
      return horizontalWorks[dataIndex];
  };

  const handleManualInteraction = (action: () => void) => {
      action();
      setIsAutoPlay(false);
      if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
      autoPlayTimeoutRef.current = setTimeout(() => { setIsAutoPlay(true); }, 3000);
  };

  const handlePrev = () => handleManualInteraction(() => setActiveIndex(prev => prev - 1));
  const handleNext = () => handleManualInteraction(() => setActiveIndex(prev => prev + 1));
  const currentModalWorks = modalDataSource === 'horizontal' ? horizontalWorks : verticalWorks;
  const handleModalPrev = () => { if (selectedWorkIndex !== null) setSelectedWorkIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev)); };
  const handleModalNext = () => { if (selectedWorkIndex !== null) setSelectedWorkIndex((prev) => (prev !== null && prev < currentModalWorks.length - 1 ? prev + 1 : prev)); };

  const openModal = (index: number, source: 'horizontal' | 'vertical') => {
      setModalDataSource(source);
      setSelectedWorkIndex(index);
      setIsMuted(false); 
  };

  // Handle Mute Toggle in Modal for Streamable
  useEffect(() => {
    if (selectedWorkIndex !== null && modalIframeRef.current && modalIframeRef.current.contentWindow) {
        const method = isMuted ? 'mute' : 'unmute';
        modalIframeRef.current.contentWindow.postMessage(JSON.stringify({ method }), '*');
    }
  }, [isMuted, selectedWorkIndex]);

  // --- SWIPE LOGIC ---
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
    // Threshold set to 75px to ensure one deliberate swipe equals one video
    if (diff > 75) handleModalNext(); else if (diff < -75) handleModalPrev();
  };

  return (
    <div className="w-full">
      {/* Hero Section - Spacer only, actual video is Global in App.tsx */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center items-start text-left pt-12 md:pt-20">
            <Reveal delay={0.2}>
                <h1 className="text-[13vw] md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter uppercase mb-4">
                    Cinematic<br />Visuals.
                </h1>
            </Reveal>
            <Reveal delay={0.4}>
                <div className="flex items-center gap-6 mt-2 mb-10 ml-2">
                    <div className="w-16 h-[2px] bg-white"></div>
                    <p className="text-xl md:text-3xl font-bold text-white uppercase tracking-[0.6em] md:tracking-[0.8em] pl-2">Engineered.</p>
                </div>
            </Reveal>
            <Reveal delay={0.6}>
                <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mb-0 font-light leading-relaxed">
                    We craft high impact video and photography for brands that dare to stand out. Fast paced, emotive, and unforgettable.
                </p>
            </Reveal>
        </div>
         <div className="absolute bottom-10 left-0 w-full flex justify-center z-20">
            <div className="flex flex-col items-center gap-2 animate-bounce">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold pl-[0.3em]">Scroll</span>
                <ArrowDown className="text-white/50" size={20} />
            </div>
         </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-32 bg-orbit-black relative z-20">
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

      {/* Featured Work */}
      <section className="py-20 bg-orbit-gray relative overflow-hidden z-20">
        <div className="container mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-30">
            <Reveal>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">Featured Work</h2>
            </Reveal>
            <Reveal delay={0.2}>
                <div className="hidden md:block">
                    <Button variant="primary" icon="arrow" onClick={() => setPage(Page.WORKS)}>View All Projects</Button>
                </div>
            </Reveal>
        </div>

        {/* Desktop Carousel (Horizontal) */}
        <div className="hidden md:flex relative h-[500px] w-full items-center justify-center perspective-1000">
            <button onClick={handlePrev} className="absolute left-12 z-40 p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 group"><ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform md:w-8 md:h-8" /></button>
            <button onClick={handleNext} className="absolute right-12 z-40 p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 group"><ChevronRight size={24} className="group-hover:translate-x-1 transition-transform md:w-8 md:h-8" /></button>
            <div className="relative w-full h-full">
                {[-2, -1, 0, 1, 2].map((offset) => {
                    const index = activeIndex + offset;
                    const work = getVisibleData(index);
                    const isCenter = offset === 0;
                    const spacing = 700; 
                    const itemWidth = '640px';
                    const xPos = offset * spacing;
                    let scale = isCenter ? 1.15 : (Math.abs(offset) === 1 ? 0.9 : 0.7);
                    let opacity = isCenter ? 1 : (Math.abs(offset) === 1 ? 0.6 : 0.3);
                    let zIndex = isCenter ? 20 : (Math.abs(offset) === 1 ? 10 : 0);
                    let blur = isCenter ? 0 : (Math.abs(offset) === 1 ? 1 : 2);
                    const shouldPlay = Math.abs(offset) <= 1;

                    return (
                        <div key={index} onClick={() => isCenter && openModal((index % horizontalWorks.length + horizontalWorks.length) % horizontalWorks.length, 'horizontal')} className="absolute top-1/2 left-1/2 bg-gray-900 shadow-2xl shadow-black cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]" style={{ width: itemWidth, aspectRatio: '16/9', transform: `translate(-50%, -50%) translateX(${xPos}px) scale(${scale})`, opacity: opacity, zIndex: zIndex, filter: `grayscale(${isCenter ? '0%' : '100%'}) blur(${blur}px)`, }}>
                            <div className="w-full h-full relative overflow-hidden group rounded-2xl border border-white/10">
                                <CarouselVideoItem videoId={work.videoId} shouldPlay={shouldPlay} />
                                <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-8 transition-opacity duration-300 ${isCenter ? 'opacity-100' : 'opacity-0'}`}>
                                    <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">{work.category}</p>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tight">{work.title}</h3>
                                    <div className="flex items-center gap-2 mt-4 text-xs font-bold uppercase tracking-widest text-white/80">
                                        <span>View Film</span> <ArrowUpRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Mobile Grid (Vertical Videos - 2x2 Grid) */}
        <div className="md:hidden px-4 pb-12">
            <div className="grid grid-cols-2 gap-3">
                {verticalWorks.map((work, index) => (
                    <Reveal key={work.id} delay={index * 0.1} width="100%">
                        <div onClick={() => openModal(index, 'vertical')} className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-gray-900 shadow-lg border border-white/5 cursor-pointer group">
                             {/* Iframe for Mobile Card */}
                            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                                <iframe 
                                    src={getEmbedUrl(work.videoId)}
                                    className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none" 
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                    title="Mobile Video"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 pointer-events-none">
                                <span className="text-[8px] font-bold uppercase tracking-widest text-orange-500 mb-0.5">{work.category}</span>
                                <h3 className="text-sm font-black text-white uppercase tracking-tight leading-none">{work.title}</h3>
                            </div>
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                <Play size={10} className="ml-0.5 text-white" />
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>

        {/* Mobile View All Button */}
        <div className="container mx-auto px-6 mt-4 flex justify-center md:hidden">
            <Button variant="primary" icon="arrow" onClick={() => setPage(Page.WORKS)}>View All Projects</Button>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-12 md:py-16 border-y border-gray-900 overflow-hidden bg-black relative z-20">
         <div className="relative w-full flex overflow-x-hidden hide-scrollbar">
            <div className="animate-marquee whitespace-nowrap">
                {[1, 2, 3, 4, 5, 6].map((i) => (<span key={i} className="text-2xl md:text-4xl font-bold text-white/30 uppercase tracking-[0.2em] px-12 md:px-20 select-none">Create • Inspire • Disrupt • </span>))}
                {[1, 2, 3, 4, 5, 6].map((i) => (<span key={`dup-${i}`} className="text-2xl md:text-4xl font-bold text-white/30 uppercase tracking-[0.2em] px-12 md:px-20 select-none">Create • Inspire • Disrupt • </span>))}
            </div>
         </div>
      </section>

      {/* Modal - Z-Index 100 to cover Navbar */}
       <div 
         className={`fixed inset-0 z-[100] bg-orbit-black flex flex-col justify-center overflow-hidden transition-all duration-500 ${selectedWorkIndex !== null ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
         onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp}
       >
        <style>{`
            :root {
                --item-width: ${modalDataSource === 'vertical' ? '80vw' : '90vw'};
                --gap: 5vw;
                --offset-start: ${modalDataSource === 'vertical' ? '10vw' : '5vw'};
            }
            @media (min-width: 768px) {
                :root {
                    --item-width: ${modalDataSource === 'vertical' ? 'calc(85vh * 9 / 16)' : '65vw'};
                    --gap: 6vw;
                    --offset-start: ${modalDataSource === 'vertical' ? 'calc(50vw - (85vh * 9 / 16) / 2)' : '17.5vw'};
                }
            }
        `}</style>
        
        {/* Mobile Swipe Hint */}
        <div className={`md:hidden absolute right-6 top-[55%] z-40 pointer-events-none animate-pulse flex items-center gap-2 transition-opacity duration-500 ${selectedWorkIndex !== null ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-xs font-bold uppercase tracking-widest text-white drop-shadow-md">Swipe</span>
            <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center bg-black/30 backdrop-blur-sm"><MoveRight size={14} /></div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/40 via-black to-black z-0 pointer-events-none"></div>

        {/* Modal Header: z-101 to be on top. Contains Back button and Index Info */}
        <div className="absolute top-0 left-0 w-full z-[101] p-6 md:p-12 flex justify-between items-start pointer-events-none">
            <button onClick={() => setSelectedWorkIndex(null)} className="group flex items-center gap-3 text-white uppercase tracking-widest text-sm font-bold hover:text-gray-300 transition-colors pointer-events-auto">
                <div className="p-2 border border-white/20 rounded-full group-hover:bg-white group-hover:text-black transition-all bg-black/20 backdrop-blur-sm"><ArrowLeft size={20} /></div>
                <span className="hidden md:inline">Close</span>
            </button>
            <div className="pointer-events-auto flex items-center gap-4">
                 <button onClick={() => setIsMuted(!isMuted)} className="p-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all text-white bg-black/20 backdrop-blur-sm">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                {selectedWorkIndex !== null && currentModalWorks[selectedWorkIndex] && (
                    <div className="text-right max-w-[50%]">
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white opacity-80 truncate">{currentModalWorks[selectedWorkIndex].category}</h2>
                        <span className="text-white/40 text-sm font-mono tracking-widest block mt-2">{String(selectedWorkIndex + 1).padStart(2, '0')} / {String(currentModalWorks.length).padStart(2, '0')}</span>
                    </div>
                )}
            </div>
        </div>

        <div className="relative z-10 w-full h-[60vh] md:h-[90vh] flex items-center mt-12 md:mt-0">
            {selectedWorkIndex !== null && (<button onClick={handleModalPrev} className="absolute left-4 md:left-12 z-30 p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 group hidden md:block"><ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" /></button>)}
            {selectedWorkIndex !== null && (<button onClick={handleModalNext} className="absolute right-4 md:right-12 z-30 p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 group hidden md:block"><ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" /></button>)}

            <div className="flex items-center transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] w-full will-change-transform" style={{ transform: selectedWorkIndex !== null ? `translateX(calc(var(--offset-start) - (var(--item-width) + var(--gap)) * ${selectedWorkIndex}))` : 'translateX(0)' }}>
                {currentModalWorks.map((work, index) => (
                    <div key={`modal-${work.id}`} className={`relative flex-shrink-0 w-[var(--item-width)] ${modalDataSource === 'vertical' ? 'aspect-[9/16]' : 'aspect-video'} mr-[var(--gap)] transition-all duration-700 ease-out ${index === selectedWorkIndex ? 'scale-100 opacity-100 grayscale-0' : 'scale-90 opacity-40 grayscale blur-[1px] cursor-pointer'}`} onClick={() => index !== selectedWorkIndex && setSelectedWorkIndex(index)}>
                        <div className="w-full h-full overflow-hidden relative shadow-2xl shadow-black bg-gray-900 border border-white/10 rounded-2xl">
                             <div className="absolute inset-0 w-full h-full overflow-hidden">
                                <iframe 
                                    ref={index === selectedWorkIndex ? modalIframeRef : null}
                                    src={getEmbedUrl(work.videoId)}
                                    className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none" 
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />
                             </div>
                            <div className={`absolute inset-0 bg-black/20 transition-opacity duration-500 ${index === selectedWorkIndex ? 'opacity-0' : 'opacity-100'}`}></div>
                            <div className={`absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end items-start transition-opacity duration-500 ${index === selectedWorkIndex ? 'opacity-100 delay-300 pointer-events-none' : 'opacity-0'}`}>
                                <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">{work.title}</h2>
                                <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-300 uppercase tracking-widest">
                                    <span>{work.client}</span><span className="w-1 h-1 bg-white rounded-full"></span><span>{work.year}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
      <style>{`.animate-marquee { display: flex; animation: marquee 25s linear infinite; } @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
};