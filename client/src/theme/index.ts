import { extendTheme } from '@chakra-ui/react';

export const theme = {
  colors: {
    primary: {
      50: '#EBF1F7',
      100: '#C8D7EA',
      200: '#A5BEDD',
      300: '#82A4D0',
      400: '#5F8AC3',
      500: '#27548A', // Main primary
      600: '#1F4370',
      700: '#183255',
      800: '#10213B',
      900: '#081120'
    },
    accent: {
      50: '#FDF7EC',
      100: '#F9E9CA',
      200: '#F5DBA8',
      300: '#F1CD86',
      400: '#EDBF64',
      500: '#DDA853', // Main accent
      600: '#B18642',
      700: '#856532',
      800: '#584321',
      900: '#2C2211'
    },
    secondary: {
      50: '#E6ECF0',
      100: '#B3C5D4',
      200: '#809FB8',
      300: '#4D789C',
      400: '#1A5280',
      500: '#183B4E', // Main secondary
      600: '#132F3E',
      700: '#0E232F',
      800: '#09161F',
      900: '#050A10'
    },
    neutral: {
      50: '#F7F7F7',
      100: '#E6E6E6',
      200: '#D4D4D4',
      300: '#C2C2C2',
      400: '#B0B0B0',
      500: '#9E9E9E',
      600: '#7E7E7E',
      700: '#5F5F5F',
      800: '#3F3F3F',
      900: '#1F1F1F'
    }
  },
  fontFamily: {
    arabic: "'Tajawal', 'Almarai', system-ui, -apple-system, sans-serif",
    base: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '2.5rem',  // 40px
    '3xl': '3rem',    // 48px
    '4xl': '4rem'     // 64px
  },
  radii: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
    lg: '0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)',
    xl: '0 15px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.05)',
    inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)'
  },
  animation: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
    spring: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },
  zIndices: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    modal: 1300,
    popover: 1400,
    toast: 1500
  }
};

export default theme;
