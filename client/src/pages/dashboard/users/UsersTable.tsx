import React from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import {
  MoreHorizontal,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Star,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';

interface User {
  id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  eventsAttended: number;
  programsParticipated: number;
  totalDonations: number;
  role: string;
  status: string;
  isVerified: boolean;
  lastLogin: string;
}

interface UsersTableProps {
  users: User[];
}

const UsersTable: React.FC<UsersTableProps> = ({ users }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {users.map((user) => (
      <Card key={user.id} className="hover:shadow-lg transition-shadow">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg">
                {user.avatar}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                aria-label={`خيارات مستخدم ${user.firstName} ${user.lastName}`}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {/* Status and Role Badges */}
          <div className="flex items-center justify-between mb-4">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {user.role}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {user.status}
            </span>
          </div>
          {/* User Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              <span>{user.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              <span>انضم {user.joinDate}</span>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div>
              <div className="flex items-center justify-center text-primary-600 mb-1">
                <Activity className="w-4 h-4" />
              </div>
              <div className="text-sm font-medium text-gray-900">
                {user.eventsAttended}
              </div>
              <div className="text-xs text-gray-500">فعالية</div>
            </div>
            <div>
              <div className="flex items-center justify-center text-green-600 mb-1">
                <Star className="w-4 h-4" />
              </div>
              <div className="text-sm font-medium text-gray-900">
                {user.programsParticipated}
              </div>
              <div className="text-xs text-gray-500">برنامج</div>
            </div>
            <div>
              <div className="flex items-center justify-center text-blue-600 mb-1">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-sm font-medium text-gray-900">
                ${user.totalDonations}
              </div>
              <div className="text-xs text-gray-500">تبرع</div>
            </div>
          </div>
          {/* Verification Status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {user.isVerified ? (
                <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
              ) : (
                <XCircle className="w-4 h-4 text-gray-400 mr-1" />
              )}
              <span className="text-xs text-gray-600">
                {user.isVerified ? 'موثق' : 'غير موثق'}
              </span>
            </div>
            <span className="text-xs text-gray-500">{user.lastLogin}</span>
          </div>
          {/* Actions */}
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" icon={Eye} className="flex-1">
              عرض
            </Button>
            <Button
              size="sm"
              variant="secondary"
              icon={Edit}
              className="flex-1"
            >
              تعديل
            </Button>
            <Button
              size="sm"
              variant="outline"
              icon={Trash2}
              className="text-red-600 hover:text-red-700"
            >
              حذف
            </Button>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export default UsersTable;
