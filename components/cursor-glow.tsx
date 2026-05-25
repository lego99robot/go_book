"use client";

import { useEffect, useState } from "react";

interface CursorGlowProps {
  color: string;
  isActive: boolean;
}

export function CursorGlow({ color, isActive }: CursorGlowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setVisible(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isActive]);

  if (!isActive || !visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] rounded-full blur-3xl mix-blend-screen transition-opacity duration-300"
      style={{
        left: position.x - 100,
        top: position.y - 100,
        width: 200,
        height: 200,
        background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
        opacity: 0.6,
      }}
    />
  );
}
