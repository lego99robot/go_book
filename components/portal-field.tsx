"use client";

import { useEffect, useRef } from "react";

export function PortalField() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationId: number;

    const handlePointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const animate = () => {
      const ease = reducedMotion ? 0.025 : 0.07;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      document.documentElement.style.setProperty("--mx", currentX.toFixed(3));
      document.documentElement.style.setProperty("--my", currentY.toFixed(3));
      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <div className="noise" aria-hidden="true" />
      <div className="portal-field" aria-hidden="true" ref={rootRef}>
        <div className="portal-core">
          <span className="portal-piece piece-a" />
          <span className="portal-piece piece-b" />
          <span className="portal-piece piece-c" />
          <span className="portal-piece piece-d" />
          <span className="portal-piece piece-e" />
          <span className="portal-piece piece-f" />
          <span className="portal-piece piece-g" />
          <span className="portal-piece piece-h" />
          <span className="portal-orbit orbit-one" />
          <span className="portal-orbit orbit-two" />
        </div>
      </div>
    </>
  );
}
