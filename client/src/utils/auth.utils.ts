import { jwtDecode } from 'jwt-decode';
import { AuthUser, TokenPair } from '@/types/auth.types';

interface JWTPayload {
  exp: number;
  iat: number;
  sub: string;
  permissions?: string[];
  roles?: string[];
}

export class AuthUtils {
  private static readonly TOKEN_EXPIRY_BUFFER = 5 * 60; // 5 minutes in seconds

  /**
   * Check if a token is expired or will expire soon
   */
  static isTokenExpired(token: string, bufferTime = AuthUtils.TOKEN_EXPIRY_BUFFER): boolean {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp <= currentTime + bufferTime;
    } catch {
      return true;
    }
  }

  /**
   * Get token expiration time in seconds
   */
  static getTokenExpirationTime(token: string): number | null {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      return decoded.exp;
    } catch {
      return null;
    }
  }

  /**
   * Extract user permissions from token
   */
  static extractPermissions(token: string): string[] {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      return decoded.permissions || [];
    } catch {
      return [];
    }
  }

  /**
   * Extract user roles from token
   */
  static extractRoles(token: string): string[] {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      return decoded.roles || [];
    } catch {
      return [];
    }
  }

  /**
   * Store tokens securely
   */
  static storeTokens(tokens: TokenPair): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  /**
   * Remove stored tokens
   */
  static clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Get stored tokens
   */
  static getStoredTokens(): TokenPair | null {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      return { accessToken, refreshToken };
    }
    return null;
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(user: AuthUser | null, permission: string): boolean {
    return user?.permissions?.includes(permission) || false;
  }

  /**
   * Check if user has specific role
   */
  static hasRole(user: AuthUser | null, role: string): boolean {
    return user?.roles?.includes(role) || false;
  }

  /**
   * Generate a secure device ID
   */
  static generateDeviceId(): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const userAgent = navigator.userAgent;
    const hashCode = this.hashString(userAgent);
    return `${timestamp}-${randomStr}-${hashCode}`;
  }

  /**
   * Simple string hashing function
   */
  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
