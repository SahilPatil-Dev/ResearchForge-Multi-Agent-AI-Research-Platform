import type {
  PasswordChangeRequest,
  RegisterRequest,
  Research,
  ResearchCreateRequest,
  ResearchProgressEvent,
  TokenResponse,
  User,
  UserUpdateRequest,
} from "../types";

function normalizeApiBaseUrl(baseUrl: string): string {
  const normalizedBaseUrl = baseUrl.trim().replace(/\/+$/, "");

  if (!normalizedBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL must not be empty.");
  }

  return normalizedBaseUrl.endsWith("/api/v1")
    ? normalizedBaseUrl
    : `${normalizedBaseUrl}/api/v1`;
}

const configuredApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
  (process.env.NODE_ENV === "production"
    ? "https://researchforge-multi-agent-system.onrender.com/api/v1"
    : "http://localhost:8000");

const API_BASE_URL = normalizeApiBaseUrl(configuredApiBaseUrl);

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    localStorage.getItem("access_token");

  const headers = new Headers(
    options.headers
  );

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  if (!response.ok) {
    let message =
      "Something went wrong.";

    try {
      const error: unknown = await response.json();
      if (
        error &&
        typeof error === "object" &&
        "detail" in error
      ) {
        const detail = error.detail;
        if (typeof detail === "string") {
          message = detail;
        } else if (Array.isArray(detail)) {
          message = detail
            .map((item: unknown) => {
              if (
                item &&
                typeof item === "object" &&
                "msg" in item &&
                typeof item.msg === "string"
              ) {
                return item.msg;
              }
              return "";
            })
            .filter(Boolean)
            .join(", ");
        }
      }
    } catch {
      message = response.statusText;
    }

    const apiError = new Error(
      message
    );

    (
      apiError as Error & {
        status?: number;
      }
    ).status = response.status;

    throw apiError;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}


export const api = {

  register(
    data: RegisterRequest
  ) {
    return request<User>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  login(
    email: string,
    password: string
  ) {
    const body =
      new URLSearchParams();

    body.append(
      "username",
      email
    );

    body.append(
      "password",
      password
    );

    return request<TokenResponse>(
      "/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body,
      }
    );
  },

  getMe() {
    return request<User>(
      "/users/me"
    );
  },

  updateProfile(
    data: UserUpdateRequest
  ) {
    return request<User>(
      "/users/me",
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  changePassword(
    data: PasswordChangeRequest
  ) {
    return request<{
      message: string;
    }>(
      "/users/me/password",
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  createResearch(
    data: ResearchCreateRequest
  ) {
    return request<Research>(
      "/research",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  getResearch(
    id: number
  ) {
    return request<Research>(
      `/research/${id}`
    );
  },

  async streamResearchEvents(
    id: number,
    signal: AbortSignal,
    onEvent: (event: ResearchProgressEvent) => void
  ) {
    const token = localStorage.getItem("access_token");
    const headers = new Headers({
      Accept: "text/event-stream",
    });

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(
      `${API_BASE_URL}/research/${id}/events`,
      {
        headers,
        signal,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Live research updates failed (${response.status}).`
      );
    }
    if (!response.body) {
      throw new Error(
        "The server did not provide a research event stream."
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const frame = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const data = frame
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trim())
          .join("\n");

        if (data) {
          onEvent(
            JSON.parse(data) as ResearchProgressEvent
          );
        }
        boundary = buffer.indexOf("\n\n");
      }
    }
  },

  getResearchHistory() {
    return request<Research[]>(
      "/research"
    );
  },

  deleteResearch(
    id: number
  ) {
    return request<void>(
      `/research/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};