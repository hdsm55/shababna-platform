import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProgram } from '../../../services/programsApi';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Alert from '../../../components/common/Alert';
import { Upload, X, ArrowLeft } from 'lucide-react';
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
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // التحقق من حجم الملف (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('حجم الصورة يجب أن يكون أقل من 2MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
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
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('goal_amount', form.goal_amount);
      formData.append('start_date', form.start_date);
      formData.append('end_date', form.end_date);

      if (image) {
        formData.append('image', image);
      }

      await createProgram(formData);
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
        <div className="bg-white rounded-xl shadow-sm border">
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

            {/* Image Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                صورة البرنامج
              </h3>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>اختر صورة</span>
                  </label>
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeImage}
                      icon={X}
                    >
                      إزالة
                    </Button>
                  )}
                </div>
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="معاينة الصورة"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  المقاس المفضل: 400×400 بكسل (مربع). الحد الأقصى: 2MB
                </p>
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
