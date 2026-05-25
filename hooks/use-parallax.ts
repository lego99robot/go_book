"use client";

import { useEffect, useState, useCallback, RefObject } from "react";

interface ParallaxValues {
  x: number;
  y: number;
  rotateX: number;
  rotateY: number;
}

export function useParallax(ref: RefObject<HTMLElement | null>, intensity: number = 0.05): ParallaxValues {
  const [values, setValues] = useState<ParallaxValues>({ x: 0, y: 0, rotateX: 0, rotateY: 0 });

  const handleScroll = useCallback(() => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Calculate how far through the viewport the element is
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight / 2;
    const distanceFromCenter = elementCenter - viewportCenter;
    
    // Normalize to -1 to 1 range
    const normalizedY = distanceFromCenter / viewportHeight;
    
    setValues({
      x: 0,
      y: normalizedY * 100 * intensity,
      rotateX: normalizedY * 5 * intensity,
      rotateY: 0,
    });
  }, [ref, intensity]);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return values;
}

export function useMouseParallax(ref: RefObject<HTMLElement | null>, intensity: number = 0.02): ParallaxValues {
  const [values, setValues] = useState<ParallaxValues>({ x: 0, y: 0, rotateX: 0, rotateY: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    
    // Check if mouse is over or near the element
    const isNear = 
      e.clientX >= rect.left - 100 &&
      e.clientX <= rect.right + 100 &&
      e.clientY >= rect.top - 100 &&
      e.clientY <= rect.bottom + 100;
    
    if (!isNear) {
      setValues({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
      return;
    }
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;
    
    setValues({
      x: deltaX * 20 * intensity,
      y: deltaY * 20 * intensity,
      rotateX: -deltaY * 10 * intensity,
      rotateY: deltaX * 10 * intensity,
    });
  }, [ref, intensity]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return values;
}
