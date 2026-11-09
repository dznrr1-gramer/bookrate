import { describe, expect, test } from "bun:test";
import { HttpException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type {
  AuthRepository,
  AuthSessionRecord,
  AuthUserRecord,
} from "./auth.repository";
import { AuthService } from "./auth.service";
import { hashPassword, verifyPassword } from "./password";

class InMemoryAuthRepository implements AuthRepository {
  private readonly users = new Map<string, AuthUserRecord>();
  private readonly sessions = new Map<string, AuthSessionRecord>();
  private nextId = 1;

  async createUser(input: {
    name: string;
    email: string;
    passwordHash: string;
  }) {
    if (this.users.has(input.email)) {
      throw { code: "P2002" };
    }

    const user: AuthUserRecord = {
      id: `user-${this.nextId++}`,
      email: input.email,
      name: input.name,
      role: "USER",
      passwordHash: input.passwordHash,
    };
    this.users.set(input.email, user);
    return user;
  }

  async findUserByEmail(email: string) {
    return this.users.get(email) ?? null;
  }

  async createSession(input: {
    userId: string;
    sessionToken: string;
    expires: Date;
  }) {
    const user = [...this.users.values()].find(
      (candidate) => candidate.id === input.userId,
    );
    if (!user) {
      throw new Error("User not found.");
    }

    const id = `session-${this.nextId++}`;
    this.sessions.set(input.sessionToken, {
      id,
      expires: input.expires,
      user,
    });
    return { id };
  }

  async findSessionByTokenHash(tokenHash: string) {
    return this.sessions.get(tokenHash) ?? null;
  }

  async findSessionById(id: string) {
    return (
      [...this.sessions.values()].find((session) => session.id === id) ?? null
    );
  }

  async rotateSession(input: {
    id: string;
    oldTokenHash: string;
    newTokenHash: string;
    expires: Date;
  }) {
    const session = this.sessions.get(input.oldTokenHash);
    if (!session || session.id !== input.id || session.expires <= new Date()) {
      return false;
    }

    this.sessions.delete(input.oldTokenHash);
    this.sessions.set(input.newTokenHash, {
      ...session,
      expires: input.expires,
    });
    return true;
  }

  async deleteSessionByTokenHash(tokenHash: string) {
    this.sessions.delete(tokenHash);
  }

  get sessionCount() {
    return this.sessions.size;
  }

  get sessionTokenHashes() {
    return [...this.sessions.keys()];
  }
}

describe("authentication security", () => {
  test("stores verifiable scrypt password hashes, not plaintext", async () => {
    const storedHash = await hashPassword("a-secure-password");

    expect(storedHash).not.toContain("a-secure-password");
    expect(await verifyPassword("a-secure-password", storedHash)).toBe(true);
    expect(await verifyPassword("another-password", storedHash)).toBe(false);
    expect(await verifyPassword("a-secure-password", "invalid")).toBe(false);
  });

  test("stores only a refresh-token hash and rotates/revokes its session", async () => {
    const repository = new InMemoryAuthRepository();
    const jwt = new JwtService({
      secret: "test-secret-that-is-long-enough-for-jwt",
    });
    const auth = new AuthService(repository, jwt);

    const registered = await auth.register({
      name: "Reader",
      email: "reader@example.invalid",
      password: "a-secure-password",
    });
    expect(registered.user).not.toHaveProperty("passwordHash");
    expect(repository.sessionCount).toBe(1);
    expect(repository.sessionTokenHashes[0]).not.toBe(registered.refreshToken);
    expect(repository.sessionTokenHashes[0]).toHaveLength(64);

    const claims = await jwt.verifyAsync(registered.accessToken);
    expect(claims.sub).toBe(registered.user.id);
    expect(claims.sid).toBeString();
    expect(claims.exp - claims.iat).toBe(15 * 60);

    const rotated = await auth.refresh(registered.refreshToken);
    expect(rotated.refreshToken).not.toBe(registered.refreshToken);
    await expect(auth.refresh(registered.refreshToken)).rejects.toMatchObject({
      status: 401,
    });

    await auth.logout(rotated.refreshToken);
    expect(repository.sessionCount).toBe(0);
    await expect(auth.refresh(rotated.refreshToken)).rejects.toMatchObject({
      status: 401,
    });
  });

  test("does not distinguish unknown accounts from incorrect passwords", async () => {
    const repository = new InMemoryAuthRepository();
    const auth = new AuthService(
      repository,
      new JwtService({ secret: "test-secret-that-is-long-enough-for-jwt" }),
    );
    const errors: unknown[] = [];

    await auth.register({
      name: "Reader",
      email: "reader@example.invalid",
      password: "a-secure-password",
    });

    for (const credentials of [
      { email: "reader@example.invalid", password: "wrong-password" },
      { email: "missing@example.invalid", password: "wrong-password" },
    ]) {
      try {
        await auth.login(credentials);
      } catch (error) {
        errors.push(error);
      }
    }

    const httpErrors = errors.filter(
      (error): error is HttpException => error instanceof HttpException,
    );
    expect(httpErrors).toHaveLength(2);
    expect(httpErrors[0].getStatus()).toBe(401);
    expect(httpErrors[1].getStatus()).toBe(401);
    expect(httpErrors[0].getResponse()).toEqual(httpErrors[1].getResponse());
  });
});
