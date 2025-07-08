import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuickActions from '../../../components/common/QuickActions';
import { Plus, TrendingUp, DollarSign, Users } from 'lucide-react';

const quickActions = [
  {
    to: '/dashboard/events/new',
    label: 'إضافة فعالية',
    icon: Plus,
    color: 'primary' as const,
    description: 'إنشاء فعالية جديدة',
  },
  {
    to: '/dashboard/programs/new',
    label: 'إضافة برنامج',
    icon: TrendingUp,
    color: 'success' as const,
    description: 'إنشاء برنامج جديد',
  },
  {
    to: '/dashboard/donations/new',
    label: 'تسجيل تبرع',
    icon: DollarSign,
    color: 'warning' as const,
    description: 'تسجيل تبرع جديد',
  },
  {
    to: '/dashboard/users/new',
    label: 'إضافة عضو',
    icon: Users,
    color: 'info' as const,
    description: 'إضافة عضو جديد',
  },
];

const NewProgram: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      navigate('/dashboard/programs');
    }, 1200);
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <QuickActions actions={quickActions} className="mb-8" />
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          إضافة برنامج جديد
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">اسم البرنامج</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">الوصف</label>
            <textarea
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">تاريخ البدء</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 transition"
          >
            إضافة البرنامج
          </button>
          {success && (
            <div className="text-green-600 text-center font-semibold mt-2">
              تمت إضافة البرنامج بنجاح!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewProgram;
