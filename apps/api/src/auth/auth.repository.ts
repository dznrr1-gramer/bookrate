import { Inject, Injectable } from "@nestjs/common";
import type { PrismaClient } from "@bookrate/database";
import { PRISMA_CLIENT } from "./auth.tokens";

export type AppRole = "USER" | "ADMIN";

export interface AuthUserRecord {
  id: string;
  email: string | null;
  name: string | null;
  role: AppRole;
  passwordHash: string | null;
}

export interface AuthSessionRecord {
  id: string;
  expires: Date;
  user: AuthUserRecord;
}

export interface AuthRepository {
  createUser(input: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<AuthUserRecord>;
  findUserByEmail(email: string): Promise<AuthUserRecord | null>;
  createSession(input: {
    userId: string;
    sessionToken: string;
    expires: Date;
  }): Promise<{ id: string }>;
  findSessionByTokenHash(tokenHash: string): Promise<AuthSessionRecord | null>;
  findSessionById(id: string): Promise<AuthSessionRecord | null>;
  rotateSession(input: {
    id: string;
    oldTokenHash: string;
    newTokenHash: string;
    expires: Date;
  }): Promise<boolean>;
  deleteSessionByTokenHash(tokenHash: string): Promise<void>;
}

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(@Inject(PRISMA_CLIENT) private readonly database: PrismaClient) {}

  createUser(input: { name: string; email: string; passwordHash: string }) {
    return this.database.user.create({
      data: input,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
      },
    });
  }

  findUserByEmail(email: string) {
    return this.database.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
      },
    });
  }

  createSession(input: {
    userId: string;
    sessionToken: string;
    expires: Date;
  }) {
    return this.database.session.create({
      data: input,
      select: { id: true },
    });
  }

  findSessionByTokenHash(tokenHash: string) {
    return this.database.session.findUnique({
      where: { sessionToken: tokenHash },
      include: { user: { select: this.userSelection } },
    });
  }

  findSessionById(id: string) {
    return this.database.session.findUnique({
      where: { id },
      include: { user: { select: this.userSelection } },
    });
  }

  async rotateSession(input: {
    id: string;
    oldTokenHash: string;
    newTokenHash: string;
    expires: Date;
  }) {
    const result = await this.database.session.updateMany({
      where: {
        id: input.id,
        sessionToken: input.oldTokenHash,
        expires: { gt: new Date() },
      },
      data: {
        sessionToken: input.newTokenHash,
        expires: input.expires,
      },
    });
    return result.count === 1;
  }

  async deleteSessionByTokenHash(tokenHash: string) {
    await this.database.session.deleteMany({
      where: { sessionToken: tokenHash },
    });
  }

  private readonly userSelection = {
    id: true,
    email: true,
    name: true,
    role: true,
    passwordHash: true,
  } as const;
}
