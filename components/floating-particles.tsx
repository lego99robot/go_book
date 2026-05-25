"use client";

import { useEffect, useRef, useMemo } from "react";
import { BookTheme } from "@/lib/books-data";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: "card" | "leaf" | "star" | "bubble";
}

interface FloatingParticlesProps {
  bookKey: string;
  theme: BookTheme;
  isActive: boolean;
}

export function FloatingParticles({ bookKey, theme, isActive }: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  const config = useMemo(() => {
    switch (bookKey) {
      case "alice":
        return {
          particleCount: 15,
          types: ["card"] as const,
          colors: [theme.primary, theme.secondary, theme.light],
        };
      case "frankenstein":
        return {
          particleCount: 20,
          types: ["star"] as const,
          colors: [theme.primary, theme.light],
        };
      case "moby":
        return {
          particleCount: 12,
          types: ["bubble"] as const,
          colors: [theme.light, theme.secondary],
        };
      default:
        return {
          particleCount: 15,
          types: ["star"] as const,
          colors: [theme.primary, theme.secondary],
        };
    }
  }, [bookKey, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < config.particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          size: Math.random() * 20 + 10,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.3 - 0.2,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          opacity: Math.random() * 0.3 + 0.1,
          type: config.types[Math.floor(Math.random() * config.types.length)],
        });
      }
    }

    const drawParticle = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;

      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      ctx.fillStyle = color;
      ctx.strokeStyle = color;

      switch (p.type) {
        case "card":
          // Playing card shape
          ctx.beginPath();
          const w = p.size * 0.7;
          const h = p.size;
          ctx.roundRect(-w / 2, -h / 2, w, h, 2);
          ctx.fill();
          // Card symbol
          ctx.fillStyle = theme.dark;
          ctx.font = `${p.size * 0.4}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("♠", 0, 0);
          break;

        case "leaf":
          // Leaf shape
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.bezierCurveTo(
            p.size / 2, -p.size / 4,
            p.size / 2, p.size / 4,
            0, p.size / 2
          );
          ctx.bezierCurveTo(
            -p.size / 2, p.size / 4,
            -p.size / 2, -p.size / 4,
            0, -p.size / 2
          );
          ctx.fill();
          break;

        case "star":
          // Electric spark / star
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            const outerRadius = p.size / 2;
            const innerRadius = p.size / 6;
            ctx.lineTo(
              Math.cos(angle) * outerRadius,
              Math.sin(angle) * outerRadius
            );
            ctx.lineTo(
              Math.cos(angle + Math.PI / 4) * innerRadius,
              Math.sin(angle + Math.PI / 4) * innerRadius
            );
          }
          ctx.closePath();
          ctx.fill();
          break;

        case "bubble":
          // Ocean bubble
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.globalAlpha = p.opacity * 0.3;
          ctx.fill();
          ctx.globalAlpha = p.opacity;
          ctx.lineWidth = 1;
          ctx.stroke();
          // Highlight
          ctx.beginPath();
          ctx.arc(-p.size / 6, -p.size / 6, p.size / 8, 0, Math.PI * 2);
          ctx.globalAlpha = p.opacity * 0.5;
          ctx.fillStyle = "#fff";
          ctx.fill();
          break;
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particlesRef.current.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Wrap around edges
        if (p.x < -p.size) p.x = canvas.offsetWidth + p.size;
        if (p.x > canvas.offsetWidth + p.size) p.x = -p.size;
        if (p.y < -p.size) p.y = canvas.offsetHeight + p.size;
        if (p.y > canvas.offsetHeight + p.size) p.y = -p.size;

        drawParticle(p);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, config, theme]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ opacity: 0.6 }}
    />
  );
}
