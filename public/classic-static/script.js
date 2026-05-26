const books = [
  {
    title: "Алиса в Стране чудес",
    author: "Льюис Кэрролл",
    mood: "абсурд, шахматы, пастель и чернила",
    palette: ["#e967b1", "#f7efd8", "#1d1922", "#b8ddf1"],
    description: "Двери, шахматные клетки и логика, которая улыбается в ответ.",
    buyLabel: "Купить книгу",
    sampleComment: "После этой книги обычная комната кажется слишком уверенной в своих углах.",
    sceneTheme: {
      primary: "#e967b1",
      secondary: "#b8ddf1",
      dark: "#1d1922",
      light: "#fff6c7",
      glow: "rgba(233, 103, 177, 0.26)",
    },
  },
  {
    title: "Франкенштейн",
    author: "Мэри Шелли",
    mood: "готическая лаборатория и холодное электричество",
    palette: ["#94ffb9", "#101915", "#d8f6e3", "#4d6b5a"],
    description: "Молния, ответственность и вопрос, где заканчивается создатель.",
    buyLabel: "Купить книгу",
    sampleComment: "Самый страшный момент не в молнии, а в тишине после нее.",
    sceneTheme: {
      primary: "#94ffb9",
      secondary: "#4d6b5a",
      dark: "#06100c",
      light: "#d8f6e3",
      glow: "rgba(148, 255, 185, 0.24)",
    },
  },
  {
    title: "Моби Дик",
    author: "Герман Мелвилл",
    mood: "море, графитовая глубина и белая бездна",
    palette: ["#f4f1e8", "#07111f", "#1d4e89", "#6fb1d4"],
    description: "Горизонт, навязчивая цель и белая форма, которая молчит громче шторма.",
    buyLabel: "Купить книгу",
    sampleComment: "Белый кит здесь не финал, а огромный пробел, который читатель заполняет собой.",
    sceneTheme: {
      primary: "#f4f1e8",
      secondary: "#1d4e89",
      dark: "#020915",
      light: "#6fb1d4",
      glow: "rgba(111, 177, 212, 0.24)",
    },
  },
];

window.libraryBooks = books;

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;
const toast = document.querySelector(".toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3200);
}

function setActiveTheme(index) {
  const theme = books[index]?.sceneTheme || books[0].sceneTheme;
  document.body.dataset.activeBook = String(index);
  root.style.setProperty("--portal-primary", theme.primary);
  root.style.setProperty("--portal-secondary", theme.secondary);
  root.style.setProperty("--portal-dark", theme.dark);
  root.style.setProperty("--portal-light", theme.light);
  root.style.setProperty("--portal-glow", theme.glow);
}

setActiveTheme(0);

document.querySelectorAll(".buy-button").forEach((button) => {
  button.addEventListener("click", () => {
    const book = button.dataset.buy;
    showToast(`Демо: ссылка на покупку "${book}" будет добавлена позже.`);
  });
});

document.querySelectorAll(".note-button").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".comment-card");
    const textarea = card?.querySelector("textarea");
    const value = textarea?.value.trim();

    if (!value) {
      showToast("Стикер пустой. Напишите короткое впечатление, и он появится как демо-комментарий.");
      textarea?.focus();
      return;
    }

    const oldDemo = card.querySelector(".demo-note");
    oldDemo?.remove();

    const note = document.createElement("p");
    note.className = "demo-note";
    note.textContent = `Демо-комментарий: ${value}`;
    card.append(note);
    textarea.value = "";
    showToast(`Стикер для "${button.dataset.noteFor}" приклеен в демо-режиме.`);
  });
});

const bookSections = [...document.querySelectorAll("[data-book-index]")];
const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) {
      setActiveTheme(Number(visible.target.dataset.bookIndex));
    }
  },
  { threshold: [0.24, 0.42, 0.6] },
);

bookSections.forEach((section) => observer.observe(section));

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

window.addEventListener(
  "pointermove",
  (event) => {
    targetX = (event.clientX / window.innerWidth - 0.5) * 2;
    targetY = (event.clientY / window.innerHeight - 0.5) * 2;
  },
  { passive: true },
);

function animatePortal() {
  const ease = reducedMotion ? 0.025 : 0.07;
  currentX += (targetX - currentX) * ease;
  currentY += (targetY - currentY) * ease;
  root.style.setProperty("--mx", currentX.toFixed(3));
  root.style.setProperty("--my", currentY.toFixed(3));
  requestAnimationFrame(animatePortal);
}

animatePortal();
