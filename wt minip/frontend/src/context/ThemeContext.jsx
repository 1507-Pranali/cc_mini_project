import { createContext, useContext, useEffect, useState } from "react";


const ThemeContext = createContext(null);


export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const value = {
    darkMode,
    toggleTheme: () => setDarkMode((current) => !current),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}


export function useTheme() {
  return useContext(ThemeContext);
}
