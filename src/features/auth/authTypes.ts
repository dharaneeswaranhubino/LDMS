export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  profilePicture?: string | null;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;

  updateProfileLoading: boolean;
  updateProfileError: string | null;
  updateProfileSuccess: string | null;
  changePasswordLoading: boolean;
  changePasswordError: string | null;
  changePasswordSuccess: string | null;
}

export interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}



export interface ProfileViewProps {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    phoneNumber?: string;
  };
}

export interface UpdateProfilePayload {
  name: string;
  phoneNumber: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
}