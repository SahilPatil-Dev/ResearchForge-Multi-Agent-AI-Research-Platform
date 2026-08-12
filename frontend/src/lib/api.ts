import type {
  PasswordChangeRequest,
  RegisterRequest,
  Research,
  ResearchCreateRequest,
  TokenResponse,
  User,
  UserUpdateRequest,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;


if (!API_BASE_URL) {
  console.warn(
    "VITE_API_BASE_URL is not configured."
  );
}

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
      const error =
        await response.json();

      if (typeof error.detail === "string") {
        message = error.detail;
      } else if (
        Array.isArray(error.detail)
      ) {
        message = error.detail
          .map(
            (item: any) =>
              item.msg
          )
          .join(", ");
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