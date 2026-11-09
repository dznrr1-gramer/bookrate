import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { prisma } from "../src/index";

loadEnv({
  path: resolve(fileURLToPath(new URL(".", import.meta.url)), "../../../.env"),
});

const passwordKeyLength = 64;
const passwordCost = 32768;

function derivePasswordKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      passwordKeyLength,
      { N: passwordCost, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
      (error, key) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(key);
      },
    );
  });
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derivePasswordKey(password, salt);

  return `scrypt$${passwordCost}$8$1$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

async function seed() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Development seed data cannot be applied in production.");
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (Boolean(adminEmail) !== Boolean(adminPassword)) {
    throw new Error(
      "Set both SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to seed a development admin.",
    );
  }

  if (
    adminEmail &&
    (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail) ||
      (adminPassword?.length ?? 0) < 12)
  ) {
    throw new Error(
      "Use a valid SEED_ADMIN_EMAIL and a SEED_ADMIN_PASSWORD of at least 12 characters.",
    );
  }

  const readerOne = await prisma.user.upsert({
    where: { email: "reader.one@example.invalid" },
    update: { name: "Ayu Pembaca", role: "USER" },
    create: {
      name: "Ayu Pembaca",
      email: "reader.one@example.invalid",
      bio: "Menikmati cerita dan berbagi rekomendasi bacaan.",
    },
  });
  const readerTwo = await prisma.user.upsert({
    where: { email: "reader.two@example.invalid" },
    update: { name: "Raka Pembaca", role: "USER" },
    create: {
      name: "Raka Pembaca",
      email: "reader.two@example.invalid",
      bio: "Selalu mencari buku untuk dibaca berikutnya.",
    },
  });

  if (adminEmail && adminPassword) {
    const passwordHash = await hashPassword(adminPassword);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { name: "BookRate Admin", passwordHash, role: "ADMIN" },
      create: {
        name: "BookRate Admin",
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
      },
    });
  } else {
    console.info(
      "Development admin seed skipped; configure both seed admin variables in the local .env to enable it.",
    );
  }

  const authors = [
    { id: "seed-author-leila-chudori", name: "Leila S. Chudori" },
    { id: "seed-author-henry-manampiring", name: "Henry Manampiring" },
    { id: "seed-author-tere-liye", name: "Tere Liye" },
    { id: "seed-author-dee-lestari", name: "Dee Lestari" },
  ];
  for (const author of authors) {
    await prisma.author.upsert({
      where: { id: author.id },
      update: { name: author.name },
      create: author,
    });
  }

  const publishers = [
    { id: "seed-publisher-kpg", name: "Kepustakaan Populer Gramedia" },
    { id: "seed-publisher-kompas", name: "Penerbit Buku Kompas" },
    { id: "seed-publisher-gramedia", name: "Gramedia Pustaka Utama" },
    { id: "seed-publisher-bentang", name: "Bentang Pustaka" },
  ];
  for (const publisher of publishers) {
    await prisma.publisher.upsert({
      where: { id: publisher.id },
      update: { name: publisher.name },
      create: publisher,
    });
  }

  const categories = [
    {
      name: "Fiksi",
      slug: "fiksi",
      description: "Cerita rekaan dalam beragam bentuk dan latar.",
    },
    {
      name: "Nonfiksi",
      slug: "nonfiksi",
      description: "Buku berbasis pengetahuan dan pengalaman nyata.",
    },
  ];
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description },
      create: category,
    });
  }

  const genres = [
    { name: "Historical Fiction", slug: "historical-fiction" },
    { name: "Filsafat", slug: "filsafat" },
    { name: "Fantasi", slug: "fantasi" },
    { name: "Romansa", slug: "romansa" },
  ];
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { slug: genre.slug },
      update: { name: genre.name },
      create: genre,
    });
  }

  const bookSeeds = [
    {
      title: "Laut Bercerita",
      slug: "laut-bercerita",
      description:
        "Sebuah novel tentang persahabatan, kehilangan, dan ingatan.",
      publishedYear: 2017,
      pageCount: 379,
      language: "id",
      authorIds: ["seed-author-leila-chudori"],
      publisherId: "seed-publisher-kpg",
      categorySlugs: ["fiksi"],
      genreSlugs: ["historical-fiction"],
    },
    {
      title: "Filosofi Teras",
      slug: "filosofi-teras",
      description:
        "Pengantar praktis filsafat Stoa untuk kehidupan sehari-hari.",
      publishedYear: 2018,
      pageCount: 320,
      language: "id",
      authorIds: ["seed-author-henry-manampiring"],
      publisherId: "seed-publisher-kompas",
      categorySlugs: ["nonfiksi"],
      genreSlugs: ["filsafat"],
    },
    {
      title: "Bumi",
      slug: "bumi",
      description: "Petualangan Raib dan kawan-kawan di dunia paralel.",
      publishedYear: 2014,
      pageCount: 440,
      language: "id",
      authorIds: ["seed-author-tere-liye"],
      publisherId: "seed-publisher-gramedia",
      categorySlugs: ["fiksi"],
      genreSlugs: ["fantasi"],
    },
    {
      title: "Pulang",
      slug: "pulang",
      description: "Kisah perjalanan, keluarga, dan pilihan hidup.",
      publishedYear: 2015,
      pageCount: 400,
      language: "id",
      authorIds: ["seed-author-tere-liye"],
      publisherId: "seed-publisher-gramedia",
      categorySlugs: ["fiksi"],
      genreSlugs: [],
    },
    {
      title: "Perahu Kertas",
      slug: "perahu-kertas",
      description:
        "Kisah tentang mimpi, persahabatan, dan menemukan jalan sendiri.",
      publishedYear: 2009,
      pageCount: 444,
      language: "id",
      authorIds: ["seed-author-dee-lestari"],
      publisherId: "seed-publisher-bentang",
      categorySlugs: ["fiksi"],
      genreSlugs: ["romansa"],
    },
  ];

  const books = new Map<string, { id: string }>();
  for (const book of bookSeeds) {
    const { authorIds, publisherId, categorySlugs, genreSlugs, ...data } = book;
    const relations = {
      authors: authorIds.map((id) => ({ id })),
      publisher: { id: publisherId },
      categories: categorySlugs.map((slug) => ({ slug })),
      genres: genreSlugs.map((slug) => ({ slug })),
    };
    const record = await prisma.book.upsert({
      where: { slug: book.slug },
      update: {
        ...data,
        authors: { set: relations.authors },
        publisher: { connect: relations.publisher },
        categories: { set: relations.categories },
        genres: { set: relations.genres },
      },
      create: {
        ...data,
        authors: { connect: relations.authors },
        publisher: { connect: relations.publisher },
        categories: { connect: relations.categories },
        genres: { connect: relations.genres },
      },
    });
    books.set(book.slug, record);
  }

  const reviews = [
    {
      userId: readerOne.id,
      bookSlug: "laut-bercerita",
      rating: 5,
      content:
        "Alurnya kuat dan kisahnya terus teringat setelah selesai membaca.",
    },
    {
      userId: readerTwo.id,
      bookSlug: "laut-bercerita",
      rating: 4,
      content: "Karakter serta suasananya terasa berkesan.",
    },
    {
      userId: readerTwo.id,
      bookSlug: "filosofi-teras",
      rating: 5,
      content: "Penjelasan konsepnya runtut dan mudah diterapkan.",
    },
  ];
  for (const review of reviews) {
    const book = books.get(review.bookSlug);
    if (!book) {
      throw new Error(`Seed book ${review.bookSlug} was not created.`);
    }

    await prisma.review.upsert({
      where: { userId_bookId: { userId: review.userId, bookId: book.id } },
      update: { rating: review.rating, content: review.content },
      create: {
        userId: review.userId,
        bookId: book.id,
        rating: review.rating,
        content: review.content,
      },
    });
  }

  const readingEntries = [
    { userId: readerOne.id, bookSlug: "bumi", status: "WANT_TO_READ" as const },
    {
      userId: readerOne.id,
      bookSlug: "filosofi-teras",
      status: "READ" as const,
    },
    {
      userId: readerTwo.id,
      bookSlug: "perahu-kertas",
      status: "CURRENTLY_READING" as const,
    },
  ];
  for (const entry of readingEntries) {
    const book = books.get(entry.bookSlug);
    if (!book) {
      throw new Error(`Seed book ${entry.bookSlug} was not created.`);
    }

    await prisma.readingList.upsert({
      where: { userId_bookId: { userId: entry.userId, bookId: book.id } },
      update: { status: entry.status },
      create: { userId: entry.userId, bookId: book.id, status: entry.status },
    });
  }

  const favorites = [
    { userId: readerOne.id, bookSlug: "laut-bercerita" },
    { userId: readerTwo.id, bookSlug: "bumi" },
  ];
  for (const favorite of favorites) {
    const book = books.get(favorite.bookSlug);
    if (!book) {
      throw new Error(`Seed book ${favorite.bookSlug} was not created.`);
    }

    await prisma.favorite.upsert({
      where: { userId_bookId: { userId: favorite.userId, bookId: book.id } },
      update: {},
      create: { userId: favorite.userId, bookId: book.id },
    });
  }

  console.info(
    "Seeded 5 books, 2 readers, 3 reviews, and 3 reading-list entries.",
  );
}

seed()
  .catch((error: unknown) => {
    console.error("Failed to seed development data.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
