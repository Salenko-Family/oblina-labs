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
    role: "Software Engineer · співзасновниця Oblina Labs і Misolla Music",
    image: "/images/authors/anastasiia-salenko.jpg",
    bio: "Розробляє вебзастосунки, інтерактивні експерименти та навчальні матеріали. Працює з frontend і backend, співзаснувала Misolla Music та використовує Oblina Labs як простір для дослідження технологій і практичних експериментів.",
    links: {
      github: "https://github.com/Anastasiia-Salenko",
      linkedin: "https://www.linkedin.com/in/anastasiia-salenko/",
    },
  },

  "dmytro-salenko": {
    id: "dmytro-salenko",
    name: "Дмитро Саленко",
    role: "Software Engineer · співзасновник Oblina Labs і Misolla Music",
    image: "/images/authors/dmytro-salenko.jpg",
    bio: "Працює над повним циклом створення вебпродуктів — від ідеї й архітектури до реалізації та запуску. Самостійно створив Віршодрук і власну версію 2048, а також є співзасновником Misolla Music.",
    links: {
      github: "https://github.com/dhammma",
      linkedin: "https://www.linkedin.com/in/dmytro-salenko/",
    },
  },
};

export const authorList: Author[] = Object.values(authors);
