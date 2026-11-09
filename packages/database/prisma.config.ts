import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

loadEnv({
  path: resolve(fileURLToPath(new URL(".", import.meta.url)), "../../.env"),
});

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
});
