import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { Request } from "express";
import { z } from "zod";
import { AUTH_JWT_SECRET, AUTH_REPOSITORY } from "./auth.tokens";
import type { AuthRepository } from "./auth.repository";

const accessTokenPayloadSchema = z.object({
  sub: z.string().min(1),
  sid: z.string().min(1),
  role: z.enum(["USER", "ADMIN"]),
});

function accessTokenFromCookie(request: Request) {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) {
    return null;
  }

  for (const cookie of cookieHeader.split(";")) {
    const [name, ...valueParts] = cookie.trim().split("=");
    if (name === "br_access") {
      return valueParts.join("=") || null;
    }
  }

  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AUTH_JWT_SECRET) secret: string,
    @Inject(AUTH_REPOSITORY) private readonly repository: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        accessTokenFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: unknown) {
    const parsedPayload = accessTokenPayloadSchema.safeParse(payload);
    if (!parsedPayload.success) {
      throw new UnauthorizedException();
    }

    const session = await this.repository.findSessionById(
      parsedPayload.data.sid,
    );
    if (
      !session ||
      session.expires <= new Date() ||
      session.user.id !== parsedPayload.data.sub ||
      session.user.role !== parsedPayload.data.role
    ) {
      throw new UnauthorizedException();
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      sessionId: session.id,
    };
  }
}
