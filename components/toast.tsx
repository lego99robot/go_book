"use client";

import { useState, useEffect, useCallback } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export function Toast({ message, isVisible }: ToastProps) {
  return (
    <div 
      className={`toast ${isVisible ? "is-visible" : ""}`}
      role="status" 
      aria-live="polite"
    >
      {message}
    </div>
  );
}

export function useToast() {
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [isVisible, message]);

  return { message, isVisible, showToast };
}
