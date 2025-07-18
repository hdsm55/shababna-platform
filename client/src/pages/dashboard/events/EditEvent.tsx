import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchEventById, updateEvent } from '../../../services/eventsApi';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Alert from '../../../components/common/Alert';

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    start_date: '',
    end_date: '',
    max_attendees: '1',
    status: 'upcoming',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // جلب بيانات الفعالية عند التحميل
  useEffect(() => {
    if (!id) {
      setError('رقم الفعالية غير محدد.');
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchEventById(id)
      .then((event) => {
        setForm({
          title: event.title || '',
          description: event.description || '',
          category: event.category || '',
          location: event.location || '',
          start_date: event.start_date || '',
          end_date: event.end_date || '',
          max_attendees: event.max_attendees?.toString() || '1',
          status: event.status || 'upcoming',
        });
        setError(null);
      })
      .catch(() => {
        setError('تعذر جلب بيانات الفعالية. تحقق من الاتصال أو رقم الفعالية.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // التحقق من الحقول قبل الإرسال
  const validateForm = () => {
    let errors: { [key: string]: string } = {};
    if (!form.title) errors.title = 'اسم الفعالية مطلوب.';
    if (!form.description) errors.description = 'الوصف مطلوب.';
    if (!form.category) errors.category = 'الفئة مطلوبة.';
    if (!form.location) errors.location = 'الموقع مطلوب.';
    if (!form.start_date) errors.start_date = 'تاريخ البداية مطلوب.';
    if (!form.end_date) errors.end_date = 'تاريخ الانتهاء مطلوب.';
    if (form.description && form.description.length < 10)
      errors.description = 'الوصف يجب أن يكون 10 أحرف على الأقل.';
    if (
      form.start_date &&
      form.end_date &&
      new Date(form.end_date) < new Date(form.start_date)
    )
      errors.end_date = 'تاريخ النهاية يجب أن يكون بعد البداية.';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setFieldErrors({});
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('يرجى تصحيح الأخطاء في الحقول أدناه.');
      return;
    }
    setLoading(true);
    try {
      await updateEvent(Number(id), {
        ...form,
        max_attendees: Number(form.max_attendees),
        status: form.status as
          | 'upcoming'
          | 'active'
          | 'completed'
          | 'cancelled',
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/events');
      }, 1500);
    } catch (err: any) {
      setError('حدث خطأ أثناء حفظ التعديلات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        تعديل فعالية
      </h1>
      {loading && (
        <div className="text-center py-8 text-lg text-gray-500">
          جاري تحميل البيانات...
        </div>
      )}
      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}
      {success && (
        <Alert type="success" className="mb-4">
          تم حفظ التعديلات بنجاح! سيتم تحويلك لقائمة الفعاليات...
        </Alert>
      )}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white rounded-xl shadow-sm border p-6"
      >
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
            error={fieldErrors.title}
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
            className={`w-full border ${
              fieldErrors.description ? 'border-red-500' : 'border-gray-300'
            } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="أدخل وصف مفصل للفعالية"
          />
          {fieldErrors.description && (
            <div className="mt-1 text-xs text-red-600 rtl:text-right">
              {fieldErrors.description}
            </div>
          )}
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
              className={`w-full border ${
                fieldErrors.category ? 'border-red-500' : 'border-gray-300'
              } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500`}
            >
              <option value="">اختر الفئة</option>
              <option value="conference">مؤتمر</option>
              <option value="workshop">ورشة عمل</option>
              <option value="networking">شبكة</option>
            </select>
            {fieldErrors.category && (
              <div className="mt-1 text-xs text-red-600 rtl:text-right">
                {fieldErrors.category}
              </div>
            )}
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
              error={fieldErrors.location}
            />
            {fieldErrors.location && (
              <div className="mt-1 text-xs text-red-600 rtl:text-right">
                {fieldErrors.location}
              </div>
            )}
          </div>
        </div>
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
              error={fieldErrors.start_date}
            />
            {fieldErrors.start_date && (
              <div className="mt-1 text-xs text-red-600 rtl:text-right">
                {fieldErrors.start_date}
              </div>
            )}
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
              error={fieldErrors.end_date}
            />
            {fieldErrors.end_date && (
              <div className="mt-1 text-xs text-red-600 rtl:text-right">
                {fieldErrors.end_date}
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="max_attendees"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              السعة *
            </label>
            <Input
              id="max_attendees"
              name="max_attendees"
              type="number"
              value={form.max_attendees}
              onChange={handleChange}
              min="1"
              required
              error={fieldErrors.max_attendees}
            />
            {fieldErrors.max_attendees && (
              <div className="mt-1 text-xs text-red-600 rtl:text-right">
                {fieldErrors.max_attendees}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              الحالة *
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="upcoming">قادم</option>
              <option value="active">نشط</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4 pt-6 border-t">
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => window.history.back()}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
