import { MoonStar, SunMedium } from "lucide-react";

import { useTheme } from "../context/ThemeContext";


function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn-secondary gap-2"
    >
      {darkMode ? <SunMedium size={16} /> : <MoonStar size={16} />}
      {darkMode ? "Light mode" : "Dark mode"}
    </button>
  );
}

export default ThemeToggle;
