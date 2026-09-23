import type { AuthorId } from "./authors";

export interface Article {
  title: string;
  description: string;
  slug: string;
  category: string;
  publishedAt: string;
  authorId: AuthorId;
}

export const articles: Article[] = [
  {
    title: "Як я взагалі стала розробницею",
    description:
      "Від перших курсів до власних проєктів, Misolla та Oblina Labs.",
    slug: "how-i-became-a-developer",
    category: "Особисте",
    publishedAt: "2026-09-23",
    authorId: "anastasiia-salenko",
  },
];
