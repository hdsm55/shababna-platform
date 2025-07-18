import React, { createContext, useContext, useEffect } from 'react';
import { theme, ThemeConfig } from '../theme/theme';
import { useTheme } from '../hooks/useTheme';

interface ThemeContextValue extends ThemeConfig {
  updateTheme: (config: Partial<ThemeConfig>) => void;
  isRTL: boolean;
  getValue: (key: string, defaultValue?: string) => string;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialConfig?: Partial<ThemeConfig>;
}

export function ThemeProvider({ children, initialConfig }: ThemeProviderProps) {
  const themeState = useTheme();

  useEffect(() => {
    if (initialConfig) {
      theme.updateConfig(initialConfig);
    }
  }, [initialConfig]);

  return (
    <ThemeContext.Provider value={themeState}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

// Example usage:
/*
function App() {
  return (
    <ThemeProvider initialConfig={{ direction: 'rtl', isDarkMode: false }}>
      <YourApp />
    </ThemeProvider>
  );
}

function YourComponent() {
  const { direction, isDarkMode, isRTL, updateTheme, getValue } = useThemeContext();

  return (
    <div className={`${isRTL ? 'rtl' : 'ltr'}`}>
      <button
        onClick={() => updateTheme({ isDarkMode: !isDarkMode })}
        style={{ backgroundColor: getValue('colors.primary.main') }}
      >
        Toggle Dark Mode
      </button>
    </div>
  );
}
*/
