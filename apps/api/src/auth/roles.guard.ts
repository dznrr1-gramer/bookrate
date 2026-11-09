import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY, type AppRole } from "./roles.decorator";

type AuthenticatedRequest = {
  user?: { role?: AppRole };
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<AppRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.user) {
      throw new UnauthorizedException({
        code: "UNAUTHORIZED",
        message: "Authentication is required.",
      });
    }
    if (!request.user.role || !requiredRoles.includes(request.user.role)) {
      throw new ForbiddenException({
        code: "FORBIDDEN",
        message: "You do not have permission to access this resource.",
      });
    }
    return true;
  }
}
