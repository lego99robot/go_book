"use client";

import { useEffect, useState } from "react";

export default function ClassicPage() {
  const [classicSrc, setClassicSrc] = useState("");

  useEffect(() => {
    const basePath = window.location.pathname.replace(/\/classic\/?$/, "");
    setClassicSrc(`${basePath || ""}/classic-static/index.html`);
  }, []);

  return (
    <main className="min-h-dvh bg-[#f4f0e7]">
      {classicSrc ? (
        <iframe
          src={classicSrc}
          title="Простая версия сайта"
          className="block h-dvh w-full border-0"
        />
      ) : (
        <div className="flex min-h-dvh items-center justify-center px-6 text-center text-[#171512]">
          Загрузка простой версии...
        </div>
      )}
    </main>
  );
}
