"use client";

import { useState, useEffect, useCallback } from "react";
import { X, BookOpen, Heart, Clock, Star, Sparkles, Quote, ChevronRight } from "lucide-react";
import { BookData, formatPrice } from "@/lib/books-data";

interface ImmersiveModalProps {
  book: BookData | null;
  isOpen: boolean;
  onClose: () => void;
  onBuy: (bookKey: string) => void;
}

export function ImmersiveModal({ book, isOpen, onClose, onBuy }: ImmersiveModalProps) {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
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

  if (!book) return null;
  if (!isOpen) return null;

  const { immersive, palette } = book;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="fixed inset-0 z-[201] overflow-y-auto overflow-x-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="immersive-title"
      >
        <div 
          className="min-h-screen"
          style={{
            background: `linear-gradient(180deg, ${palette.paper} 0%, color-mix(in srgb, ${palette.paper} 90%, ${palette.shade}) 100%)`,
            color: palette.ink,
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="fixed top-6 right-6 z-[210] w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-300 hover:scale-110"
            style={{
              borderColor: palette.accent,
              background: `color-mix(in srgb, ${palette.paper} 80%, transparent)`,
              color: palette.ink,
            }}
            aria-label="Закрыть"
          >
            <X size={24} />
          </button>

          {/* Hero section */}
          <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-6 py-20">
            {/* Decorative background elements */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: `radial-gradient(circle at 30% 20%, ${palette.accent}, transparent 50%),
                             radial-gradient(circle at 70% 80%, ${palette.shade}, transparent 50%)`,
              }}
            />
            
            {/* Floating shapes */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div 
                className="absolute top-[10%] left-[5%] w-32 h-32 opacity-30 animate-pulse"
                style={{ 
                  background: palette.accent,
                  transform: "rotate(12deg) skew(-5deg)",
                }}
              />
              <div 
                className="absolute top-[20%] right-[10%] w-24 h-48 opacity-20"
                style={{ 
                  background: palette.shade,
                  transform: "rotate(-8deg)",
                }}
              />
              <div 
                className="absolute bottom-[15%] left-[15%] w-40 h-20 opacity-25"
                style={{ 
                  background: palette.accent,
                  transform: "skew(15deg)",
                }}
              />
            </div>

            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <p 
                className="text-xs font-bold tracking-[0.2em] uppercase mb-6"
                style={{ color: palette.accent }}
              >
                Погружение в мир книги
              </p>
              <h1 
                id="immersive-title"
                className="font-serif text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[0.9] mb-6"
              >
                {book.title}
              </h1>
              <p className="text-xl opacity-80 mb-4">{book.author}</p>
              <p 
                className="text-[clamp(1.1rem,2.5vw,1.5rem)] leading-relaxed max-w-2xl mx-auto font-serif italic"
                style={{ color: `color-mix(in srgb, ${palette.ink} 80%, ${palette.accent})` }}
              >
                {immersive.tagline}
              </p>
            </div>
          </section>

          {/* Atmosphere section */}
          <section className="relative px-6 py-20">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="font-serif text-3xl font-bold mb-6 flex items-center gap-3">
                    <Sparkles size={28} style={{ color: palette.accent }} />
                    Атмосфера
                  </h2>
                  <p className="text-lg leading-relaxed opacity-90">
                    {immersive.atmosphere}
                  </p>
                </div>
                <div 
                  className="p-8 relative"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in srgb, ${palette.accent} 15%, transparent), transparent)`,
                    borderLeft: `4px solid ${palette.accent}`,
                  }}
                >
                  <p className="text-sm font-bold tracking-widest uppercase mb-4 opacity-60">
                    Визуальный образ
                  </p>
                  <p className="text-lg leading-relaxed italic font-serif">
                    {immersive.illustration}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Key Themes */}
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
                    className="p-6 flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1"
                    style={{
                      background: `color-mix(in srgb, ${palette.paper} 90%, ${palette.accent})`,
                      borderBottom: `3px solid ${palette.accent}`,
                      boxShadow: `8px 8px 0 color-mix(in srgb, ${palette.shade} 20%, transparent)`,
                    }}
                  >
                    <span 
                      className="text-2xl font-bold font-serif opacity-40"
                      style={{ color: palette.accent }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-lg">{theme}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Emotional Journey */}
          <section className="relative px-6 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-serif text-3xl font-bold mb-6 flex items-center justify-center gap-3">
                <Heart size={28} style={{ color: palette.accent }} />
                Эмоциональное путешествие
              </h2>
              <p className="text-xl leading-relaxed opacity-90">
                {immersive.emotionalJourney}
              </p>
              
              {/* Mood indicators */}
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                {book.moods.map((mood, index) => (
                  <div 
                    key={index}
                    className="px-6 py-3"
                    style={{
                      background: `linear-gradient(90deg, ${palette.accent}, color-mix(in srgb, ${palette.accent} 60%, ${palette.shade}))`,
                      color: palette.paper,
                      transform: "skew(-5deg)",
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
                className="mx-auto mb-8 opacity-30"
                style={{ color: palette.accent }}
              />
              <div className="relative h-32 flex items-center justify-center">
                {immersive.quotes.map((quote, index) => (
                  <p
                    key={index}
                    className={`absolute inset-0 flex items-center justify-center font-serif text-2xl md:text-3xl italic leading-relaxed transition-all duration-700 ${
                      index === activeQuoteIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
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
                      index === activeQuoteIndex ? "scale-125" : "opacity-40"
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
                <div>
                  <h3 className="font-serif text-2xl font-bold mb-6 flex items-center gap-3">
                    <Star size={24} style={{ color: palette.accent }} />
                    Идеально для тех, кто...
                  </h3>
                  <ul className="space-y-4">
                    {immersive.perfectFor.map((item, index) => (
                      <li 
                        key={index}
                        className="flex items-start gap-3 text-lg"
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
                <div className="opacity-80">
                  <h3 className="font-serif text-2xl font-bold mb-6">
                    Возможно, не подойдёт...
                  </h3>
                  <ul className="space-y-4">
                    {immersive.notFor.map((item, index) => (
                      <li 
                        key={index}
                        className="flex items-start gap-3 text-lg opacity-80"
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
                <div className="flex items-center gap-4">
                  <Clock size={32} style={{ color: palette.accent }} />
                  <div>
                    <p className="text-sm font-bold tracking-widest uppercase opacity-60">Время чтения</p>
                    <p className="text-xl font-serif">{immersive.readingTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
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
              <p className="text-xl opacity-80 mb-10">
                {book.description}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => onBuy(book.key)}
                  className="min-h-[56px] px-10 py-4 text-lg font-bold transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: palette.accent,
                    color: palette.paper,
                    border: `2px solid ${palette.ink}`,
                    boxShadow: `8px 8px 0 ${palette.ink}`,
                  }}
                >
                  Купить книгу — {formatPrice(book.basePrice)}
                </button>
                <button
                  onClick={onClose}
                  className="min-h-[56px] px-10 py-4 text-lg font-bold transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "transparent",
                    color: palette.ink,
                    border: `2px solid ${palette.ink}`,
                  }}
                >
                  Вернуться к библиотеке
                </button>
              </div>
            </div>
          </section>

          {/* Footer spacer */}
          <div className="h-20" />
        </div>
      </div>
    </>
  );
}
