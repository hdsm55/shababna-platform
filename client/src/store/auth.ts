import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';

export interface AuthUser extends User {
  lastLogin?: Date;
  permissions?: string[];
  roles?: string[];
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: Date | null;
  deviceId: string | null;

  // Authentication actions
  setAuth: (user: AuthUser, token: string, refreshToken?: string) => void;
  clearAuth: () => void;
  updateUser: (userData: Partial<AuthUser>) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
  updateLastActivity: () => void;

  // Permission management
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;

  // Token management
  updateToken: (newToken: string) => void;
  setRefreshToken: (token: string) => void;

  // Device management
  setDeviceId: (id: string) => void;
}

const generateDeviceId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      lastActivity: null,
      deviceId: null,

      // Authentication actions
      setAuth: (user, token, refreshToken) => set({
        user: {
          ...user,
          lastLogin: new Date(),
        },
        token,
        refreshToken: refreshToken || null,
        isAuthenticated: true,
        error: null,
        lastActivity: new Date(),
        deviceId: get().deviceId || generateDeviceId(),
      }),

      clearAuth: () => set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
        lastActivity: null,
      }),

      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      })),

      setLoading: (status) => set({ isLoading: status }),

      setError: (error) => set({ error }),

      updateLastActivity: () => set({ lastActivity: new Date() }),

      // Permission management
      hasPermission: (permission) => {
        const state = get();
        return state.user?.permissions?.includes(permission) || false;
      },

      hasRole: (role) => {
        const state = get();
        return state.user?.roles?.includes(role) || false;
      },

      // Token management
      updateToken: (newToken) => set({ token: newToken }),

      setRefreshToken: (token) => set({ refreshToken: token }),

      // Device management
      setDeviceId: (id) => set({ deviceId: id }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        deviceId: state.deviceId,
      }),
    }
  )
);

// Import activity tracker
import { activityTracker } from './activity-tracker';

// Initialize activity tracking when auth state changes
useAuthStore.subscribe((state) => {
  if (state.isAuthenticated) {
    activityTracker.startTracking(state);
    activityTracker.setupAutoLogout(state);
  } else {
    activityTracker.stopTracking();
  }
});

// Export custom hooks for common auth operations
export const useAuth = () => {
  const store = useAuthStore();

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    deviceId: store.deviceId,

    login: async (user: AuthUser, token: string, refreshToken?: string) => {
      store.setLoading(true);
      try {
        store.setAuth(user, token, refreshToken);
      } catch (error) {
        store.setError(error instanceof Error ? error.message : 'Login failed');
      } finally {
        store.setLoading(false);
      }
    },

    logout: () => {
      store.clearAuth();
    },

    checkPermission: (permission: string) => store.hasPermission(permission),
    checkRole: (role: string) => store.hasRole(role),

    refreshUserToken: (newToken: string) => {
      store.updateToken(newToken);
    },
  };
};

// Export type for TypeScript support
export type { AuthState };
