import type { AuthorId } from "./authors";

export interface Experiment {
  title: string;
  description: string;
  status: string;
  publishedAt: string;
  href: string;
  authors: AuthorId[];
  preview: {
    image: string;
    video: string;
  };
}

export const experiments: Experiment[] = [
  {
    title: "PG Lite Cats",
    description: "Інтерактивне пояснення алгоритму Cats для PG Lite.",
    status: "Опубліковано",
    publishedAt: "08 вересня 2026",
    href: "/experiments/pglite-cats",
    authors: ["anastasiia-salenko"],
    preview: {
      image: "/images/experiments/pglite-cats.jpg",
      video: "/videos/experiments/pglite-cats.mp4",
    },
  },
  {
    title: "Килим Серпінського",
    description:
      "Інтерактивна побудова Килима Серпінського за допомогою рекурсії.",
    status: "Опубліковано",
    publishedAt: "25 серпня 2026",
    href: "/experiments/sierpinski-carpet",
    authors: ["anastasiia-salenko"],
    preview: {
      image: "/images/experiments/sierpinski-carpet.jpg",
      video: "/videos/experiments/sierpinski-carpet.mp4",
    },
  },
  {
    title: "Canvas та 2D графіка",
    description:
      "Інтерактивне знайомство з Canvas, 2D-графікою та створенням анімації.",
    status: "Опубліковано",
    publishedAt: "18 серпня 2026",
    href: "/experiments/canvas-2d-graphics",
    authors: ["anastasiia-salenko"],
    preview: {
      image: "/images/experiments/canvas-2d-graphics.jpg",
      video: "/videos/experiments/canvas-2d-graphics.mp4",
    },
  },
  {
    title: "Довге віднімання",
    description:
      "Інтерактивне пояснення алгоритму віднімання великих чисел у стовпчик.",
    status: "Опубліковано",
    publishedAt: "14 серпня 2026",
    href: "/experiments/long-subtraction",
    authors: ["anastasiia-salenko"],
    preview: {
      image: "/images/experiments/long-subtraction.jpg",
      video: "/videos/experiments/long-subtraction.mp4",
    },
  },
  {
    title: "Довге додавання",
    description:
      "Інтерактивне пояснення алгоритму додавання великих чисел у стовпчик.",
    status: "Опубліковано",
    publishedAt: "12 серпня 2026",
    href: "/experiments/long-addition",
    authors: ["anastasiia-salenko"],
    preview: {
      image: "/images/experiments/long-addition.jpg",
      video: "/videos/experiments/long-addition.mp4",
    },
  },
];
