// Design tokens for Shababna Platform
export const tokens = {
  colors: {
    primary: {
      main: '#27548A', // Official brand primary
      light: '#3E6CA3',
      dark: '#183B4E',
      50: '#F0F4F8',
      100: '#D9E2ED',
      200: '#B3C5D6',
      300: '#8CA8BF',
      400: '#668BA8',
      500: '#27548A',
      600: '#214B7D',
      700: '#1B4270',
      800: '#153963',
      900: '#0F3056'
    },
    accent: {
      main: '#DDA853', // Official brand accent
      light: '#E4BB75',
      dark: '#C68F31',
      50: '#FDF8F0',
      100: '#FAEAD6',
      200: '#F5D5AD',
      300: '#F0C084',
      400: '#EBAB5B',
      500: '#DDA853',
      600: '#C68F31',
      700: '#AF760F',
      800: '#985D0C',
      900: '#814409'
    },
    secondary: {
      main: '#183B4E', // Official brand secondary
      light: '#2F5268',
      dark: '#102834',
      50: '#E6EBEE',
      100: '#CCD7DD',
      200: '#99AFBB',
      300: '#668799',
      400: '#335F77',
      500: '#183B4E',
      600: '#153446',
      700: '#122C3E',
      800: '#0F2536',
      900: '#0C1D2E'
    },
    semantic: {
      success: '#22C55E',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#0EA5E9'
    },
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717'
    }
  },
  typography: {
    fonts: {
      arabic: 'Tajawal, "Noto Sans Arabic", system-ui, sans-serif',
      latin: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },
    sizes: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    }
  },
  spacing: {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem',    // 96px
  },
  radius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
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
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
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
  }
};
