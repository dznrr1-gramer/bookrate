import { describe, expect, test } from "bun:test";
import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { assertUserAccess } from "./authorization";

describe("assertUserAccess", () => {
  const ownerId = "reader-1";

  test("requires an authenticated user", () => {
    expect(() => assertUserAccess(undefined, ownerId)).toThrow(
      UnauthorizedException,
    );
  });

  test("allows a user to access their own resource", () => {
    expect(() =>
      assertUserAccess({ id: ownerId, role: "USER" }, ownerId),
    ).not.toThrow();
  });

  test("forbids a user from accessing another user's resource", () => {
    expect(() =>
      assertUserAccess({ id: "reader-2", role: "USER" }, ownerId),
    ).toThrow(ForbiddenException);
  });

  test("allows an administrator to access another user's resource", () => {
    expect(() =>
      assertUserAccess({ id: "admin-1", role: "ADMIN" }, ownerId),
    ).not.toThrow();
  });
});
