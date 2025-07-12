import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDonation } from '../../../services/dashboardApi';

const NewDonation: React.FC = () => {
  const [donor, setDonor] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createDonation({
        donorName: donor,
        amount: Number(amount),
        date,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/donations');
      }, 1200);
    } catch (err: any) {
      setError('حدث خطأ أثناء تسجيل التبرع.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
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
              min="1"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">تاريخ التبرع</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'جاري التسجيل...' : 'تسجيل التبرع'}
          </button>
          {error && (
            <div className="text-red-600 text-center font-semibold mt-2">
              {error}
            </div>
          )}
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
