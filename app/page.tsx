"use client";

import { useState, useEffect, useCallback } from "react";
import { books, BookData } from "@/lib/books-data";
import { PortalField } from "@/components/portal-field";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { BookSection } from "@/components/book-section";
import { PurchaseSection } from "@/components/purchase-section";
import { ImmersiveModal } from "@/components/immersive-modal";
import { Toast, useToast } from "@/components/toast";

export default function LibraryPage() {
  const [selectedPurchaseBook, setSelectedPurchaseBook] = useState("alice");
  const [immersiveBook, setImmersiveBook] = useState<BookData | null>(null);
  const [isImmersiveOpen, setIsImmersiveOpen] = useState(false);
  const { message, isVisible, showToast } = useToast();

  // Update portal theme based on visible book section
  useEffect(() => {
    const setActiveTheme = (index: number) => {
      const theme = books[index]?.sceneTheme || books[0].sceneTheme;
      document.documentElement.style.setProperty("--portal-primary", theme.primary);
      document.documentElement.style.setProperty("--portal-secondary", theme.secondary);
      document.documentElement.style.setProperty("--portal-dark", theme.dark);
      document.documentElement.style.setProperty("--portal-light", theme.light);
      document.documentElement.style.setProperty("--portal-glow", theme.glow);
    };

    setActiveTheme(0);

    const bookSections = document.querySelectorAll("[data-book-index]");
    
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveTheme(Number((visible.target as HTMLElement).dataset.bookIndex));
        }
      },
      { threshold: [0.24, 0.42, 0.6] }
    );

    bookSections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleOpenImmersive = useCallback((book: BookData) => {
    setImmersiveBook(book);
    setIsImmersiveOpen(true);
  }, []);

  const handleCloseImmersive = useCallback(() => {
    setIsImmersiveOpen(false);
  }, []);

  const handleBuyFromImmersive = useCallback((bookKey: string) => {
    setIsImmersiveOpen(false);
    setSelectedPurchaseBook(bookKey);
    setTimeout(() => {
      const purchaseSection = document.getElementById("purchase");
      purchaseSection?.scrollIntoView({ behavior: "smooth", block: "start" });
      const book = books.find(b => b.key === bookKey);
      showToast(`Выбрано: ${book?.title}. Можно оформить ниже.`);
    }, 400);
  }, [showToast]);

  const handleBuyFromSection = useCallback((bookKey: string) => {
    setSelectedPurchaseBook(bookKey);
    const purchaseSection = document.getElementById("purchase");
    purchaseSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    const book = books.find(b => b.key === bookKey);
    showToast(`Выбрано: ${book?.title}. Можно оформить ниже.`);
  }, [showToast]);

  return (
    <>
      <PortalField />
      <Header />
      
      <main id="top" className="relative z-[2]">
        <HeroSection />
        
        {books.map((book, index) => (
          <BookSection
            key={book.key}
            book={book}
            index={index}
            onOpenImmersive={handleOpenImmersive}
            onBuy={handleBuyFromSection}
            nextBookHref={
              index < books.length - 1 
                ? `#${books[index + 1].key === "moby" ? "moby-dick" : books[index + 1].key}` 
                : "#top"
            }
            nextBookLabel={
              index < books.length - 1 
                ? index === 0 ? "Следующая атмосфера" : index === 1 ? "К морю" : "Вернуться к порталу"
                : "Вернуться к порталу"
            }
          />
        ))}

        <PurchaseSection
          selectedBookKey={selectedPurchaseBook}
          onSelectBook={setSelectedPurchaseBook}
          showToast={showToast}
        />
      </main>

      <footer className="relative z-[2] py-8 px-[clamp(1rem,5vw,5rem)] text-[rgba(244,240,231,0.76)] bg-[#171512]">
        <p className="max-w-[62rem] mx-auto leading-relaxed">
          Статический прототип для GitHub Pages. Комментарии и покупка работают как демонстрация идеи.
        </p>
      </footer>

      <Toast message={message} isVisible={isVisible} />
      
      <ImmersiveModal
        book={immersiveBook}
        isOpen={isImmersiveOpen}
        onClose={handleCloseImmersive}
        onBuy={handleBuyFromImmersive}
      />
    </>
  );
}
