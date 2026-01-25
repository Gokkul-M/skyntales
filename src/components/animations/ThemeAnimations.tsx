import { useEffect, useRef } from "react";

interface AnimationProps {
  type: "confetti" | "hearts" | "snowfall" | "fireworks" | "leaves" | "petals" | "diyas" | "stars" | "none";
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
    const particleCount = type === "snowfall" ? 100 : type === "hearts" ? 30 : 50;

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
          return { ...baseParticle, color: "#ffa500", size: Math.random() * 8 + 4, speedY: Math.random() * 0.5 + 0.2, y: canvas.height + 20, goingUp: true };
        case "stars":
          return { ...baseParticle, color: "#ffd700", size: Math.random() * 6 + 3, twinkle: Math.random() * Math.PI * 2 };
        case "fireworks":
          return { ...baseParticle, color: ["#ff0000", "#ffd700", "#00ff00", "#00ffff", "#ff00ff"][Math.floor(Math.random() * 5)], exploded: false, explosionParticles: [] };
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
              p.x += Math.sin(p.y / 20) * 0.3;
            }
            drawDiya(ctx, p.x, p.y, p.size, p.opacity * (0.7 + Math.sin(Date.now() / 200 + index) * 0.3));
            break;

          case "stars":
            p.twinkle += 0.05;
            const starOpacity = 0.3 + Math.sin(p.twinkle) * 0.7;
            drawStar(ctx, p.x, p.y, p.size, p.color, starOpacity);
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
