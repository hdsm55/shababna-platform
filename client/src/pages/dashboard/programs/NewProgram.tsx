import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProgram } from '../../../services/programsApi';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Alert from '../../../components/common/Alert';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewProgram: React.FC = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    goal_amount: '',
    start_date: '',
    end_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.description ||
      !form.category ||
      !form.goal_amount ||
      !form.start_date ||
      !form.end_date
    ) {
      setError('جميع الحقول المطلوبة يجب ملؤها');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // بناء جسم الطلب كـ JSON فقط
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        goal_amount: Number(form.goal_amount),
        start_date: form.start_date,
        end_date: form.end_date,
        current_amount: 0,
        status: 'active' as const,
      };
      await createProgram(payload);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/programs');
      }, 1500);
    } catch (err: any) {
      setError('حدث خطأ أثناء إضافة البرنامج');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dashboard/programs">
            <Button variant="ghost" size="sm" icon={ArrowLeft}>
              العودة للبرامج
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة برنامج جديد
            </h1>
            <p className="text-gray-600">أدخل تفاصيل البرنامج الجديد</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 backdrop-blur-none">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && <Alert type="error">{error}</Alert>}

            {success && (
              <Alert type="success">
                تم إضافة البرنامج بنجاح! جاري التوجيه...
              </Alert>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                المعلومات الأساسية
              </h3>

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  اسم البرنامج *
                </label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="أدخل اسم البرنامج"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  الوصف *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="أدخل وصف مفصل للبرنامج"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    الفئة *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">اختر الفئة</option>
                    <option value="صحية">صحية</option>
                    <option value="تعليمية">تعليمية</option>
                    <option value="قيادية">قيادية</option>
                    <option value="اجتماعية">اجتماعية</option>
                    <option value="ثقافية">ثقافية</option>
                    <option value="رياضية">رياضية</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="goal_amount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    الهدف المالي *
                  </label>
                  <Input
                    id="goal_amount"
                    name="goal_amount"
                    type="number"
                    value={form.goal_amount}
                    onChange={handleChange}
                    required
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">التواريخ</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="start_date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    تاريخ البداية *
                  </label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={form.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="end_date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    تاريخ الانتهاء *
                  </label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={form.end_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'جاري الإضافة...' : 'إضافة البرنامج'}
              </Button>
              <Link to="/dashboard/programs">
                <Button type="button" variant="secondary" className="flex-1">
                  إلغاء
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewProgram;
