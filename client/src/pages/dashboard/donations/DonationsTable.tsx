import React from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import { Calendar, MapPin, MoreHorizontal } from 'lucide-react';

interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  category: string;
  description: string;
  date: string;
  anonymous: boolean;
  receiptNumber: string;
  transactionId: string;
  notes: string;
  location: string;
  campaign?: string;
}

interface DonationsTableProps {
  donations: Donation[];
  formatCurrency: (amount: number, currency: string) => string;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  getPaymentMethodIcon: (method: string) => React.ElementType;
  getPaymentMethodText: (method: string) => string;
  getCategoryText: (category: string) => string;
  formatDate: (dateString: string) => string;
  onEdit?: (donation: Donation) => void;
  onView?: (donation: Donation) => void;
  onDelete?: (id: string) => void;
}

const DonationsTable: React.FC<DonationsTableProps> = ({
  donations,
  formatCurrency,
  getStatusColor,
  getStatusText,
  getPaymentMethodIcon,
  getPaymentMethodText,
  getCategoryText,
  formatDate,
  onEdit,
  onView,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {donations.map((donation) => {
        const PaymentIcon = getPaymentMethodIcon(donation.paymentMethod);
        return (
          <Card key={donation.id} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {donation.anonymous ? 'متبرع مجهول' : donation.donorName}
                  </h3>
                  <p className="text-sm text-gray-600">{donation.donorEmail}</p>
                </div>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`خيارات تبرع ${donation.donorName}`}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Amount and Status */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-primary-600">
                  {formatCurrency(donation.amount, donation.currency)}
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    donation.status
                  )}`}
                >
                  {getStatusText(donation.status)}
                </span>
              </div>

              {/* Payment Method and Category */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <PaymentIcon className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  <span>{getPaymentMethodText(donation.paymentMethod)}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {getCategoryText(donation.category)}
                </span>
              </div>

              {/* Description */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 line-clamp-2">
                  {donation.description}
                </p>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  <span>{formatDate(donation.date)}</span>
                </div>
                {donation.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    <span>{donation.location}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                {onView && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onView(donation)}
                  >
                    عرض
                  </Button>
                )}
                {onEdit && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onEdit(donation)}
                  >
                    تعديل
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(donation.id)}
                  >
                    حذف
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default DonationsTable;
