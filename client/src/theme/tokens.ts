// Design tokens for Shababna Platform - Enhanced Visual System
export const tokens = {
  colors: {
    primary: {
      main: '#1E3A8A', // أزرق غامق أكثر
      light: '#3B5B9A',
      dark: '#0F1F4A', // غامق جداً
      25: '#F8FAFC',
      50: '#F0F4F8',
      75: '#E2E8F0',
      100: '#D9E2ED',
      150: '#94A3B8',
      200: '#B3C5D6',
      300: '#8CA8BF',
      400: '#668BA8',
      500: '#1E3A8A', // أزرق غامق
      600: '#1A2F6B', // غامق أكثر
      700: '#162552', // غامق جداً
      800: '#121B39', // غامق للغاية
      900: '#0E1120' // أسود مائل للأزرق
    },
    accent: {
      main: '#B45309', // برتقالي غامق أكثر
      light: '#D97706',
      dark: '#92400E', // غامق
      25: '#FEFCF8',
      50: '#FDF8F0',
      75: '#F7F0E0',
      100: '#FAEAD6',
      150: '#E8D4B0',
      200: '#F5D5AD',
      300: '#F0C084',
      400: '#EBAB5B',
      500: '#B45309', // برتقالي غامق
      600: '#92400E', // غامق أكثر
      700: '#78350F', // غامق جداً
      800: '#5C2A0B', // غامق للغاية
      900: '#401F08' // أسود مائل للبرتقالي
    },
    secondary: {
      main: '#0F172A', // رمادي غامق جداً
      light: '#1E293B',
      dark: '#020617', // أسود تقريباً
      25: '#F8FAFB',
      50: '#E6EBEE',
      75: '#D1D8DC',
      100: '#CCD7DD',
      150: '#9BA8B0',
      200: '#99AFBB',
      300: '#668799',
      400: '#335F77',
      500: '#0F172A', // رمادي غامق جداً
      600: '#0C1421', // غامق أكثر
      700: '#091018', // غامق جداً
      800: '#060C0F', // غامق للغاية
      900: '#030607' // أسود تقريباً
    },
    semantic: {
      success: {
        main: '#15803D', // أخضر غامق
        50: '#F0FDF4',
        100: '#DCFCE7',
        200: '#BBF7D0',
        300: '#86EFAC',
        400: '#4ADE80',
        500: '#15803D', // أخضر غامق
        600: '#166534', // غامق أكثر
        700: '#14532D', // غامق جداً
        800: '#134E2A', // غامق للغاية
        900: '#0F3D1F' // أسود مائل للأخضر
      },
      error: {
        main: '#B91C1C', // أحمر غامق
        50: '#FEF2F2',
        100: '#FEE2E2',
        200: '#FECACA',
        300: '#FCA5A5',
        400: '#F87171',
        500: '#B91C1C', // أحمر غامق
        600: '#991B1B', // غامق أكثر
        700: '#7F1D1D', // غامق جداً
        800: '#6B1A1A', // غامق للغاية
        900: '#571717' // أسود مائل للأحمر
      },
      warning: {
        main: '#D97706', // برتقالي غامق
        50: '#FFFBEB',
        100: '#FEF3C7',
        200: '#FDE68A',
        300: '#FCD34D',
        400: '#FBBF24',
        500: '#D97706', // برتقالي غامق
        600: '#B45309', // غامق أكثر
        700: '#92400E', // غامق جداً
        800: '#78350F', // غامق للغاية
        900: '#5C2A0B' // أسود مائل للبرتقالي
      },
      info: {
        main: '#0369A1', // أزرق غامق
        50: '#F0F9FF',
        100: '#E0F2FE',
        200: '#BAE6FD',
        300: '#7DD3FC',
        400: '#38BDF8',
        500: '#0369A1', // أزرق غامق
        600: '#075985', // غامق أكثر
        700: '#0C4A6E', // غامق جداً
        800: '#0B3D5B', // غامق للغاية
        900: '#0A2E47' // أسود مائل للأزرق
      }
    },
    neutral: {
      25: '#FCFCFC',
      50: '#FAFAFA',
      75: '#F5F5F5',
      100: '#F5F5F5',
      150: '#E5E5E5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717'
    },
    // إضافة gradients جديدة مع الألوان الغامقة
    gradients: {
      primary: 'linear-gradient(135deg, #1E3A8A 0%, #0F1F4A 100%)',
      accent: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)',
      hero: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)',
      secondary: 'linear-gradient(135deg, #0F172A 0%, #020617 100%)',
      success: 'linear-gradient(135deg, #15803D 0%, #14532D 100%)',
      error: 'linear-gradient(135deg, #B91C1C 0%, #7F1D1D 100%)',
      warning: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)',
      info: 'linear-gradient(135deg, #0369A1 0%, #0C4A6E 100%)',
      glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    }
  },
  typography: {
    fonts: {
      arabic: 'Tajawal, "Noto Sans Arabic", system-ui, sans-serif',
      latin: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'Poppins, system-ui, sans-serif', // للعناوين
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
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.75rem', // 28px
      '4xl': '2rem',   // 32px
      '5xl': '2.5rem', // 40px
      '6xl': '3rem',   // 48px
      // أحجام display جديدة
      'display-1': '2.5rem', // 40px
      'display-2': '2rem',   // 32px
      'display-3': '1.75rem', // 28px
      // أحجام body جديدة
      'body-lg': '1.125rem', // 18px
      'body-md': '1rem',     // 16px
      'body-sm': '0.875rem', // 14px
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
    '0.5': '0.125rem',  // 2px
    1: '0.25rem',  // 4px
    '1.5': '0.375rem',  // 6px
    2: '0.5rem',   // 8px
    '2.5': '0.625rem',  // 10px
    3: '0.75rem',  // 12px
    '3.5': '0.875rem',  // 14px
    4: '1rem',     // 16px
    '4.5': '1.125rem',  // 18px
    5: '1.25rem',  // 20px
    '5.5': '1.375rem',  // 22px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem',    // 96px
    32: '8rem',    // 128px
    40: '10rem',   // 160px
    48: '12rem',   // 192px
  },
  radius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    '3xl': '3rem',    // 48px
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
    // إضافة shadows جديدة
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
    maxWidth: '80rem' // 1280px
  },
  // إضافة animations جديدة
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
  // إضافة effects جديدة
  effects: {
    glass: 'backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);',
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
