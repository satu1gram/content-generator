'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

const Select = ({ 
  options, 
  value, 
  onChange, 
  label, 
  placeholder = 'Select an option', 
  className = '',
  icon
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[10px] font-bold text-[#9B8EA0] uppercase tracking-[0.2em] mb-2 px-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full h-11 md:h-12 px-5 flex items-center justify-between
          bg-white border border-[#E8E5DF] rounded-xl
          transition-all duration-300
          ${isOpen ? 'border-[#00A896] ring-4 ring-[#007A6E]/5 shadow-sm' : 'hover:border-[#00A896]/30'}
          group
        `.trim()}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-[#9B8EA0] group-hover:text-[#00A896] transition-colors">{icon}</div>}
          <span className={`text-[13px] font-bold ${selectedOption ? 'text-[#1C1C1E]' : 'text-[#CED4DA]'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-[#9B8EA0] transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#00A896]' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-[100] w-full mt-2 bg-white border border-[#E8E5DF] rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto py-2 scrollbar-thin">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full px-5 py-2 md:py-2.5 flex items-center justify-between
                      text-[12px] font-medium transition-all
                      ${isSelected 
                        ? 'bg-[#E0F5F2] text-[#00A896] font-bold' 
                        : 'text-[#3D3D3D] hover:bg-[#F7F6F2] hover:text-[#1C1C1E]'
                      }
                    `.trim()}
                  >
                    {option.label}
                    {isSelected && <Check size={14} className="text-[#00A896]" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Select;
