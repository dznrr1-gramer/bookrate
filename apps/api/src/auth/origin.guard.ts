import {
  ForbiddenException,
  Inject,
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from "@nestjs/common";
import type { Request } from "express";
import { AUTH_COOKIE_CONFIG } from "./auth.tokens";

interface AuthCookieConfig {
  webOrigin: string;
}

@Injectable()
export class OriginGuard implements CanActivate {
  constructor(
    @Inject(AUTH_COOKIE_CONFIG) private readonly config: AuthCookieConfig,
  ) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    if (request.headers.origin === this.config.webOrigin) {
      return true;
    }

    throw new ForbiddenException({
      code: "CSRF_ORIGIN_FORBIDDEN",
      message: "Request origin is not allowed.",
    });
  }
}
