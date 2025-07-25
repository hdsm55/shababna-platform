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
import { fetchProgramById, updateProgram } from '../../../services/programsApi';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Calendar,
  Target,
  DollarSign,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

const EditProgram: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isRTL = i18n.dir() === 'rtl';

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    goal_amount: '',
    start_date: '',
    end_date: '',
    status: 'active',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // جلب بيانات البرنامج
  const {
    data: programData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['program', id],
    queryFn: () => fetchProgramById(id!),
    enabled: !!id,
  });

  const program = programData?.data || programData;

  // تحديث البرنامج
  const updateProgramMutation = useMutation({
    mutationFn: (data: any) => updateProgram(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['program', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-programs'] });
      navigate(`/dashboard/programs/${id}`);
    },
  });

  // تعبئة النموذج عند تحميل البيانات
  useEffect(() => {
    if (program) {
      setForm({
        title: program.title || '',
        description: program.description || '',
        category: program.category || '',
        goal_amount: program.goal_amount?.toString() || '',
        start_date: program.start_date
          ? new Date(program.start_date).toISOString().split('T')[0]
          : '',
        end_date: program.end_date
          ? new Date(program.end_date).toISOString().split('T')[0]
          : '',
        status: program.status || 'active',
      });
      if (program.image_url) {
        setImagePreview(program.image_url);
      }
    }
  }, [program]);

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
        'editProgram.errors.titleRequired',
        'عنوان البرنامج مطلوب'
      );
    }

    if (!form.description.trim()) {
      newErrors.description = t(
        'editProgram.errors.descriptionRequired',
        'وصف البرنامج مطلوب'
      );
    }

    if (!form.category.trim()) {
      newErrors.category = t(
        'editProgram.errors.categoryRequired',
        'فئة البرنامج مطلوبة'
      );
    }

    if (!form.goal_amount || parseFloat(form.goal_amount) <= 0) {
      newErrors.goal_amount = t(
        'editProgram.errors.goalAmountRequired',
        'المبلغ المستهدف مطلوب ويجب أن يكون أكبر من صفر'
      );
    }

    if (!form.start_date) {
      newErrors.start_date = t(
        'editProgram.errors.startDateRequired',
        'تاريخ البداية مطلوب'
      );
    }

    if (!form.end_date) {
      newErrors.end_date = t(
        'editProgram.errors.endDateRequired',
        'تاريخ النهاية مطلوب'
      );
    }

    if (
      form.start_date &&
      form.end_date &&
      new Date(form.start_date) >= new Date(form.end_date)
    ) {
      newErrors.end_date = t(
        'editProgram.errors.endDateAfterStart',
        'تاريخ النهاية يجب أن يكون بعد تاريخ البداية'
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
    formData.append('category', form.category);
    formData.append('goal_amount', form.goal_amount);
    formData.append('start_date', form.start_date);
    formData.append('end_date', form.end_date);
    formData.append('status', form.status);

    if (image) {
      formData.append('image', image);
    }

    updateProgramMutation.mutate(formData);
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

  if (error || !program) {
    return (
      <DashboardLayout>
        <Alert
          type="error"
          title={t('editProgram.error.title', 'خطأ في تحميل البرنامج')}
        >
          {t('editProgram.error.message', 'حدث خطأ أثناء جلب بيانات البرنامج.')}
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SEO
        title={t('editProgram.seo.title', 'تعديل البرنامج')}
        description={t('editProgram.seo.description', 'تعديل بيانات البرنامج')}
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
                <Link to={`/dashboard/programs/${id}`}>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>
                      {t('editProgram.backToProgram', 'العودة إلى البرنامج')}
                    </span>
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {t('editProgram.title', 'تعديل البرنامج')}
                  </h1>
                  <p className="text-gray-600">
                    {t('editProgram.subtitle', 'تحديث بيانات البرنامج')}
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
          >
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* معلومات أساسية */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {t('editProgram.basicInfo', 'المعلومات الأساسية')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('editProgram.form.title', 'عنوان البرنامج')} *
                      </label>
                      <Input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder={t(
                          'editProgram.form.titlePlaceholder',
                          'أدخل عنوان البرنامج'
                        )}
                        error={errors.title}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('editProgram.form.category', 'فئة البرنامج')} *
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
                          {t('editProgram.form.selectCategory', 'اختر الفئة')}
                        </option>
                        <option value="صحية">
                          {t('editProgram.categories.health', 'صحية')}
                        </option>
                        <option value="تعليمية">
                          {t('editProgram.categories.educational', 'تعليمية')}
                        </option>
                        <option value="اجتماعية">
                          {t('editProgram.categories.social', 'اجتماعية')}
                        </option>
                        <option value="رياضية">
                          {t('editProgram.categories.sports', 'رياضية')}
                        </option>
                        <option value="ثقافية">
                          {t('editProgram.categories.cultural', 'ثقافية')}
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
                    {t('editProgram.form.description', 'وصف البرنامج')} *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder={t(
                      'editProgram.form.descriptionPlaceholder',
                      'أدخل وصف البرنامج'
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

                {/* المبلغ المستهدف والتواريخ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('editProgram.form.goalAmount', 'المبلغ المستهدف')} *
                    </label>
                    <div className="relative">
                      <Input
                        name="goal_amount"
                        type="number"
                        value={form.goal_amount}
                        onChange={handleChange}
                        placeholder="0"
                        error={errors.goal_amount}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('editProgram.form.startDate', 'تاريخ البداية')} *
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
                      {t('editProgram.form.endDate', 'تاريخ النهاية')} *
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

                {/* الحالة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('editProgram.form.status', 'حالة البرنامج')}
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="active">
                      {t('editProgram.status.active', 'نشط')}
                    </option>
                    <option value="pending">
                      {t('editProgram.status.pending', 'قيد الانتظار')}
                    </option>
                    <option value="completed">
                      {t('editProgram.status.completed', 'مكتمل')}
                    </option>
                    <option value="cancelled">
                      {t('editProgram.status.cancelled', 'ملغي')}
                    </option>
                  </select>
                </div>

                {/* الصورة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('editProgram.form.image', 'صورة البرنامج')}
                  </label>
                  <div className="space-y-4">
                    {imagePreview && (
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt={t(
                            'editProgram.form.imagePreview',
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
                          {t('editProgram.form.uploadImage', 'رفع صورة')}
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
                            {t(
                              'editProgram.form.noImage',
                              'لم يتم اختيار صورة'
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <Link to={`/dashboard/programs/${id}`}>
                    <Button variant="outline">
                      {t('editProgram.actions.cancel', 'إلغاء')}
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={updateProgramMutation.isPending}
                    className="flex items-center space-x-2"
                  >
                    {updateProgramMutation.isPending ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>
                      {t('editProgram.actions.save', 'حفظ التغييرات')}
                    </span>
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditProgram;
