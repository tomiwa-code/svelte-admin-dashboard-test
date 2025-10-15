import { writable } from "svelte/store";

// Get initial theme based on localStorage or system preference
const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("theme");
    if (stored) return stored;

    // Check system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
  }
  return "light";
};

const createThemeStore = () => {
  const { subscribe, set, update } = writable(getInitialTheme());

  return {
    subscribe,
    toggleTheme: () =>
      update((current) => {
        const newTheme = current === "light" ? "dark" : "light";
        if (typeof window !== "undefined") {
          localStorage.setItem("theme", newTheme);
        }
        return newTheme;
      }),
    setTheme: (theme: "light" | "dark") => {
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", theme);
      }
      set(theme);
    },
  };
};

export const theme = createThemeStore();
