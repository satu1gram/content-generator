import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean | string;
}

const Card = ({ children, className = '', padding = true }: CardProps) => {
  const paddingStyle = typeof padding === 'string' ? padding : padding ? 'p-4' : 'p-0';
  
  return (
    <div className={`
      bg-surface 
      border-thin 
      rounded-[var(--bp-radius-md)] 
      ${paddingStyle} 
      ${className}
    `.trim()}>
      {children}
    </div>
  );
};

export default Card;
