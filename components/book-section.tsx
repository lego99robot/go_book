"use client";

import { useState, useRef } from "react";
import { BookData } from "@/lib/books-data";
import { BookIllustration, SectionSeam } from "./book-illustrations";
import { FloatingParticles } from "./floating-particles";
import { MagneticButton, MagneticLink } from "./magnetic-button";
import { useInView } from "@/hooks/use-in-view";
import { useParallax } from "@/hooks/use-parallax";
import { Eye } from "lucide-react";

interface BookSectionProps {
  book: BookData;
  index: number;
  onOpenImmersive: (book: BookData) => void;
  onBuy: (bookKey: string) => void;
  nextBookHref?: string;
  nextBookLabel?: string;
}

export function BookSection({ 
  book, 
  index, 
  onOpenImmersive, 
  onBuy,
  nextBookHref = "#top",
  nextBookLabel = "Вернуться к порталу"
}: BookSectionProps) {
  const [comment, setComment] = useState("");
  const [demoNote, setDemoNote] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inViewRef, isInView] = useInView({ threshold: 0.2, rootMargin: "-50px" });
  const parallax = useParallax(sectionRef, 0.3);

  const sectionId = book.key === "moby" ? "moby-dick" : book.key;
  const { palette, sceneTheme } = book;

  const bookStyles = {
    "--accent-color": palette.accent,
    "--ink-color": palette.ink,
    "--paper-color": palette.paper,
    "--shade-color": palette.shade,
  } as React.CSSProperties;

  const isAlice = book.key === "alice";
  const isFrankenstein = book.key === "frankenstein";
  const isMoby = book.key === "moby";

  const getSectionBackground = () => {
    if (isMoby) {
      return `linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent 30%),
              radial-gradient(circle at 62% 18%, rgba(244, 241, 232, 0.2), transparent 16rem),
              linear-gradient(135deg, #07111f, #0b233f 60%, #06101d)`;
    }
    return `radial-gradient(circle at 82% 18%, color-mix(in srgb, ${palette.accent} 28%, transparent), transparent 24rem),
            linear-gradient(135deg, color-mix(in srgb, ${palette.paper} 94%, white), ${palette.paper})`;
  };

  const handleNoteSubmit = () => {
    if (!comment.trim()) return;
    setDemoNote(comment);
    setComment("");
  };

  const getQuoteCardStyle = () => {
    if (isFrankenstein) {
      return {
        color: "#d8f6e3",
        background: `linear-gradient(135deg, rgba(148, 255, 185, 0.12), transparent 46%), rgba(6, 16, 12, 0.78)`,
        borderColor: "rgba(148, 255, 185, 0.28)",
        boxShadow: "-10px 12px 0 rgba(148, 255, 185, 0.16)",
      };
    }
    if (isMoby) {
      return {
        color: "#f7f4ea",
        background: `linear-gradient(135deg, rgba(111, 177, 212, 0.18), transparent 46%), rgba(7, 17, 31, 0.7)`,
        borderColor: "rgba(244, 241, 232, 0.28)",
        boxShadow: "-10px 12px 0 rgba(111, 177, 212, 0.16)",
      };
    }
    return {
      color: palette.ink,
      background: `linear-gradient(135deg, color-mix(in srgb, ${palette.accent} 22%, transparent), transparent 46%), color-mix(in srgb, ${palette.paper} 80%, white)`,
      boxShadow: `-10px 12px 0 color-mix(in srgb, ${palette.accent} 28%, transparent)`,
    };
  };

  const getCommentCardStyle = () => {
    if (isFrankenstein) {
      return {
        background: `linear-gradient(135deg, rgba(148, 255, 185, 0.28), transparent 45%), #dff8d8`,
        boxShadow: `-12px 16px 0 rgba(148, 255, 185, 0.16), inset 0 -20px 40px rgba(24, 92, 52, 0.08)`,
        transform: "rotate(-1.8deg)",
      };
    }
    if (isMoby) {
      return {
        background: `linear-gradient(135deg, rgba(111, 177, 212, 0.32), transparent 45%), #f5f2e9`,
        transform: "rotate(1deg)",
      };
    }
    return {
      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.5), transparent 40%), #ffe86d`,
      boxShadow: `12px 16px 0 rgba(0, 0, 0, 0.16), inset 0 -20px 40px rgba(191, 126, 0, 0.08)`,
      transform: "rotate(1.4deg)",
    };
  };

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className="relative min-h-[105vh] py-[clamp(5rem,8vw,8.5rem)] px-[clamp(1rem,5vw,5rem)] overflow-hidden isolate"
      style={{
        ...bookStyles,
        color: palette.ink,
        background: getSectionBackground(),
        borderTop: `1px solid color-mix(in srgb, ${palette.accent} 28%, transparent)`,
      }}
      data-book-index={index}
    >
      {/* Floating particles */}
      <FloatingParticles 
        bookKey={book.key} 
        theme={sceneTheme} 
        isActive={isInView} 
      />

      {/* Seam for non-first sections */}
      {index > 0 && (
        <SectionSeam variant={isFrankenstein ? "frank" : isMoby ? "moby" : "frank"} />
      )}

      {/* Book illustration with parallax */}
      <div 
        style={{ 
          transform: `translateY(${parallax.y}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <BookIllustration bookKey={book.key} />
      </div>

      {/* Decorative patterns */}
      {isAlice && (
        <>
          <div 
            className="absolute inset-[9%_-4%_auto_auto] w-96 h-96 opacity-[0.12] rotate-[12deg] -skew-x-6 pointer-events-none"
            style={{
              background: `linear-gradient(45deg, #1d1922 25%, transparent 25% 75%, #1d1922 75%),
                          linear-gradient(45deg, #1d1922 25%, transparent 25% 75%, #1d1922 75%)`,
              backgroundPosition: "0 0, 1.3rem 1.3rem",
              backgroundSize: "2.6rem 2.6rem",
              transform: `rotate(12deg) skewX(-6deg) translateY(${parallax.y * 0.5}px)`,
            }}
          />
          <div 
            className="absolute inset-[auto_auto_8%_-7%] w-[42rem] h-60 opacity-100 -rotate-[8deg] pointer-events-none"
            style={{
              background: `linear-gradient(90deg, rgba(29, 25, 34, 0.1) 0 1px, transparent 1px 50%),
                          linear-gradient(0deg, rgba(29, 25, 34, 0.1) 0 1px, transparent 1px 50%)`,
              backgroundSize: "2.2rem 2.2rem",
            }}
          />
        </>
      )}

      {/* Section inner content with fade-in animation */}
      <div 
        ref={inViewRef}
        className="relative z-[2] w-full max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(19rem,0.78fr)_minmax(23rem,1fr)_minmax(17rem,0.66fr)] gap-[clamp(1.5rem,3vw,3.5rem)] items-center"
        style={{
          opacity: isInView ? 1 : 0,
          transform: isInView ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
        }}
      >
        {/* Book meta with staggered animation */}
        <div 
          className="relative min-w-0"
          style={{
            transform: `translateY(${parallax.y * -0.5}px)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          <p 
            className="m-0 mb-4 uppercase text-xs font-bold tracking-[0.16em]"
            style={{ color: palette.accent }}
          >
            {book.chapter}
          </p>
          <div className="relative w-fit max-w-full">
            <div 
              className="absolute inset-[10%_-0.12em_4%_0.08em] -z-[1] -skew-x-[8deg] -rotate-1"
              style={{ background: `color-mix(in srgb, ${palette.accent} 16%, transparent)` }}
            />
            {book.key === "frankenstein" ? (
              <h2 className="m-0 max-w-[7ch] font-serif text-[clamp(2.45rem,3.9vw,4.1rem)] font-bold leading-[0.9]">
                <span className="block">Франкен</span>
                <span 
                  className="block -mt-[0.18em] pl-[0.42em]"
                  style={{ color: `color-mix(in srgb, ${palette.ink} 78%, ${palette.accent})` }}
                >
                  штейн
                </span>
              </h2>
            ) : (
              <h2 className="m-0 max-w-[9.2ch] font-serif text-[clamp(2.25rem,3.65vw,3.95rem)] font-bold leading-[1.04]">
                {book.title}
              </h2>
            )}
          </div>
          <p 
            className="mt-4 font-bold"
            style={{ color: `color-mix(in srgb, ${palette.ink} 70%, ${palette.accent})` }}
          >
            {book.author}
          </p>
          <div 
            className="w-[min(15rem,65%)] h-3 mt-8"
            style={{ 
              background: palette.accent,
              boxShadow: `20px 18px 0 color-mix(in srgb, ${palette.shade} 80%, transparent)`,
            }}
          />
        </div>

        {/* Book content with levitation effect on hover */}
        <div 
          className="relative z-[3] min-w-0 max-w-[42rem] p-[clamp(1.15rem,2.2vw,1.7rem)] backdrop-blur-[8px] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          style={{
            borderLeft: `4px solid ${palette.accent}`,
            background: `repeating-linear-gradient(150deg, rgba(255, 255, 255, 0.08) 0 2px, transparent 2px 8px),
                        color-mix(in srgb, ${palette.paper} 82%, transparent)`,
            boxShadow: `18px 18px 0 color-mix(in srgb, ${palette.shade} 18%, transparent)`,
          }}
          data-entry={`READ / ${String(index + 1).padStart(2, "0")}`}
        >
          {/* Entry label */}
          <span 
            className="absolute top-4 right-4 max-w-32 text-[0.68rem] font-extrabold tracking-[0.16em] leading-tight text-right uppercase"
            style={{ color: `color-mix(in srgb, ${palette.ink} 34%, transparent)` }}
          >
            READ / {String(index + 1).padStart(2, "0")}
          </span>

          {/* Corner fold */}
          <div 
            className="absolute right-[-1px] bottom-[-1px] w-11 h-11 opacity-80"
            style={{
              borderLeft: `1px solid color-mix(in srgb, ${palette.ink} 24%, transparent)`,
              borderTop: `1px solid color-mix(in srgb, ${palette.ink} 24%, transparent)`,
              background: `linear-gradient(135deg, transparent 50%, color-mix(in srgb, ${palette.accent} 34%, transparent) 50%)`,
            }}
          />

          <p 
            className="m-0 mr-[7.5rem] mb-4 text-xs font-extrabold tracking-[0.16em] leading-tight uppercase"
            style={{ color: `color-mix(in srgb, ${palette.ink} 62%, ${palette.accent})` }}
          >
            {book.kicker}
          </p>

          <div 
            className="relative py-4 pl-4"
            style={{ borderLeft: `1px solid color-mix(in srgb, ${palette.accent} 70%, transparent)` }}
          >
            <div 
              className="absolute left-[-0.28rem] top-4 w-2 h-2 rotate-45"
              style={{ background: palette.accent }}
            />
            <p className="m-0 text-[clamp(1rem,1.4vw,1.18rem)] leading-relaxed">
              {book.note}
            </p>
          </div>

          {/* Mood scale */}
          <div 
            className="grid gap-2 mt-5 pt-4"
            style={{ borderTop: `1px solid color-mix(in srgb, ${palette.ink} 26%, transparent)` }}
            aria-label="Профиль ощущения книги"
          >
            <p 
              className="m-0 mb-1 text-xs font-extrabold tracking-[0.14em] leading-tight uppercase"
              style={{ color: `color-mix(in srgb, ${palette.ink} 72%, ${palette.accent})` }}
            >
              Профиль ощущения
            </p>
            {book.moods.map((mood, i) => (
              <div 
                key={i}
                className="grid grid-cols-[minmax(7.5rem,0.52fr)_minmax(8rem,1fr)] gap-3 items-center -skew-x-[4deg]"
              >
                <span 
                  className="min-w-0 text-sm font-bold leading-tight skew-x-[4deg]"
                  style={{ color: `color-mix(in srgb, ${palette.ink} 82%, ${palette.accent})` }}
                >
                  {mood.label}
                </span>
                <span 
                  className="relative h-2 overflow-hidden"
                  style={{
                    border: `1px solid color-mix(in srgb, ${palette.ink} 30%, transparent)`,
                    background: `repeating-linear-gradient(135deg, color-mix(in srgb, ${palette.ink} 9%, transparent) 0 2px, transparent 2px 7px),
                                color-mix(in srgb, ${palette.paper} 60%, transparent)`,
                  }}
                >
                  <span 
                    className="mood-fill"
                    style={{ 
                      "--value": `${mood.value}%`,
                      transitionDelay: `${i * 150 + 300}ms`,
                    } as React.CSSProperties}
                  />
                </span>
              </div>
            ))}
          </div>

          {/* Actions with magnetic buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <MagneticButton
              onClick={() => onOpenImmersive(book)}
              className="min-h-[46px] inline-flex items-center justify-center gap-2 border px-5 py-3 font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: palette.accent,
                color: palette.paper,
                borderColor: palette.ink,
                boxShadow: `5px 5px 0 ${palette.ink}`,
              }}
              intensity={0.2}
            >
              <Eye size={18} />
              Погрузиться в мир
            </MagneticButton>
            <MagneticButton
              onClick={() => onBuy(book.key)}
              className="min-h-[46px] inline-flex items-center justify-center border px-5 py-3 font-bold cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "transparent",
                color: palette.ink,
                borderColor: palette.ink,
              }}
              intensity={0.2}
            >
              Купить книгу
            </MagneticButton>
            <MagneticLink 
              href={nextBookHref}
              className="min-h-[46px] inline-flex items-center justify-center border border-current px-5 py-3 font-bold cursor-pointer transition-all duration-200 bg-transparent hover:-translate-y-0.5"
              style={{ color: palette.ink }}
              intensity={0.2}
            >
              {nextBookLabel}
            </MagneticLink>
          </div>
        </div>

        {/* Aside with staggered animation */}
        <aside 
          className="relative z-[4] grid gap-4 self-stretch min-w-0"
          id={isMoby ? "comments" : undefined}
          style={{
            transform: `translateY(${parallax.y * 0.3}px)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          {/* Quote card with hover levitation */}
          <div 
            className="relative p-[clamp(1rem,2vw,1.45rem)] border -rotate-[1.1deg] transition-all duration-300 hover:-translate-y-1 hover:rotate-0"
            style={getQuoteCardStyle()}
          >
            <p className="m-0 mb-4 uppercase text-xs font-bold tracking-[0.16em]">
              Цитата читателя
            </p>
            <blockquote className="m-0 font-serif text-[clamp(1.35rem,2vw,2.1rem)] leading-tight">
              &ldquo;{book.quote}&rdquo;
            </blockquote>
          </div>

          {/* Comment card */}
          <div 
            className="relative z-[2] min-h-72 p-[clamp(1rem,2vw,1.45rem)] border border-[rgba(37,27,20,0.3)] text-[#251b14] transition-all duration-300 hover:-translate-y-1"
            style={getCommentCardStyle()}
          >
            <p className="m-0 mb-4 uppercase text-xs font-bold tracking-[0.16em]">
              Публичный стикер
            </p>
            <label htmlFor={`${book.key}-note`} className="block mb-2 font-bold">
              Ваш комментарий
            </label>
            <textarea
              id={`${book.key}-note`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Напишите впечатление..."
              className="w-full min-h-28 resize-y border border-[rgba(37,27,20,0.28)] bg-[rgba(255,255,255,0.42)] text-[#251b14] p-4 outline-none focus:border-[#251b14] focus:shadow-[0_0_0_3px_rgba(37,27,20,0.1)] transition-all duration-200"
            />
            <button
              onClick={handleNoteSubmit}
              className="mt-3 min-h-10 px-4 py-2 font-bold text-[#251b14] bg-[#fff6a0] border border-current transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_currentColor]"
            >
              Приклеить
            </button>
            {demoNote && (
              <p className="mt-4 p-3 border border-dashed border-[rgba(37,27,20,0.35)] bg-[rgba(255,255,255,0.32)] leading-relaxed animate-fade-in">
                Демо-комментарий: {demoNote}
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
