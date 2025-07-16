import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDonations } from '../../services/dashboardApi';
import Button from '../../components/common/Button';

const DonationsDashboard: React.FC = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getDonations = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchDonations();
        setDonations(data.data || []);
      } catch (err: any) {
        setError('تعذر تحميل بيانات التبرعات');
      } finally {
        setLoading(false);
      }
    };
    getDonations();
  }, []);

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">لوحة التبرعات</h1>
        <div className="flex gap-2">
          <Link to="/donations">
            <Button
              variant="outline"
              className="font-bold text-primary-600 border-primary-300"
            >
              صفحة التبرعات العامة
            </Button>
          </Link>
          <Link
            to="/dashboard/donations/new"
            className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition"
          >
            + تسجيل تبرع جديد
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">جاري التحميل...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <table className="min-w-full text-right rtl:text-right">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3">اسم المتبرع</th>
                <th className="py-2 px-3">البريد الإلكتروني</th>
                <th className="py-2 px-3">المبلغ</th>
                <th className="py-2 px-3">العملة</th>
                <th className="py-2 px-3">التاريخ</th>
                <th className="py-2 px-3">الحالة</th>
                <th className="py-2 px-3">طريقة الدفع</th>
                <th className="py-2 px-3">ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium">
                    {donation.donorName}
                  </td>
                  <td className="py-2 px-3">{donation.donorEmail}</td>
                  <td className="py-2 px-3">{donation.amount}</td>
                  <td className="py-2 px-3">{donation.currency}</td>
                  <td className="py-2 px-3">{donation.date}</td>
                  <td className="py-2 px-3">{donation.status}</td>
                  <td className="py-2 px-3">{donation.paymentMethod}</td>
                  <td className="py-2 px-3">{donation.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DonationsDashboard;
