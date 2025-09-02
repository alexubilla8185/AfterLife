import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Theme = 'light' | 'dark';

// Helper function to convert hex to HSL
const hexToHsl = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [173, 81, 40]; // Fallback to Teal

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
};

// Based on Tailwind's typical lightness scale for a balanced palette
const lightnessMap: { [key: number]: number } = {
    50: 95, 100: 89, 200: 81, 300: 71, 400: 62,
    500: 54, 600: 48, 700: 42, 800: 35, 900: 30, 950: 17
};

interface ThemeContextType {
  theme: Theme;
  accentColor: string;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: string) => void;
  randomizeTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>('light');
    const [accentColor, setAccentColorState] = useState<string>('#14b8a6'); // Default Teal

    useEffect(() => {
        const storedTheme = window.localStorage.getItem('theme') as Theme;
        const storedAccentColor = window.localStorage.getItem('accentColor');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        setThemeState(storedTheme || (prefersDark ? 'dark' : 'light'));
        setAccentColorState(storedAccentColor || '#14b8a6');
    }, []);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const setAccentColor = (color: string) => {
        setAccentColorState(color);
    }

    const randomizeTheme = useCallback(() => {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        setAccentColorState(randomColor);
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        
        // Handle light/dark mode
        if (theme === 'dark') {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }

        // Handle accent color
        const [h, s] = hexToHsl(accentColor);
        Object.entries(lightnessMap).forEach(([shade, lightness]) => {
            root.style.setProperty(`--color-primary-${shade}`, `${h.toFixed(0)} ${s.toFixed(0)}% ${lightness}%`);
        });
        localStorage.setItem('accentColor', accentColor);

    }, [theme, accentColor]);

    return (
        <ThemeContext.Provider value={{ theme, accentColor, setTheme, setAccentColor, randomizeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};