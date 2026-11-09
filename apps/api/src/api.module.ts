import { Module, type DynamicModule } from "@nestjs/common";
import { AuthenticationModule } from "./auth/authentication.module";
import { HealthController } from "./health/health.controller";
import { ValidationController } from "./validation/validation.controller";
import { prisma } from "@bookrate/database";
import { PRISMA_CLIENT } from "./auth/auth.tokens";
import { HomepageController } from "./homepage/homepage.controller";
import {
  HOMEPAGE_REPOSITORY,
  PrismaHomepageRepository,
} from "./homepage/homepage.repository";
import { HomepageService } from "./homepage/homepage.service";
import { CatalogController } from "./catalog/catalog.controller";
import {
  CATALOG_REPOSITORY,
  PrismaCatalogRepository,
} from "./catalog/catalog.repository";
import { CatalogService } from "./catalog/catalog.service";

@Module({})
export class ApiModule {
  static register(options: {
    isProduction: boolean;
    jwtSecret: string;
    webOrigin: string;
  }): DynamicModule {
    return {
      module: ApiModule,
      imports: [
        AuthenticationModule.register({
          isProduction: options.isProduction,
          jwtSecret: options.jwtSecret,
          webOrigin: options.webOrigin,
        }),
      ],
      controllers: [
        HealthController,
        HomepageController,
        CatalogController,
        ...(!options.isProduction ? [ValidationController] : []),
      ],
      providers: [
        { provide: PRISMA_CLIENT, useValue: prisma },
        {
          provide: HOMEPAGE_REPOSITORY,
          useClass: PrismaHomepageRepository,
        },
        { provide: CATALOG_REPOSITORY, useClass: PrismaCatalogRepository },
        HomepageService,
        CatalogService,
      ],
    };
  }
}
