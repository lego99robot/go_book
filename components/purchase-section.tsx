"use client";

import { useState } from "react";
import { books, BookData, formatPrice, formatPriceFactor } from "@/lib/books-data";
import { SectionSeam } from "./book-illustrations";

interface PurchaseSectionProps {
  selectedBookKey: string;
  onSelectBook: (key: string) => void;
  showToast: (message: string) => void;
}

export function PurchaseSection({ selectedBookKey, onSelectBook, showToast }: PurchaseSectionProps) {
  const [format, setFormat] = useState<"print" | "ebook" | "gift">("print");
  
  const selectedBook = books.find(b => b.key === selectedBookKey) || books[0];
  const price = selectedBook.basePrice * formatPriceFactor[format];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatLabels = { print: "Печатная", ebook: "Электронная", gift: "Подарочная" };
    showToast(`Демо-оформление: ${selectedBook.title}, формат "${formatLabels[format]}", сумма ${formatPrice(price)}. Реальная оплата будет подключена позже.`);
  };

  return (
    <section 
      id="purchase" 
      className="relative overflow-hidden py-[clamp(5rem,8vw,8rem)] px-[clamp(1rem,5vw,5rem)] text-[#211a17]"
      style={{
        background: `linear-gradient(115deg, rgba(233, 103, 177, 0.18), transparent 28%),
                    radial-gradient(circle at 82% 18%, rgba(111, 177, 212, 0.28), transparent 19rem),
                    linear-gradient(135deg, #fff7df, #f3ecd8 58%, #d7eef8)`,
        borderTop: "1px solid rgba(33, 26, 23, 0.16)",
      }}
      aria-labelledby="purchase-title"
    >
      <SectionSeam variant="purchase" />

      {/* Background pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          background: `repeating-linear-gradient(115deg, rgba(33, 26, 23, 0.05) 0 1px, transparent 1px 9px)`,
        }}
      />

      {/* Purchase mark decoration */}
      <div className="absolute inset-[auto_-7rem_5%_auto] w-[min(46vw,37rem)] aspect-square pointer-events-none opacity-40 -rotate-[10deg]">
        <span 
          className="absolute inset-[6%_38%_42%_6%] border border-[rgba(33,26,23,0.55)] -skew-x-[8deg]"
          style={{ 
            background: "rgba(233, 103, 177, 0.54)",
            boxShadow: "12px 12px 0 rgba(33, 26, 23, 0.12)",
          }}
        />
        <span 
          className="absolute inset-[24%_8%_20%_42%] border border-[rgba(33,26,23,0.55)] -skew-x-[8deg]"
          style={{ 
            background: "rgba(29, 78, 137, 0.42)",
            boxShadow: "12px 12px 0 rgba(33, 26, 23, 0.12)",
          }}
        />
        <span 
          className="absolute inset-[58%_32%_8%_18%] border border-[rgba(33,26,23,0.55)] -skew-x-[8deg]"
          style={{ 
            background: "rgba(148, 255, 185, 0.36)",
            boxShadow: "12px 12px 0 rgba(33, 26, 23, 0.12)",
          }}
        />
      </div>

      {/* Ornament */}
      <div className="purchase-ornament">
        <svg className="ornament-vessel absolute right-0 top-1 w-[clamp(9.5rem,16vw,16rem)] rotate-[7deg] -skew-x-[3deg]" viewBox="0 0 260 260" preserveAspectRatio="xMidYMid meet">
          <path className="ornament-sheet" d="M74 35h104l22 156H92L74 35Z" />
          <path className="ornament-book" d="M39 92h142l-18 86H22l17-86Z" />
          <path className="ornament-book dark" d="M96 68h108l24 118H120L96 68Z" />
          <path className="ornament-ribbon" d="M174 42l34 16l-10 75l-18-18l-14 24l-4-79l12-18Z" />
          <path className="ornament-line" d="M30 204c54-18 112-18 174 0" />
          <path className="ornament-line" d="M54 222c36-10 82-10 140 0" />
        </svg>
        <svg className="ornament-vessel absolute right-[clamp(13rem,23vw,23rem)] top-[clamp(2.1rem,4vw,3.8rem)] w-[clamp(6.2rem,10.5vw,10rem)] opacity-70 -rotate-[8deg] skew-x-[5deg]" viewBox="0 0 260 260" preserveAspectRatio="xMidYMid meet">
          <path className="ornament-sail" d="M121 31l71 139H78L121 31Z" />
          <path className="ornament-book dark" d="M58 128h151l-27 54H28l30-54Z" />
          <path className="ornament-ribbon" d="M152 54l37 24l-17 66l-16-20l-19 18l3-70l12-18Z" />
          <path className="ornament-line" d="M36 202c45-16 105-15 178 2" />
          <path className="ornament-line" d="M68 221c31-8 72-7 123 4" />
        </svg>
        <svg className="ornament-vessel absolute right-[clamp(24rem,40vw,40rem)] top-[clamp(6rem,9vw,8rem)] w-[clamp(4.1rem,6.8vw,6.4rem)] opacity-50 rotate-[14deg] -skew-x-[10deg]" viewBox="0 0 260 260" preserveAspectRatio="xMidYMid meet">
          <path className="ornament-sheet" d="M91 50h79l-14 123H76L91 50Z" />
          <path className="ornament-book" d="M50 117h124l39 45H70L50 117Z" />
          <path className="ornament-keel" d="M86 164h116l-54 39l-62-39Z" />
          <path className="ornament-line" d="M43 210c34-11 84-10 150 2" />
        </svg>
        <span 
          className="ornament-vessel absolute right-[clamp(34rem,53vw,52rem)] top-[clamp(8rem,13vw,11.2rem)] w-[clamp(2.5rem,4.2vw,4.2rem)] aspect-square opacity-40 border border-[rgba(33,26,23,0.5)] -rotate-[18deg] skew-x-[12deg]"
          style={{
            background: `linear-gradient(135deg, rgba(233, 103, 177, 0.38), transparent 62%), rgba(148, 255, 185, 0.24)`,
          }}
        />
      </div>

      {/* Shell content */}
      <div className="relative z-[1] w-full max-w-[1280px] mx-auto">
        {/* Copy */}
        <div className="grid gap-4 w-full max-w-[29.5rem] mb-[clamp(2rem,4vw,3rem)]">
          <p className="m-0 uppercase text-xs font-bold tracking-[0.16em] text-[var(--red)]">
            Книжная касса
          </p>
          <h2 id="purchase-title" className="max-w-[12ch] m-0 font-serif text-[clamp(2rem,4vw,3.9rem)] leading-[0.96]">
            Оформить книгу
          </h2>
          <p className="max-w-[29.5rem] m-0 text-[clamp(1rem,1.35vw,1.18rem)] leading-relaxed">
            Демо-блок покупки: здесь можно выбрать атмосферу, формат и перейти к
            оформлению. Реальную ссылку на магазин можно будет подключить позже.
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(18rem,0.74fr)_minmax(25rem,1fr)] gap-[clamp(1.2rem,3vw,3rem)] items-stretch">
          {/* Selector */}
          <div className="grid gap-4 content-start" aria-label="Выбор книги">
            {books.map((book, index) => (
              <button
                key={book.key}
                onClick={() => onSelectBook(book.key)}
                className={`w-full min-h-24 p-4 text-left text-[#211a17] border border-[rgba(33,26,23,0.38)] cursor-pointer transition-all duration-200 ${
                  selectedBookKey === book.key 
                    ? "translate-x-1 translate-y-1 shadow-[4px_4px_0_rgba(33,26,23,0.22)]" 
                    : "shadow-[9px_9px_0_rgba(33,26,23,0.1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_rgba(33,26,23,0.22)]"
                }`}
                style={{
                  background: selectedBookKey === book.key
                    ? `linear-gradient(90deg, rgba(33, 26, 23, 0.12) 0 0.42rem, transparent 0.42rem),
                       linear-gradient(135deg, rgba(233, 103, 177, 0.22), transparent 52%),
                       rgba(255, 248, 226, 0.94)`
                    : `linear-gradient(135deg, rgba(255, 255, 255, 0.72), transparent 54%),
                       rgba(255, 248, 226, 0.84)`,
                  borderColor: selectedBookKey === book.key ? "#211a17" : "rgba(33, 26, 23, 0.38)",
                }}
                aria-pressed={selectedBookKey === book.key}
              >
                <span className="block mb-2 text-[rgba(33,26,23,0.64)] text-xs font-extrabold tracking-[0.16em] leading-tight uppercase">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong className="block font-serif text-[clamp(1.45rem,2.4vw,2.1rem)] leading-[0.95]">
                  {book.title}
                </strong>
                <small className="block mt-2 text-[rgba(33,26,23,0.72)] font-bold">
                  {book.mood.split(",")[0]}
                </small>
              </button>
            ))}
          </div>

          {/* Checkout card */}
          <form 
            className="relative grid gap-4 min-w-0 p-[clamp(1.35rem,3vw,2.3rem)] text-[#f7f4ea] border border-[rgba(244,241,232,0.2)]"
            style={{
              background: `repeating-linear-gradient(145deg, rgba(255, 255, 255, 0.06) 0 2px, transparent 2px 9px),
                          linear-gradient(135deg, #171512, #07111f 72%)`,
              boxShadow: `18px 18px 0 color-mix(in srgb, ${selectedBook.palette.accent} 28%, transparent),
                         inset 0 0 0 1px rgba(244, 241, 232, 0.08)`,
              "--checkout-accent": selectedBook.palette.accent,
            } as React.CSSProperties}
            onSubmit={handleSubmit}
            aria-label="Оформление книги"
          >
            {/* Corner decoration */}
            <div className="absolute inset-[1rem_1rem_auto_auto] w-16 h-16 border-t border-r border-[rgba(244,241,232,0.38)]" />

            <p className="block mb-2 text-[rgba(33,26,23,0.64)] text-xs font-extrabold tracking-[0.16em] leading-tight uppercase text-[rgba(244,241,232,0.64)]">
              выбрано к покупке
            </p>
            <h3 className="max-w-[16ch] m-0 font-serif text-[clamp(2.3rem,5vw,4.8rem)] leading-[0.9]">
              {selectedBook.title}
            </h3>
            <p className="m-0 text-[rgba(244,241,232,0.78)] font-extrabold">
              {selectedBook.author}
            </p>
            <p className="max-w-[42rem] m-0 text-[rgba(244,241,232,0.82)] text-base leading-relaxed">
              {selectedBook.description}
            </p>

            {/* Format grid */}
            <div className="grid grid-cols-3 gap-3 mt-1" aria-label="Формат книги">
              {(["print", "ebook", "gift"] as const).map((f) => (
                <label key={f} className="min-w-0">
                  <input
                    type="radio"
                    name="format"
                    value={f}
                    checked={format === f}
                    onChange={() => setFormat(f)}
                    className="absolute opacity-0 pointer-events-none"
                  />
                  <span 
                    className={`grid min-h-12 place-items-center py-3 px-4 text-[#f7f4ea] font-extrabold text-center border cursor-pointer transition-all duration-200 ${
                      format === f 
                        ? "text-[#171512]" 
                        : "border-[rgba(244,241,232,0.3)]"
                    }`}
                    style={format === f ? {
                      background: `color-mix(in srgb, ${selectedBook.palette.accent} 64%, #f4f1e8)`,
                      boxShadow: "5px 5px 0 rgba(244, 241, 232, 0.18)",
                    } : {}}
                  >
                    {f === "print" ? "Печатная" : f === "ebook" ? "Электронная" : "Подарочная"}
                  </span>
                </label>
              ))}
            </div>

            {/* Price row */}
            <div className="flex items-baseline justify-between gap-4 mt-1 pt-4 border-t border-[rgba(244,241,232,0.24)]">
              <span className="text-[rgba(244,241,232,0.7)] font-extrabold tracking-[0.08em] uppercase">
                Стоимость
              </span>
              <strong className="text-[clamp(1.8rem,3.5vw,3.1rem)] leading-none">
                {formatPrice(price)}
              </strong>
            </div>

            <button
              type="submit"
              className="min-h-14 mt-1 py-4 px-5 text-[#171512] font-black bg-[#f4f1e8] border border-[#f4f1e8] cursor-pointer transition-colors duration-200"
              style={{
                ["--checkout-accent" as string]: selectedBook.palette.accent,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = selectedBook.palette.accent;
                e.currentTarget.style.borderColor = selectedBook.palette.accent;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#f4f1e8";
                e.currentTarget.style.borderColor = "#f4f1e8";
              }}
            >
              Оформить книгу
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
