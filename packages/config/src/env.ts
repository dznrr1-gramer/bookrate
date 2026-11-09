import { z } from "zod";

function isOrigin(value: string) {
  try {
    const url = new URL(value);
    return (
      url.origin === value && url.pathname === "/" && !url.search && !url.hash
    );
  } catch {
    return false;
  }
}

const serverEnvSchema = z.object({
  DATABASE_URL: z
    .string()
    .url()
    .refine(
      (value) => {
        const protocol = value.slice(0, value.indexOf(":")).toLowerCase();
        return ["postgres", "postgresql"].includes(protocol);
      },
      { message: "Must be a PostgreSQL connection URL" },
    ),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  WEB_ORIGIN: z
    .string()
    .url()
    .refine(isOrigin, "Must be an origin without a path, query, or fragment")
    .default("http://localhost:3000"),
  AUTH_JWT_SECRET: z.string().min(32).optional(),
  GOOGLE_BOOKS_API_KEY: z.string().min(1).optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv(
  input: Record<string, string | undefined>,
): ServerEnv {
  const result = serverEnvSchema.safeParse(input);

  if (!result.success) {
    const details = result.error.issues
      .map(
        (issue) => `${issue.path.join(".") || "environment"}: ${issue.message}`,
      )
      .join("; ");
    throw new Error(`Invalid server environment: ${details}`);
  }

  if (input.NODE_ENV === "production" && !result.data.AUTH_JWT_SECRET) {
    throw new Error(
      "Invalid server environment: AUTH_JWT_SECRET: Required in production and must contain at least 32 characters",
    );
  }

  return result.data;
}
