"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="min-h-screen py-[calc(var(--header-h)+5vw)] pb-[7vw] px-[clamp(1rem,6vw,6rem)] grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,1.1fr)] gap-[clamp(2rem,5vw,6rem)] items-center" data-scene="hero">
      <div className="max-w-[55rem] min-w-0">
        <p className="m-0 mb-4 uppercase text-xs font-bold tracking-[0.16em] text-[var(--red)]">
          Личная библиотека прочитанных книг
        </p>
        <h1 className="max-w-[13ch] m-0 font-serif text-[clamp(2.35rem,4.6vw,4.35rem)] font-bold leading-none text-balance">
          Один живой портал чтения.
        </h1>
        <p className="max-w-[42rem] mt-8 text-[clamp(1.05rem,2vw,1.35rem)] leading-relaxed text-[var(--muted)]">
          Минималистичная полка превращается в кубистическую карту впечатлений:
          каждая книга меняет свет, геометрию и настроение страницы.
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-8" aria-label="Действия">
          <Link 
            href="#alice" 
            className="min-h-[46px] inline-flex items-center justify-center border border-current px-5 py-3 font-bold cursor-pointer transition-all duration-200 bg-[var(--text)] text-[var(--cream)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_currentColor]"
          >
            Открыть библиотеку
          </Link>
          <Link 
            href="#comments" 
            className="min-h-[46px] inline-flex items-center justify-center border border-current px-5 py-3 font-bold cursor-pointer transition-all duration-200 bg-transparent hover:-translate-y-0.5 hover:shadow-[5px_5px_0_currentColor]"
          >
            Оставить заметку
          </Link>
        </div>
      </div>
    </section>
  );
}
