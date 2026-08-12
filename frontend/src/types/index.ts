export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
}

export interface ResearchCreateRequest {
  topic: string;
}

export type ResearchStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export interface Research {
  id: number;
  topic: string;
  status: ResearchStatus;
  error_message: string | null;
  report: string | null;
  feedback: string | null;
  score: number | null;
  created_at: string;
  completed_at: string | null;
}

export interface UserUpdateRequest {
  full_name?: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}