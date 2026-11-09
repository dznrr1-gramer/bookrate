import { Module, type DynamicModule } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { prisma } from "@bookrate/database";
import { AuthController } from "./auth.controller";
import {
  AUTH_COOKIE_CONFIG,
  AUTH_JWT_SECRET,
  AUTH_REPOSITORY,
  PRISMA_CLIENT,
} from "./auth.tokens";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { JwtStrategy } from "./jwt.strategy";
import { OriginGuard } from "./origin.guard";
import { PrismaAuthRepository } from "./auth.repository";
import { RolesGuard } from "./roles.guard";

interface AuthenticationModuleOptions {
  jwtSecret: string;
  webOrigin: string;
  isProduction: boolean;
}

@Module({})
export class AuthenticationModule {
  static register(options: AuthenticationModuleOptions): DynamicModule {
    const cookieOptions = {
      webOrigin: options.webOrigin,
      secure: options.isProduction,
      accessCookieMaxAge: 15 * 60 * 1_000,
      refreshCookieMaxAge: 7 * 24 * 60 * 60 * 1_000,
    };

    return {
      module: AuthenticationModule,
      imports: [
        PassportModule.register({
          defaultStrategy: "jwt",
          session: false,
        }),
        JwtModule.register({
          secret: options.jwtSecret,
          signOptions: { expiresIn: "15m" },
        }),
      ],
      controllers: [AuthController],
      providers: [
        { provide: AUTH_COOKIE_CONFIG, useValue: cookieOptions },
        { provide: AUTH_JWT_SECRET, useValue: options.jwtSecret },
        { provide: PRISMA_CLIENT, useValue: prisma },
        { provide: AUTH_REPOSITORY, useClass: PrismaAuthRepository },
        AuthService,
        JwtStrategy,
        JwtAuthGuard,
        OriginGuard,
        RolesGuard,
      ],
      exports: [PassportModule, JwtAuthGuard, RolesGuard],
    };
  }
}
