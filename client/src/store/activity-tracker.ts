import { AuthState } from './auth';

export class ActivityTracker {
  private static instance: ActivityTracker;
  private cleanup: (() => void) | null = null;

  private constructor() {}

  static getInstance(): ActivityTracker {
    if (!ActivityTracker.instance) {
      ActivityTracker.instance = new ActivityTracker();
    }
    return ActivityTracker.instance;
  }

  startTracking(state: AuthState): void {
    this.stopTracking(); // Clean up any existing listeners

    const updateActivity = () => {
      if (state.isAuthenticated) {
        state.updateLastActivity();
      }
    };

    if (typeof window !== 'undefined') {
      const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

      events.forEach(event => {
        window.addEventListener(event, updateActivity, { passive: true });
      });

      // Store cleanup function
      this.cleanup = () => {
        events.forEach(event => {
          window.removeEventListener(event, updateActivity);
        });
      };
    }
  }

  stopTracking(): void {
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = null;
    }
  }

  setupAutoLogout(state: AuthState, inactivityTimeout = 30 * 60 * 1000): void {
    setInterval(() => {
      if (state.lastActivity) {
        const inactiveTime = Date.now() - state.lastActivity.getTime();
        if (inactiveTime > inactivityTimeout) {
          state.clearAuth();
          this.stopTracking();
        }
      }
    }, 60 * 1000); // Check every minute
  }
}

export const activityTracker = ActivityTracker.getInstance();
