"use client";

import { BookData } from "@/lib/books-data";

interface BookIllustrationProps {
  bookKey: string;
}

export function AliceIllustration() {
  return (
    <div className="book-illustration alice-illustration" aria-hidden="true">
      <svg viewBox="0 0 560 560" role="img">
        <path d="M64 130h118v118H64zM182 248h118v118H182zM300 130h118v118H300zM64 366h118v118H64z" />
        <circle cx="392" cy="354" r="86" />
        <path d="M392 246c54 58 53 158 0 216c-54-58-53-158 0-216Z" />
        <path d="M438 91c-39 24-55 62-47 115c36-27 53-65 47-115Z" />
      </svg>
    </div>
  );
}

export function FrankensteinIllustration() {
  return (
    <div className="book-illustration frank-illustration" aria-hidden="true">
      <svg viewBox="0 0 560 560" role="img">
        <path d="M146 96h178l-36 126h88L194 502l48-176h-90l-6-230Z" />
        <path d="M360 80h88v190h-88zM89 252h92v230H89z" />
        <path d="M421 274c-66 13-106 54-119 123c68-10 109-51 119-123Z" />
        <path d="M103 96l115 82M431 425l-132-78M423 145l-91 94" />
      </svg>
    </div>
  );
}

export function MobyIllustration() {
  return (
    <div className="book-illustration moby-illustration" aria-hidden="true">
      <svg viewBox="0 0 560 560" role="img">
        <path className="whale-body" d="M54 337c78-82 187-116 327-100c68 8 113 32 134 70c-52 25-121 32-206 20c-68 66-147 94-238 82c-25-3-36-41-17-72Z" />
        <path className="whale-belly" d="M96 386c86 19 171 7 255-35c-45 57-115 83-210 78c-35-2-50-18-45-43Z" />
        <path className="whale-tail" d="M382 239c34-62 83-93 149-91c-10 63-51 103-124 120c66 7 111 34 135 82c-65 16-119 1-160-45" />
        <path className="whale-fin" d="M258 337c-8 58-35 101-81 129c-7-53 12-96 81-129Z" />
        <path className="sea-line sea-line-one" d="M25 448c112 27 231 22 358-16c54-16 104-22 151-18" />
        <path className="sea-line sea-line-two" d="M59 497c96 21 202 14 318-21c43-13 86-19 130-18" />
        <circle className="whale-eye" cx="142" cy="329" r="7" />
      </svg>
    </div>
  );
}

export function BookIllustration({ bookKey }: BookIllustrationProps) {
  switch (bookKey) {
    case "alice":
      return <AliceIllustration />;
    case "frankenstein":
      return <FrankensteinIllustration />;
    case "moby":
      return <MobyIllustration />;
    default:
      return null;
  }
}

export function SectionSeam({ variant }: { variant: "frank" | "moby" | "purchase" }) {
  const opacityClass = variant === "frank" ? "opacity-[0.52]" : variant === "moby" ? "opacity-[0.62]" : "opacity-[0.48]";
  
  return (
    <div className={`section-seam ${opacityClass}`} aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M-40 70C170 16 270 114 482 62S792 8 988 58s316 72 492 10" />
        <path d="M-52 92C180 38 315 126 512 78s315-34 492 12 276 48 488-24" />
        <path d="M-30 44C150 88 335 5 530 38s335 94 522 46 292-86 430-34" />
      </svg>
    </div>
  );
}
