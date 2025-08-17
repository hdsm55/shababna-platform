// الألوان الرسمية لمنصة شبابنا العالمية
// مبنية على الألوان المعتمدة في الهوية البصرية فقط
export const brandColors = {
  // الألوان الأساسية من الهوية المعتمدة
  primary: {
    50: '#e6f0f8',
    100: '#cce1f1',
    200: '#99c3e3',
    300: '#66a5d5',
    400: '#3387c7',
    500: '#27548A', // YInMn Blue - اللون الأساسي
    600: '#1f436e',
    700: '#173252',
    800: '#0f2136',
    900: '#003362', // Dark Midnight Blue
  },

  // اللون الثانوي - Japanese Indigo
  secondary: {
    50: '#e8f0f4',
    100: '#d1e1e9',
    200: '#a3c3d3',
    300: '#75a5bd',
    400: '#4787a7',
    500: '#183B4E', // Japanese Indigo - اللون الثانوي
    600: '#132f3e',
    700: '#0e232e',
    800: '#0a171f',
    900: '#050b0f',
  },

  // اللون المميز - Indian Yellow
  accent: {
    50: '#fef8f0',
    100: '#fdf1e1',
    200: '#fbe3c3',
    300: '#f9d5a5',
    400: '#f7c787',
    500: '#DDA853', // Indian Yellow - اللون المميز
    600: '#b18642',
    700: '#856432',
    800: '#594221',
    900: '#2c2111',
  },

  // اللون المحايد - Beige
  neutral: {
    50: '#fefefd',
    100: '#fdfdfb',
    200: '#fbfbf7',
    300: '#f9f9f3',
    400: '#f7f7ef',
    500: '#F3F3E0', // Beige - اللون المحايد
    600: '#c2c2b3',
    700: '#919186',
    800: '#606159',
    900: '#30302c',
  },

  // اللون الداكن - Dark Midnight Blue (بديل للأسود)
  dark: {
    50: '#e6f0f8',
    100: '#cce1f1',
    200: '#99c3e3',
    300: '#66a5d5',
    400: '#3387c7',
    500: '#003362', // Dark Midnight Blue - بديل للأسود
    600: '#002a52',
    700: '#002042',
    800: '#001631',
    900: '#000c21',
  },

  // ألوان الحالة - مبنية على الألوان الأساسية
  success: {
    50: '#e8f0f4',
    100: '#d1e1e9',
    200: '#a3c3d3',
    300: '#75a5bd',
    400: '#4787a7',
    500: '#183B4E', // Japanese Indigo
    600: '#132f3e',
    700: '#0e232e',
    800: '#0a171f',
    900: '#050b0f',
  },

  warning: {
    50: '#fef8f0',
    100: '#fdf1e1',
    200: '#fbe3c3',
    300: '#f9d5a5',
    400: '#f7c787',
    500: '#DDA853', // Indian Yellow
    600: '#b18642',
    700: '#856432',
    800: '#594221',
    900: '#2c2111',
  },

  error: {
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

  info: {
    50: '#e6f0f8',
    100: '#cce1f1',
    200: '#99c3e3',
    300: '#66a5d5',
    400: '#3387c7',
    500: '#27548A', // YInMn Blue
    600: '#1f436e',
    700: '#173252',
    800: '#0f2136',
    900: '#003362',
  },
};

// متدرجات الألوان الرسمية - مبنية على الألوان المعتمدة فقط
export const brandGradients = {
  primary: 'linear-gradient(135deg, #27548A 0%, #003362 100%)',
  secondary: 'linear-gradient(135deg, #183B4E 0%, #0e232e 100%)',
  accent: 'linear-gradient(135deg, #DDA853 0%, #b18642 100%)',
  hero: 'linear-gradient(135deg, #27548A 0%, #183B4E 50%, #003362 100%)',
  card: 'linear-gradient(135deg, #ffffff 0%, #F3F3E0 100%)',
  dark: 'linear-gradient(135deg, #003362 0%, #183B4E 100%)',
  light: 'linear-gradient(135deg, #F3F3E0 0%, #ffffff 100%)',
  overlay: 'linear-gradient(135deg, #003362 0%, #183B4E 50%, #27548A 100%)',
  text: 'linear-gradient(135deg, #27548A 0%, #DDA853 100%)',
};

// أحجام الخطوط الرسمية - نظام موحد
export const typography = {
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
  },
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// المسافات الرسمية - نظام موحد
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
  '5xl': '8rem',   // 128px
};

// الظلال الرسمية - مبنية على الألوان المعتمدة
export const shadows = {
  sm: '0 1px 2px 0 rgba(39, 84, 138, 0.05)',
  md: '0 4px 6px -1px rgba(39, 84, 138, 0.1), 0 2px 4px -1px rgba(39, 84, 138, 0.06)',
  lg: '0 10px 15px -3px rgba(39, 84, 138, 0.1), 0 4px 6px -2px rgba(39, 84, 138, 0.05)',
  xl: '0 20px 25px -5px rgba(39, 84, 138, 0.1), 0 10px 10px -5px rgba(39, 84, 138, 0.04)',
  '2xl': '0 25px 50px -12px rgba(39, 84, 138, 0.25)',
};

// أحجام المكونات الرسمية
export const componentSizes = {
  button: {
    sm: { px: '0.5rem', py: '0.25rem', text: '0.75rem' },
    md: { px: '0.75rem', py: '0.5rem', text: '0.875rem' },
    lg: { px: '1rem', py: '0.75rem', text: '1rem' },
    xl: { px: '1.5rem', py: '1rem', text: '1.125rem' },
  },
  card: {
    sm: { p: '1rem', gap: '0.5rem' },
    md: { p: '1.5rem', gap: '0.75rem' },
    lg: { p: '2rem', gap: '1rem' },
    xl: { p: '2.5rem', gap: '1.25rem' },
  },
  icon: {
    sm: '1rem',    // 16px
    md: '1.25rem', // 20px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
  },
};

// نقاط التوقف للتصميم المتجاوب
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// دوال مساعدة للحصول على الألوان
export const getColor = (color: string, shade: number = 500) => {
  const colorMap: any = brandColors;
  return colorMap[color]?.[shade] || colorMap.primary[500];
};

export const getGradient = (gradient: string) => {
  const gradientMap: any = brandGradients;
  return gradientMap[gradient] || gradientMap.primary;
};

// تصدير النظام الكامل
export default {
  colors: brandColors,
  gradients: brandGradients,
  typography,
  spacing,
  shadows,
  componentSizes,
  breakpoints,
  getColor,
  getGradient,
};
