import React from 'react';
import Card from '../../../components/common/Card';
import {
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Heart,
  Gift,
} from 'lucide-react';

interface DonationsStatsProps {
  stats: {
    total: number;
    count: number;
    completed: number;
    pending: number;
    failed: number;
    anonymous: number;
  };
  formatCurrency: (amount: number, currency: string) => string;
}

const DonationsStats: React.FC<DonationsStatsProps> = ({
  stats,
  formatCurrency,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="mr-4 rtl:ml-4 rtl:mr-0">
              <p className="text-sm font-medium text-gray-600">
                إجمالي التبرعات
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.total, 'SAR')}
              </p>
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600">+12.5%</span>
            <span className="text-gray-500 mr-2 rtl:ml-2 rtl:mr-0">
              من الشهر الماضي
            </span>
          </div>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="mr-4 rtl:ml-4 rtl:mr-0">
              <p className="text-sm font-medium text-gray-600">عدد التبرعات</p>
              <p className="text-2xl font-bold text-gray-900">{stats.count}</p>
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <CheckCircle className="w-4 h-4 text-blue-600 mr-1" />
            <span className="text-blue-600">{stats.completed}</span>
            <span className="text-gray-500 mr-2 rtl:ml-2 rtl:mr-0">مكتملة</span>
          </div>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="mr-4 rtl:ml-4 rtl:mr-0">
              <p className="text-sm font-medium text-gray-600">قيد الانتظار</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pending}
              </p>
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mr-1" />
            <span className="text-yellow-600">{stats.failed}</span>
            <span className="text-gray-500 mr-2 rtl:ml-2 rtl:mr-0">فشلت</span>
          </div>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div className="mr-4 rtl:ml-4 rtl:mr-0">
              <p className="text-sm font-medium text-gray-600">تبرعات مجهولة</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.anonymous}
              </p>
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <Gift className="w-4 h-4 text-purple-600 mr-1" />
            <span className="text-purple-600">+8.2%</span>
            <span className="text-gray-500 mr-2 rtl:ml-2 rtl:mr-0">
              من إجمالي التبرعات
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DonationsStats;
