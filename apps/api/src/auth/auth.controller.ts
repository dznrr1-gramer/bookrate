import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request, Response } from "express";
import {
  loginInputSchema,
  registerInputSchema,
  type LoginInput,
  type RegisterInput,
} from "@bookrate/validators";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import {
  AuthService,
  type AuthTokenBundle,
  type SafeUser,
} from "./auth.service";
import { AUTH_COOKIE_CONFIG } from "./auth.tokens";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { OriginGuard } from "./origin.guard";

interface AuthenticatedRequest extends Request {
  user: SafeUser & { sessionId: string };
}

interface AuthCookieConfig {
  accessCookieMaxAge: number;
  refreshCookieMaxAge: number;
  secure: boolean;
}

const accessCookieName = "br_access";
const refreshCookieName = "br_refresh";
const accessCookiePath = "/api/v1";
const refreshCookiePath = "/api/v1/auth";

function getCookie(request: Request, name: string) {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) {
    return undefined;
  }

  for (const cookie of cookieHeader.split(";")) {
    const [cookieName, ...valueParts] = cookie.trim().split("=");
    if (cookieName === name) {
      return valueParts.join("=") || undefined;
    }
  }

  return undefined;
}

@ApiTags("authentication")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    @Inject(AUTH_COOKIE_CONFIG)
    private readonly cookieConfig: AuthCookieConfig,
  ) {}

  @Post("register")
  @UseGuards(OriginGuard)
  @ApiOperation({ summary: "Register a reader account" })
  async register(
    @Body(new ZodValidationPipe(registerInputSchema)) input: RegisterInput,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.auth.register(input);
    this.setCookies(response, request, result);
    return { user: result.user };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UseGuards(OriginGuard)
  @ApiOperation({ summary: "Sign in and create a session" })
  async login(
    @Body(new ZodValidationPipe(loginInputSchema)) input: LoginInput,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.auth.login(input);
    this.setCookies(response, request, result);
    return { user: result.user };
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @UseGuards(OriginGuard)
  @ApiOperation({ summary: "Rotate the refresh session and access token" })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = getCookie(request, refreshCookieName);
    if (!refreshToken) {
      this.clearCookies(response, request);
      throw new UnauthorizedException({
        code: "INVALID_SESSION",
        message: "The session is invalid or expired.",
      });
    }

    try {
      const result = await this.auth.refresh(refreshToken);
      this.setCookies(response, request, result);
      return { user: result.user };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        this.clearCookies(response, request);
      }
      throw error;
    }
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @UseGuards(OriginGuard)
  @ApiOperation({ summary: "Revoke the current refresh session" })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = getCookie(request, refreshCookieName);
    if (!refreshToken) {
      this.clearCookies(response, request);
      throw new UnauthorizedException({
        code: "INVALID_SESSION",
        message: "The session is invalid or expired.",
      });
    }

    await this.auth.logout(refreshToken);
    this.clearCookies(response, request);
    return { success: true as const };
  }

  @Get("session")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get the current authenticated reader" })
  session(@Req() request: AuthenticatedRequest) {
    const { id, email, name, role } = request.user;
    return { user: { id, email, name, role } };
  }

  private setCookies(
    response: Response,
    request: Request,
    result: AuthTokenBundle,
  ) {
    const secure = this.cookieConfig.secure || request.secure;
    response.cookie(accessCookieName, result.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: accessCookiePath,
      maxAge: this.cookieConfig.accessCookieMaxAge,
    });
    response.cookie(refreshCookieName, result.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: refreshCookiePath,
      maxAge: this.cookieConfig.refreshCookieMaxAge,
    });
  }

  private clearCookies(response: Response, request: Request) {
    const secure = this.cookieConfig.secure || request.secure;
    response.clearCookie(accessCookieName, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: accessCookiePath,
    });
    response.clearCookie(refreshCookieName, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: refreshCookiePath,
    });
  }
}
