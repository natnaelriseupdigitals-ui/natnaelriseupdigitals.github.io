import React from 'react';
import { Page } from '../types';
import { Button } from './Button';
import { Instagram, Youtube, Twitter, Mail } from 'lucide-react';

interface FooterProps {
    setPage: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ setPage }) => {
  return (
    <footer className="bg-black py-20 border-t border-gray-900">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
          <div className="mb-12 md:mb-0">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
              Let's create<br />something unreal.
            </h2>
            <Button 
                variant="outline"
                onClick={() => {
                    setPage(Page.CONTACT);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            >
              Start a Project
            </Button>
          </div>
          
          <div className="flex flex-col items-start md:items-end">
            <div className="flex space-x-6 mb-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Youtube /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Mail /></a>
            </div>
            <p className="text-gray-600 text-sm uppercase tracking-widest">
              © {new Date().getFullYear()} Cian Cinematic. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};