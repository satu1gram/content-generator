import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: React.ReactNode;
}

const Button = ({ variant = 'primary', size = 'md', href, children, className = '', ...props }: ButtonProps) => {
  const variants = {
    primary: 'bg-[#00A896] text-white hover:bg-[#008A7B] shadow-sm',
    secondary: 'bg-[#F7F6F2] text-[#1C1C1E] border border-[#E8E5DF] hover:bg-[#EAE7E0]',
    ghost: 'bg-transparent text-[#9B8EA0] hover:bg-[#F7F6F2] hover:text-[#1C1C1E]',
    danger: 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-[11px]',
    md: 'px-6 py-2.5 text-[12px]',
    lg: 'px-8 py-3.5 text-[14px]',
  };

  const commonClasses = `
    inline-flex items-center justify-center gap-2
    rounded-xl 
    font-bold 
    uppercase tracking-widest
    transition-all duration-200
    active:scale-[0.98]
    disabled:opacity-50 disabled:pointer-events-none
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim();

  if (href) {
    return (
      <Link href={href} className={commonClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={commonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
