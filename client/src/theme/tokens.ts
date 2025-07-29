// Design tokens for Shababna Platform - Enhanced Visual System
export const tokens = {
  colors: {
    primary: {
      main: '#27548A', // YInMn Blue - اللون الأساسي
      light: '#4A7AB8',
      dark: '#183B4E', // Japanese Indigo - اللون الغامق
      25: '#F8FAFC',
      50: '#F0F4F8',
      75: '#E2E8F0',
      100: '#D9E2ED',
      150: '#94A3B8',
      200: '#B3C5D6',
      300: '#8CA8BF',
      400: '#668BA8',
      500: '#27548A', // YInMn Blue
      600: '#1E3F6B',
      700: '#183B4E', // Japanese Indigo
      800: '#0F2A3A',
      900: '#003362' // Dark Midnight Blue
    },
    accent: {
      main: '#DDA853', // Indian Yellow - اللون المميز
      light: '#E8C275',
      dark: '#C19A4A',
      25: '#FEFCF8',
      50: '#FDF8F0',
      75: '#F7F0E0',
      100: '#FAEAD6',
      150: '#E8D4B0',
      200: '#F5D5AD',
      300: '#F0C084',
      400: '#EBAB5B',
      500: '#DDA853', // Indian Yellow
      600: '#C19A4A',
      700: '#A68B41',
      800: '#8B7C38',
      900: '#706D2F'
    },
    secondary: {
      main: '#183B4E', // Japanese Indigo
      light: '#2A5A6B',
      dark: '#003362', // Dark Midnight Blue
      25: '#F8FAFB',
      50: '#E6EBEE',
      75: '#D1D8DC',
      100: '#CCD7DD',
      150: '#9BA8B0',
      200: '#99AFBB',
      300: '#668799',
      400: '#335F77',
      500: '#183B4E', // Japanese Indigo
      600: '#0F2A3A',
      700: '#0A1F2A',
      800: '#06141A',
      900: '#003362' // Dark Midnight Blue
    },
    neutral: {
      main: '#F3F3E0', // Beige - اللون المحايد
      light: '#FAFAF5',
      dark: '#E8E8D0',
      25: '#FCFCFC',
      50: '#FAFAFA',
      75: '#F5F5F5',
      100: '#F3F3E0', // Beige
      150: '#E5E5D0',
      200: '#D4D4C0',
      300: '#C4C4B0',
      400: '#A3A390',
      500: '#737370',
      600: '#525250',
      700: '#404040',
      800: '#262626',
      900: '#171717'
    },
    semantic: {
      success: {
        main: '#15803D',
        50: '#F0FDF4',
        100: '#DCFCE7',
        200: '#BBF7D0',
        300: '#86EFAC',
        400: '#4ADE80',
        500: '#15803D',
        600: '#166534',
        700: '#14532D',
        800: '#134E2A',
        900: '#0F3D1F'
      },
      error: {
        main: '#B91C1C',
        50: '#FEF2F2',
        100: '#FEE2E2',
        200: '#FECACA',
        300: '#FCA5A5',
        400: '#F87171',
        500: '#B91C1C',
        600: '#991B1B',
        700: '#7F1D1D',
        800: '#6B1A1A',
        900: '#571717'
      },
      warning: {
        main: '#DDA853', // Indian Yellow
        50: '#FFFBEB',
        100: '#FEF3C7',
        200: '#FDE68A',
        300: '#FCD34D',
        400: '#FBBF24',
        500: '#DDA853', // Indian Yellow
        600: '#C19A4A',
        700: '#A68B41',
        800: '#8B7C38',
        900: '#706D2F'
      },
      info: {
        main: '#27548A', // YInMn Blue
        50: '#F0F9FF',
        100: '#E0F2FE',
        200: '#BAE6FD',
        300: '#7DD3FC',
        400: '#38BDF8',
        500: '#27548A', // YInMn Blue
        600: '#1E3F6B',
        700: '#183B4E',
        800: '#0F2A3A',
        900: '#003362'
      }
    },
    // إضافة gradients جديدة مع الألوان الجديدة
    gradients: {
      primary: 'linear-gradient(135deg, #27548A 0%, #183B4E 100%)',
      accent: 'linear-gradient(135deg, #DDA853 0%, #C19A4A 100%)',
      hero: 'linear-gradient(135deg, #27548A 0%, #003362 100%)',
      secondary: 'linear-gradient(135deg, #183B4E 0%, #003362 100%)',
      success: 'linear-gradient(135deg, #15803D 0%, #14532D 100%)',
      error: 'linear-gradient(135deg, #B91C1C 0%, #7F1D1D 100%)',
      warning: 'linear-gradient(135deg, #DDA853 0%, #C19A4A 100%)',
      info: 'linear-gradient(135deg, #27548A 0%, #183B4E 100%)',
      glass: 'linear-gradient(135deg, rgba(243,243,224,0.1) 0%, rgba(243,243,224,0.05) 100%)',
      warm: 'linear-gradient(135deg, #DDA853 0%, #F3F3E0 100%)',
      cool: 'linear-gradient(135deg, #27548A 0%, #F3F3E0 100%)',
    }
  },
  typography: {
    fonts: {
      arabic: 'Tajawal, "Noto Sans Arabic", system-ui, sans-serif',
      latin: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'Poppins, system-ui, sans-serif',
      mono: 'JetBrains Mono, "Fira Code", Consolas, monospace',
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      'display-1': '3.5rem',
      'display-2': '3rem',
      'display-3': '2.5rem',
      'body-lg': '1.125rem',
      'body-md': '1rem',
      'body-sm': '0.875rem',
    },
    lineHeights: {
      tight: '1.1',
      snug: '1.2',
      normal: '1.5',
      relaxed: '1.6',
      loose: '1.8',
    }
  },
  spacing: {
    0: '0',
    '0.5': '0.125rem',
    1: '0.25rem',
    '1.5': '0.375rem',
    2: '0.5rem',
    '2.5': '0.625rem',
    3: '0.75rem',
    '3.5': '0.875rem',
    4: '1rem',
    '4.5': '1.125rem',
    5: '1.25rem',
    '5.5': '1.375rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
  },
  radius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    '3xl': '3rem',
    full: '9999px'
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    'glow-primary': '0 0 20px rgba(39, 84, 138, 0.3)',
    'glow-accent': '0 0 20px rgba(221, 168, 83, 0.3)',
    'glow-success': '0 0 20px rgba(34, 197, 94, 0.3)',
    'glow-error': '0 0 20px rgba(239, 68, 68, 0.3)',
  },
  transitions: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    timing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    }
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  container: {
    padding: {
      DEFAULT: '1rem',
      sm: '2rem',
      lg: '4rem',
      xl: '5rem',
      '2xl': '6rem',
    },
    maxWidth: '80rem'
  },
  animations: {
    fadeIn: 'fadeIn 0.5s ease-in-out',
    slideUp: 'slideUp 0.5s ease-out',
    slideDown: 'slideDown 0.5s ease-out',
    slideLeft: 'slideLeft 0.5s ease-out',
    slideRight: 'slideRight 0.5s ease-out',
    scaleIn: 'scaleIn 0.3s ease-out',
    scaleOut: 'scaleOut 0.3s ease-in',
    bounce: 'bounce 1s infinite',
    pulse: 'pulse 2s infinite',
    spin: 'spin 1s linear infinite',
    ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    wiggle: 'wiggle 1s ease-in-out infinite',
  },
  effects: {
    glass: 'backdrop-filter: blur(10px); background: rgba(243, 243, 224, 0.1); border: 1px solid rgba(243, 243, 224, 0.2);',
    blur: 'backdrop-filter: blur(8px);',
    grayscale: 'filter: grayscale(100%);',
    sepia: 'filter: sepia(100%);',
    invert: 'filter: invert(100%);',
  }
};

