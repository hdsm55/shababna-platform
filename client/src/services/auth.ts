import { fetchAPI } from '@/utils/api';
import { User } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  first_name: string;
  last_name: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  async getProfile(token: string): Promise<User> {
    const response = await fetchAPI('/auth/me', {
      token,
    });
    return response.data.user;
  },

  async updateProfile(token: string, data: Partial<User>): Promise<User> {
    const response = await fetchAPI('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
    return response.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await fetchAPI('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await fetchAPI('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },
};
