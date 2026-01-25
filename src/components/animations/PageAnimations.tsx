import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeAnimations from "./ThemeAnimations";

const PageAnimations = () => {
  const location = useLocation();
  const { activeTheme } = useTheme();
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (location.pathname === "/" || location.pathname.startsWith("/admin")) {
      setShowAnimation(false);
      return;
    }

    if (activeTheme && activeTheme.animation !== "none") {
      setShowAnimation(true);
      setAnimationKey(prev => prev + 1);
    } else {
      setShowAnimation(false);
    }
  }, [location.pathname, activeTheme]);

  if (!showAnimation || !activeTheme || activeTheme.animation === "none") {
    return null;
  }

  return (
    <ThemeAnimations
      key={animationKey}
      type={activeTheme.animation as any}
      color={activeTheme.colors.primary}
      contained={false}
      loop={false}
    />
  );
};

export default PageAnimations;
