import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { Card } from '../../../components/ui/Card/Card';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Alert from '../../../components/common/Alert';
import SEO from '../../../components/common/SEO';
import { fetchEventById, updateEvent } from '../../../services/eventsApi';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Calendar,
  MapPin,
  Users,
  FileText,
  Image as ImageIcon,
  AlertTriangle,
} from 'lucide-react';

const EditEvent: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isRTL = i18n.dir() === 'rtl';

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    start_date: '',
    end_date: '',
    max_attendees: '',
    status: 'upcoming',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // جلب بيانات الفعالية
  const {
    data: eventData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventById(id!),
    enabled: !!id,
  });

  const event = eventData?.data || eventData;

  // تحديث الفعالية
  const updateEventMutation = useMutation({
    mutationFn: (data: any) => updateEvent(parseInt(id!), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-events'] });
      navigate(`/dashboard/events/${id}`);
    },
    onError: (error: any) => {
      console.error('Update event error:', error);
      // يمكن إضافة toast notification هنا
    },
  });

  // تعبئة النموذج عند تحميل البيانات
  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || '',
        description: event.description || '',
        location: event.location || '',
        category: event.category || '',
        start_date: event.start_date
          ? new Date(event.start_date).toISOString().split('T')[0]
          : '',
        end_date: event.end_date
          ? new Date(event.end_date).toISOString().split('T')[0]
          : '',
        max_attendees: event.max_attendees?.toString() || '',
        status: event.status || 'upcoming',
      });
      if (event.image_url) {
        setImagePreview(event.image_url);
      }
    }
  }, [event]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // إزالة الخطأ عند التعديل
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) {
      newErrors.title = t(
        'editEvent.errors.titleRequired',
        'عنوان الفعالية مطلوب'
      );
    }

    if (!form.description.trim()) {
      newErrors.description = t(
        'editEvent.errors.descriptionRequired',
        'وصف الفعالية مطلوب'
      );
    }

    if (!form.location.trim()) {
      newErrors.location = t(
        'editEvent.errors.locationRequired',
        'موقع الفعالية مطلوب'
      );
    }

    if (!form.category.trim()) {
      newErrors.category = t(
        'editEvent.errors.categoryRequired',
        'فئة الفعالية مطلوبة'
      );
    }

    if (!form.start_date) {
      newErrors.start_date = t(
        'editEvent.errors.startDateRequired',
        'تاريخ البداية مطلوب'
      );
    }

    if (!form.end_date) {
      newErrors.end_date = t(
        'editEvent.errors.endDateRequired',
        'تاريخ النهاية مطلوب'
      );
    }

    if (
      form.start_date &&
      form.end_date &&
      new Date(form.start_date) >= new Date(form.end_date)
    ) {
      newErrors.end_date = t(
        'editEvent.errors.endDateAfterStart',
        'تاريخ النهاية يجب أن يكون بعد تاريخ البداية'
      );
    }

    if (form.max_attendees && parseInt(form.max_attendees) <= 0) {
      newErrors.max_attendees = t(
        'editEvent.errors.maxAttendeesPositive',
        'العدد الأقصى للمشاركين يجب أن يكون أكبر من صفر'
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('location', form.location);
    formData.append('category', form.category);
    formData.append('start_date', form.start_date);
    formData.append('end_date', form.end_date);
    formData.append('max_attendees', form.max_attendees);
    formData.append('status', form.status);

    if (image) {
      formData.append('image', image);
    }

    updateEventMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !event) {
    return (
      <DashboardLayout>
        <Alert
          type="error"
          title={t('editEvent.error.title', 'خطأ في تحميل الفعالية')}
        >
          {t('editEvent.error.message', 'حدث خطأ أثناء جلب بيانات الفعالية.')}
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SEO
        title={t('editEvent.seo.title', 'تعديل الفعالية')}
        description={t('editEvent.seo.description', 'تعديل بيانات الفعالية')}
        type="website"
      />

      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-sm border-b border-gray-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to={`/dashboard/events/${id}`}>
                  <Button variant="outline" className="flex items-center gap-2">
                    {t('eventEdit.backToEvents', 'العودة إلى الفعاليات')}
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {t('editEvent.title', 'تعديل الفعالية')}
                  </h1>
                  <p className="text-gray-600">
                    {t('editEvent.subtitle', 'تحديث بيانات الفعالية')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-h-[80vh] overflow-y-auto"
          >
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* معلومات أساسية */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {t('editEvent.basicInfo', 'المعلومات الأساسية')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('editEvent.form.title', 'عنوان الفعالية')} *
                      </label>
                      <Input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder={t(
                          'editEvent.form.titlePlaceholder',
                          'أدخل عنوان الفعالية'
                        )}
                        error={errors.title}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('editEvent.form.category', 'فئة الفعالية')} *
                      </label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                          errors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">
                          {t('editEvent.form.selectCategory', 'اختر الفئة')}
                        </option>
                        <option value="ورش عمل">
                          {t('editEvent.categories.workshops', 'ورش عمل')}
                        </option>
                        <option value="محاضرات">
                          {t('editEvent.categories.lectures', 'محاضرات')}
                        </option>
                        <option value="فعاليات اجتماعية">
                          {t('editEvent.categories.social', 'فعاليات اجتماعية')}
                        </option>
                        <option value="فعاليات رياضية">
                          {t('editEvent.categories.sports', 'فعاليات رياضية')}
                        </option>
                        <option value="فعاليات ثقافية">
                          {t('editEvent.categories.cultural', 'فعاليات ثقافية')}
                        </option>
                        <option value="فعاليات تعليمية">
                          {t(
                            'editEvent.categories.educational',
                            'فعاليات تعليمية'
                          )}
                        </option>
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.category}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* الوصف */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('editEvent.form.description', 'وصف الفعالية')} *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder={t(
                      'editEvent.form.descriptionPlaceholder',
                      'أدخل وصف الفعالية'
                    )}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* الموقع والتواريخ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('editEvent.form.location', 'موقع الفعالية')} *
                    </label>
                    <Input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder={t(
                        'editEvent.form.locationPlaceholder',
                        'أدخل موقع الفعالية'
                      )}
                      error={errors.location}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('editEvent.form.startDate', 'تاريخ البداية')} *
                    </label>
                    <Input
                      name="start_date"
                      type="date"
                      value={form.start_date}
                      onChange={handleChange}
                      error={errors.start_date}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('editEvent.form.endDate', 'تاريخ النهاية')} *
                    </label>
                    <Input
                      name="end_date"
                      type="date"
                      value={form.end_date}
                      onChange={handleChange}
                      error={errors.end_date}
                    />
                  </div>
                </div>

                {/* السعة والحالة */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t(
                        'editEvent.form.maxAttendees',
                        'العدد الأقصى للمشاركين'
                      )}
                    </label>
                    <Input
                      name="max_attendees"
                      type="number"
                      value={form.max_attendees}
                      onChange={handleChange}
                      placeholder="0"
                      error={errors.max_attendees}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('editEvent.form.status', 'حالة الفعالية')}
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="upcoming">
                        {t('editEvent.status.upcoming', 'قادمة')}
                      </option>
                      <option value="active">
                        {t('editEvent.status.active', 'نشطة')}
                      </option>
                      <option value="completed">
                        {t('editEvent.status.completed', 'مكتملة')}
                      </option>
                      <option value="cancelled">
                        {t('editEvent.status.cancelled', 'ملغية')}
                      </option>
                    </select>
                  </div>
                </div>

                {/* الصورة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('editEvent.form.image', 'صورة الفعالية')}
                  </label>
                  <div className="space-y-4">
                    {imagePreview && (
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt={t(
                            'editEvent.form.imagePreview',
                            'معاينة الصورة'
                          )}
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="flex items-center space-x-4">
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300 flex items-center space-x-2">
                        <Upload className="w-4 h-4" />
                        <span>
                          {t('editEvent.form.uploadImage', 'رفع صورة')}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      {!imagePreview && (
                        <div className="flex items-center space-x-2 text-gray-500">
                          <ImageIcon className="w-4 h-4" />
                          <span className="text-sm">
                            {t('editEvent.form.noImage', 'لم يتم اختيار صورة')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <Link to={`/dashboard/events/${id}`}>
                    <Button variant="outline">
                      {t('editEvent.actions.cancel', 'إلغاء')}
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={updateEventMutation.isPending}
                    className="flex items-center space-x-2"
                  >
                    {updateEventMutation.isPending ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>
                      {updateEventMutation.isPending
                        ? t('editEvent.actions.saving', 'جاري الحفظ...')
                        : t('editEvent.actions.save', 'حفظ التغييرات')}
                    </span>
                  </Button>
                </div>

                {/* رسالة الخطأ */}
                {updateEventMutation.isError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {t(
                          'editEvent.error.save',
                          'حدث خطأ أثناء حفظ البيانات'
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditEvent;
