import type { AuthorId } from "./authors";

export interface Project {
  slug: string;
  title: string;
  type: string;
  description: string;
  authors: AuthorId[];
  image: string;
  technologies: string[];
  externalUrl?: string;
  githubUrl?: string;
  color?: "pink" | "yellow" | "lime";
}

export const projects: Project[] = [
  {
    slug: "virshodruk",
    title: "Віршодрук",
    type: "Learning tool",
    description:
      "Клавіатурний тренажер для практики української поезії — з бібліотекою віршів, власними текстами та статистикою друку.",
    authors: ["dmytro-salenko"],
    image: "/images/projects/virshodruk.jpg",
    technologies: [],
    externalUrl: "https://virshodruk.com/",
    color: "pink",
  },
  {
    slug: "2048",
    title: "2048",
    type: "Game",
    description: "Власна реалізація класичної гри 2048.",
    authors: ["dmytro-salenko"],
    image: "/images/projects/2048.jpg",
    technologies: [],
    externalUrl: "https://repairfix-2048.firebaseapp.com/",
    githubUrl: "https://github.com/dhammma/repairfix-2048",
    color: "yellow",
  },
  {
    slug: "misolla-music",
    title: "Misolla Music",
    type: "Product",
    description: "Платформа для музичної освіти.",
    authors: ["anastasiia-salenko", "dmytro-salenko"],
    image: "/images/projects/misolla-music.jpg",
    technologies: [],
    externalUrl: "https://www.misolla-music.com/uk",
    color: "lime",
  },
];
