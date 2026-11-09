import { Module, type DynamicModule } from "@nestjs/common";
import { AuthenticationModule } from "./auth/authentication.module";
import { HealthController } from "./health/health.controller";
import { ValidationController } from "./validation/validation.controller";

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
        ...(!options.isProduction ? [ValidationController] : []),
      ],
    };
  }
}
