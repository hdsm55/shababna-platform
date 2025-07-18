import { User } from '@/types';

export interface AuthUser extends User {
  lastLogin?: Date;
  permissions?: string[];
  roles?: string[];
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark';
  language?: string;
  notifications?: NotificationPreferences;
  accessibility?: AccessibilityPreferences;
}

export interface NotificationPreferences {
  email?: boolean;
  push?: boolean;
  desktop?: boolean;
  categories?: {
    [key: string]: boolean;
  };
}

export interface AccessibilityPreferences {
  fontSize?: 'normal' | 'large' | 'extra-large';
  contrast?: 'normal' | 'high';
  reduceMotion?: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  deviceId?: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  phone?: string;
  acceptTerms: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
