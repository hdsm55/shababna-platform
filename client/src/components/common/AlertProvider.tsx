import React from 'react';
import { useUnifiedAlert } from '../../hooks/useUnifiedAlert';
import UnifiedAlert from './UnifiedAlert';

/**
 * Alert Provider - مزود الإشعارات الموحد
 * يوفر الإشعارات في جميع أنحاء التطبيق
 */

interface AlertProviderProps {
  children: React.ReactNode;
}

export const AlertContext = React.createContext<ReturnType<
  typeof useUnifiedAlert
> | null>(null);

export const useAlert = () => {
  const context = React.useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
};

const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const alertHook = useUnifiedAlert();

  return (
    <AlertContext.Provider value={alertHook}>
      {children}

      {/* عرض جميع الإشعارات النشطة */}
      {alertHook.alerts.map((alert) => (
        <UnifiedAlert
          key={alert.id}
          type={alert.type}
          message={alert.message}
          title={alert.options.title}
          position={alert.options.position}
          duration={alert.options.duration}
          closable={alert.options.closable}
          autoHide={alert.options.autoHide}
          size={alert.options.size}
          onClose={() => alertHook.removeAlert(alert.id)}
        />
      ))}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
