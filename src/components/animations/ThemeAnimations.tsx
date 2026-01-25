import { useEffect, useRef } from "react";

interface AnimationProps {
  type: "confetti" | "hearts" | "snowfall" | "fireworks" | "leaves" | "petals" | "diyas" | "stars" | "sparkles" | "bubbles" | "rain" | "butterflies" | "sunrays" | "aurora" | "fireflies" | "none";
  color?: string;
}

const ThemeAnimations = ({ type, color = "#ffffff" }: AnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (type === "none" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const particleCount = type === "snowfall" ? 100 : type === "hearts" ? 30 : type === "sparkles" ? 80 : type === "diyas" ? 60 : type === "bubbles" ? 40 : type === "rain" ? 150 : type === "butterflies" ? 15 : type === "sunrays" ? 8 : type === "aurora" ? 5 : type === "fireflies" ? 50 : 50;

    const createParticle = () => {
      const baseParticle = {
        x: Math.random() * canvas.width,
        y: -20,
        size: Math.random() * 10 + 5,
        speedY: Math.random() * 2 + 1,
        speedX: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 2 - 1,
        opacity: Math.random() * 0.5 + 0.5,
      };

      switch (type) {
        case "hearts":
          return { ...baseParticle, color: "#ff6b6b", size: Math.random() * 15 + 10 };
        case "snowfall":
          return { ...baseParticle, color: "#ffffff", size: Math.random() * 5 + 2, speedY: Math.random() * 1 + 0.5 };
        case "confetti":
          return { ...baseParticle, color: ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#1dd1a1"][Math.floor(Math.random() * 5)], size: Math.random() * 8 + 4 };
        case "leaves":
          return { ...baseParticle, color: ["#2d5016", "#4a7c23", "#6b8e23", "#8fbc8f"][Math.floor(Math.random() * 4)], size: Math.random() * 12 + 8 };
        case "petals":
          return { ...baseParticle, color: ["#ffb6c1", "#ffc0cb", "#ff69b4", "#ff1493"][Math.floor(Math.random() * 4)], size: Math.random() * 10 + 6 };
        case "diyas":
          return { 
            ...baseParticle, 
            color: ["#ffa500", "#ffd700", "#ff6600", "#ffcc00"][Math.floor(Math.random() * 4)], 
            size: Math.random() * 6 + 3, 
            speedY: Math.random() * 0.8 + 0.3, 
            y: canvas.height + 20, 
            goingUp: true,
            sparkle: Math.random() * Math.PI * 2,
            trail: []
          };
        case "sparkles":
          return { 
            ...baseParticle, 
            color: ["#ffd700", "#ff6600", "#ffffff", "#ff4500", "#ffcc00"][Math.floor(Math.random() * 5)], 
            size: Math.random() * 4 + 2, 
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speedX: (Math.random() - 0.5) * 4,
            speedY: (Math.random() - 0.5) * 4,
            life: 1,
            decay: Math.random() * 0.02 + 0.01,
            burst: Math.random() > 0.7
          };
        case "stars":
          return { ...baseParticle, color: "#ffd700", size: Math.random() * 6 + 3, twinkle: Math.random() * Math.PI * 2 };
        case "fireworks":
          return { ...baseParticle, color: ["#ff0000", "#ffd700", "#00ff00", "#00ffff", "#ff00ff"][Math.floor(Math.random() * 5)], exploded: false, explosionParticles: [] };
        case "bubbles":
          return { 
            ...baseParticle, 
            color: ["#87ceeb", "#add8e6", "#b0e0e6", "#e0ffff"][Math.floor(Math.random() * 4)],
            size: Math.random() * 20 + 10,
            speedY: -(Math.random() * 1 + 0.5),
            y: canvas.height + 30,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.05 + 0.02
          };
        case "rain":
          return { 
            ...baseParticle, 
            color: "#a4c8e1",
            size: Math.random() * 2 + 1,
            length: Math.random() * 20 + 15,
            speedY: Math.random() * 15 + 10,
            speedX: Math.random() * 2 - 1
          };
        case "butterflies":
          return { 
            ...baseParticle, 
            color: ["#ff69b4", "#ffa500", "#87ceeb", "#dda0dd", "#f0e68c"][Math.floor(Math.random() * 5)],
            size: Math.random() * 15 + 10,
            wingPhase: Math.random() * Math.PI * 2,
            wingSpeed: Math.random() * 0.2 + 0.1,
            speedY: Math.random() * 0.5 - 0.25,
            speedX: Math.random() * 2 - 1,
            amplitude: Math.random() * 50 + 30
          };
        case "sunrays":
          return { 
            ...baseParticle, 
            color: "#ffd700",
            x: canvas.width / 2,
            y: -50,
            angle: Math.random() * Math.PI * 2,
            length: canvas.height * 1.5,
            opacity: 0.1 + Math.random() * 0.1,
            pulse: Math.random() * Math.PI * 2
          };
        case "aurora":
          return { 
            ...baseParticle, 
            colors: ["#00ff88", "#00ffcc", "#00ccff", "#0088ff", "#8800ff"],
            y: Math.random() * canvas.height * 0.4,
            amplitude: Math.random() * 100 + 50,
            frequency: Math.random() * 0.01 + 0.005,
            phase: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.3 + 0.1
          };
        case "fireflies":
          return { 
            ...baseParticle, 
            color: "#ffff66",
            size: Math.random() * 4 + 2,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            targetX: Math.random() * canvas.width,
            targetY: Math.random() * canvas.height,
            glowPhase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.5 + 0.2
          };
        default:
          return baseParticle;
      }
    };

    for (let i = 0; i < particleCount; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y + size / 4);
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
      ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.75, x, y + size);
      ctx.bezierCurveTo(x, y + size * 0.75, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
      ctx.fill();
      ctx.restore();
    };

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const px = x + Math.cos(angle) * size;
        const py = y + Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawDiya = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = "#ffa500";
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffff00";
      ctx.beginPath();
      ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        switch (type) {
          case "hearts":
            p.y += p.speedY;
            p.x += Math.sin(p.y / 30) * 0.5;
            p.rotation += p.rotationSpeed;
            drawHeart(ctx, p.x, p.y, p.size, p.color, p.opacity);
            break;

          case "snowfall":
            p.y += p.speedY;
            p.x += Math.sin(p.y / 50) * 0.5 + p.speedX * 0.3;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.fill();
            break;

          case "confetti":
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed * 5;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            ctx.restore();
            break;

          case "leaves":
          case "petals":
            p.y += p.speedY;
            p.x += Math.sin(p.y / 40) * 1.5 + p.speedX;
            p.rotation += p.rotationSpeed * 2;
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

          case "diyas":
            if (p.goingUp) {
              p.y -= p.speedY;
              p.x += Math.sin(p.y / 20) * 0.5;
            }
            p.sparkle += 0.1;
            const glowSize = p.size * (1 + Math.sin(p.sparkle) * 0.3);
            ctx.save();
            ctx.shadowBlur = 15;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity * (0.6 + Math.sin(Date.now() / 150 + index) * 0.4);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowSize * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = 0.8;
            ctx.fill();
            ctx.restore();
            break;

          case "sparkles":
            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= p.decay;
            if (p.life > 0) {
              ctx.save();
              ctx.shadowBlur = 10;
              ctx.shadowColor = p.color;
              ctx.globalAlpha = p.life;
              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
              ctx.fill();
              for (let i = 0; i < 4; i++) {
                const angle = (i * Math.PI) / 2;
                const rayLen = p.size * 2 * p.life;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + Math.cos(angle) * rayLen, p.y + Math.sin(angle) * rayLen);
                ctx.strokeStyle = p.color;
                ctx.lineWidth = 1;
                ctx.stroke();
              }
              ctx.restore();
            }
            if (p.life <= 0) {
              particles[index] = createParticle();
            }
            break;

          case "stars":
            p.twinkle += 0.05;
            const starOpacity = 0.3 + Math.sin(p.twinkle) * 0.7;
            drawStar(ctx, p.x, p.y, p.size, p.color, starOpacity);
            break;

          case "bubbles":
            p.y += p.speedY;
            p.wobble += p.wobbleSpeed;
            p.x += Math.sin(p.wobble) * 0.5;
            ctx.save();
            ctx.globalAlpha = p.opacity * 0.6;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.fill();
            ctx.restore();
            if (p.y < -p.size) {
              particles[index] = createParticle();
            }
            break;

          case "rain":
            p.y += p.speedY;
            p.x += p.speedX;
            ctx.save();
            ctx.globalAlpha = p.opacity * 0.5;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.speedX * 2, p.y + p.length);
            ctx.stroke();
            ctx.restore();
            if (p.y > canvas.height) {
              particles[index] = createParticle();
            }
            break;

          case "butterflies":
            p.wingPhase += p.wingSpeed;
            p.x += p.speedX + Math.sin(p.wingPhase * 0.5) * 2;
            p.y += p.speedY + Math.cos(p.wingPhase * 0.3) * 1;
            const wingFlap = Math.sin(p.wingPhase) * 0.5 + 0.5;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(-p.size * 0.6 * wingFlap, 0, p.size * 0.8, p.size * 0.5, -0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(p.size * 0.6 * wingFlap, 0, p.size * 0.8, p.size * 0.5, 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#333";
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 0.15, p.size * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            if (p.x < -50 || p.x > canvas.width + 50 || p.y < -50 || p.y > canvas.height + 50) {
              particles[index] = createParticle();
            }
            break;

          case "sunrays":
            p.pulse += 0.02;
            const rayOpacity = p.opacity * (0.5 + Math.sin(p.pulse) * 0.5);
            ctx.save();
            ctx.globalAlpha = rayOpacity;
            const gradient = ctx.createLinearGradient(
              canvas.width / 2, 0,
              canvas.width / 2 + Math.cos(p.angle) * p.length,
              Math.sin(p.angle) * p.length
            );
            gradient.addColorStop(0, "rgba(255,215,0,0.4)");
            gradient.addColorStop(1, "rgba(255,215,0,0)");
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(
              canvas.width / 2 + Math.cos(p.angle - 0.1) * p.length,
              Math.sin(p.angle - 0.1) * p.length
            );
            ctx.lineTo(
              canvas.width / 2 + Math.cos(p.angle + 0.1) * p.length,
              Math.sin(p.angle + 0.1) * p.length
            );
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            break;

          case "aurora":
            p.phase += 0.01;
            ctx.save();
            ctx.globalAlpha = p.opacity;
            for (let i = 0; i < p.colors.length; i++) {
              ctx.beginPath();
              ctx.moveTo(0, p.y + i * 30);
              for (let x = 0; x < canvas.width; x += 10) {
                const y = p.y + i * 30 + Math.sin(x * p.frequency + p.phase + i) * p.amplitude;
                ctx.lineTo(x, y);
              }
              ctx.lineTo(canvas.width, canvas.height);
              ctx.lineTo(0, canvas.height);
              ctx.closePath();
              const auroraGrad = ctx.createLinearGradient(0, p.y, 0, canvas.height);
              auroraGrad.addColorStop(0, p.colors[i]);
              auroraGrad.addColorStop(1, "transparent");
              ctx.fillStyle = auroraGrad;
              ctx.fill();
            }
            ctx.restore();
            break;

          case "fireflies":
            p.glowPhase += 0.05;
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 10) {
              p.targetX = Math.random() * canvas.width;
              p.targetY = Math.random() * canvas.height;
            }
            p.x += (dx / dist) * p.speed;
            p.y += (dy / dist) * p.speed;
            const fireflyGlow = 0.3 + Math.sin(p.glowPhase) * 0.7;
            ctx.save();
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#ffff66";
            ctx.globalAlpha = fireflyGlow;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * fireflyGlow, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            break;

          default:
            p.y += p.speedY;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color || color;
            ctx.globalAlpha = p.opacity;
            ctx.fill();
        }

        if (p.y > canvas.height + 20) {
          if (type === "diyas") {
            particles[index] = createParticle();
          } else {
            particles[index] = createParticle();
          }
        }
        if (type === "diyas" && p.y < -20) {
          particles[index] = createParticle();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [type, color]);

  if (type === "none") return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default ThemeAnimations;
