import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface FestivalTheme {
  id: string;
  name: string;
  type: "festival" | "month" | "event";
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    textColor: string;
    overlayColor: string;
    overlayOpacity: number;
  };
  animation: "none" | "confetti" | "hearts" | "snowfall" | "fireworks" | "leaves" | "petals" | "diyas" | "stars" | "bubbles" | "rain" | "butterflies" | "sunrays" | "aurora" | "fireflies";
  heroOverlay?: string;
  heroGradient?: string;
  bannerText?: string;
  bannerIcon?: string;
}

interface ThemeContextType {
  activeTheme: FestivalTheme | null;
  allThemes: FestivalTheme[];
  loading: boolean;
}

const defaultTheme: FestivalTheme = {
  id: "default",
  name: "Default",
  type: "month",
  startDate: "",
  endDate: "",
  isActive: false,
  priority: 0,
  colors: {
    primary: "#D4A574",
    secondary: "#8B7355",
    accent: "#C9A86C",
    textColor: "#FFFFFF",
    overlayColor: "#000000",
    overlayOpacity: 0.4,
  },
  animation: "none",
};

const ThemeContext = createContext<ThemeContextType>({
  activeTheme: null,
  allThemes: [],
  loading: true,
});

export const useTheme = () => useContext(ThemeContext);

const isDateInRange = (startDate: string, endDate: string): boolean => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  return now >= start && now <= end;
};

const hexToHSL = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "180 35% 17%";
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

const DEFAULT_PRIMARY_HSL = "180 35% 17%";
const DEFAULT_ACCENT_HSL = "28 45% 65%";

const applyThemeColors = (theme: FestivalTheme | null) => {
  const root = document.documentElement;
  
  if (theme) {
    root.style.setProperty('--theme-hero-primary', theme.colors.primary);
    root.style.setProperty('--theme-hero-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-hero-accent', theme.colors.accent);
    root.style.setProperty('--theme-hero-text', theme.colors.textColor);
    
    root.style.setProperty('--primary', hexToHSL(theme.colors.primary));
    root.style.setProperty('--accent', hexToHSL(theme.colors.accent));
    root.setAttribute('data-theme-active', 'true');
  } else {
    root.style.setProperty('--theme-hero-primary', '#1a4d4d');
    root.style.setProperty('--theme-hero-secondary', '#8B7355');
    root.style.setProperty('--theme-hero-accent', '#C9A86C');
    root.style.setProperty('--theme-hero-text', '#FFFFFF');
    
    root.style.setProperty('--primary', DEFAULT_PRIMARY_HSL);
    root.style.setProperty('--accent', DEFAULT_ACCENT_HSL);
    root.removeAttribute('data-theme-active');
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [allThemes, setAllThemes] = useState<FestivalTheme[]>([]);
  const [activeTheme, setActiveTheme] = useState<FestivalTheme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applyThemeColors(activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    const themesRef = collection(db, "festivalThemes");
    const q = query(themesRef, orderBy("priority", "desc"));

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const themesData: FestivalTheme[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          themesData.push({
            id: doc.id,
            name: data.name || "",
            type: data.type || "event",
            startDate: data.startDate || "",
            endDate: data.endDate || "",
            isActive: data.isActive || false,
            priority: data.priority || 0,
            colors: {
              primary: data.colors?.primary || defaultTheme.colors.primary,
              secondary: data.colors?.secondary || defaultTheme.colors.secondary,
              accent: data.colors?.accent || defaultTheme.colors.accent,
              textColor: data.colors?.textColor || defaultTheme.colors.textColor,
              overlayColor: data.colors?.overlayColor || defaultTheme.colors.overlayColor,
              overlayOpacity: data.colors?.overlayOpacity ?? defaultTheme.colors.overlayOpacity,
            },
            animation: data.animation || "none",
            heroOverlay: data.heroOverlay || "",
            heroGradient: data.heroGradient || "",
            bannerText: data.bannerText || "",
            bannerIcon: data.bannerIcon || "",
          });
        });

        setAllThemes(themesData);

        const now = new Date();
        const activeThemes = themesData.filter(
          (theme) => theme.isActive && isDateInRange(theme.startDate, theme.endDate)
        );

        if (activeThemes.length > 0) {
          activeThemes.sort((a, b) => b.priority - a.priority);
          setActiveTheme(activeThemes[0]);
        } else {
          setActiveTheme(null);
        }

        setLoading(false);
      },
      (error) => {
        console.error("Error fetching themes:", error);
        setActiveTheme(null);
        setAllThemes([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <ThemeContext.Provider value={{ activeTheme, allThemes, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};
