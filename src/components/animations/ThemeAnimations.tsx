import { useEffect, useRef } from "react";

interface AnimationProps {
  type: 
    | "none"
    | "snowfall" | "frost" | "hearts" | "spring" | "petals" | "sundust" | "clouds" | "rain" | "windyleaves" | "academicdust" | "festivesparks" | "diyas" | "snowsparkle"
    | "valentine" | "diwali" | "christmas" | "holi" | "newyear" | "pongal" | "independence" | "onam" | "navratri" | "eid" | "womensday" | "mothersday"
    | "confetti" | "leaves" | "stars" | "sparkles" | "bubbles" | "butterflies" | "sunrays" | "aurora" | "fireflies" | "fireworks";
  color?: string;
  contained?: boolean;
  loop?: boolean;
}

const ThemeAnimations = ({ type, color = "#ffffff", contained = false, loop = true }: AnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (type === "none" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      if (contained && containerRef.current) {
        const parent = containerRef.current.parentElement;
        if (parent) {
          canvas.width = parent.offsetWidth;
          canvas.height = parent.offsetHeight;
        }
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    updateCanvasSize();

    const particles: any[] = [];
    
    const getParticleCount = () => {
      switch (type) {
        case "snowfall": case "frost": return 80;
        case "hearts": case "valentine": return 25;
        case "spring": return 40;
        case "petals": case "onam": return 45;
        case "sundust": case "pongal": return 60;
        case "clouds": return 15;
        case "rain": return 100;
        case "windyleaves": case "leaves": return 35;
        case "academicdust": return 30;
        case "festivesparks": return 50;
        case "diyas": return 35;
        case "snowsparkle": case "christmas": return 90;
        case "diwali": case "fireworks": return 10;
        case "holi": return 60;
        case "newyear": return 80;
        case "independence": return 50;
        case "navratri": return 40;
        case "eid": return 45;
        case "womensday": case "mothersday": return 40;
        case "sparkles": return 80;
        case "stars": return 50;
        case "bubbles": return 25;
        case "butterflies": return 12;
        case "sunrays": return 12;
        case "aurora": return 3;
        case "fireflies": return 35;
        case "confetti": return 70;
        default: return 30;
      }
    };

    const particleCount = getParticleCount();

    const createParticle = () => {
      const baseParticle = {
        x: Math.random() * canvas.width,
        y: -20,
        size: Math.random() * 8 + 4,
        speedY: Math.random() * 1.5 + 0.5,
        speedX: Math.random() * 1 - 0.5,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 1 - 0.5,
        opacity: Math.random() * 0.4 + 0.2,
      };

      switch (type) {
        case "snowfall":
        case "frost":
          return { 
            ...baseParticle, 
            color: "#ffffff", 
            size: Math.random() * 4 + 1, 
            speedY: Math.random() * 0.6 + 0.2,
            opacity: Math.random() * 0.6 + 0.3,
            drift: Math.random() * Math.PI * 2,
            driftSpeed: Math.random() * 0.015 + 0.008,
            blur: Math.random() > 0.5
          };

        case "hearts":
        case "valentine":
          return { 
            ...baseParticle, 
            color: ["#ff6b8a", "#ff8fa3", "#ffb3c1", "#e05780"][Math.floor(Math.random() * 4)], 
            size: Math.random() * 14 + 8,
            speedY: -(Math.random() * 0.5 + 0.2),
            y: canvas.height + 20,
            opacity: Math.random() * 0.4 + 0.2,
            swing: Math.random() * Math.PI * 2,
            swingSpeed: Math.random() * 0.015 + 0.008,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.03 + 0.02,
            glow: type === "valentine"
          };

        case "spring":
          return { 
            ...baseParticle, 
            color: ["#90be6d", "#b5e48c", "#d8f3dc", "#95d5b2"][Math.floor(Math.random() * 4)], 
            size: Math.random() * 5 + 2,
            speedY: -(Math.random() * 0.4 + 0.2),
            y: canvas.height + 20,
            opacity: Math.random() * 0.5 + 0.2,
            drift: Math.random() * Math.PI * 2,
            driftSpeed: Math.random() * 0.02 + 0.01
          };

        case "petals":
          return { 
            ...baseParticle, 
            color: ["#ffb7c5", "#ffc8dd", "#ffafcc", "#f8bbd0"][Math.floor(Math.random() * 4)], 
            size: Math.random() * 10 + 5,
            speedY: Math.random() * 0.6 + 0.3,
            opacity: Math.random() * 0.4 + 0.2,
            flutter: Math.random() * Math.PI * 2,
            flutterSpeed: Math.random() * 0.04 + 0.02
          };

        case "sundust":
          return { 
            ...baseParticle, 
            color: ["#ffd700", "#ffdf00", "#f9c74f", "#fee440"][Math.floor(Math.random() * 4)], 
            size: Math.random() * 3 + 1,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speedY: Math.random() * 0.2 - 0.1,
            speedX: Math.random() * 0.2 - 0.1,
            opacity: Math.random() * 0.4 + 0.2,
            shimmer: Math.random() * Math.PI * 2,
            shimmerSpeed: Math.random() * 0.02 + 0.01
          };

        case "clouds":
          return { 
            ...baseParticle, 
            color: "rgba(255,255,255,0.3)",
            size: Math.random() * 40 + 25,
            x: -100,
            y: Math.random() * canvas.height * 0.5,
            speedX: Math.random() * 0.3 + 0.1,
            speedY: 0,
            opacity: Math.random() * 0.15 + 0.08
          };

        case "rain":
          return { 
            ...baseParticle, 
            color: "#a8c5d8",
            size: Math.random() * 1.2 + 0.5,
            length: Math.random() * 18 + 12,
            speedY: Math.random() * 10 + 8,
            speedX: Math.random() * 1 - 0.5,
            opacity: Math.random() * 0.25 + 0.1
          };

        case "windyleaves":
        case "leaves":
          return { 
            ...baseParticle, 
            color: ["#6b705c", "#a68a64", "#b68d40", "#936639"][Math.floor(Math.random() * 4)], 
            size: Math.random() * 12 + 6,
            speedY: Math.random() * 1.2 + 0.8,
            speedX: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.3,
            sway: Math.random() * Math.PI * 2,
            swaySpeed: Math.random() * 0.04 + 0.02
          };

        case "academicdust":
          return { 
            ...baseParticle, 
            color: ["#6c757d", "#adb5bd", "#dee2e6"][Math.floor(Math.random() * 3)], 
            size: Math.random() * 2 + 1,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speedY: Math.random() * 0.15 - 0.075,
            speedX: Math.random() * 0.15 - 0.075,
            opacity: Math.random() * 0.3 + 0.1
          };

        case "festivesparks":
          return { 
            ...baseParticle, 
            color: ["#ff6b35", "#f7c59f", "#ffd166", "#ef476f"][Math.floor(Math.random() * 4)], 
            size: Math.random() * 4 + 2,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            life: 1,
            decay: Math.random() * 0.015 + 0.005,
            burstX: (Math.random() - 0.5) * 4,
            burstY: (Math.random() - 0.5) * 4,
            opacity: Math.random() * 0.7 + 0.3
          };

        case "diyas":
          return { 
            ...baseParticle, 
            color: ["#d4a574", "#c9a86c", "#e8b923", "#f4a460"][Math.floor(Math.random() * 4)], 
            size: Math.random() * 4 + 2, 
            speedY: Math.random() * 0.35 + 0.15, 
            y: canvas.height + 20, 
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.04 + 0.02
          };

        case "snowsparkle":
          const isSnow = Math.random() > 0.3;
          return isSnow ? { 
            ...baseParticle, 
            type: "snow",
            color: "#ffffff", 
            size: Math.random() * 4 + 1, 
            speedY: Math.random() * 0.6 + 0.3,
            opacity: Math.random() * 0.6 + 0.3,
            drift: Math.random() * Math.PI * 2,
            driftSpeed: Math.random() * 0.015 + 0.008
          } : {
            ...baseParticle,
            type: "sparkle",
            color: ["#ffffff", "#fffacd", "#f0f8ff"][Math.floor(Math.random() * 3)],
            size: Math.random() * 3 + 1,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.08 + 0.04,
            opacity: Math.random() * 0.5 + 0.3
          };

        case "diwali":
        case "fireworks":
          const explosionColors = [
            ["#ff6b6b", "#ee5a5a", "#ff8585"],
            ["#ffd700", "#ffcc00", "#ffe066"],
            ["#ff9f43", "#ee8832", "#ffbe76"],
            ["#a29bfe", "#8c7ae6", "#b8b0ff"],
            ["#00d2d3", "#01a3a4", "#48dbfb"]
          ];
          const colorSet = explosionColors[Math.floor(Math.random() * explosionColors.length)];
          return { 
            ...baseParticle, 
            colors: colorSet,
            color: colorSet[0],
            x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
            y: canvas.height + 20,
            speedY: -(Math.random() * 5 + 6),
            speedX: (Math.random() - 0.5) * 2,
            exploded: false,
            explosionParticles: [],
            targetY: Math.random() * canvas.height * 0.4 + canvas.height * 0.1,
            size: 3
          };

        case "christmas":
          const isSnowflake = Math.random() > 0.2;
          return isSnowflake ? { 
            ...baseParticle, 
            type: "snowflake",
            color: "#ffffff", 
            size: Math.random() * 5 + 2, 
            speedY: Math.random() * 0.5 + 0.2,
            opacity: Math.random() * 0.6 + 0.3,
            drift: Math.random() * Math.PI * 2,
            driftSpeed: Math.random() * 0.015 + 0.008,
            tint: ["#ffffff", "#f0fff0", "#fff0f0"][Math.floor(Math.random() * 3)]
          } : {
            ...baseParticle,
            type: "star",
            color: ["#ffd700", "#ff6b6b", "#90ee90"][Math.floor(Math.random() * 3)],
            size: Math.random() * 4 + 2,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.05 + 0.03
          };

        case "holi":
          return { 
            ...baseParticle, 
            color: ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#1dd1a1", "#5f27cd"][Math.floor(Math.random() * 6)], 
            size: Math.random() * 15 + 8,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            life: 1,
            decay: Math.random() * 0.008 + 0.003,
            burstX: (Math.random() - 0.5) * 8,
            burstY: (Math.random() - 0.5) * 8 - 2,
            opacity: Math.random() * 0.6 + 0.3
          };

        case "newyear":
          const isConfetti = Math.random() > 0.4;
          return isConfetti ? { 
            ...baseParticle, 
            type: "confetti",
            color: ["#ff69b4", "#ffd700", "#00ff7f", "#ff4500", "#1e90ff", "#ff1493"][Math.floor(Math.random() * 6)], 
            size: Math.random() * 10 + 5,
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 6 - 3,
            opacity: Math.random() * 0.7 + 0.3,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.15 + 0.08,
            shape: Math.floor(Math.random() * 3)
          } : {
            ...baseParticle,
            type: "firework",
            colors: ["#ffd700", "#ff4500", "#ff69b4"],
            color: "#ffd700",
            x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
            y: canvas.height + 20,
            speedY: -(Math.random() * 6 + 7),
            speedX: (Math.random() - 0.5) * 3,
            exploded: false,
            explosionParticles: [],
            targetY: Math.random() * canvas.height * 0.35 + canvas.height * 0.1,
            size: 3
          };

        case "pongal":
          return { 
            ...baseParticle, 
            color: ["#f4a460", "#daa520", "#ffd700", "#f5deb3"][Math.floor(Math.random() * 4)], 
            size: Math.random() * 4 + 2,
            speedY: -(Math.random() * 0.3 + 0.1),
            y: canvas.height + 20,
            opacity: Math.random() * 0.5 + 0.2,
            drift: Math.random() * Math.PI * 2,
            driftSpeed: Math.random() * 0.015 + 0.008
          };

        case "independence":
          const flagColors = ["#ff9933", "#ffffff", "#138808"];
          return { 
            ...baseParticle, 
            color: flagColors[Math.floor(Math.random() * 3)], 
            size: Math.random() * 4 + 2,
            speedY: -(Math.random() * 1.5 + 1),
            y: canvas.height + 20,
            x: Math.random() * canvas.width,
            opacity: Math.random() * 0.6 + 0.3,
            drift: Math.random() * Math.PI * 2,
            driftSpeed: Math.random() * 0.02 + 0.01
          };

        case "onam":
          return { 
            ...baseParticle, 
            color: ["#ff6b6b", "#ffd93d", "#ff9a3c", "#c7f464", "#4cd137", "#9c88ff"][Math.floor(Math.random() * 6)], 
            size: Math.random() * 10 + 6,
            x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.8,
            y: canvas.height / 2 + (Math.random() - 0.5) * canvas.height * 0.6,
            angle: Math.random() * Math.PI * 2,
            radius: Math.random() * 150 + 50,
            angleSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
            opacity: Math.random() * 0.5 + 0.3,
            flutter: Math.random() * Math.PI * 2,
            flutterSpeed: Math.random() * 0.03 + 0.015
          };

        case "navratri":
          return { 
            ...baseParticle, 
            color: ["#ff4757", "#ffa502", "#2ed573", "#1e90ff", "#ff6b81"][Math.floor(Math.random() * 5)], 
            size: Math.random() * 5 + 3,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            angle: Math.random() * Math.PI * 2,
            orbitRadius: Math.random() * 30 + 15,
            orbitSpeed: (Math.random() * 0.03 + 0.02) * (Math.random() > 0.5 ? 1 : -1),
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.05 + 0.03,
            opacity: Math.random() * 0.6 + 0.3
          };

        case "eid":
          const isStar = Math.random() > 0.3;
          return isStar ? { 
            ...baseParticle, 
            type: "star",
            color: ["#ffd700", "#fffacd", "#f0e68c"][Math.floor(Math.random() * 3)], 
            size: Math.random() * 4 + 2,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.7,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.03 + 0.02,
            opacity: Math.random() * 0.5 + 0.3
          } : {
            ...baseParticle,
            type: "crescent",
            color: "#ffd700",
            size: Math.random() * 20 + 15,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.5,
            opacity: Math.random() * 0.3 + 0.15,
            drift: Math.random() * Math.PI * 2,
            driftSpeed: Math.random() * 0.008 + 0.004
          };

        case "womensday":
          const isPetal = Math.random() > 0.4;
          return isPetal ? { 
            ...baseParticle, 
            type: "petal",
            color: ["#ff69b4", "#da70d6", "#ee82ee", "#dda0dd"][Math.floor(Math.random() * 4)], 
            size: Math.random() * 10 + 5,
            speedY: Math.random() * 0.5 + 0.2,
            opacity: Math.random() * 0.4 + 0.2,
            flutter: Math.random() * Math.PI * 2,
            flutterSpeed: Math.random() * 0.03 + 0.015
          } : {
            ...baseParticle,
            type: "sparkle",
            color: ["#ffffff", "#fffacd", "#ffc0cb"][Math.floor(Math.random() * 3)],
            size: Math.random() * 3 + 1,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.06 + 0.03,
            opacity: Math.random() * 0.5 + 0.3
          };

        case "mothersday":
          const isHeart = Math.random() > 0.5;
          return isHeart ? { 
            ...baseParticle, 
            type: "heart",
            color: ["#ff69b4", "#ff1493", "#db7093", "#ffb6c1"][Math.floor(Math.random() * 4)], 
            size: Math.random() * 12 + 6,
            speedY: -(Math.random() * 0.4 + 0.2),
            y: canvas.height + 20,
            opacity: Math.random() * 0.4 + 0.2,
            swing: Math.random() * Math.PI * 2,
            swingSpeed: Math.random() * 0.015 + 0.008
          } : {
            ...baseParticle,
            type: "floral",
            color: ["#ffb7c5", "#e6e6fa", "#f0fff0"][Math.floor(Math.random() * 3)],
            size: Math.random() * 4 + 2,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            opacity: Math.random() * 0.3 + 0.15,
            drift: Math.random() * Math.PI * 2,
            driftSpeed: Math.random() * 0.01 + 0.005
          };

        case "sparkles":
          return { 
            ...baseParticle, 
            color: ["#ffd700", "#ff6600", "#ffffff", "#ff4500"][Math.floor(Math.random() * 4)], 
            size: Math.random() * 5 + 2, 
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            life: 1,
            decay: Math.random() * 0.012 + 0.004,
            twinkle: Math.random() * Math.PI * 2,
            burstX: (Math.random() - 0.5) * 6,
            burstY: (Math.random() - 0.5) * 6
          };

        case "stars":
          return { 
            ...baseParticle, 
            color: "#d4a574", 
            size: Math.random() * 4 + 2, 
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.03 + 0.01
          };

        case "bubbles":
          return { 
            ...baseParticle, 
            color: ["#a8c5d8", "#b8d0e0", "#c8dae8"][Math.floor(Math.random() * 3)],
            size: Math.random() * 15 + 8,
            speedY: -(Math.random() * 0.6 + 0.3),
            y: canvas.height + 30,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.03 + 0.01,
            opacity: Math.random() * 0.25 + 0.1
          };

        case "butterflies":
          return { 
            ...baseParticle, 
            color: ["#e8d0d8", "#d8c0c8", "#c8d8e0", "#e0d8c0"][Math.floor(Math.random() * 4)],
            size: Math.random() * 12 + 8,
            wingPhase: Math.random() * Math.PI * 2,
            wingSpeed: Math.random() * 0.15 + 0.08,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            targetX: Math.random() * canvas.width,
            targetY: Math.random() * canvas.height,
            speed: Math.random() * 0.8 + 0.4,
            opacity: Math.random() * 0.35 + 0.15
          };

        case "sunrays":
          return { 
            ...baseParticle, 
            color: "#d4a574",
            angle: (Math.random() * Math.PI * 0.5) + Math.PI * 0.25,
            length: canvas.height * 1.2,
            opacity: Math.random() * 0.08 + 0.03,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.01 + 0.005
          };

        case "aurora":
          return { 
            ...baseParticle, 
            colors: ["#4a8080", "#5a9090", "#6aa0a0", "#7ab0b0"],
            y: Math.random() * canvas.height * 0.3,
            amplitude: Math.random() * 60 + 30,
            frequency: Math.random() * 0.008 + 0.003,
            phase: Math.random() * Math.PI * 2,
            phaseSpeed: Math.random() * 0.008 + 0.004,
            opacity: Math.random() * 0.15 + 0.05
          };

        case "fireflies":
          return { 
            ...baseParticle, 
            color: "#d4c4a0",
            size: Math.random() * 3 + 1.5,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            targetX: Math.random() * canvas.width,
            targetY: Math.random() * canvas.height,
            glowPhase: Math.random() * Math.PI * 2,
            glowSpeed: Math.random() * 0.04 + 0.02,
            speed: Math.random() * 0.4 + 0.2,
            opacity: Math.random() * 0.5 + 0.3
          };

        case "confetti":
          return { 
            ...baseParticle, 
            color: ["#ff69b4", "#9b59b6", "#f1c40f", "#2ecc71", "#3498db", "#e74c3c"][Math.floor(Math.random() * 6)], 
            size: Math.random() * 10 + 5,
            speedY: Math.random() * 2 + 1,
            speedX: Math.random() * 4 - 2,
            opacity: Math.random() * 0.5 + 0.5,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.15 + 0.05,
            shape: Math.floor(Math.random() * 3)
          };

        default:
          return baseParticle;
      }
    };

    for (let i = 0; i < particleCount; i++) {
      const p = createParticle() as any;
      if (!["bubbles", "diyas", "diwali", "fireworks", "hearts", "valentine", "spring", "pongal", "independence", "mothersday"].includes(type)) {
        if (!p.type || p.type !== "firework") {
          p.y = Math.random() * canvas.height;
        }
      }
      particles.push(p);
    }

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number, rotation: number = 0, glow: boolean = false) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(x, y);
      ctx.rotate(rotation);
      if (glow) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
      }
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, size / 4);
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, size / 4);
      ctx.bezierCurveTo(-size / 2, size / 2, 0, size * 0.75, 0, size);
      ctx.bezierCurveTo(0, size * 0.75, size / 2, size / 2, size / 2, size / 4);
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, size / 4);
      ctx.fill();
      ctx.restore();
    };

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number, points: number = 4) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.shadowBlur = size * 3;
      ctx.shadowColor = color;
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? size : size * 0.4;
        const angle = (i * Math.PI) / points - Math.PI / 2;
        if (i === 0) ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
        else ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawCrescent = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x + size * 0.35, y - size * 0.1, size * 0.75, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        if (p.dead) return;

        switch (type) {
          case "snowfall":
          case "frost":
            p.y += p.speedY;
            p.drift += p.driftSpeed;
            p.x += Math.sin(p.drift) * 0.5;
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            if (p.blur) {
              ctx.shadowBlur = 6;
              ctx.shadowColor = "rgba(255,255,255,0.5)";
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            if (p.y > canvas.height + 10) {
              if (loop) particles[index] = createParticle();
              else p.dead = true;
            }
            break;

          case "hearts":
          case "valentine":
            p.y += p.speedY;
            p.swing += p.swingSpeed;
            p.x += Math.sin(p.swing) * 0.6;
            if (p.pulse) p.pulse += p.pulseSpeed;
            const heartScale = p.pulse ? 1 + Math.sin(p.pulse) * 0.1 : 1;
            drawHeart(ctx, p.x, p.y, p.size * heartScale, p.color, p.opacity, 0, p.glow);
            if (p.y < -20) {
              if (loop) particles[index] = createParticle();
              else p.dead = true;
            }
            break;

          case "spring":
            p.y += p.speedY;
            p.drift += p.driftSpeed;
            p.x += Math.sin(p.drift) * 0.4;
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            if (p.y < -10) {
              if (loop) particles[index] = createParticle();
              else p.dead = true;
            }
            break;

          case "petals":
            p.y += p.speedY;
            p.flutter += p.flutterSpeed;
            p.x += Math.sin(p.flutter) * 1;
            p.rotation += p.rotationSpeed * 1.5;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            if (p.y > canvas.height + 20) {
              if (loop) particles[index] = createParticle();
              else p.dead = true;
            }
            break;

          case "sundust":
            p.shimmer += p.shimmerSpeed;
            p.x += p.speedX;
            p.y += p.speedY;
            const shimmerOpacity = p.opacity * (0.5 + Math.sin(p.shimmer) * 0.5);
            ctx.save();
            ctx.globalAlpha = shimmerOpacity;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            break;

          case "clouds":
            p.x += p.speedX;
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            for (let i = 0; i < 5; i++) {
              ctx.beginPath();
              ctx.arc(p.x + i * p.size * 0.5, p.y + Math.sin(i) * 10, p.size * 0.6, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
            if (p.x > canvas.width + 200) {
              if (loop) {
                p.x = -150;
                p.y = Math.random() * canvas.height * 0.5;
              } else p.dead = true;
            }
            break;

          case "rain":
            p.y += p.speedY;
            p.x += p.speedX;
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.speedX, p.y + p.length);
            ctx.stroke();
            ctx.restore();
            if (p.y > canvas.height) {
              if (loop) particles[index] = createParticle();
              else p.dead = true;
            }
            break;

          case "windyleaves":
          case "leaves":
            p.y += p.speedY;
            p.x += p.speedX;
            p.sway += p.swaySpeed;
            p.x += Math.sin(p.sway) * 1.5;
            p.rotation += p.rotationSpeed * 2;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size / 2.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            if (p.y > canvas.height + 20 || p.x > canvas.width + 50) {
              if (loop) particles[index] = createParticle();
              else p.dead = true;
            }
            break;

          case "academicdust":
            p.x += p.speedX;
            p.y += p.speedY;
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            break;

          case "festivesparks":
            p.life -= p.decay;
            p.x += p.burstX * p.life;
            p.y += p.burstY * p.life;
            p.burstY += 0.05;
            if (p.life > 0) {
              ctx.save();
              ctx.globalAlpha = p.life * p.opacity;
              ctx.fillStyle = p.color;
              ctx.shadowBlur = 12;
              ctx.shadowColor = p.color;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
            if (p.life <= 0) {
              if (loop) particles[index] = createParticle();
              else p.dead = true;
            }
            break;

          case "diyas":
            p.y -= p.speedY;
            p.x += Math.sin(p.y / 30) * 0.25;
            p.pulse += p.pulseSpeed;
            const diyaGlow = 1 + Math.sin(p.pulse) * 0.15;
            ctx.save();
            ctx.shadowBlur = 20;
            ctx.shadowColor = p.color;
            ctx.globalAlpha = p.opacity * (0.7 + Math.sin(p.pulse) * 0.3);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * diyaGlow, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = "#fff8e0";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            if (p.y < -20) {
              if (loop) particles[index] = createParticle();
              else p.dead = true;
            }
            break;

          case "snowsparkle":
            if (p.type === "snow") {
              p.y += p.speedY;
              p.drift += p.driftSpeed;
              p.x += Math.sin(p.drift) * 0.5;
              ctx.save();
              ctx.globalAlpha = p.opacity;
              ctx.fillStyle = p.color;
              ctx.shadowBlur = 4;
              ctx.shadowColor = "rgba(255,255,255,0.5)";
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
              if (p.y > canvas.height + 10) {
                if (loop) particles[index] = createParticle();
                else p.dead = true;
              }
            } else {
              p.twinkle += p.twinkleSpeed;
              const sparkleOp = p.opacity * (0.3 + Math.sin(p.twinkle) * 0.7);
              drawStar(ctx, p.x, p.y, p.size, p.color, sparkleOp);
            }
            break;

          case "diwali":
          case "fireworks":
            if (!p.exploded) {
              p.y += p.speedY;
              p.x += p.speedX;
              p.speedY += 0.08;
              ctx.save();
              ctx.globalAlpha = 0.8;
              ctx.fillStyle = p.color;
              ctx.shadowBlur = 10;
              ctx.shadowColor = p.color;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
              if (p.y <= p.targetY || p.speedY >= 0) {
                p.exploded = true;
                const particleCount = 50 + Math.floor(Math.random() * 30);
                for (let i = 0; i < particleCount; i++) {
                  const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.3;
                  const speed = Math.random() * 4 + 2;
                  p.explosionParticles.push({
                    x: p.x,
                    y: p.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1,
                    color: p.colors[Math.floor(Math.random() * p.colors.length)],
                    size: Math.random() * 2 + 1
                  });
                }
              }
            } else {
              let allDead = true;
              p.explosionParticles.forEach((ep: any) => {
                if (ep.life > 0) {
                  allDead = false;
                  ep.x += ep.vx;
                  ep.y += ep.vy;
                  ep.vy += 0.06;
                  ep.vx *= 0.98;
                  ep.life -= 0.015;
                  ctx.save();
                  ctx.globalAlpha = ep.life * 0.9;
                  ctx.fillStyle = ep.color;
                  ctx.shadowBlur = 8;
                  ctx.shadowColor = ep.color;
                  ctx.beginPath();
                  ctx.arc(ep.x, ep.y, ep.size * ep.life, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.restore();
                }
              });
              if (allDead) {
                if (loop) particles[index] = createParticle();
                else p.dead = true;
              }
            }
            break;

          case "christmas":
            if (p.type === "snowflake") {
              p.y += p.speedY;
              p.drift += p.driftSpeed;
              p.x += Math.sin(p.drift) * 0.5;
              ctx.save();
              ctx.globalAlpha = p.opacity;
              ctx.fillStyle = p.tint || p.color;
              ctx.shadowBlur = 4;
              ctx.shadowColor = "rgba(255,255,255,0.4)";
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
              if (p.y > canvas.height + 10) {
                if (loop) particles[index] = createParticle();
                else p.dead = true;
              }
            } else {
              p.twinkle += p.twinkleSpeed;
              const starOp = p.opacity * (0.4 + Math.sin(p.twinkle) * 0.6);
              drawStar(ctx, p.x, p.y, p.size, p.color, starOp);
            }
            break;

          case "holi":
            p.life -= p.decay;
            p.x += p.burstX * p.life;
            p.y += p.burstY * p.life;
            if (p.life > 0) {
              ctx.save();
              ctx.globalAlpha = p.life * p.opacity;
              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
            if (p.life <= 0) {
              if (loop) particles[index] = createParticle();
              else p.dead = true;
            }
            break;

          case "newyear":
            if (p.type === "confetti") {
              p.y += p.speedY;
              p.x += p.speedX;
              p.wobble += p.wobbleSpeed;
              p.x += Math.sin(p.wobble) * 2;
              p.rotation += p.rotationSpeed * 5;
              p.speedY += 0.03;
              ctx.save();
              ctx.translate(p.x, p.y);
              ctx.rotate((p.rotation * Math.PI) / 180);
              ctx.fillStyle = p.color;
              ctx.globalAlpha = p.opacity;
              ctx.shadowBlur = 6;
              ctx.shadowColor = p.color;
              if (p.shape === 0) ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
              else if (p.shape === 1) {
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
              } else {
                ctx.beginPath();
                ctx.moveTo(0, -p.size / 2);
                ctx.lineTo(p.size / 2, p.size / 2);
                ctx.lineTo(-p.size / 2, p.size / 2);
                ctx.closePath();
                ctx.fill();
              }
              ctx.restore();
              if (p.y > canvas.height + 20) {
                if (loop) particles[index] = createParticle();
                else p.dead = true;
              }
            } else {
              if (!p.exploded) {
                p.y += p.speedY;
                p.x += p.speedX;
                p.speedY += 0.1;
                ctx.save();
                ctx.globalAlpha = 0.9;
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 12;
                ctx.shadowColor = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                if (p.y <= p.targetY || p.speedY >= 0) {
                  p.exploded = true;
                  for (let i = 0; i < 60; i++) {
                    const angle = (Math.PI * 2 * i) / 60;
                    const speed = Math.random() * 5 + 3;
                    p.explosionParticles.push({
                      x: p.x, y: p.y,
                      vx: Math.cos(angle) * speed,
                      vy: Math.sin(angle) * speed,
                      life: 1,
                      color: p.colors[Math.floor(Math.random() * p.colors.length)],
                      size: Math.random() * 2.5 + 1
                    });
                  }
                }
              } else {
                let allDead = true;
                p.explosionParticles.forEach((ep: any) => {
                  if (ep.life > 0) {
                    allDead = false;
                    ep.x += ep.vx;
                    ep.y += ep.vy;
                    ep.vy += 0.08;
                    ep.life -= 0.018;
                    ctx.save();
                    ctx.globalAlpha = ep.life;
                    ctx.fillStyle = ep.color;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = ep.color;
                    ctx.beginPath();
                    ctx.arc(ep.x, ep.y, ep.size * ep.life, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                  }
                });
                if (allDead) {
                  if (loop) particles[index] = createParticle();
                  else p.dead = true;
                }
              }
            }
            break;

          case "pongal":
            p.y += p.speedY;
            p.drift += p.driftSpeed;
            p.x += Math.sin(p.drift) * 0.3;
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            if (p.y < -10) {
              if (loop) particles[index] = createParticle();
              else p.dead = true;
            }
            break;

          case "independence":
            p.y += p.speedY;
            p.drift += p.driftSpeed;
            p.x += Math.sin(p.drift) * 0.8;
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            if (p.y < -10) {
              if (loop) particles[index] = createParticle();
              else p.dead = true;
            }
            break;

          case "onam":
            p.angle += p.angleSpeed;
            p.flutter += p.flutterSpeed;
            const onamX = canvas.width / 2 + Math.cos(p.angle) * p.radius;
            const onamY = canvas.height / 2 + Math.sin(p.angle) * p.radius * 0.6;
            p.x += (onamX - p.x) * 0.02;
            p.y += (onamY - p.y) * 0.02;
            p.rotation += p.rotationSpeed;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            break;

          case "navratri":
            p.angle += p.orbitSpeed;
            p.pulse += p.pulseSpeed;
            const navX = p.x + Math.cos(p.angle) * p.orbitRadius;
            const navY = p.y + Math.sin(p.angle) * p.orbitRadius;
            const navGlow = 0.5 + Math.sin(p.pulse) * 0.5;
            ctx.save();
            ctx.globalAlpha = p.opacity * navGlow;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(navX, navY, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            break;

          case "eid":
            if (p.type === "star") {
              p.twinkle += p.twinkleSpeed;
              const eidStarOp = p.opacity * (0.4 + Math.sin(p.twinkle) * 0.6);
              drawStar(ctx, p.x, p.y, p.size, p.color, eidStarOp);
            } else {
              p.drift += p.driftSpeed;
              p.x += Math.sin(p.drift) * 0.2;
              p.y += Math.cos(p.drift) * 0.1;
              drawCrescent(ctx, p.x, p.y, p.size, p.color, p.opacity);
            }
            break;

          case "womensday":
            if (p.type === "petal") {
              p.y += p.speedY;
              p.flutter += p.flutterSpeed;
              p.x += Math.sin(p.flutter) * 0.8;
              p.rotation += p.rotationSpeed;
              ctx.save();
              ctx.translate(p.x, p.y);
              ctx.rotate((p.rotation * Math.PI) / 180);
              ctx.fillStyle = p.color;
              ctx.globalAlpha = p.opacity;
              ctx.beginPath();
              ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
              if (p.y > canvas.height + 20) {
                if (loop) particles[index] = createParticle();
                else p.dead = true;
              }
            } else {
              p.twinkle += p.twinkleSpeed;
              const wdSparkle = p.opacity * (0.3 + Math.sin(p.twinkle) * 0.7);
              ctx.save();
              ctx.globalAlpha = wdSparkle;
              ctx.fillStyle = p.color;
              ctx.shadowBlur = 10;
              ctx.shadowColor = p.color;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
            break;

          case "mothersday":
            if (p.type === "heart") {
              p.y += p.speedY;
              p.swing += p.swingSpeed;
              p.x += Math.sin(p.swing) * 0.5;
              drawHeart(ctx, p.x, p.y, p.size, p.color, p.opacity);
              if (p.y < -20) {
                if (loop) particles[index] = createParticle();
                else p.dead = true;
              }
            } else {
              p.drift += p.driftSpeed;
              p.x += Math.sin(p.drift) * 0.3;
              p.y += Math.cos(p.drift) * 0.2;
              ctx.save();
              ctx.globalAlpha = p.opacity;
              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
            break;

          case "sparkles":
            p.twinkle += 0.12;
            p.life -= p.decay;
            p.x += p.burstX * p.life;
            p.y += p.burstY * p.life;
            p.burstY += 0.08;
            if (p.life > 0) {
              const sparkleOpacity = p.life * (0.6 + Math.sin(p.twinkle) * 0.4);
              ctx.save();
              ctx.shadowBlur = 20;
              ctx.shadowColor = p.color;
              ctx.globalAlpha = sparkleOpacity * 0.9;
              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.arc(p.x, p.y, Math.max(0.1, p.size * p.life * 1.5), 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
            if (p.life <= 0) {
              if (loop) particles[index] = createParticle();
              else p.dead = true;
            }
            break;

          case "stars":
            p.twinkle += p.twinkleSpeed;
            const starOpacity = 0.2 + Math.sin(p.twinkle) * 0.3;
            drawStar(ctx, p.x, p.y, p.size, p.color, starOpacity);
            break;

          case "bubbles":
            p.y += p.speedY;
            p.wobble += p.wobbleSpeed;
            p.x += Math.sin(p.wobble) * 0.4;
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = p.opacity * 0.5;
            ctx.fillStyle = "rgba(255,255,255,0.3)";
            ctx.beginPath();
            ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.15, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            if (p.y < -p.size) {
              if (loop) particles[index] = createParticle();
              else p.dead = true;
            }
            break;

          case "butterflies":
            p.wingPhase += p.wingSpeed;
            const bDx = p.targetX - p.x;
            const bDy = p.targetY - p.y;
            const bDist = Math.sqrt(bDx * bDx + bDy * bDy);
            if (bDist < 30 || bDist === 0) {
              p.targetX = Math.random() * canvas.width;
              p.targetY = Math.random() * canvas.height;
            } else {
              p.x += (bDx / bDist) * p.speed + Math.sin(p.wingPhase * 0.5) * 0.5;
              p.y += (bDy / bDist) * p.speed + Math.cos(p.wingPhase * 0.3) * 0.3;
            }
            const wingScale = 0.6 + Math.sin(p.wingPhase) * 0.4;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(-p.size * 0.5 * wingScale, -p.size * 0.1, p.size * 0.6, p.size * 0.35, -0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(p.size * 0.5 * wingScale, -p.size * 0.1, p.size * 0.6, p.size * 0.35, 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(80,60,50,0.6)";
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 0.08, p.size * 0.25, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            break;

          case "sunrays":
            p.pulse += p.pulseSpeed;
            const rayAlpha = p.opacity * (0.6 + Math.sin(p.pulse) * 0.4);
            ctx.save();
            ctx.globalAlpha = rayAlpha;
            const rayGrad = ctx.createLinearGradient(0, 0, Math.cos(p.angle) * p.length, Math.sin(p.angle) * p.length);
            rayGrad.addColorStop(0, `rgba(212,165,116,${rayAlpha})`);
            rayGrad.addColorStop(1, "rgba(212,165,116,0)");
            ctx.fillStyle = rayGrad;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(p.angle - 0.08) * p.length, Math.sin(p.angle - 0.08) * p.length);
            ctx.lineTo(Math.cos(p.angle + 0.08) * p.length, Math.sin(p.angle + 0.08) * p.length);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            break;

          case "aurora":
            p.phase += p.phaseSpeed;
            ctx.save();
            ctx.globalAlpha = p.opacity;
            for (let i = 0; i < p.colors.length; i++) {
              ctx.beginPath();
              ctx.moveTo(0, p.y + i * 25);
              for (let x = 0; x <= canvas.width; x += 8) {
                const waveY = p.y + i * 25 + Math.sin(x * p.frequency + p.phase + i * 0.5) * p.amplitude;
                ctx.lineTo(x, waveY);
              }
              ctx.lineTo(canvas.width, canvas.height * 0.6);
              ctx.lineTo(0, canvas.height * 0.6);
              ctx.closePath();
              const auroraGrad = ctx.createLinearGradient(0, p.y, 0, canvas.height * 0.6);
              auroraGrad.addColorStop(0, p.colors[i]);
              auroraGrad.addColorStop(1, "transparent");
              ctx.fillStyle = auroraGrad;
              ctx.fill();
            }
            ctx.restore();
            break;

          case "fireflies":
            p.glowPhase += p.glowSpeed;
            const fDx = p.targetX - p.x;
            const fDy = p.targetY - p.y;
            const fDist = Math.sqrt(fDx * fDx + fDy * fDy);
            if (fDist < 15 || isNaN(fDist) || fDist === 0) {
              p.targetX = Math.random() * canvas.width;
              p.targetY = Math.random() * canvas.height;
            } else {
              p.x += (fDx / fDist) * p.speed;
              p.y += (fDy / fDist) * p.speed;
            }
            const fireflyGlow = 0.3 + Math.sin(p.glowPhase) * 0.7;
            ctx.save();
            ctx.globalAlpha = p.opacity * fireflyGlow;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            break;

          case "confetti":
            p.y += p.speedY;
            p.x += p.speedX;
            p.wobble += p.wobbleSpeed;
            p.x += Math.sin(p.wobble) * 2;
            p.rotation += p.rotationSpeed * 5;
            p.speedY += 0.02;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            if (p.shape === 0) ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            else if (p.shape === 1) {
              ctx.beginPath();
              ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.beginPath();
              ctx.moveTo(0, -p.size / 2);
              ctx.lineTo(p.size / 2, p.size / 2);
              ctx.lineTo(-p.size / 2, p.size / 2);
              ctx.closePath();
              ctx.fill();
            }
            ctx.restore();
            if (p.y > canvas.height + 20) {
              if (loop) particles[index] = createParticle();
              else p.dead = true;
            }
            break;
        }
      });

      const allDead = !loop && particles.every(p => p.dead);
      if (!allDead) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [type, color, contained, loop]);

  if (type === "none") return null;

  return (
    <div
      ref={containerRef}
      className={`${contained ? "absolute inset-0" : "fixed inset-0"} pointer-events-none z-50`}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default ThemeAnimations;
