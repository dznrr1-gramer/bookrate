import "reflect-metadata";
import { afterEach, describe, expect, setDefaultTimeout, test } from "bun:test";
import type { INestApplication } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Roles } from "./roles.decorator";
import { RolesGuard } from "./roles.guard";

type TestRole = "USER" | "ADMIN";
type RequestWithTestUser = Request & { user?: { role: TestRole } };

@Controller("role-guard-test")
@UseGuards(RolesGuard)
class RoleGuardTestController {
  @Get("admin")
  @Roles("ADMIN")
  admin() {
    return { role: "ADMIN" };
  }

  @Get("user")
  @Roles("USER")
  user() {
    return { role: "USER" };
  }

  @Get("public")
  public() {
    return { access: "public" };
  }
}

setDefaultTimeout(30_000);

describe("RolesGuard", () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  async function startApp() {
    const moduleRef = await Test.createTestingModule({
      controllers: [RoleGuardTestController],
      providers: [RolesGuard],
    }).compile();
    app = moduleRef.createNestApplication({ logger: false });
    app.use(
      (
        request: RequestWithTestUser,
        _response: Response,
        next: NextFunction,
      ) => {
        const role = request.header("x-test-role");
        if (role === "USER" || role === "ADMIN") {
          request.user = { role };
        }
        next();
      },
    );
    await app.listen(0, "127.0.0.1");

    const address = app.getHttpServer().address();
    if (!address || typeof address === "string") {
      throw new Error("The test API server did not bind to a TCP port.");
    }

    return `http://127.0.0.1:${address.port}/role-guard-test`;
  }

  test("requires a matching user role only on role-restricted routes", async () => {
    const baseUrl = await startApp();

    expect((await fetch(`${baseUrl}/public`)).status).toBe(200);
    expect((await fetch(`${baseUrl}/admin`)).status).toBe(401);
    expect(
      (
        await fetch(`${baseUrl}/admin`, {
          headers: { "x-test-role": "USER" },
        })
      ).status,
    ).toBe(403);
    expect(
      (
        await fetch(`${baseUrl}/admin`, {
          headers: { "x-test-role": "ADMIN" },
        })
      ).status,
    ).toBe(200);
    expect(
      (
        await fetch(`${baseUrl}/user`, {
          headers: { "x-test-role": "USER" },
        })
      ).status,
    ).toBe(200);
    expect(
      (
        await fetch(`${baseUrl}/user`, {
          headers: { "x-test-role": "ADMIN" },
        })
      ).status,
    ).toBe(403);
  });
});
