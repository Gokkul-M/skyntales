import { useEffect, useRef } from 'react';
import '@/styles/cursor.css';

const CustomCursor = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();

  const mousePos = useRef({ x: 0, y: 0 });
  const cursorState = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePos.current = { x: event.clientX, y: event.clientY };
    };

    const animate = () => {
      // Linear interpolation for smooth follow
      const lerpFactor = 0.1; // Decreased for smoother animation
      cursorState.current.x += (mousePos.current.x - cursorState.current.x) * lerpFactor;
      cursorState.current.y += (mousePos.current.y - cursorState.current.y) * lerpFactor;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(-50%, -50%) translate3d(${cursorState.current.x}px, ${cursorState.current.y}px, 0)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <div ref={cursorDotRef} className="custom-cursor-dot"></div>;
};

export default CustomCursor;
