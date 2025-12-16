import React from 'react';
import { Reveal } from '../components/Reveal';
import { ArrowDown } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-orbit-black min-h-screen">
      
      {/* Cinematic Hero Section - Video Only */}
      <section className="relative h-screen w-full overflow-hidden">
         <div className="absolute inset-0 bg-black/50 z-10"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-orbit-black via-transparent to-transparent z-10"></div>
         
         <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover scale-110 opacity-80"
        >
            <source src="https://www.dropbox.com/scl/fi/tz20d2xwyzl770wkhehkx/IMG_0669-2.mp4?rlkey=wptpf6cnzoz5vbjvzkfh2si8t&st=r71hja1x&raw=1" type="video/mp4" />
            Your browser does not support the video tag.
        </video>

         {/* Scroll Indicator */}
         <div className="absolute bottom-10 left-0 w-full flex justify-center z-20">
            <div className="flex flex-col items-center gap-2 animate-bounce">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold pl-[0.3em]">Scroll</span>
                <ArrowDown className="text-white/50" size={20} />
            </div>
         </div>
      </section>

      {/* Intro Text Section - Appears on Scroll */}
      <section className="py-20 md:py-32 container mx-auto px-6 flex flex-col justify-center items-start">
             <Reveal>
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-none text-white">
                    We are<br />Orbit Visuals.
                </h1>
             </Reveal>
             <Reveal delay={0.2}>
                <p className="text-lg md:text-xl text-gray-200 max-w-xl font-light">
                    A collective of creators pushing the boundaries of what's possible in digital media.
                </p>
             </Reveal>
      </section>

      {/* Manifesto */}
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32 items-start">
        <div className="lg:col-span-4 hidden lg:block sticky top-32">
            <Reveal delay={0.3}>
                 <span className="text-sm uppercase tracking-[0.3em] text-gray-500 border-l border-gray-500 pl-4 block">
                    Our Philosophy
                 </span>
            </Reveal>
        </div>
        <div className="lg:col-span-8">
            <Reveal delay={0.4}>
                <h3 className="text-2xl md:text-4xl font-bold leading-tight mb-8">
                    We don't just capture moments;<br />we manufacture emotions.
                </h3>
            </Reveal>
            <Reveal delay={0.5}>
                <div className="space-y-6 text-gray-400 text-base md:text-lg leading-relaxed">
                    <p>
                        Orbit Visuals was born from a desire to break the mold of traditional production. In a world saturated with content, only the boldest visuals survive. We combine high-end cinematography with fast-paced editing techniques to create work that demands attention.
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

      {/* Stats - Aligned Properly */}
      <div className="border-y border-gray-900 bg-gray-900/20 py-20">
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
                            <span className="block text-4xl md:text-6xl font-black text-white mb-2">{stat.number}</span>
                            <span className="block text-xs uppercase tracking-[0.2em] text-gray-500">{stat.label}</span>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};