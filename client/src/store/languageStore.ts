import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  language: 'ar' | 'en' | 'tr';
  isRTL: boolean;
  setLanguage: (lang: 'ar' | 'en' | 'tr') => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'ar',
      isRTL: true,
      setLanguage: (lang) => set({ 
        language: lang, 
        isRTL: lang === 'ar' 
      }),
    }),
    {
      name: 'language-storage',
    }
  )
);