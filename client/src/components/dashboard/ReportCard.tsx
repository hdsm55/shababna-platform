import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import {
  Eye,
  Edit,
  Download,
  Share,
  Calendar,
  Clock,
  Globe,
  Lock,
  Star,
} from 'lucide-react';

// يمكن تمرير الدوال المساعدة أو إعادة تعريفها هنا حسب الحاجة

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-700';
    case 'draft':
      return 'bg-yellow-100 text-yellow-700';
    case 'archived':
      return 'bg-gray-100 text-gray-700';
    case 'scheduled':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'published':
      return 'منشور';
    case 'draft':
      return 'مسودة';
    case 'archived':
      return 'مؤرشف';
    case 'scheduled':
      return 'مجدول';
    default:
      return status;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ar-EG');
};

const ReportCard = ({ report, onEdit, onView }: any) => {
  // يمكن تمرير أو إعادة تعريف أي دوال مساعدة أخرى حسب الحاجة
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {report.title}
            </h3>
            <p className="text-sm text-gray-600">{report.author}</p>
          </div>
        </div>
        {/* Status and Type Badges */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              report.status
            )}`}
          >
            {getStatusText(report.status)}
          </span>
          <span className="text-xs text-gray-500">{report.format}</span>
        </div>
        {/* Description */}
        <div className="mb-4">
          <p className="text-sm text-gray-700 line-clamp-3">
            {report.description}
          </p>
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {report.tags &&
            report.tags.slice(0, 3).map((tag: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          {report.tags && report.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{report.tags.length - 3}
            </span>
          )}
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-center text-sm">
          <div>
            <div className="flex items-center justify-center text-blue-600 mb-1">
              <Eye className="w-4 h-4" />
            </div>
            <div className="font-medium text-gray-900">{report.views}</div>
            <div className="text-xs text-gray-500">مشاهدة</div>
          </div>
          <div>
            <div className="flex items-center justify-center text-green-600 mb-1">
              <Download className="w-4 h-4" />
            </div>
            <div className="font-medium text-gray-900">{report.downloads}</div>
            <div className="text-xs text-gray-500">تحميل</div>
          </div>
          <div>
            <div className="flex items-center justify-center text-purple-600 mb-1">
              <Share className="w-4 h-4" />
            </div>
            <div className="font-medium text-gray-900">{report.shares}</div>
            <div className="text-xs text-gray-500">مشاركة</div>
          </div>
        </div>
        {/* Additional Info */}
        <div className="space-y-2 mb-4 text-xs text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-2 rtl:ml-2 rtl:mr-0" />
            <span>{formatDate(report.createdDate)}</span>
          </div>
          {report.scheduledDate && (
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-2 rtl:ml-2 rtl:mr-0" />
              <span>مجدول: {formatDate(report.scheduledDate)}</span>
            </div>
          )}
        </div>
        {/* Visibility and Featured */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {report.isPublic ? (
              <Globe className="w-4 h-4 text-green-600" />
            ) : (
              <Lock className="w-4 h-4 text-gray-600" />
            )}
            <span className="text-xs text-gray-600">
              {report.isPublic ? 'عام' : 'خاص'}
            </span>
          </div>
          {report.isFeatured && <Star className="w-4 h-4 text-yellow-500" />}
        </div>
        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={onView}
            icon={Eye}
            className="flex-1"
          >
            عرض
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={onEdit}
            icon={Edit}
            className="flex-1"
          >
            تعديل
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ReportCard;
