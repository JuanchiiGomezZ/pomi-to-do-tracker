import { useUnistyles, UnistylesRuntime } from "react-native-unistyles";

export type ThemeMode = "light" | "dark" | "system";

export function useTheme() {
  const { theme, rt } = useUnistyles();

  /**
   * Get current theme mode
   * Returns 'system' if adaptive themes are enabled
   * Returns 'light' or 'dark' if manually set
   */
  const getCurrentMode = (): ThemeMode => {
    if (rt.hasAdaptiveThemes) {
      return "system";
    }
    return rt.themeName as "light" | "dark";
  };

  /**
   * Set theme mode
   * @param mode - 'light', 'dark', or 'system'
   */
  const setThemeMode = (mode: ThemeMode) => {
    if (mode === "system") {
      // Enable adaptive themes (follows system)
      UnistylesRuntime.setAdaptiveThemes(true);
    } else {
      // Disable adaptive themes and set manual theme
      if (rt.hasAdaptiveThemes) {
        UnistylesRuntime.setAdaptiveThemes(false);
      }
      UnistylesRuntime.setTheme(mode);
    }
  };

  /**
   * Toggle between light and dark
   * If system mode is active, switches to manual mode first
   */
  const toggleTheme = () => {
    const currentTheme = rt.themeName as "light" | "dark";
    const newTheme = currentTheme === "light" ? "dark" : "light";

    // Disable adaptive if enabled
    if (rt.hasAdaptiveThemes) {
      UnistylesRuntime.setAdaptiveThemes(false);
    }

    UnistylesRuntime.setTheme(newTheme);
  };

  return {
    // Current theme object with colors, spacing, etc.
    theme,

    // Current theme name ('light' | 'dark')
    themeName: rt.themeName as "light" | "dark",

    // Current mode ('light' | 'dark' | 'system')
    mode: getCurrentMode(),

    // Whether adaptive themes (system) is enabled
    isSystemMode: rt.hasAdaptiveThemes,

    // Actions
    setThemeMode,
    toggleTheme,
    setLight: () => setThemeMode("light"),
    setDark: () => setThemeMode("dark"),
    setSystem: () => setThemeMode("system"),
  };
}
