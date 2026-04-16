import React from 'react';
import { Send } from 'lucide-react';

interface InputAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  onSend?: () => void;
  disabled?: boolean;
}

const InputArea = ({ value, onChange, placeholder, onSend, disabled }: InputAreaProps) => {
  return (
    <div className="bg-inner border-thin rounded-[var(--bp-radius-md)] p-3">
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full bg-transparent border-none outline-none 
          text-[13px] text-[var(--bp-text-primary)] 
          placeholder:text-[var(--bp-text-placeholder)]
          resize-none min-height-[80px]
          disabled:opacity-50
        `.trim()}
      />
      
      <div className="flex items-center justify-between mt-2.5">
        <div className="flex gap-2">
          <button className="px-2 py-1 bg-surface border-thin rounded-[var(--bp-radius-xs)] text-[11px] text-[var(--bp-text-secondary)] hover:bg-[var(--bp-bg-hover)] transition-colors">
            ✨ Optimize
          </button>
          <button className="px-2 py-1 bg-surface border-thin rounded-[var(--bp-radius-xs)] text-[11px] text-[var(--bp-text-secondary)] hover:bg-[var(--bp-bg-hover)] transition-colors">
            📝 Templates
          </button>
        </div>

        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className={`
            w-[30px] h-[30px] flex items-center justify-center
            bg-[var(--bp-text-primary)] text-white 
            rounded-[var(--bp-radius-sm)]
            transition-all duration-150
            hover:opacity-85 active:scale-[0.95]
            disabled:opacity-20 disabled:pointer-events-none
          `.trim()}
        >
          <Send size={14} className="ml-0.5" />
        </button>
      </div>
    </div>
  );
};

export default InputArea;
