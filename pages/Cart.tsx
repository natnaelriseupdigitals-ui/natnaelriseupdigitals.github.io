import React from 'react';
import { Reveal } from '../components/Reveal';
import { Button } from '../components/Button';
import { Page } from '../types';
import { Trash2, ArrowLeft } from 'lucide-react';

interface CartProps {
    setPage: (page: Page) => void;
}

export const Cart: React.FC<CartProps> = ({ setPage }) => {
  // Mock Cart Data
  const cartItems = [
    {
        id: 1,
        name: "Nightcall",
        type: "Limited Edition Print",
        price: 145.00,
        image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <div className="bg-orbit-black min-h-screen pt-32 pb-20 relative z-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <Reveal>
            <button 
                onClick={() => setPage(Page.STORE)} 
                className="flex items-center text-gray-400 hover:text-white mb-8 text-xs uppercase tracking-widest transition-colors"
            >
                <ArrowLeft size={16} className="mr-2" /> Continue Shopping
            </button>
        </Reveal>

        <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 text-white">
                Your Cart
            </h1>
        </Reveal>

        {cartItems.length > 0 ? (
            <div className="space-y-12">
                {/* Cart Items */}
                <div className="border-t border-gray-800">
                    {cartItems.map((item, index) => (
                        <Reveal key={item.id} delay={index * 0.1}>
                            <div className="py-8 flex gap-6 items-center border-b border-gray-800">
                                <div className="w-24 h-32 bg-gray-900 rounded-lg overflow-hidden shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">{item.name}</h3>
                                        <button className="text-gray-500 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">{item.type}</p>
                                    <p className="text-lg font-mono text-white">${item.price.toFixed(2)}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

                {/* Summary */}
                <Reveal delay={0.2}>
                    <div className="flex flex-col items-end gap-4">
                        <div className="flex justify-between w-full md:w-80 text-lg font-bold uppercase tracking-widest border-b border-white pb-4 mb-4">
                            <span>Total</span>
                            <span>${cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)}</span>
                        </div>
                        <Button fullWidth className="md:w-80">
                            Checkout
                        </Button>
                        <p className="text-xs text-gray-500 uppercase tracking-widest text-center md:text-right w-full md:w-80">
                            Taxes and shipping calculated at checkout
                        </p>
                    </div>
                </Reveal>
            </div>
        ) : (
            <div className="text-center py-20 border border-dashed border-gray-800 rounded-2xl">
                <p className="text-gray-500 mb-8">Your cart is empty.</p>
                <Button onClick={() => setPage(Page.STORE)}>Start Shopping</Button>
            </div>
        )}
      </div>
    </div>
  );
};