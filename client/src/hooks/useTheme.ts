import { useEffect, useState } from 'react';
import { theme, ThemeConfig } from '../theme/theme';

export function useTheme() {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(theme.getConfig());

  useEffect(() => {
    const handleThemeChange = (event: CustomEvent<ThemeConfig>) => {
      setThemeConfig(event.detail);
    };

    // Listen for theme changes
    window.addEventListener('themechange', handleThemeChange as EventListener);

    return () => {
      window.removeEventListener('themechange', handleThemeChange as EventListener);
    };
  }, []);

  const updateTheme = (config: Partial<ThemeConfig>) => {
    theme.updateConfig(config);
  };

  return {
    ...themeConfig,
    updateTheme,
    isRTL: themeConfig.direction === 'rtl',
    getValue: theme.getValue.bind(theme)
  };
}

// Export theme instance for direct access when hooks aren't available
export { theme };
