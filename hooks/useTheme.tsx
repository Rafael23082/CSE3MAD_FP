import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("Unable to load theme context");
  }

  return context;
}