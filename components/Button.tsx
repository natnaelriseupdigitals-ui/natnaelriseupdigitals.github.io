import React from 'react';
import { ArrowRight, ArrowUpRight, ShoppingCart } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  icon?: 'arrow' | 'diagonal' | 'bag' | 'none';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon = 'none', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  
  // --- BUTTON SYSTEM RULES ---
  // 1. Consistency: All buttons use the same font stack, tracking, and transition timing.
  // 2. Responsiveness: Text scales from 10px (mobile) to 12px (desktop). Padding scales proportionally.
  // 3. Interaction: Hover lifts the button. Click presses it down.

  const isGhost = variant === 'ghost';

  const baseClasses = "relative group flex items-center justify-center font-bold uppercase tracking-[0.2em] transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed select-none";
  
  // Sizing Rules
  const sizeClasses = isGhost 
    ? "text-xs py-2 px-0" // Ghost buttons are text links, no pill shape needed
    : "text-[10px] md:text-xs py-3 px-6 md:py-4 md:px-10 rounded-full active:scale-95 hover:-translate-y-0.5 shadow-lg shadow-black/20";

  const variantClasses = {
    // Primary: Maximum Contrast (White on Black BG). Instantly noticeable.
    primary: "bg-white text-black border border-white hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]",
    
    // Outline: Secondary actions. Elegant fill animation on hover.
    outline: "bg-transparent text-white border border-white/40 hover:border-white hover:text-black overflow-hidden backdrop-blur-sm",
    
    // Ghost: Navigation links.
    ghost: "bg-transparent text-white/70 hover:text-white border-none shadow-none"
  };

  const IconMap = {
    arrow: ArrowRight,
    diagonal: ArrowUpRight,
    bag: ShoppingCart,
    none: null
  };

  const IconComp = IconMap[icon];

  return (
    <button 
      className={`
        ${baseClasses}
        ${sizeClasses}
        ${variantClasses[variant]} 
        ${fullWidth ? 'w-full' : 'inline-flex'} 
        ${className}
      `}
      {...props}
    >
      {/* Outline Fill Animation (Cinematic Sweep) */}
      {variant === 'outline' && (
         <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out -z-10"></div>
      )}

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-3">
        {children}
        {IconComp && (
            <IconComp 
                size={16} 
                className={`transition-transform duration-300 ${icon === 'arrow' ? 'group-hover:translate-x-1' : ''} ${icon === 'diagonal' ? 'group-hover:-translate-y-0.5 group-hover:translate-x-0.5' : ''}`} 
            />
        )}
      </span>
      
      {/* Ghost Underline Animation */}
      {isGhost && (
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
      )}
    </button>
  );
};