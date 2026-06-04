import { darkTheme, lightTheme } from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type ThemeType = typeof lightTheme;

type ThemeContextType = {
  theme: ThemeType,
  changeTheme: any;
  isDark: boolean
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const STORAGE_KEY = "APP_THEME";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(false);

  const loadTheme = async() => {
    try{
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedTheme == "dark"){
        setIsDark(true);
      }
      if (!savedTheme){
        if (colorScheme == "dark"){
          setIsDark(true);
        }
      }
    }catch(err){
      console.log("Failed to load theme: ", err);
    }
  }

  const changeTheme = async(newTheme: string) => {
    const newThemeIsDark = newTheme == "dark";
    if (newThemeIsDark != isDark){
      console.log("Changed to Dark!");
      setIsDark(newThemeIsDark);
      await AsyncStorage.setItem(STORAGE_KEY, newThemeIsDark ? "dark": "light");
    }
  }

  useEffect(() => {
    console.log("Loading theme....");
    loadTheme();
  }, [colorScheme])

  return (
    <ThemeContext.Provider value={{theme: isDark ? darkTheme : lightTheme, changeTheme, isDark}}>
      {children}
    </ThemeContext.Provider>
  );
}