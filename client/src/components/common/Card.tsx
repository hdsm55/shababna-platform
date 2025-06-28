import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  onClick 
}) => {
  const baseClasses = 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden';
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-300' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;