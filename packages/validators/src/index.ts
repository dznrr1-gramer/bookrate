import { z } from "zod";

const emailSchema = z.string().trim().toLowerCase().email().max(254);
const nameSchema = z.string().trim().min(1).max(80);
export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const idSchema = z.string().trim().min(1).max(128);
const descriptionSchema = z.string().trim().max(20_000).nullable().optional();
const passwordSchema = z.string().min(12).max(128);
const httpUrlSchema = z
  .string()
  .trim()
  .url({ protocol: /^https?$/ })
  .max(2_048)
  .nullable()
  .optional();
const isbnSchema = z
  .string()
  .trim()
  .max(20)
  .transform((value) => value.replace(/[\s-]/g, ""))
  .pipe(
    z.union([z.string().regex(/^\d{9}[\dX]$/i), z.string().regex(/^\d{13}$/)]),
  );
const readingStatusSchema = z.enum([
  "WANT_TO_READ",
  "CURRENTLY_READING",
  "READ",
]);
const ratingSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

function hasUpdates(value: object) {
  return Object.keys(value).length > 0;
}

export const registerInputSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

export const loginInputSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1).max(128),
  })
  .strict();

export const profileUpdateSchema = z
  .object({
    name: nameSchema.optional(),
    bio: z.string().trim().max(500).nullable().optional(),
    image: httpUrlSchema,
  })
  .strict()
  .refine(hasUpdates, { message: "At least one profile field is required." });

const bookFields = {
  title: z.string().trim().min(1).max(240),
  slug: slugSchema,
  description: descriptionSchema,
  isbn: isbnSchema.nullable().optional(),
  publishedYear: z
    .number()
    .int()
    .min(1)
    .max(new Date().getFullYear() + 1)
    .nullable()
    .optional(),
  pageCount: z.number().int().min(1).max(100_000).nullable().optional(),
  language: z.string().trim().min(2).max(35).nullable().optional(),
  coverImage: httpUrlSchema,
  googleBooksVolumeId: z.string().trim().min(1).max(128).nullable().optional(),
  authorIds: z.array(idSchema).max(50),
  publisherId: idSchema.nullable().optional(),
  categoryIds: z.array(idSchema).max(30),
  genreIds: z.array(idSchema).max(30),
};

export const bookCreateSchema = z
  .object({
    ...bookFields,
    authorIds: bookFields.authorIds.default([]),
    categoryIds: bookFields.categoryIds.default([]),
    genreIds: bookFields.genreIds.default([]),
  })
  .strict();

export const bookUpdateSchema = z
  .object(bookFields)
  .partial()
  .strict()
  .refine(hasUpdates, { message: "At least one book field is required." });

const taxonomyFields = {
  name: nameSchema,
  slug: slugSchema,
  description: z.string().trim().max(1_000).nullable().optional(),
};

export const categoryCreateSchema = z.object(taxonomyFields).strict();
export const genreCreateSchema = z.object(taxonomyFields).strict();

export const categoryUpdateSchema = z
  .object(taxonomyFields)
  .partial()
  .strict()
  .refine(hasUpdates, { message: "At least one category field is required." });

export const genreUpdateSchema = z
  .object(taxonomyFields)
  .partial()
  .strict()
  .refine(hasUpdates, { message: "At least one genre field is required." });

export const reviewCreateSchema = z
  .object({
    bookId: idSchema,
    rating: ratingSchema,
    content: z.string().trim().min(1).max(5_000),
  })
  .strict();

export const reviewUpdateSchema = z
  .object({
    rating: ratingSchema.optional(),
    content: z.string().trim().min(1).max(5_000).optional(),
  })
  .strict()
  .refine(hasUpdates, { message: "At least one review field is required." });

export const favoriteInputSchema = z
  .object({
    bookId: idSchema,
  })
  .strict();

export const readingListInputSchema = z
  .object({
    bookId: idSchema,
    status: readingStatusSchema,
  })
  .strict();

export const catalogQuerySchema = z
  .object({
    search: z.string().trim().max(120).optional(),
    category: slugSchema.optional(),
    genre: slugSchema.optional(),
    minRating: z.coerce.number().int().min(1).max(5).optional(),
    sort: z.enum(["popular", "rating", "newest", "title"]).default("newest"),
    direction: z.enum(["asc", "desc"]).default("desc"),
    page: z.coerce.number().int().min(1).max(10_000).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

export const reviewQuerySchema = z
  .object({
    sort: z.enum(["newest", "rating", "likes"]).default("newest"),
    direction: z.enum(["asc", "desc"]).default("desc"),
    page: z.coerce.number().int().min(1).max(10_000).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

export type RegisterInput = z.infer<typeof registerInputSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type BookCreateInput = z.infer<typeof bookCreateSchema>;
export type BookUpdateInput = z.infer<typeof bookUpdateSchema>;
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
export type GenreCreateInput = z.infer<typeof genreCreateSchema>;
export type GenreUpdateInput = z.infer<typeof genreUpdateSchema>;
export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
export type ReviewUpdateInput = z.infer<typeof reviewUpdateSchema>;
export type FavoriteInput = z.infer<typeof favoriteInputSchema>;
export type ReadingListInput = z.infer<typeof readingListInputSchema>;
export type CatalogQuery = z.infer<typeof catalogQuerySchema>;
export type ReviewQuery = z.infer<typeof reviewQuerySchema>;
export type ReadingStatusInput = z.infer<typeof readingStatusSchema>;
export type BookRatingInput = z.infer<typeof ratingSchema>;
