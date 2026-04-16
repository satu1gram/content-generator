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
    primary: 'bg-[var(--bp-accent)] text-white hover:bg-[var(--bp-accent-hover)]',
    secondary: 'bg-[var(--bp-bg-inner)] text-[var(--bp-text-primary)] border-thin hover:bg-[var(--bp-bg-hover)]',
    ghost: 'bg-transparent text-[var(--bp-text-secondary)] hover:bg-[var(--bp-bg-hover)]',
    danger: 'bg-[var(--bp-red-bg)] text-[var(--bp-red)] border-[0.5px] border-[var(--bp-red)]/[0.2] hover:opacity-80',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[11px]',
    md: 'px-3.5 py-2 text-[13px]',
    lg: 'px-5 py-2.5 text-[14px]',
  };

  const commonClasses = `
    inline-flex items-center justify-center gap-2
    rounded-[var(--bp-radius-sm)] 
    font-medium 
    transition-all duration-150
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
