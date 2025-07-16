import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../../services/eventsApi';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Alert from '../../../components/common/Alert';
import { Upload, X, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewEvent: React.FC = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    start_date: '',
    end_date: '',
    capacity: '',
    price: '',
    organizer: '',
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
      !form.location ||
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
      formData.append('location', form.location);
      formData.append('start_date', form.start_date);
      formData.append('end_date', form.end_date);
      formData.append('capacity', form.capacity);
      formData.append('price', form.price);
      formData.append('organizer', form.organizer);

      if (image) {
        formData.append('image', image);
      }

      await createEvent(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/events');
      }, 1500);
    } catch (err: any) {
      setError('حدث خطأ أثناء إضافة الفعالية');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dashboard/events">
            <Button variant="ghost" size="sm" icon={ArrowLeft}>
              العودة للفعاليات
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              إضافة فعالية جديدة
            </h1>
            <p className="text-gray-600">أدخل تفاصيل الفعالية الجديدة</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && <Alert type="error">{error}</Alert>}

            {success && (
              <Alert type="success">
                تم إضافة الفعالية بنجاح! جاري التوجيه...
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
                  اسم الفعالية *
                </label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="أدخل اسم الفعالية"
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
                  placeholder="أدخل وصف مفصل للفعالية"
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
                    <option value="conference">مؤتمر</option>
                    <option value="workshop">ورشة عمل</option>
                    <option value="networking">شبكة</option>
                    <option value="seminar">ندوة</option>
                    <option value="exhibition">معرض</option>
                    <option value="competition">مسابقة</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    الموقع *
                  </label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    value={form.location}
                    onChange={handleChange}
                    required
                    placeholder="أدخل الموقع"
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

            {/* Event Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                تفاصيل الفعالية
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="capacity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    السعة
                  </label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    value={form.capacity}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    السعر
                  </label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label
                    htmlFor="organizer"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    المنظم
                  </label>
                  <Input
                    id="organizer"
                    name="organizer"
                    type="text"
                    value={form.organizer}
                    onChange={handleChange}
                    placeholder="اسم المنظم"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                صورة الفعالية
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
                {loading ? 'جاري الإضافة...' : 'إضافة الفعالية'}
              </Button>
              <Link to="/dashboard/events">
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

export default NewEvent;
