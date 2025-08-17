import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';

interface RateLimiterProps {
  children: React.ReactNode;
  maxAttempts?: number;
  timeWindow?: number; // in milliseconds
  onLimitReached?: () => void;
  showWarning?: boolean;
  className?: string;
}

interface RateLimitState {
  attempts: number;
  lastAttempt: number;
  isBlocked: boolean;
  remainingTime: number;
}

export const RateLimiter: React.FC<RateLimiterProps> = ({
  children,
  maxAttempts = 5,
  timeWindow = 60000, // 1 minute
  onLimitReached,
  showWarning = true,
  className = '',
}) => {
  const [state, setState] = useState<RateLimitState>({
    attempts: 0,
    lastAttempt: 0,
    isBlocked: false,
    remainingTime: 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if user is rate limited
  const isRateLimited = useCallback(() => {
    const now = Date.now();
    const timeSinceLastAttempt = now - state.lastAttempt;

    // Reset attempts if time window has passed
    if (timeSinceLastAttempt > timeWindow) {
      setState((prev) => ({
        ...prev,
        attempts: 0,
        isBlocked: false,
        remainingTime: 0,
      }));
      return false;
    }

    // Check if user has exceeded max attempts
    if (state.attempts >= maxAttempts) {
      const remainingTime = timeWindow - timeSinceLastAttempt;
      setState((prev) => ({
        ...prev,
        isBlocked: true,
        remainingTime,
      }));
      return true;
    }

    return false;
  }, [state.attempts, state.lastAttempt, maxAttempts, timeWindow]);

  // Record an attempt
  const recordAttempt = useCallback(() => {
    const now = Date.now();
    const timeSinceLastAttempt = now - state.lastAttempt;

    // Reset attempts if time window has passed
    if (timeSinceLastAttempt > timeWindow) {
      setState((prev) => ({
        ...prev,
        attempts: 1,
        lastAttempt: now,
        isBlocked: false,
        remainingTime: 0,
      }));
      return true;
    }

    // Increment attempts
    const newAttempts = state.attempts + 1;
    setState((prev) => ({
      ...prev,
      attempts: newAttempts,
      lastAttempt: now,
    }));

    // Check if limit reached
    if (newAttempts >= maxAttempts) {
      setState((prev) => ({
        ...prev,
        isBlocked: true,
        remainingTime: timeWindow,
      }));
      onLimitReached?.();
      return false;
    }

    return true;
  }, [
    state.attempts,
    state.lastAttempt,
    maxAttempts,
    timeWindow,
    onLimitReached,
  ]);

  // Update remaining time
  useEffect(() => {
    if (state.isBlocked && state.remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          const newRemainingTime = Math.max(0, prev.remainingTime - 1000);

          if (newRemainingTime === 0) {
            return {
              ...prev,
              isBlocked: false,
              attempts: 0,
              remainingTime: 0,
            };
          }

          return {
            ...prev,
            remainingTime: newRemainingTime,
          };
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isBlocked, state.remainingTime]);

  // Format remaining time
  const formatRemainingTime = (ms: number): string => {
    const seconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}s`;
  };

  // Handle child interactions
  const handleChildInteraction = useCallback(
    (event: React.MouseEvent | React.KeyboardEvent) => {
      if (isRateLimited()) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }

      return recordAttempt();
    },
    [isRateLimited, recordAttempt]
  );

  // Clone children and add event handlers
  const childrenWithRateLimit = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent) => {
          if (!handleChildInteraction(e)) {
            return;
          }
          child.props.onClick?.(e);
        },
        onKeyDown: (e: React.KeyboardEvent) => {
          if (!handleChildInteraction(e)) {
            return;
          }
          child.props.onKeyDown?.(e);
        },
        disabled: state.isBlocked || child.props.disabled,
      });
    }
    return child;
  });

  return (
    <div className={`relative ${className}`}>
      {childrenWithRateLimit}

      {/* Rate Limit Warning */}
      <AnimatePresence>
        {showWarning && state.attempts > 0 && !state.isBlocked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-8 left-0 right-0 bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-xs text-yellow-800"
          >
            <div className="flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{maxAttempts - state.attempts} محاولة متبقية</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rate Limit Blocked */}
      <AnimatePresence>
        {state.isBlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  تم تجاوز الحد المسموح
                </span>
              </div>
              <p className="text-xs text-red-600">
                يرجى الانتظار {formatRemainingTime(state.remainingTime)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Hook for rate limiting
export const useRateLimiter = (
  maxAttempts: number = 5,
  timeWindow: number = 60000
) => {
  const [attempts, setAttempts] = useState(0);
  const [lastAttempt, setLastAttempt] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const timeSinceLastAttempt = now - lastAttempt;

    if (timeSinceLastAttempt > timeWindow) {
      setAttempts(0);
      setIsBlocked(false);
      return true;
    }

    if (attempts >= maxAttempts) {
      setIsBlocked(true);
      return false;
    }

    return true;
  }, [attempts, lastAttempt, maxAttempts, timeWindow]);

  const recordAttempt = useCallback(() => {
    const now = Date.now();
    const timeSinceLastAttempt = now - lastAttempt;

    if (timeSinceLastAttempt > timeWindow) {
      setAttempts(1);
      setLastAttempt(now);
      setIsBlocked(false);
      return true;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setLastAttempt(now);

    if (newAttempts >= maxAttempts) {
      setIsBlocked(true);
      return false;
    }

    return true;
  }, [attempts, lastAttempt, maxAttempts, timeWindow]);

  return {
    attempts,
    isBlocked,
    checkRateLimit,
    recordAttempt,
    remainingAttempts: Math.max(0, maxAttempts - attempts),
  };
};

export default RateLimiter;
