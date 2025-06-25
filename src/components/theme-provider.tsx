import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: "dark" | "light"
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  actualTheme: "light",
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "onlycat-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme
    } catch {
      return defaultTheme
    }
  })
  const [actualTheme, setActualTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return "light"
  })

  useEffect(() => {
    const root = window.document.documentElement
    const body = window.document.body

    // Adiciona classe de transição antes da mudança
    root.classList.add('theme-transitioning')
    body.classList.add('theme-transitioning')

    // Remove all possible theme classes
    root.classList.remove("light", "dark", "system")
    body.classList.remove("light", "dark", "system")
    
    // Clear any existing color scheme
    root.style.colorScheme = ""

    let currentTheme: "dark" | "light" = "light"

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      currentTheme = systemTheme
    } else {
      currentTheme = theme
    }

    // Apply theme classes to both root and body
    root.classList.add(currentTheme)
    body.classList.add(currentTheme)
    
    // Set data attributes for additional styling
    root.setAttribute("data-theme", currentTheme)
    root.setAttribute("data-color-mode", currentTheme)
    
    // Set color scheme for native browser elements
    root.style.colorScheme = currentTheme
    
    // Update actual theme state
    setActualTheme(currentTheme)

    // Remove transition class after animation
    setTimeout(() => {
      root.classList.remove('theme-transitioning')
      body.classList.remove('theme-transitioning')
    }, 300)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        const newSystemTheme = e.matches ? "dark" : "light"
        
        root.classList.add('theme-transitioning')
        body.classList.add('theme-transitioning')
        
        root.classList.remove("light", "dark")
        body.classList.remove("light", "dark")
        root.classList.add(newSystemTheme)
        body.classList.add(newSystemTheme)
        root.setAttribute("data-theme", newSystemTheme)
        root.setAttribute("data-color-mode", newSystemTheme)
        root.style.colorScheme = newSystemTheme
        setActualTheme(newSystemTheme)

        setTimeout(() => {
          root.classList.remove('theme-transitioning')
          body.classList.remove('theme-transitioning')
        }, 300)
      }
    }

    if (theme === "system") {
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])

  const value = {
    theme,
    actualTheme,
    setTheme: (newTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, newTheme)
        setTheme(newTheme)
        
        // Log da mudança de tema para debug
        console.log(`🎨 [ThemeProvider] Tema alterado para: ${newTheme}`)
      } catch (error) {
        console.error("Failed to save theme to localStorage:", error)
        setTheme(newTheme)
      }
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
