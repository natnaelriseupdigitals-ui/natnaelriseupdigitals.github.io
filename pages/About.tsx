import React from 'react';
import { Reveal } from '../components/Reveal';
import { ArrowDown } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-transparent min-h-screen">
      
      {/* Cinematic Hero Section - Transparent to show Global Video */}
      <section className="relative h-screen w-full overflow-hidden">
         {/* Scroll Indicator */}
         <div className="absolute bottom-10 left-0 w-full flex justify-center z-20">
            <div className="flex flex-col items-center gap-2 animate-bounce">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold pl-[0.3em]">Scroll</span>
                <ArrowDown className="text-white/50" size={20} />
            </div>
         </div>
      </section>

      {/* Intro Text Section - Appears on Scroll with Glass Effect */}
      <section className="py-20 md:py-32 container mx-auto px-6 flex flex-col justify-center items-start relative z-20 mt-[-10vh] md:mt-0">
             {/* Glass Container */}
             <div className="bg-black/10 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-3xl w-full md:w-auto">
                 <Reveal>
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-none text-white drop-shadow-lg">
                        We are<br />Cian Cinematic.
                    </h1>
                 </Reveal>
                 <Reveal delay={0.2}>
                    <p className="text-lg md:text-xl text-gray-200 max-w-xl font-light drop-shadow-md">
                        A collective of creators pushing the boundaries of what's possible in digital media.
                    </p>
                 </Reveal>
             </div>
      </section>

      {/* Manifesto - UPDATED: Blur effect instead of solid black background */}
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32 items-start relative z-20">
        <div className="lg:col-span-4 hidden lg:block sticky top-32">
            <Reveal delay={0.3}>
                 <div className="bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-white/5 inline-block">
                     <span className="text-sm uppercase tracking-[0.3em] text-gray-300 border-l border-white pl-4 block">
                        Our Philosophy
                     </span>
                 </div>
            </Reveal>
        </div>
        <div className="lg:col-span-8">
             {/* Text Content Wrapper with Blur */}
             <div className="bg-black/30 backdrop-blur-xl border border-white/5 p-8 md:p-12 rounded-3xl shadow-2xl">
                <Reveal delay={0.4}>
                    <h3 className="text-2xl md:text-4xl font-bold leading-tight mb-8 text-white drop-shadow-md">
                        We don't just capture moments;<br />we manufacture emotions.
                    </h3>
                </Reveal>
                <Reveal delay={0.5}>
                    <div className="space-y-6 text-gray-300 text-base md:text-lg leading-relaxed font-medium">
                        <p>
                            Cian Cinematic was born from a desire to break the mold of traditional production. In a world saturated with content, only the boldest visuals survive. We combine high-end cinematography with fast-paced editing techniques to create work that demands attention.
                        </p>
                        <p>
                            From the streets of Tokyo to the coastlines of California, our lens has no boundaries. We are storytellers, adrenaline junkies, and perfectionists dedicated to elevating your brand to the stratosphere.
                        </p>
                        <p>
                            We believe that every frame matters. Whether it's a 15-second social spot or a full-length documentary, we bring the same level of intensity and precision to every project.
                        </p>
                    </div>
                </Reveal>
             </div>
        </div>
      </div>

      {/* Stats - Aligned Properly */}
      <div className="border-y border-gray-900 bg-gray-900/40 backdrop-blur-md py-20 relative z-20">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                    { number: "150+", label: "Projects" },
                    { number: "12", label: "Countries" },
                    { number: "50M+", label: "Views" },
                    { number: "100%", label: "Passion" },
                ].map((stat, i) => (
                    <Reveal key={i} delay={i * 0.1}>
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <span className="block text-4xl md:text-6xl font-black text-white mb-2 drop-shadow-md">{stat.number}</span>
                            <span className="block text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">{stat.label}</span>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};