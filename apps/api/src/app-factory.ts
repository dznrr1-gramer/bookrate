import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { randomBytes } from "node:crypto";
import type { ServerEnv } from "@bookrate/config/env";
import { ApiModule } from "./api.module";
import { ApiExceptionFilter } from "./common/filters/api-exception.filter";

export async function createApiApplication(
  config: ServerEnv,
  options: { logger?: boolean; isProduction?: boolean } = {},
) {
  const isProduction =
    options.isProduction ?? process.env.NODE_ENV === "production";
  if (isProduction && !config.AUTH_JWT_SECRET) {
    throw new Error("AUTH_JWT_SECRET is required in production.");
  }
  const jwtSecret =
    config.AUTH_JWT_SECRET ?? randomBytes(32).toString("base64url");
  const app = await NestFactory.create(
    ApiModule.register({
      isProduction,
      jwtSecret,
      webOrigin: config.WEB_ORIGIN,
    }),
    {
      logger: options.logger === false ? false : undefined,
    },
  );

  app.setGlobalPrefix("api/v1");
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      callback(null, !origin || origin === config.WEB_ORIGIN);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
  app.useGlobalFilters(new ApiExceptionFilter());

  if (!isProduction) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle("BookRate API")
        .setDescription("Versioned REST API for the BookRate application.")
        .setVersion("1.0")
        .build(),
    );
    SwaggerModule.setup("api/v1/docs", app, document, {
      jsonDocumentUrl: "api/v1/docs/openapi.json",
    });
  }

  return app;
}
