import type { AuthorId } from "./authors";

export interface Experiment {
  title: string;
  description: string;
  status: string;
  publishedAt: string;
  href: string;
  authors: AuthorId[];
}

export const experiments: Experiment[] = [
  {
    title: "Довге додавання",
    description:
      "Інтерактивне пояснення алгоритму додавання великих чисел у стовпчик.",
    status: "Опубліковано",
    publishedAt: "12 серпня 2026",
    href: "/experiments/long-addition",
    authors: ["anastasiia-salenko"],
  },
  {
    title: "Довге віднімання",
    description:
      "Інтерактивне пояснення алгоритму віднімання великих чисел у стовпчик.",
    status: "Опубліковано",
    publishedAt: "14 серпня 2026",
    href: "/experiments/long-subtraction",
    authors: ["anastasiia-salenko"],
  },
  {
    title: "Canvas та 2D графіка",
    description:
      "Інтерактивне знайомство з Canvas, 2D-графікою та створенням анімації.",
    status: "Опубліковано",
    publishedAt: "18 серпня 2026",
    href: "/experiments/canvas-2d-graphics",
    authors: ["anastasiia-salenko"],
  },
  {
    title: "Килим Серпінського",
    description:
      "Інтерактивна побудова Килима Серпінського за допомогою рекурсії.",
    status: "Опубліковано",
    publishedAt: "25 серпня 2026",
    href: "/experiments/sierpinski-carpet",
    authors: ["anastasiia-salenko"],
  },
  {
    title: "PG Lite Cate",
    description: "Інтерактивне пояснення алгоритму Cate для PG Lite.",
    status: "Опубліковано",
    publishedAt: "08 вересня 2026",
    href: "/experiments/pglite-cate",
    authors: ["anastasiia-salenko"],
  },
];
