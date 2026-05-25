"use client";

import { useRef, useEffect, useState, ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  intensity?: number;
}

export function MagneticButton({
  children,
  className = "",
  style = {},
  onClick,
  intensity = 0.3,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      // Magnetic effect radius
      const maxDistance = 150;
      
      if (distance < maxDistance) {
        const strength = 1 - distance / maxDistance;
        setPosition({
          x: distanceX * intensity * strength,
          y: distanceY * intensity * strength,
        });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [intensity]);

  return (
    <button
      ref={buttonRef}
      className={className}
      style={{
        ...style,
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 && position.y === 0 ? "transform 0.3s ease-out" : "transform 0.1s ease-out",
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

interface MagneticLinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  style?: React.CSSProperties;
  intensity?: number;
}

export function MagneticLink({
  children,
  href,
  className = "",
  style = {},
  intensity = 0.3,
}: MagneticLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const link = linkRef.current;
    if (!link) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = link.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      const maxDistance = 150;
      
      if (distance < maxDistance) {
        const strength = 1 - distance / maxDistance;
        setPosition({
          x: distanceX * intensity * strength,
          y: distanceY * intensity * strength,
        });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    link.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      link.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [intensity]);

  return (
    <a
      ref={linkRef}
      href={href}
      className={className}
      style={{
        ...style,
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 && position.y === 0 ? "transform 0.3s ease-out" : "transform 0.1s ease-out",
      }}
    >
      {children}
    </a>
  );
}
