import "reflect-metadata";
import { config as loadEnv } from "dotenv";
import { Logger } from "@nestjs/common";
import { resolve } from "node:path";
import { parseServerEnv } from "@bookrate/config/env";
import { createApiApplication } from "./app-factory";

loadEnv({ path: resolve(import.meta.dir, "../../../.env") });

async function bootstrap() {
  const config = parseServerEnv(process.env);
  const app = await createApiApplication(config);
  await app.listen(config.API_PORT);
  Logger.log(`BookRate API listening on port ${config.API_PORT}`, "Bootstrap");
}

void bootstrap().catch((error: unknown) => {
  const logger = new Logger("Bootstrap");
  const message =
    error instanceof Error
      ? error.message.replace(
          /(postgres(?:ql)?:\/\/)[^@\s]+@/gi,
          "$1[redacted]@",
        )
      : "Unknown startup error";
  logger.error(`API startup failed: ${message}`);
  process.exitCode = 1;
});
