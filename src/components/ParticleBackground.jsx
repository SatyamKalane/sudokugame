import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const { theme, selectedCell } = useGame();
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleGlobalMouseMove = (event) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const getThemeColor = () => {
      if (theme === 'matrix') return { r: 34, g: 197, b: 94 };
      if (theme === 'amoled') return { r: 255, g: 255, b: 255 };
      return { r: 6, g: 182, b: 212 }; // Cyberpunk Cyan
    };

    const count = 90;
    const particles = Array(count).fill(null).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      baseSpeedX: Math.random() * 0.4 - 0.2,
      baseSpeedY: Math.random() * -0.5 - 0.1,
      vx: 0,
      vy: 0,
      alpha: Math.random() * 0.4 + 0.1
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const rgb = getThemeColor();

      particles.forEach(p => {
        // Magnetic calculations drawing vectors toward the user's cursor pointer
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 180) {
          const force = (180 - distance) / 180;
          p.vx += (dx / distance) * force * 0.15;
          p.vy += (dy / distance) * force * 0.15;
        }

        // Apply friction decay and base speeds
        p.vx *= 0.93;
        p.vy *= 0.93;
        p.x += p.baseSpeedX + p.vx;
        p.y += p.baseSpeedY + p.vy;

        // Loop bounds boundaries
        if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
        if (p.x < 0 || p.x > canvas.width) p.baseSpeedX *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + (selectedCell ? 0.5 : 0), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, selectedCell]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}
