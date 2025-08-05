import { useState, useCallback } from 'react';
import { withRetry } from '../services/api';

interface UseApiWithRetryOptions {
  maxRetries?: number;
  delay?: number;
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
}

export const useApiWithRetry = (options: UseApiWithRetryOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);

  const execute = useCallback(async <T>(
    apiCall: () => Promise<T>
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    setRetryCount(0);

    try {
      const result = await withRetry(
        apiCall,
        options.maxRetries || 3,
        options.delay || 2000
      );

      options.onSuccess?.(result);
      return result;
    } catch (err: any) {
      setError(err);
      setRetryCount(options.maxRetries || 3);
      options.onError?.(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setError(null);
    setRetryCount(0);
    setIsLoading(false);
  }, []);

  return {
    execute,
    isLoading,
    error,
    retryCount,
    reset,
    isBackendIdle: error?.isBackendIdle || false
  };
};