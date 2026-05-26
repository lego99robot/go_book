"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, BookOpen, Heart, Clock, Star, Sparkles, Quote, ChevronRight } from "lucide-react";
import { BookData, formatPrice } from "@/lib/books-data";
import { FloatingParticles } from "./floating-particles";
import { MagneticButton } from "./magnetic-button";
import { WaveText } from "./wave-text";
import { CursorGlow } from "./cursor-glow";
import { ImmersiveBookScene } from "./immersive-book-scene";

interface ImmersiveModalProps {
  book: BookData | null;
  isOpen: boolean;
  onClose: () => void;
  onBuy: (bookKey: string) => void;
}

export function ImmersiveModal({ book, isOpen, onClose, onBuy }: ImmersiveModalProps) {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsAnimatingIn(true);
    } else {
      document.body.style.overflow = "";
      setIsAnimatingIn(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-rotate quotes
  useEffect(() => {
    if (!book || !isOpen) return;
    const interval = setInterval(() => {
      setActiveQuoteIndex((prev) => (prev + 1) % book.immersive.quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [book, isOpen]);

  // Track scroll for parallax inside modal
  useEffect(() => {
    if (!contentRef.current || !isOpen) return;
    
    const handleScroll = () => {
      if (contentRef.current) {
        setScrollY(contentRef.current.scrollTop);
      }
    };
    
    const element = contentRef.current;
    element.addEventListener("scroll", handleScroll, { passive: true });
    return () => element.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  if (!book) return null;
  if (!isOpen) return null;

  const { immersive, palette, sceneTheme } = book;

  return (
    <>
      {/* Cursor glow effect */}
      <CursorGlow color={palette.accent} isActive={isOpen} />

      {/* Backdrop with fade in */}
      <div 
        className="fixed inset-0 z-[200] backdrop-blur-sm transition-all duration-500"
        style={{
          background: isAnimatingIn ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0)",
        }}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal with book opening effect */}
      <div 
        ref={contentRef}
        className="fixed inset-0 z-[201] overflow-y-auto overflow-x-hidden transition-all duration-700"
        style={{
          transformOrigin: "center center",
          transform: isAnimatingIn ? "perspective(1000px) rotateY(0deg) scale(1)" : "perspective(1000px) rotateY(-90deg) scale(0.8)",
          opacity: isAnimatingIn ? 1 : 0,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="immersive-title"
      >
        <div 
          className="min-h-screen relative"
          style={{
            background: `linear-gradient(180deg, ${palette.paper} 0%, color-mix(in srgb, ${palette.paper} 90%, ${palette.shade}) 100%)`,
            color: palette.ink,
          }}
        >
          {/* Floating particles in modal */}
          <FloatingParticles 
            bookKey={book.key} 
            theme={sceneTheme} 
            isActive={isOpen} 
          />

          {/* Close button with magnetic effect */}
          <MagneticButton
            onClick={onClose}
            className="fixed top-6 right-6 z-[210] w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-300 hover:scale-110"
            style={{
              borderColor: palette.accent,
              background: `color-mix(in srgb, ${palette.paper} 80%, transparent)`,
              color: palette.ink,
            }}
            intensity={0.4}
          >
            <X size={24} />
          </MagneticButton>

          {/* Hero section with parallax */}
          <section 
            className="relative min-h-[82vh] flex items-start justify-center overflow-hidden px-[clamp(1rem,4vw,1.5rem)] pt-[clamp(5.4rem,9vw,7.2rem)] pb-[clamp(17rem,34vh,22rem)]"
          >
            {/* Decorative background elements */}
            <div 
              className="absolute inset-0 opacity-20 transition-transform duration-100"
              style={{
                background: `radial-gradient(circle at 30% 20%, ${palette.accent}, transparent 50%),
                             radial-gradient(circle at 70% 80%, ${palette.shade}, transparent 50%)`,
                transform: `translateY(${scrollY * 0.1}px)`,
              }}
            />
            
            {/* Floating shapes with parallax */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div 
                className="absolute top-[10%] left-[5%] w-32 h-32 opacity-30"
                style={{ 
                  background: palette.accent,
                  transform: `rotate(12deg) skew(-5deg) translateY(${scrollY * 0.2}px)`,
                  transition: "transform 0.1s ease-out",
                }}
              />
              <div 
                className="absolute top-[20%] right-[10%] w-24 h-48 opacity-20"
                style={{ 
                  background: palette.shade,
                  transform: `rotate(-8deg) translateY(${scrollY * 0.15}px)`,
                  transition: "transform 0.1s ease-out",
                }}
              />
              <div 
                className="absolute bottom-[15%] left-[15%] w-40 h-20 opacity-25"
                style={{ 
                  background: palette.accent,
                  transform: `skew(15deg) translateY(${scrollY * -0.1}px)`,
                  transition: "transform 0.1s ease-out",
                }}
              />
            </div>

            <ImmersiveBookScene
              bookKey={book.key}
              palette={palette}
              isActive={isOpen}
              scrollY={scrollY}
            />

            <div className="relative z-20 text-center max-w-4xl mx-auto">
              <p 
                className="text-xs font-bold tracking-[0.2em] uppercase mb-6"
                style={{ 
                  color: palette.accent,
                  animation: "fadeInUp 0.6s ease-out 0.2s both",
                }}
              >
                Погружение в мир книги
              </p>
              <h1 
                id="immersive-title"
                className="font-serif text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[0.9] mb-6 text-balance"
                style={{
                  animation: "fadeInUp 0.6s ease-out 0.3s both",
                }}
              >
                {book.title}
              </h1>
              <p 
                className="text-xl opacity-80 mb-4"
                style={{
                  animation: "fadeInUp 0.6s ease-out 0.4s both",
                }}
              >
                {book.author}
              </p>
              <p 
                className="text-[clamp(1.1rem,2.5vw,1.5rem)] leading-relaxed max-w-2xl mx-auto font-serif italic text-pretty"
                style={{ 
                  color: `color-mix(in srgb, ${palette.ink} 80%, ${palette.accent})`,
                  animation: "fadeInUp 0.6s ease-out 0.5s both",
                }}
              >
                <WaveText 
                  text={immersive.tagline} 
                  isVisible={isAnimatingIn}
                  delay={600}
                  staggerDelay={20}
                />
              </p>
            </div>
          </section>

          {/* Atmosphere section */}
          <section 
            className="relative px-6 py-20"
            style={{
              opacity: 1 - Math.max(0, (scrollY - 100) * 0.001),
            }}
          >
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div
                  className="animate-fade-in-left"
                  style={{
                    animationDelay: "0.6s",
                  }}
                >
                  <h2 className="font-serif text-3xl font-bold mb-6 flex items-center gap-3">
                    <Sparkles size={28} style={{ color: palette.accent }} />
                    Атмосфера
                  </h2>
                  <p className="text-lg leading-relaxed opacity-90 text-pretty">
                    {immersive.atmosphere}
                  </p>
                </div>
                <div 
                  className="p-8 relative animate-fade-in-right transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in srgb, ${palette.accent} 15%, transparent), transparent)`,
                    borderLeft: `4px solid ${palette.accent}`,
                    animationDelay: "0.8s",
                  }}
                >
                  <p className="text-sm font-bold tracking-widest uppercase mb-4 opacity-60">
                    Визуальный образ
                  </p>
                  <p className="text-lg leading-relaxed italic font-serif text-pretty">
                    {immersive.illustration}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Key Themes with staggered animation */}
          <section 
            className="relative px-6 py-20"
            style={{
              background: `linear-gradient(180deg, transparent, color-mix(in srgb, ${palette.shade} 10%, transparent), transparent)`,
            }}
          >
            <div className="max-w-5xl mx-auto">
              <h2 className="font-serif text-3xl font-bold mb-10 text-center">
                Ключевые темы
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {immersive.keyThemes.map((theme, index) => (
                  <div 
                    key={index}
                    className="min-w-0 p-6 flex items-start gap-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-fade-in-up"
                    style={{
                      background: `color-mix(in srgb, ${palette.paper} 90%, ${palette.accent})`,
                      borderBottom: `3px solid ${palette.accent}`,
                      boxShadow: `8px 8px 0 color-mix(in srgb, ${palette.shade} 20%, transparent)`,
                      animationDelay: `${0.2 * index + 1}s`,
                    }}
                  >
                    <span 
                      className="text-2xl font-bold font-serif opacity-40"
                      style={{ color: palette.accent }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="min-w-0 text-lg text-pretty">{theme}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Emotional Journey */}
          <section className="relative px-6 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-serif text-3xl font-bold mb-6 flex items-center justify-center gap-3">
                <Heart size={28} style={{ color: palette.accent }} className="animate-pulse" />
                Эмоциональное путешествие
              </h2>
              <p className="text-xl leading-relaxed opacity-90 text-pretty">
                {immersive.emotionalJourney}
              </p>
              
              {/* Mood indicators with animation */}
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                {book.moods.map((mood, index) => (
                  <div 
                    key={index}
                    className="px-6 py-3 transition-all duration-300 hover:scale-105 animate-fade-in-up"
                    style={{
                      background: `linear-gradient(90deg, ${palette.accent}, color-mix(in srgb, ${palette.accent} 60%, ${palette.shade}))`,
                      color: palette.paper,
                      transform: "skew(-5deg)",
                      animationDelay: `${index * 0.15 + 1.5}s`,
                    }}
                  >
                    <span className="inline-block" style={{ transform: "skew(5deg)" }}>
                      <span className="font-bold">{mood.label}</span>
                      <span className="ml-2 opacity-80">{mood.value}%</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Quotes carousel */}
          <section 
            className="relative px-6 py-24 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, color-mix(in srgb, ${palette.shade} 30%, ${palette.paper}), ${palette.paper})`,
            }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <Quote 
                size={48} 
                className="mx-auto mb-8 opacity-30 animate-bounce-slow"
                style={{ color: palette.accent }}
              />
              <div className="relative min-h-[13rem] sm:min-h-40 flex items-center justify-center">
                {immersive.quotes.map((quote, index) => (
                  <p
                    key={index}
                    className={`absolute inset-0 flex items-center justify-center px-1 font-serif text-[clamp(1.35rem,5vw,1.875rem)] italic leading-relaxed text-pretty transition-all duration-700 ${
                      index === activeQuoteIndex ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
                    }`}
                  >
                    {quote}
                  </p>
                ))}
              </div>
              <div className="flex justify-center gap-2 mt-8">
                {immersive.quotes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveQuoteIndex(index)}
                    className={`w-3 h-3 transition-all duration-300 ${
                      index === activeQuoteIndex ? "scale-125" : "opacity-40 hover:opacity-70"
                    }`}
                    style={{
                      background: palette.accent,
                      transform: index === activeQuoteIndex ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                    aria-label={`Цитата ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Perfect For / Not For */}
          <section className="relative px-6 py-20">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Perfect for */}
                <div className="animate-fade-in-left" style={{ animationDelay: "0.3s" }}>
                  <h3 className="font-serif text-2xl font-bold mb-6 flex items-center gap-3">
                    <Star size={24} style={{ color: palette.accent }} />
                    Идеально для тех, кто...
                  </h3>
                  <ul className="space-y-4">
                    {immersive.perfectFor.map((item, index) => (
                      <li 
                        key={index}
                        className="flex items-start gap-3 text-lg transition-all duration-300 hover:translate-x-2"
                        style={{
                          animationDelay: `${index * 0.1 + 0.5}s`,
                        }}
                      >
                        <ChevronRight 
                          size={20} 
                          className="mt-1 flex-shrink-0"
                          style={{ color: palette.accent }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Not for */}
                <div className="opacity-80 animate-fade-in-right" style={{ animationDelay: "0.5s" }}>
                  <h3 className="font-serif text-2xl font-bold mb-6">
                    Возможно, не подойдёт...
                  </h3>
                  <ul className="space-y-4">
                    {immersive.notFor.map((item, index) => (
                      <li 
                        key={index}
                        className="flex items-start gap-3 text-lg opacity-80 transition-all duration-300 hover:translate-x-2"
                      >
                        <span className="mt-1 flex-shrink-0 w-5 h-0.5" style={{ background: palette.shade, marginTop: "0.75rem" }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Reading Info */}
          <section 
            className="relative px-6 py-16"
            style={{
              background: `color-mix(in srgb, ${palette.accent} 10%, ${palette.paper})`,
            }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="flex items-center gap-4 transition-all duration-300 hover:scale-105">
                  <Clock size={32} style={{ color: palette.accent }} />
                  <div>
                    <p className="text-sm font-bold tracking-widest uppercase opacity-60">Время чтения</p>
                    <p className="text-xl font-serif">{immersive.readingTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 transition-all duration-300 hover:scale-105">
                  <BookOpen size={32} style={{ color: palette.accent }} />
                  <div>
                    <p className="text-sm font-bold tracking-widest uppercase opacity-60">Сложность</p>
                    <p className="text-xl font-serif">{immersive.difficulty}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative px-6 py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-4xl font-bold mb-6">
                Готовы к погружению?
              </h2>
              <p className="text-xl opacity-80 mb-10 text-pretty">
                {book.description}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <MagneticButton
                  onClick={() => onBuy(book.key)}
                  className="min-h-[56px] px-10 py-4 text-lg font-bold transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: palette.accent,
                    color: palette.paper,
                    border: `2px solid ${palette.ink}`,
                    boxShadow: `8px 8px 0 ${palette.ink}`,
                  }}
                  intensity={0.3}
                >
                  Купить книгу — {formatPrice(book.basePrice)}
                </MagneticButton>
                <MagneticButton
                  onClick={onClose}
                  className="min-h-[56px] px-10 py-4 text-lg font-bold transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "transparent",
                    color: palette.ink,
                    border: `2px solid ${palette.ink}`,
                  }}
                  intensity={0.3}
                >
                  Вернуться к библиотеке
                </MagneticButton>
              </div>
            </div>
          </section>

          {/* Footer spacer */}
          <div className="h-20" />
        </div>
      </div>

      {/* CSS animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out both;
        }

        .animate-fade-in-left {
          animation: fadeInUp 0.6s ease-out both;
        }

        .animate-fade-in-right {
          animation: fadeInUp 0.6s ease-out both;
        }
      `}</style>
    </>
  );
}
