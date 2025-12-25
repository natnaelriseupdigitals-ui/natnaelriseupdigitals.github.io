import React from 'react';
import { Reveal } from '../components/Reveal';
import { Button } from '../components/Button';
import { ArrowUpRight } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="bg-orbit-black min-h-screen pt-32 pb-20 flex flex-col justify-center relative z-20">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left Info */}
            <div className="order-2 lg:order-1">
                <Reveal>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">
                        Let's Talk.
                    </h1>
                </Reveal>
                <Reveal delay={0.2}>
                    <p className="text-xl text-gray-400 mb-12 max-w-md">
                        Have a project in mind? We'd love to hear about it. Fill out the form or send us an email directly.
                    </p>
                </Reveal>

                <Reveal delay={0.3}>
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Email</h4>
                            <a href="mailto:hello@orbitvisuals.com" className="text-2xl font-bold hover:text-white text-gray-200 transition-colors flex items-center">
                                hello@orbitvisuals.com <ArrowUpRight className="ml-2 w-5 h-5" />
                            </a>
                        </div>
                        <div>
                            <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Studio</h4>
                            <p className="text-2xl font-bold text-gray-200">
                                Los Angeles, CA<br />
                                90210
                            </p>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* Right Form */}
            <div className="order-1 lg:order-2 bg-gray-900/30 p-6 md:p-12 border border-gray-800 backdrop-blur-sm rounded-xl">
                <form className="space-y-6 md:space-y-8" onSubmit={(e) => e.preventDefault()}>
                    <Reveal delay={0.2}>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-gray-500">Name</label>
                            <input 
                                type="text" 
                                placeholder="John Doe" 
                                className="w-full bg-transparent border-b border-gray-700 py-3 md:py-4 text-white text-lg md:text-xl focus:outline-none focus:border-white transition-colors placeholder-gray-700"
                            />
                        </div>
                    </Reveal>

                    <Reveal delay={0.3}>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-gray-500">Email</label>
                            <input 
                                type="email" 
                                placeholder="john@example.com" 
                                className="w-full bg-transparent border-b border-gray-700 py-3 md:py-4 text-white text-lg md:text-xl focus:outline-none focus:border-white transition-colors placeholder-gray-700"
                            />
                        </div>
                    </Reveal>

                    <Reveal delay={0.4}>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-gray-500">Project Type</label>
                            <div className="relative">
                                <select className="w-full bg-transparent border-b border-gray-700 py-3 md:py-4 text-white text-lg md:text-xl focus:outline-none focus:border-white transition-colors appearance-none rounded-none">
                                    <option className="bg-black text-gray-400" value="" disabled selected>Select an option</option>
                                    <option className="bg-black text-white">Commercial Video</option>
                                    <option className="bg-black text-white">Photography</option>
                                    <option className="bg-black text-white">Music Video</option>
                                    <option className="bg-black text-white">Brand Direction</option>
                                </select>
                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delay={0.5}>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-gray-500">Message</label>
                            <textarea 
                                rows={4}
                                placeholder="Tell us about your vision..." 
                                className="w-full bg-transparent border-b border-gray-700 py-3 md:py-4 text-white text-lg md:text-xl focus:outline-none focus:border-white transition-colors placeholder-gray-700 resize-none"
                            ></textarea>
                        </div>
                    </Reveal>

                    <Reveal delay={0.6}>
                        {/* Updated Button: Removed icon="arrow" to match the solid, non-sliding animation of the Add to Cart buttons */}
                        <Button variant="primary" fullWidth className="mt-4">
                            Send Request
                        </Button>
                    </Reveal>
                </form>
            </div>
        </div>
    </div>
  );
};