import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-bold transition-all duration-200 sketchy-border',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white',
          'disabled:pointer-events-none disabled:opacity-50 disabled:grayscale',
          'hover:-translate-y-1 hover:rotate-1',
          {
            'bg-[#e0ddd5] text-[#111] hover:bg-[#111] hover:text-[#e0ddd5]': variant === 'primary' || variant === 'default',
            'bg-red-600 text-[#e0ddd5] hover:bg-[#111] hover:text-red-600': variant === 'danger',
            'bg-transparent text-[#e0ddd5] border-2 border-[#e0ddd5] hover:bg-[#e0ddd5] hover:text-[#111]': variant === 'outline',
            'bg-transparent hover:bg-[#111] text-[#e0ddd5] border-none': variant === 'ghost',
          },
          {
            'px-3 py-1 text-sm': size === 'sm',
            'px-6 py-2 text-lg': size === 'md',
            'px-8 py-3 text-xl': size === 'lg',
          },
          className
        )}
        style={{ fontFamily: 'var(--font-sketch)' }}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
