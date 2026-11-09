import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createHash, randomBytes } from "node:crypto";
import type { LoginInput, RegisterInput } from "@bookrate/validators";
import { AUTH_REPOSITORY } from "./auth.tokens";
import { type AuthRepository, type AuthUserRecord } from "./auth.repository";
import { hashPassword, verifyPassword } from "./password";

const accessTokenLifetimeSeconds = 15 * 60;
const sessionLifetimeMilliseconds = 7 * 24 * 60 * 60 * 1_000;
const dummyPasswordHash = hashPassword(randomBytes(32).toString("base64url"));

export type SafeUser = Pick<AuthUserRecord, "id" | "email" | "name" | "role">;

export interface AuthTokenBundle {
  accessToken: string;
  refreshToken: string;
  user: SafeUser;
}

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function isUniqueConstraintError(error: unknown): error is { code: "P2002" } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

function toSafeUser(user: AuthUserRecord): SafeUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly repository: AuthRepository,
    private readonly jwt: JwtService,
  ) {}

  async register(input: RegisterInput): Promise<AuthTokenBundle> {
    const passwordHash = await hashPassword(input.password);
    let user: AuthUserRecord;
    try {
      user = await this.repository.createUser({
        name: input.name,
        email: input.email,
        passwordHash,
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException({
          code: "REGISTRATION_CONFLICT",
          message: "Unable to register with these credentials.",
        });
      }
      throw error;
    }

    return this.createSession(user);
  }

  async login(input: LoginInput): Promise<AuthTokenBundle> {
    const user = await this.repository.findUserByEmail(input.email);
    const passwordHash = user?.passwordHash ?? (await dummyPasswordHash);
    const isValidPassword = await verifyPassword(input.password, passwordHash);
    if (!user || !user.passwordHash || !isValidPassword) {
      throw new UnauthorizedException({
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password.",
      });
    }

    return this.createSession(user);
  }

  async refresh(refreshToken: string): Promise<AuthTokenBundle> {
    const oldTokenHash = hashSessionToken(refreshToken);
    const session = await this.repository.findSessionByTokenHash(oldTokenHash);
    if (!session || session.expires <= new Date()) {
      throw this.invalidSession();
    }

    const nextRefreshToken = randomBytes(32).toString("base64url");
    const expires = new Date(Date.now() + sessionLifetimeMilliseconds);
    const rotated = await this.repository.rotateSession({
      id: session.id,
      oldTokenHash,
      newTokenHash: hashSessionToken(nextRefreshToken),
      expires,
    });
    if (!rotated) {
      throw this.invalidSession();
    }

    return {
      accessToken: await this.createAccessToken(session.id, session.user),
      refreshToken: nextRefreshToken,
      user: toSafeUser(session.user),
    };
  }

  async logout(refreshToken?: string) {
    if (refreshToken) {
      await this.repository.deleteSessionByTokenHash(
        hashSessionToken(refreshToken),
      );
    }
  }

  private async createSession(user: AuthUserRecord): Promise<AuthTokenBundle> {
    const refreshToken = randomBytes(32).toString("base64url");
    const session = await this.repository.createSession({
      userId: user.id,
      sessionToken: hashSessionToken(refreshToken),
      expires: new Date(Date.now() + sessionLifetimeMilliseconds),
    });

    return {
      accessToken: await this.createAccessToken(session.id, user),
      refreshToken,
      user: toSafeUser(user),
    };
  }

  private createAccessToken(sessionId: string, user: AuthUserRecord) {
    return this.jwt.signAsync(
      { sub: user.id, sid: sessionId, role: user.role },
      { expiresIn: accessTokenLifetimeSeconds },
    );
  }

  private invalidSession() {
    return new UnauthorizedException({
      code: "INVALID_SESSION",
      message: "The session is invalid or expired.",
    });
  }
}
