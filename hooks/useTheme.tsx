import { ThemeContext } from "@/context/ThemeContext";
import { use } from "react";

export function useTheme() {
  const context = use(ThemeContext);

  if (!context) {
    throw new Error("Unable to load theme context");
  }

  return context;
}