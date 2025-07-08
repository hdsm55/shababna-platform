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

const NewDonation: React.FC = () => {
  const [donor, setDonor] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      navigate('/dashboard/donations');
    }, 1200);
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <QuickActions actions={quickActions} className="mb-8" />
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">تسجيل تبرع جديد</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">اسم المتبرع</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={donor}
              onChange={(e) => setDonor(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">المبلغ</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">الوصف</label>
            <textarea
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded font-bold hover:bg-yellow-600 transition"
          >
            تسجيل التبرع
          </button>
          {success && (
            <div className="text-green-600 text-center font-semibold mt-2">
              تم تسجيل التبرع بنجاح!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewDonation;
