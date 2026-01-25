import { useEffect, useRef } from "react";

interface AnimationProps {
  type: "confetti" | "hearts" | "snowfall" | "fireworks" | "leaves" | "petals" | "diyas" | "stars" | "sparkles" | "bubbles" | "rain" | "butterflies" | "sunrays" | "aurora" | "fireflies" | "none";
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
        case "snowfall": return 80;
        case "hearts": return 18;
        case "sparkles": return 80;
        case "diyas": return 30;
        case "bubbles": return 25;
        case "rain": return 100;
        case "butterflies": return 10;
        case "sunrays": return 12;
        case "aurora": return 3;
        case "fireflies": return 35;
        case "confetti": return 70;
        case "leaves": return 30;
        case "petals": return 40;
        case "stars": return 50;
        case "fireworks": return 8;
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
        case "hearts":
          return { 
            ...baseParticle, 
            color: ["#e8a0b0", "#d4838f", "#c97a87", "#b86b7a"][Math.floor(Math.random() * 4)], 
            size: Math.random() * 12 + 8,
            speedY: Math.random() * 0.8 + 0.3,
            opacity: Math.random() * 0.3 + 0.15,
            swing: Math.random() * Math.PI * 2,
            swingSpeed: Math.random() * 0.02 + 0.01
          };
        case "snowfall":
          return { 
            ...baseParticle, 
            color: "#ffffff", 
            size: Math.random() * 4 + 1, 
            speedY: Math.random() * 0.8 + 0.3,
            opacity: Math.random() * 0.5 + 0.3,
            drift: Math.random() * Math.PI * 2,
            driftSpeed: Math.random() * 0.02 + 0.01
          };
        case "confetti":
          return { 
            ...baseParticle, 
            color: ["#ff69b4", "#9b59b6", "#f1c40f", "#2ecc71", "#3498db", "#e74c3c", "#ff6b6b", "#a29bfe"][Math.floor(Math.random() * 8)], 
            size: Math.random() * 10 + 5,
            speedY: Math.random() * 2 + 1,
            speedX: Math.random() * 4 - 2,
            opacity: Math.random() * 0.5 + 0.5,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.15 + 0.05,
            shape: Math.floor(Math.random() * 3)
          };
        case "leaves":
          return { 
            ...baseParticle, 
            color: ["#6b5a4a", "#7c6b5b", "#8a7a6a", "#5a4a3a"][Math.floor(Math.random() * 4)], 
            size: Math.random() * 10 + 6,
            speedY: Math.random() * 0.6 + 0.3,
            opacity: Math.random() * 0.4 + 0.2,
            sway: Math.random() * Math.PI * 2,
            swaySpeed: Math.random() * 0.03 + 0.01
          };
        case "petals":
          return { 
            ...baseParticle, 
            color: ["#e8d0d8", "#dcc0c8", "#d4b0b8", "#c8a0a8"][Math.floor(Math.random() * 4)], 
            size: Math.random() * 8 + 4,
            speedY: Math.random() * 0.5 + 0.2,
            opacity: Math.random() * 0.35 + 0.15,
            flutter: Math.random() * Math.PI * 2,
            flutterSpeed: Math.random() * 0.04 + 0.02
          };
        case "diyas":
          return { 
            ...baseParticle, 
            color: ["#d4a574", "#c9a86c", "#b89860", "#a08050"][Math.floor(Math.random() * 4)], 
            size: Math.random() * 4 + 2, 
            speedY: Math.random() * 0.4 + 0.2, 
            y: canvas.height + 20, 
            goingUp: true,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.05 + 0.03
          };
        case "sparkles":
          return { 
            ...baseParticle, 
            color: ["#ffd700", "#ff6600", "#ffffff", "#ff4500", "#ffcc00", "#ff8c00", "#ffa500"][Math.floor(Math.random() * 7)], 
            size: Math.random() * 5 + 2, 
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            life: 1,
            decay: Math.random() * 0.012 + 0.004,
            twinkle: Math.random() * Math.PI * 2,
            burstX: (Math.random() - 0.5) * 6,
            burstY: (Math.random() - 0.5) * 6,
            trail: []
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
        case "fireworks":
          const explosionColors = [
            ["#ff6b6b", "#ee5a5a", "#ff8585"],
            ["#ffd700", "#ffcc00", "#ffe066"],
            ["#4ecdc4", "#45b7aa", "#6fe0d8"],
            ["#a29bfe", "#8c7ae6", "#b8b0ff"],
            ["#fd79a8", "#e056fd", "#ff9ff3"],
            ["#00d2d3", "#01a3a4", "#48dbfb"],
            ["#ff9f43", "#ee8832", "#ffbe76"]
          ];
          const colorSet = explosionColors[Math.floor(Math.random() * explosionColors.length)];
          return { 
            ...baseParticle, 
            colors: colorSet,
            color: colorSet[0],
            x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
            y: canvas.height + 20,
            speedY: -(Math.random() * 4 + 5),
            speedX: (Math.random() - 0.5) * 2,
            exploded: false,
            explosionParticles: [],
            targetY: Math.random() * canvas.height * 0.4 + canvas.height * 0.1,
            trailOpacity: 1,
            size: 3
          };
        case "bubbles":
          return { 
            ...baseParticle, 
            color: ["#a8c5d8", "#b8d0e0", "#c8dae8", "#d8e4f0"][Math.floor(Math.random() * 4)],
            size: Math.random() * 15 + 8,
            speedY: -(Math.random() * 0.6 + 0.3),
            y: canvas.height + 30,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.03 + 0.01,
            opacity: Math.random() * 0.25 + 0.1
          };
        case "rain":
          return { 
            ...baseParticle, 
            color: "#a8c5d8",
            size: Math.random() * 1.5 + 0.5,
            length: Math.random() * 15 + 10,
            speedY: Math.random() * 8 + 6,
            speedX: Math.random() * 1.5 - 0.75,
            opacity: Math.random() * 0.3 + 0.1
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
        default:
          return baseParticle;
      }
    };

