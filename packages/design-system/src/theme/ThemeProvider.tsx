import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { ThemeColors, ThemeName, themes } from './themes';

interface ThemeContextValue {
  /** Name of the active theme. */
  themeName: ThemeName;
  /** Color tokens for the active theme. Reference these instead of raw hex. */
  colors: ThemeColors;
  /** Switch to a specific theme. */
  setTheme: (name: ThemeName) => void;
  /** Flip between the two built-in themes. */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  /** Theme to start with. Defaults to the dark palette. */
  initialTheme?: ThemeName;
  children: React.ReactNode;
}

/** Provides the active theme to the tree. Changing the theme updates context,
 * so every component reading it via useTheme()/useThemeColors() re-renders
 * instantly with the new tokens. */
export function ThemeProvider({ initialTheme = 'dark', children }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeName>(initialTheme);

  const setTheme = useCallback((name: ThemeName) => setThemeName(name), []);
  const toggleTheme = useCallback(
    () => setThemeName((prev) => (prev === 'dark' ? 'light' : 'dark')),
    [],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ themeName, colors: themes[themeName], setTheme, toggleTheme }),
    [themeName, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Access the full theme context (colors + controls). Must be used within a
 * ThemeProvider. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}

/** Convenience hook for the common case of only needing the color tokens. */
export function useThemeColors(): ThemeColors {
  return useTheme().colors;
}

/** Builds a themed StyleSheet from a factory and rebuilds it whenever the theme
 * changes. Pass a module-level `makeStyles(colors)` so the reference is stable. */
export function useStyles<T>(factory: (colors: ThemeColors) => T): T {
  const colors = useThemeColors();
  return useMemo(() => factory(colors), [colors, factory]);
}
