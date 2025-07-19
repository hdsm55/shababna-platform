import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface QuickAction {
  to: string;
  label: string;
  icon: React.ElementType;
  color?: 'primary' | 'success' | 'warning' | 'info';
  description?: string;
  soon?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

const colorMap: Record<string, string> = {
  primary: 'border-blue-300 text-blue-500 hover:bg-blue-50',
  success: 'border-green-300 text-green-500 hover:bg-green-50',
  warning: 'border-yellow-200 text-yellow-500 hover:bg-yellow-50',
  info: 'border-blue-300 text-blue-500 hover:bg-blue-50',
};

const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  className = '',
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <div
      className={`w-full flex flex-col gap-4 ${className}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Link
              to={action.soon ? '#' : action.to}
              key={action.label}
              className={`flex-1 min-w-[200px] max-w-xs border rounded-xl px-6 py-5 flex flex-col items-center transition-all duration-150 shadow-sm bg-white ${
                colorMap[action.color || 'primary']
              } ${
                action.soon
                  ? 'opacity-60 pointer-events-none'
                  : 'cursor-pointer'
              }`}
              tabIndex={action.soon ? -1 : 0}
              aria-disabled={action.soon}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-7 h-7" />
                <span className="text-lg font-semibold">{t(action.label)}</span>
              </div>
              <span className="text-sm text-gray-400 font-light">
                {action.description}
                {action.soon && (
                  <span className="ml-1 text-xs text-gray-400">
                    {t('common.soon', 'قريبًا')}
                  </span>
                )}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
