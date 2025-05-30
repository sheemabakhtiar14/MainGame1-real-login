import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  interactive = false 
}) => {
  const baseClasses = 'bg-dark-800 rounded-lg overflow-hidden border border-dark-700 shadow-lg';
  const interactiveClasses = interactive 
    ? 'cursor-pointer transition-all duration-300 hover:border-secondary-700 hover:shadow-xl hover:transform hover:-translate-y-1'
    : '';

  return (
    <motion.div
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={interactive ? { scale: 1.02 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.div>
  );
};

export default Card;