// إضافة keyframes للanimations
export const keyframes = {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  slideUp: {
    '0%': { transform: 'translateY(20px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  slideDown: {
    '0%': { transform: 'translateY(-20px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  slideLeft: {
    '0%': { transform: 'translateX(20px)', opacity: '0' },
    '100%': { transform: 'translateX(0)', opacity: '1' },
  },
  slideRight: {
    '0%': { transform: 'translateX(-20px)', opacity: '0' },
    '100%': { transform: 'translateX(0)', opacity: '1' },
  },
  scaleIn: {
    '0%': { transform: 'scale(0.9)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
  scaleOut: {
    '0%': { transform: 'scale(1)', opacity: '1' },
    '100%': { transform: 'scale(0.9)', opacity: '0' },
  },
  wiggle: {
    '0%, 100%': { transform: 'rotate(-3deg)' },
    '50%': { transform: 'rotate(3deg)' },
  },
};

// إضافة utility functions جديدة
export const getGradientClasses = (gradient: keyof typeof tokens.colors.gradients) => {
  return `bg-gradient-to-br ${tokens.colors.gradients[gradient]}`;
};

export const getAnimationClasses = (animation: keyof typeof tokens.animations) => {
  return tokens.animations[animation];
};

export const getEffectClasses = (effect: keyof typeof tokens.effects) => {
  return tokens.effects[effect];
};

// إضافة hover effects جديدة
export const hoverEffects = {
  lift: 'hover:-translate-y-1 hover:shadow-lg transition-all duration-300',
  scale: 'hover:scale-105 transition-transform duration-300',
  glow: 'hover:shadow-lg hover:shadow-primary-200 transition-shadow duration-300',
  border: 'hover:border-primary-500 transition-colors duration-300',
  rotate: 'hover:rotate-3 transition-transform duration-300',
  pulse: 'hover:animate-pulse',
  bounce: 'hover:animate-bounce',
};

// إضافة loading states جديدة
export const loadingStates = {
  skeleton: 'animate-pulse bg-neutral-200',
  spinner: 'animate-spin',
  dots: 'animate-bounce',
  progress: 'animate-progress',
  shimmer: 'animate-shimmer',
};

// إضافة micro-interactions
export const microInteractions = {
  buttonPress: 'active:scale-95 transition-transform duration-150',
  cardHover: 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
  linkHover: 'hover:text-primary-600 transition-colors duration-200',
  inputFocus: 'focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all duration-200',
  iconHover: 'hover:scale-110 transition-transform duration-200',
};
