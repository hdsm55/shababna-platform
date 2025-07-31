import React from 'react';
import Button from '../../../components/common/Button';
import { Trash2 } from 'lucide-react';

interface DangerZoneSectionProps {
  settings: any;
  handleDeleteAccount?: () => void;
}

const DangerZoneSection: React.FC<DangerZoneSectionProps> = ({
  settings,
  handleDeleteAccount,
}) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-red-700">إدارة الحساب</h2>
    <div className="p-4 bg-red-50 rounded-lg flex items-center justify-between">
      <div>
        <h3 className="font-medium text-red-900">حذف الحساب</h3>
        <p className="text-sm text-red-700">
          سيتم حذف جميع بياناتك بشكل نهائي ولا يمكن التراجع عن هذا الإجراء.
        </p>
      </div>
      <Button
        variant="outline"
        icon={Trash2}
        onClick={handleDeleteAccount}
        className="text-red-600 border-red-600 hover:bg-red-50"
      >
        حذف الحساب
      </Button>
    </div>
  </div>
);

export default DangerZoneSection;
