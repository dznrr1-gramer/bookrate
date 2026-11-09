import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import type { AppRole } from "./roles.decorator";

export interface AuthorizationActor {
  id: string;
  role: AppRole;
}

export function assertUserAccess(
  actor: AuthorizationActor | null | undefined,
  userId: string,
): asserts actor is AuthorizationActor {
  if (!actor) {
    throw new UnauthorizedException({
      code: "UNAUTHORIZED",
      message: "Authentication is required.",
    });
  }
  if (actor.role !== "ADMIN" && actor.id !== userId) {
    throw new ForbiddenException({
      code: "FORBIDDEN",
      message: "You do not have permission to access this resource.",
    });
  }
}
