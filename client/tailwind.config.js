/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // تحسين الأداء
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        // الألوان المعتمدة - منصة شبابنا
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
        // ألوان الحالة
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
      },
      fontFamily: {
        'arabic': ['Tajawal', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
        'latin': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand-primary': 'linear-gradient(135deg, #27548A 0%, #003362 100%)',
        'gradient-brand-secondary': 'linear-gradient(135deg, #183B4E 0%, #0e232e 100%)',
        'gradient-brand-accent': 'linear-gradient(135deg, #DDA853 0%, #b18642 100%)',
        'gradient-brand-hero': 'linear-gradient(135deg, #27548A 0%, #183B4E 50%, #003362 100%)',
        'gradient-brand-overlay': 'linear-gradient(135deg, #003362 0%, #183B4E 50%, #27548A 100%)',
        'gradient-brand-light': 'linear-gradient(135deg, #F3F3E0 0%, #ffffff 100%)',
        'gradient-brand-text': 'linear-gradient(135deg, #27548A 0%, #DDA853 100%)',
      },
      boxShadow: {
        // ظلال اللون الأساسي (Primary)
        'brand-sm': '0 1px 2px 0 rgba(39, 84, 138, 0.05)',
        'brand-md': '0 4px 6px -1px rgba(39, 84, 138, 0.1), 0 2px 4px -1px rgba(39, 84, 138, 0.06)',
        'brand-lg': '0 10px 15px -3px rgba(39, 84, 138, 0.1), 0 4px 6px -2px rgba(39, 84, 138, 0.05)',
        'brand-xl': '0 20px 25px -5px rgba(39, 84, 138, 0.1), 0 10px 10px -5px rgba(39, 84, 138, 0.04)',
        'brand-2xl': '0 25px 50px -12px rgba(39, 84, 138, 0.25)',

        // ظلال اللون الثانوي (Secondary)
        'secondary-sm': '0 1px 2px 0 rgba(24, 59, 78, 0.05)',
        'secondary-md': '0 4px 6px -1px rgba(24, 59, 78, 0.1), 0 2px 4px -1px rgba(24, 59, 78, 0.06)',
        'secondary-lg': '0 10px 15px -3px rgba(24, 59, 78, 0.1), 0 4px 6px -2px rgba(24, 59, 78, 0.05)',
        'secondary-xl': '0 20px 25px -5px rgba(24, 59, 78, 0.1), 0 10px 10px -5px rgba(24, 59, 78, 0.04)',
        'secondary-2xl': '0 25px 50px -12px rgba(24, 59, 78, 0.25)',

        // ظلال اللون المميز (Accent)
        'accent-sm': '0 1px 2px 0 rgba(221, 168, 83, 0.05)',
        'accent-md': '0 4px 6px -1px rgba(221, 168, 83, 0.1), 0 2px 4px -1px rgba(221, 168, 83, 0.06)',
        'accent-lg': '0 10px 15px -3px rgba(221, 168, 83, 0.1), 0 4px 6px -2px rgba(221, 168, 83, 0.05)',
        'accent-xl': '0 20px 25px -5px rgba(221, 168, 83, 0.1), 0 10px 10px -5px rgba(221, 168, 83, 0.04)',
        'accent-2xl': '0 25px 50px -12px rgba(221, 168, 83, 0.25)',

        // ظلال تفاعلية
        'brand-hover': '0 20px 25px -5px rgba(39, 84, 138, 0.15), 0 10px 10px -5px rgba(39, 84, 138, 0.06)',
        'secondary-hover': '0 20px 25px -5px rgba(24, 59, 78, 0.15), 0 10px 10px -5px rgba(24, 59, 78, 0.06)',
        'accent-hover': '0 20px 25px -5px rgba(221, 168, 83, 0.15), 0 10px 10px -5px rgba(221, 168, 83, 0.06)',
      },
      animation: {
        'gradient-shift': 'gradientShift 15s ease infinite',
        'floating': 'floating 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        floating: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      // تحسين الأداء
      transitionProperty: {
        'transform': 'transform',
        'opacity': 'opacity',
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'fast': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}