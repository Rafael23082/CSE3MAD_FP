import { darkTheme, lightTheme } from "@/theme/colors";
import { createContext, ReactNode } from "react";
import { useColorScheme } from "react-native";

type ThemeContextType = typeof darkTheme;

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}