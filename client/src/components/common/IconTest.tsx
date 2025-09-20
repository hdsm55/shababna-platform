import React from 'react';
import ReliableIcon from './ReliableIcon';
import IconFallbackFixed from './IconFallbackFixed';
import { Card } from '../ui/Card/Card';

const IconTest: React.FC = () => {
  const testIcons = [
    'calendar',
    'users',
    'home',
    'settings',
    'bell',
    'user',
    'mail',
    'phone',
    'map-pin',
    'clock',
    'check-circle',
    'arrow-left',
    'share-2',
    'globe',
    'award',
    'tag',
    'plus',
    'edit',
    'trash-2',
    'eye',
    'search',
    'filter',
    'download',
    'refresh-cw',
    'file-text',
    'message-circle',
    'user-plus',
    'user-check',
    'log-out',
    'layout-dashboard',
    'target',
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          اختبار الأيقونات - ReliableIcon
        </h2>
        <div className="grid grid-cols-6 gap-4">
          {testIcons.map((iconName) => (
            <div
              key={iconName}
              className="flex flex-col items-center p-2 border rounded"
            >
              <ReliableIcon name={iconName} size={24} className="mb-2" />
              <span className="text-xs text-gray-600">{iconName}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          اختبار الأيقونات - IconFallback
        </h2>
        <div className="grid grid-cols-6 gap-4">
          {testIcons.map((iconName) => (
            <div
              key={iconName}
              className="flex flex-col items-center p-2 border rounded"
            >
              <IconFallbackFixed name={iconName} size={24} className="mb-2" />
              <span className="text-xs text-gray-600">{iconName}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default IconTest;
