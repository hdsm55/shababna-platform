import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertType } from '../components/common/UnifiedAlert';

/**
 * Hook للإشعارات الموحدة
 * يوفر واجهة بسيطة لإظهار الإشعارات في جميع أنحاء التطبيق
 */

interface AlertOptions {
  title?: string;
  position?: 'top-center' | 'top-right' | 'inline' | 'overlay';
  duration?: number;
  closable?: boolean;
  autoHide?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface AlertState {
  id: string;
  type: AlertType;
  message: string;
  options: AlertOptions;
}

export const useUnifiedAlert = () => {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<AlertState[]>([]);

  // إضافة إشعار جديد
  const addAlert = useCallback((
    type: AlertType,
    message: string,
    options: AlertOptions = {}
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newAlert: AlertState = {
      id,
      type,
      message,
      options: {
        position: 'top-center',
        duration: 5000,
        closable: true,
        autoHide: true,
        size: 'md',
        ...options,
      },
    };

    setAlerts(prev => [...prev, newAlert]);

    // إزالة تلقائية بعد المدة المحددة
    if (options.autoHide !== false && options.duration !== 0) {
      setTimeout(() => {
        removeAlert(id);
      }, options.duration || 5000);
    }

    return id;
  }, []);

  // إزالة إشعار
  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  // إزالة جميع الإشعارات
  const clearAll = useCallback(() => {
    setAlerts([]);
  }, []);

  // دوال مختصرة للإشعارات الشائعة
  const success = useCallback((message: string, options?: AlertOptions) => {
    return addAlert('success', message, options);
  }, [addAlert]);

  const error = useCallback((message: string, options?: AlertOptions) => {
    return addAlert('error', message, { duration: 7000, ...options });
  }, [addAlert]);

  const warning = useCallback((message: string, options?: AlertOptions) => {
    return addAlert('warning', message, options);
  }, [addAlert]);

  const info = useCallback((message: string, options?: AlertOptions) => {
    return addAlert('info', message, options);
  }, [addAlert]);

  // إشعارات محلية للنماذج
  const localSuccess = useCallback((message: string, options?: AlertOptions) => {
    return addAlert('success', message, { position: 'button-bottom', ...options });
  }, [addAlert]);

  const localError = useCallback((message: string, options?: AlertOptions) => {
    return addAlert('error', message, { position: 'button-bottom', duration: 7000, ...options });
  }, [addAlert]);

  const formSuccess = useCallback((message: string, options?: AlertOptions) => {
    return addAlert('success', message, { position: 'form-top', ...options });
  }, [addAlert]);

  const formError = useCallback((message: string, options?: AlertOptions) => {
    return addAlert('error', message, { position: 'form-top', duration: 7000, ...options });
  }, [addAlert]);

  // دوال للإشعارات الشائعة مع ترجمة
  const showSuccess = useCallback((key: string, options?: AlertOptions) => {
    return success(t(key), options);
  }, [success, t]);

  const showError = useCallback((key: string, options?: AlertOptions) => {
    return error(t(key), { duration: 7000, ...options });
  }, [error, t]);

  const showWarning = useCallback((key: string, options?: AlertOptions) => {
    return warning(t(key), options);
  }, [warning, t]);

  const showInfo = useCallback((key: string, options?: AlertOptions) => {
    return info(t(key), options);
  }, [info, t]);


  // إشعارات العمليات
  const operationSuccess = useCallback((operation: string, options?: AlertOptions) => {
    return success(
      t('operations.success', { operation: t(`operations.${operation}`) }),
      options
    );
  }, [success, t]);

  const operationError = useCallback((operation: string, options?: AlertOptions) => {
    return error(
      t('operations.error', { operation: t(`operations.${operation}`) }),
      { duration: 7000, ...options }
    );
  }, [error, t]);

  return {
    alerts,
    addAlert,
    removeAlert,
    clearAll,
    success,
    error,
    warning,
    info,
    localSuccess,
    localError,
    formSuccess,
    formError,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    operationSuccess,
    operationError,
  };
};
