import { tokens } from './tokens';

export type Direction = 'ltr' | 'rtl';

export interface ThemeConfig {
  direction: Direction;
  isDarkMode: boolean;
}

export class Theme {
  private static instance: Theme;
  private currentConfig: ThemeConfig = {
    direction: 'rtl',
    isDarkMode: false
  };

  private constructor() {}

  public static getInstance(): Theme {
    if (!Theme.instance) {
      Theme.instance = new Theme();
    }
    return Theme.instance;
  }

  public getConfig(): ThemeConfig {
    return { ...this.currentConfig };
  }

  public updateConfig(config: Partial<ThemeConfig>): void {
    this.currentConfig = {
      ...this.currentConfig,
      ...config
    };
    this.applyTheme();
  }

  public getDirection(): Direction {
    return this.currentConfig.direction;
  }

  public isDarkMode(): boolean {
    return this.currentConfig.isDarkMode;
  }

  private applyTheme(): void {
    const html = document.documentElement;
    const { direction, isDarkMode } = this.currentConfig;

    // Apply direction
    html.dir = direction;
    html.lang = direction === 'rtl' ? 'ar' : 'en';
    html.style.fontFamily = direction === 'rtl' ? tokens.typography.fonts.arabic : tokens.typography.fonts.latin;

    // Apply color scheme
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { direction, isDarkMode }
    }));
  }

  // Helper method to get theme-aware CSS values
  public getValue(key: string, defaultValue?: string): string {
    const value = this.resolveTokenPath(tokens, key);
    return value || defaultValue || '';
  }

  private resolveTokenPath(obj: any, path: string): any {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : null;
    }, obj);
  }
}

// Export singleton instance
export const theme = Theme.getInstance();

// Export tokens for direct access
export { tokens };
