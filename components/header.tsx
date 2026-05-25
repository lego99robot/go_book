"use client";

import Link from "next/link";

export function Header() {
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-10 h-[var(--header-h)] flex items-center justify-between gap-2 sm:gap-4 px-[clamp(0.85rem,4vw,3.5rem)] border-b border-[rgba(23,21,18,0.08)] bg-[rgba(244,240,231,0.72)] backdrop-blur-[18px]"
      aria-label="Главная навигация"
    >
      <Link 
        href="#top" 
        className="flex shrink-0 items-center gap-3 font-bold tracking-normal"
        aria-label="К началу страницы"
      >
        <span className="w-6 h-6 inline-block bg-[linear-gradient(90deg,var(--black)_0_48%,transparent_48%),linear-gradient(0deg,var(--red)_0_50%,var(--yellow)_50%)] -rotate-[8deg] border border-[var(--black)]" />
        <span className="max-[560px]:sr-only">Читательская полка</span>
      </Link>
      <nav className="flex min-w-0 items-center justify-end gap-[clamp(0.55rem,2.5vw,2rem)] text-[rgba(23,21,18,0.74)] text-[0.8rem] sm:text-sm font-semibold" aria-label="Навигация по книгам">
        <Link href="#alice" className="py-1 border-b-2 border-transparent hover:border-current transition-colors">Алиса</Link>
        <Link href="#frankenstein" className="py-1 border-b-2 border-transparent hover:border-current transition-colors">Франкенштейн</Link>
        <Link href="#moby-dick" className="py-1 border-b-2 border-transparent hover:border-current transition-colors">Моби Дик</Link>
      </nav>
    </header>
  );
}
