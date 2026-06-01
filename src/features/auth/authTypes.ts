export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  profilePicture?: string | null;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

export interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
