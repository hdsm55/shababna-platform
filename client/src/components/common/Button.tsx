import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-200',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-4 focus:ring-secondary-200',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-4 focus:ring-primary-200',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading && <LoadingSpinner size="sm" color="text-current" />}
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className={`${iconSizeClasses[size]} ${children ? 'mr-2 rtl:ml-2 rtl:mr-0' : ''}`} />
      )}
      {!loading && children}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={`${iconSizeClasses[size]} ${children ? 'ml-2 rtl:mr-2 rtl:ml-0' : ''}`} />
      )}
    </motion.button>
  );
};

export default Button;