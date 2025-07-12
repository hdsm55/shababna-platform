import React from 'react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { Search, Filter } from 'lucide-react';

interface DonationsFilterProps {
  searchTerm: string;
  statusFilter: string;
  categoryFilter: string;
  paymentFilter: string;
  showFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPaymentChange: (value: string) => void;
  onReset: () => void;
  onToggleFilters: () => void;
}

const DonationsFilter: React.FC<DonationsFilterProps> = ({
  searchTerm,
  statusFilter,
  categoryFilter,
  paymentFilter,
  showFilters,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onPaymentChange,
  onReset,
  onToggleFilters,
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="البحث في التبرعات..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 rtl:pr-10 rtl:pl-4"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleFilters}
            icon={Filter}
          >
            الفلاتر
          </Button>
          <Button variant="secondary" size="sm" onClick={onReset}>
            إعادة تعيين
          </Button>
        </div>
      </div>
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الحالة
              </label>
              <select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="completed">مكتمل</option>
                <option value="pending">قيد الانتظار</option>
                <option value="failed">فشل</option>
                <option value="refunded">مسترد</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الفئة
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">جميع الفئات</option>
                <option value="general">عام</option>
                <option value="events">فعاليات</option>
                <option value="programs">برامج</option>
                <option value="emergency">طوارئ</option>
                <option value="education">تعليم</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                طريقة الدفع
              </label>
              <select
                value={paymentFilter}
                onChange={(e) => onPaymentChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">جميع الطرق</option>
                <option value="card">بطاقة ائتمان</option>
                <option value="bank">تحويل بنكي</option>
                <option value="wallet">محفظة إلكترونية</option>
                <option value="cash">نقدي</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الترتيب
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="newest">الأحدث</option>
                <option value="oldest">الأقدم</option>
                <option value="amount-high">المبلغ الأعلى</option>
                <option value="amount-low">المبلغ الأقل</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationsFilter;
