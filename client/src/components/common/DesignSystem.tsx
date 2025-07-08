import React from 'react';

// Design System Constants
export const DESIGN_SYSTEM = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    accent: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      arabic: ['Tajawal', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
} as const;

// Section Background Variants
export const SECTION_VARIANTS = {
  hero: 'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white',
  content: 'bg-white text-neutral-900',
  accent:
    'bg-gradient-to-br from-accent-50 via-white to-primary-50 text-neutral-900',
  neutral: 'bg-neutral-50 text-neutral-900',
  primary:
    'bg-gradient-to-br from-primary-50 via-white to-primary-100 text-neutral-900',
} as const;

// Card Variants
export const CARD_VARIANTS = {
  default: 'bg-white border border-neutral-200 shadow-sm rounded-lg',
  elevated: 'bg-white border border-neutral-200 shadow-md rounded-lg',
  accent:
    'bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200 rounded-lg',
  primary:
    'bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-lg',
} as const;

// Button Variants with proper contrast
export const BUTTON_VARIANTS = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-md',
  secondary: 'bg-secondary-600 text-white hover:bg-secondary-700',
  accent: 'bg-accent-500 text-white hover:bg-accent-600',
  ghost: 'bg-transparent text-primary-600 hover:bg-primary-50',
  outline:
    'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
} as const;

// Utility function to get section classes
export const getSectionClasses = (
  variant: keyof typeof SECTION_VARIANTS = 'content'
) => {
  return SECTION_VARIANTS[variant];
};

// Utility function to get card classes
export const getCardClasses = (
  variant: keyof typeof CARD_VARIANTS = 'default'
) => {
  return CARD_VARIANTS[variant];
};

// Utility function to get button classes
export const getButtonClasses = (
  variant: keyof typeof BUTTON_VARIANTS = 'primary'
) => {
  return BUTTON_VARIANTS[variant];
};

export default DESIGN_SYSTEM;
