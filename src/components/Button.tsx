import React, { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  let variantClasses = '';
  let sizeClasses = '';

  // Variant styles
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg';
      break;
    case 'secondary':
      variantClasses = 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-md hover:shadow-lg';
      break;
    case 'accent':
      variantClasses = 'bg-accent-500 hover:bg-accent-600 text-white shadow-md hover:shadow-lg';
      break;
    case 'ghost':
      variantClasses = 'bg-transparent hover:bg-dark-800 text-gray-200';
      break;
    case 'outline':
      variantClasses = 'bg-transparent border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white';
      break;
    default:
      variantClasses = 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg';
  }

  // Size styles
  switch (size) {
    case 'sm':
      sizeClasses = 'text-xs px-3 py-1.5 rounded';
      break;
    case 'md':
      sizeClasses = 'text-sm px-4 py-2 rounded-md';
      break;
    case 'lg':
      sizeClasses = 'text-base px-6 py-3 rounded-md';
      break;
    default:
      sizeClasses = 'text-sm px-4 py-2 rounded-md';
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`
        ${variantClasses}
        ${sizeClasses}
        ${fullWidth ? 'w-full' : ''}
        font-medium transition-all duration-200 flex items-center justify-center gap-2
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </motion.button>
  );
};

export default Button;