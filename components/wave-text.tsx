"use client";

import { useEffect, useState } from "react";

interface WaveTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  staggerDelay?: number;
  isVisible?: boolean;
}

export function WaveText({
  text,
  className = "",
  style = {},
  delay = 0,
  staggerDelay = 30,
  isVisible = true,
}: WaveTextProps) {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setVisibleChars(0);
      return;
    }

    const startTimeout = setTimeout(() => {
      let charIndex = 0;
      const interval = setInterval(() => {
        charIndex++;
        setVisibleChars(charIndex);
        if (charIndex >= text.length) {
          clearInterval(interval);
        }
      }, staggerDelay);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, delay, staggerDelay, isVisible]);

  return (
    <span className={className} style={style}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          style={{
            opacity: index < visibleChars ? 1 : 0,
            transform: index < visibleChars ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            display: "inline-block",
            whiteSpace: char === " " ? "pre" : "normal",
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