    for (let i = 0; i < particleCount; i++) {
      const p = createParticle();
      if (type !== "bubbles" && type !== "diyas" && type !== "fireworks") {
        p.y = Math.random() * canvas.height;
      }
      particles.push(p);
    }

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number, rotation: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(x, y);
      ctx.rotate(rotation);
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

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.shadowBlur = size * 2;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        switch (type) {
          case "hearts":
            p.y += p.speedY;
            p.swing += p.swingSpeed;
            p.x += Math.sin(p.swing) * 0.8;
            p.rotation += p.rotationSpeed * 0.5;
            drawHeart(ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation * Math.PI / 180);
            if (p.y > canvas.height + 20) {
              if (loop) particles[index] = createParticle();
              else p.dead = true;
            }
            break;

          case "snowfall":
            p.y += p.speedY;
            p.drift += p.driftSpeed;
            p.x += Math.sin(p.drift) * 0.6;
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = p.size * 2;
            ctx.shadowColor = "rgba(255,255,255,0.5)";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            if (p.y > canvas.height + 10) {
              if (loop) particles[index] = createParticle();
              else p.dead = true;
            }
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
            if (p.shape === 0) {
              ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else if (p.shape === 1) {
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
            if (p.y > canvas.height + 20 || p.x < -50 || p.x > canvas.width + 50) {
              if (loop) particles[index] = createParticle();
              else p.dead = true;
            }
            break;

          case "leaves":
            p.y += p.speedY;
            p.sway += p.swaySpeed;
            p.x += Math.sin(p.sway) * 1.2;
            p.rotation += p.rotationSpeed;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size / 2.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            if (p.y > canvas.height + 20) {
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

          case "diyas":
            p.y -= p.speedY;
            p.x += Math.sin(p.y / 30) * 0.3;
            p.pulse += p.pulseSpeed;
            const diyaGlow = 1 + Math.sin(p.pulse) * 0.2;
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
              ctx.globalAlpha = sparkleOpacity * 0.4;
              ctx.beginPath();
              ctx.arc(p.x, p.y, Math.max(0.1, p.size * p.life * 3), 0, Math.PI * 2);
              ctx.fill();
              const rays = 4;
              ctx.strokeStyle = p.color;
              ctx.lineWidth = 1.5;
              ctx.globalAlpha = sparkleOpacity * 0.6;
              for (let i = 0; i < rays; i++) {
                const angle = (i / rays) * Math.PI * 2 + p.twinkle;
                const rayLen = Math.max(0.1, p.size * p.life * 4);
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + Math.cos(angle) * rayLen, p.y + Math.sin(angle) * rayLen);
                ctx.stroke();
              }
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
            const rayGrad = ctx.createLinearGradient(
              0, 0,
              Math.cos(p.angle) * p.length,
              Math.sin(p.angle) * p.length
            );
            rayGrad.addColorStop(0, `rgba(212,165,116,${rayAlpha})`);
            rayGrad.addColorStop(1, "rgba(212,165,116,0)");
            ctx.fillStyle = rayGrad;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(
              Math.cos(p.angle - 0.08) * p.length,
              Math.sin(p.angle - 0.08) * p.length
            );
            ctx.lineTo(
              Math.cos(p.angle + 0.08) * p.length,
              Math.sin(p.angle + 0.08) * p.length
            );
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
            const ffGlow = Math.max(0.2, 0.5 + Math.sin(p.glowPhase) * 0.5);
            const ffRadius = Math.max(1, p.size * ffGlow);
            ctx.save();
            ctx.shadowBlur = 12;
            ctx.shadowColor = p.color;
            ctx.globalAlpha = p.opacity * ffGlow;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, ffRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            break;

          case "fireworks":
            if (!p.exploded) {
              p.y += p.speedY;
              p.x += p.speedX;
              p.speedY += 0.08;
              p.trailOpacity *= 0.97;
              ctx.save();
              ctx.shadowBlur = 15;
              ctx.shadowColor = p.color;
              ctx.globalAlpha = 0.9;
              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.globalAlpha = p.trailOpacity * 0.5;
              for (let t = 1; t <= 5; t++) {
                ctx.beginPath();
                ctx.arc(p.x - p.speedX * t * 2, p.y - p.speedY * t * 2, p.size * (1 - t * 0.15), 0, Math.PI * 2);
                ctx.fill();
              }
              ctx.restore();
              if (p.y <= p.targetY || p.speedY >= 0) {
                p.exploded = true;
                const numExplosionParticles = 40 + Math.floor(Math.random() * 20);
                for (let i = 0; i < numExplosionParticles; i++) {
                  const angle = (i / numExplosionParticles) * Math.PI * 2 + Math.random() * 0.3;
                  const speed = 2 + Math.random() * 4;
                  const colorIdx = Math.floor(Math.random() * p.colors.length);
                  p.explosionParticles.push({
                    x: p.x,
                    y: p.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1,
                    decay: 0.012 + Math.random() * 0.008,
                    size: 2 + Math.random() * 2,
                    color: p.colors[colorIdx],
                    trail: []
                  });
                }
              }
            } else {
              let allDead = true;
              p.explosionParticles.forEach((ep: any) => {
                if (ep.life > 0) {
                  allDead = false;
                  ep.trail.unshift({ x: ep.x, y: ep.y, life: ep.life });
                  if (ep.trail.length > 6) ep.trail.pop();
                  ep.x += ep.vx;
                  ep.y += ep.vy;
                  ep.vy += 0.06;
                  ep.vx *= 0.98;
                  ep.life -= ep.decay;
                  ctx.save();
                  ep.trail.forEach((t: any, ti: number) => {
                    ctx.globalAlpha = t.life * 0.3 * (1 - ti / ep.trail.length);
                    ctx.fillStyle = ep.color;
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, Math.max(0.1, ep.size * (1 - ti * 0.1)), 0, Math.PI * 2);
                    ctx.fill();
                  });
                  ctx.shadowBlur = 15;
                  ctx.shadowColor = ep.color;
                  ctx.globalAlpha = Math.max(0, ep.life) * 0.9;
                  ctx.fillStyle = ep.color;
                  ctx.beginPath();
                  ctx.arc(ep.x, ep.y, Math.max(0.1, ep.size * ep.life), 0, Math.PI * 2);
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

          default:
            p.y += p.speedY;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color || color;
            ctx.globalAlpha = p.opacity;
            ctx.fill();
            if (p.y > canvas.height + 20) {
              if (loop) particles[index] = createParticle();
              else p.dead = true;
            }
        }
      });

      const allDead = !loop && particles.every(p => p.dead);
      if (allDead) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [type, color, contained, loop]);

  if (type === "none") return null;

  if (contained) {
    return (
      <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0"
          style={{ opacity: 0.8 }}
        />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10"
      style={{ opacity: 0.8 }}
    />
  );
};

export default ThemeAnimations;
