export const authorIds = ["anastasiia-salenko", "dmytro-salenko"] as const;

export type AuthorId = (typeof authorIds)[number];

export interface Author {
  id: AuthorId;
  name: string;
  role: string;
  image: string;
  bio: string;
  links: {
    github: string;
    linkedin: string;
  };
}

export const authors: Record<AuthorId, Author> = {
  "anastasiia-salenko": {
    id: "anastasiia-salenko",
    name: "Анастасія Саленко",
    role: "Software Engineer · співзасновниця",
    image: "/images/authors/anastasiia-salenko.jpg",
    bio: "Працює над розробкою, експериментами та навчальними матеріалами Oblina Labs.",
    links: {
      github: "https://github.com/Anastasiia-Salenko",
      linkedin: "https://www.linkedin.com/in/anastasiia-salenko/",
    },
  },

  "dmytro-salenko": {
    id: "dmytro-salenko",
    name: "Дмитро Саленко",
    role: "Співзасновник",
    image: "/images/authors/dmytro-salenko.jpg",
    bio: "Працює над проєктами, дослідженнями та розвитком Oblina Labs.",
    links: {
      github: "https://github.com/dhammma",
      linkedin: "https://www.linkedin.com/in/dmytro-salenko/",
    },
  },
};

export const authorList: Author[] = Object.values(authors);
