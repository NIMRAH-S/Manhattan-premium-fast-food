import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className,
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-[#D4A574] text-white hover:bg-[#B88A58] shadow-lg hover:shadow-xl',
    secondary: 'bg-[#1A1A1A] text-white hover:bg-black',
    outline: 'border-2 border-[#D4A574] text-[#D4A574] hover:bg-[#D4A574] hover:text-white',
    ghost: 'text-[#1A1A1A] hover:bg-[#E8E8E8]',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-semibold',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={twMerge(
        clsx(
          'relative overflow-hidden transition-all duration-300 rounded-none transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
          variants[variant],
          sizes[size],
          className
        )
      )}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};
