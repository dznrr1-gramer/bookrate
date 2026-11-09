import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ExceptionFilter,
} from "@nestjs/common";
import type { Request, Response } from "express";

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Unhandled API exception (${exception instanceof Error ? exception.name : "unknown"}).`,
      );
    }

    const body =
      status === HttpStatus.INTERNAL_SERVER_ERROR
        ? {
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred.",
          }
        : this.getClientError(exception);

    response.status(status).json({
      statusCode: status,
      error: body,
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    });
  }

  private getClientError(exception: unknown) {
    if (!(exception instanceof HttpException)) {
      return {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred.",
      };
    }

    const payload = exception.getResponse();
    if (typeof payload === "string") {
      return { code: "HTTP_ERROR", message: payload };
    }

    const message = (payload as { message?: unknown }).message;
    return {
      code: (payload as { code?: string }).code ?? "HTTP_ERROR",
      message: Array.isArray(message)
        ? message.join("; ")
        : typeof message === "string"
          ? message
          : exception.message,
      ...("issues" in payload ? { issues: payload.issues } : {}),
    };
  }
}
