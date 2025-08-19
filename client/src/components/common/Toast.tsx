import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { DESIGN_SYSTEM } from './DesignSystem';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dir?: 'rtl' | 'ltr';
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, clearToasts }}
    >
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getClasses = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => {
          const direction =
            toast.dir ||
            (typeof document !== 'undefined'
              ? (document.documentElement.dir as 'rtl' | 'ltr')
              : 'rtl');
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.35, type: 'spring' }}
              className={`border rounded-lg shadow-lg p-4 backdrop-blur-sm flex items-start gap-3 ${getClasses(
                toast.type
              )}`}
              dir={direction}
              role="alert"
            >
              <div className="flex-shrink-0 mt-0.5">{getIcon(toast.type)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-neutral-900 mb-1">
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className="text-sm text-neutral-600 mb-3">
                    {toast.message}
                  </p>
                )}
                {toast.action && (
                  <button
                    onClick={toast.action.onClick}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// Convenience functions
export const toast = {
  success: (title: string, message?: string, options?: Partial<Toast>) => {
    return { type: 'success' as const, title, message, ...options };
  },
  error: (title: string, message?: string, options?: Partial<Toast>) => {
    return { type: 'error' as const, title, message, ...options };
  },
  warning: (title: string, message?: string, options?: Partial<Toast>) => {
    return { type: 'warning' as const, title, message, ...options };
  },
  info: (title: string, message?: string, options?: Partial<Toast>) => {
    return { type: 'info' as const, title, message, ...options };
  },
};

export default ToastContainer;
