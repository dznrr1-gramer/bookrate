import type { LoginInput, RegisterInput } from "@bookrate/validators";

const defaultApiBaseUrl = "http://localhost:4000/api/v1";

function getApiBaseUrl() {
  const value = process.env.NEXT_PUBLIC_API_URL ?? defaultApiBaseUrl;
  const url = new URL(value);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("NEXT_PUBLIC_API_URL must use HTTP or HTTPS.");
  }
  if (url.username || url.password) {
    throw new Error("NEXT_PUBLIC_API_URL must not contain credentials.");
  }
  if (url.search || url.hash) {
    throw new Error(
      "NEXT_PUBLIC_API_URL must not contain a query or fragment.",
    );
  }

  return url.toString().replace(/\/+$/, "");
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  options: { credentials?: RequestCredentials } = {},
): Promise<T> {
  const normalizedPath = path.replace(/^\/+/, "");
  const baseUrl = getApiBaseUrl();
  const base = new URL(baseUrl);
  const url = new URL(normalizedPath, `${baseUrl}/`);

  if (
    url.origin !== base.origin ||
    (url.pathname !== base.pathname &&
      !url.pathname.startsWith(`${base.pathname}/`))
  ) {
    throw new Error(
      "API request path must remain under the configured API base URL.",
    );
  }

  const headers = new Headers(init.headers);
  if (init.body !== undefined && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    headers,
    credentials: options.credentials ?? "omit",
  });

  if (!response.ok) {
    let payload: { error?: { code?: string; message?: string } } | null = null;
    if (response.headers.get("content-type")?.includes("application/json")) {
      try {
        payload = (await response.json()) as {
          error?: { code?: string; message?: string };
        };
      } catch {
        throw new ApiClientError(
          "The API returned an invalid error response.",
          response.status,
        );
      }
    }
    throw new ApiClientError(
      payload?.error?.message ?? "The API request failed.",
      response.status,
      payload?.error?.code,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const apiClient = {
  health: () => apiRequest<{ status: "ok" }>("health"),
  auth: {
    register: (input: RegisterInput) =>
      apiRequest<{ user: AuthUser }>(
        "auth/register",
        { method: "POST", body: JSON.stringify(input) },
        { credentials: "include" },
      ),
    login: (input: LoginInput) =>
      apiRequest<{ user: AuthUser }>(
        "auth/login",
        { method: "POST", body: JSON.stringify(input) },
        { credentials: "include" },
      ),
    refresh: () =>
      apiRequest<{ user: AuthUser }>(
        "auth/refresh",
        { method: "POST" },
        { credentials: "include" },
      ),
    logout: () =>
      apiRequest<{ success: true }>(
        "auth/logout",
        { method: "POST" },
        { credentials: "include" },
      ),
    session: () =>
      apiRequest<{ user: AuthUser }>(
        "auth/session",
        {},
        { credentials: "include" },
      ),
  },
};

export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  role: "USER" | "ADMIN";
}
