import React, { useState, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button/ButtonSimple';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/InputSimple';
// استخدام نظام الإشعارات الموحد
import { useAlert } from '../components/common/AlertProvider';
import { useUnifiedLoading } from '../hooks/useUnifiedLoading';
import UnifiedAlert from '../components/common/UnifiedAlert';
import SEO from '../components/common/SEO';
import { countries } from '../utils/countries';
import { getApiUrl } from '../config/environment';
import {
  getAllCountries,
  interests,
  maritalStatus,
  specializations,
  occupations,
} from '../data/referenceData';

interface JoinUsFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // مطلوب
  age: number; // مطلوب
  motivation: string; // مطلوب
  // الحقول الجديدة
  countryOfResidence: string; // مطلوب
  nationality: string; // مطلوب
  specialization: string; // مطلوب
  interests: string[]; // مطلوب - حد أدنى واحد
  otherInterests?: string; // اختياري فقط عند اختيار "أخرى"
  occupation: string; // مطلوب
  maritalStatus: string; // مطلوب
}

const JoinUs: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showOtherInterests, setShowOtherInterests] = useState(false);
  const { formSuccess, formError } = useAlert();
  const { withButtonLoading } = useUnifiedLoading();

  // Local alert state for form notifications
  const [localAlert, setLocalAlert] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<JoinUsFormData>({
    defaultValues: {
      interests: [],
    },
  });
  const isRTL = i18n.dir() === 'rtl';

  // دوال مساعدة للاهتمامات
  const handleInterestToggle = (interestValue: string) => {
    const newInterests = selectedInterests.includes(interestValue)
      ? selectedInterests.filter((i) => i !== interestValue)
      : [...selectedInterests, interestValue];

    setSelectedInterests(newInterests);
    setValue('interests', newInterests);

    // إظهار/إخفاء حقل "أخرى"
    setShowOtherInterests(newInterests.includes('other'));
  };

  const onSubmit = async (data: JoinUsFormData) => {
    await withButtonLoading(async () => {
      try {
        console.log('🚀 إرسال بيانات الانضمام:', data);
        console.log('🌐 API URL:', `${getApiUrl()}/forms/join-requests`);

        // إرسال البيانات فعليًا إلى API
        const res = await fetch(`${getApiUrl()}/forms/join-requests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phone,
            country: data.countryOfResidence, // استخدام بلد الإقامة كالدولة الأساسية
            age: data.age,
            motivation: data.motivation,
            // الحقول الجديدة
            country_of_residence: data.countryOfResidence,
            nationality: data.nationality,
            specialization: data.specialization,
            interests: data.interests,
            other_interests: data.otherInterests,
            occupation: data.occupation,
            marital_status: data.maritalStatus,
          }),
        });

        console.log('📊 Response Status:', res.status);
        console.log('📊 Response OK:', res.ok);

        if (!res.ok) {
          const errorText = await res.text();
          console.error('❌ Error Response:', errorText);
          throw new Error(`فشل في إرسال الطلب: ${res.status}`);
        }

        const result = await res.json();
        console.log('✅ Success Response:', result);

        setLocalAlert({
          type: 'success',
          message: 'تم إرسال طلب العضوية بنجاح! سنتواصل معك قريباً.',
        });
        reset();
        setSelectedInterests([]);
        setShowOtherInterests(false);
      } catch (error) {
        console.error('❌ Join Form Error:', error);
        setLocalAlert({
          type: 'error',
          message: 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.',
        });
      }
    });
  };

  return (
    <div
      className="page-container bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-accent-200 rounded-full blur-2xl opacity-25" />
      </motion.div>

      <SEO
        title={t('joinUs.title')}
        description={t('joinUs.subtitle')}
        type="website"
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <section className="max-w-3xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-dark-500 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {t('joinUs.title', 'انضم إلى شبابنا')}
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg text-dark-400 max-w-2xl mx-auto leading-relaxed"
            >
              {t(
                'joinUs.subtitle',
                'كن جزءا من مجتمع شبابي إسلامي عالمي في اسطنبول.'
              )}
            </motion.p>
          </motion.div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6 md:p-8 border border-primary-200 shadow-brand-sm hover:shadow-brand-md transition-all duration-300 bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-6"
              >
                <h2 className="text-2xl font-bold text-dark-500 mb-2">
                  {t('joinUs.form.title', 'نموذج الانضمام')}
                </h2>
                <p className="text-dark-400 text-sm">
                  {t(
                    'joinUs.form.subtitle',
                    'املأ النموذج أدناه للانضمام إلى مجتمعنا'
                  )}
                </p>
              </motion.div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <Input
                    label={t('joinUs.form.firstName', 'الاسم الأول')}
                    type="text"
                    {...register('firstName', {
                      required: t(
                        'joinUs.form.firstNameRequired',
                        'الاسم الأول مطلوب'
                      ),
                      minLength: {
                        value: 2,
                        message: t(
                          'joinUs.form.firstNameMinLength',
                          'الاسم الأول يجب أن يكون على الأقل حرفين'
                        ),
                      },
                    })}
                    error={!!errors.firstName?.message}
                    fullWidth
                  />
                  <Input
                    label={t('joinUs.form.lastName', 'اسم العائلة')}
                    type="text"
                    {...register('lastName', {
                      required: t(
                        'joinUs.form.lastNameRequired',
                        'اسم العائلة مطلوب'
                      ),
                    })}
                    error={!!errors.lastName?.message}
                    fullWidth
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <Input
                    label={t('joinUs.form.email', 'البريد الإلكتروني')}
                    type="email"
                    {...register('email', {
                      required: t(
                        'joinUs.form.emailRequired',
                        'البريد الإلكتروني مطلوب'
                      ),
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: t(
                          'joinUs.form.emailInvalid',
                          'البريد الإلكتروني غير صالح'
                        ),
                      },
                    })}
                    error={!!errors.email?.message}
                    fullWidth
                  />
                  <Input
                    label={t('joinUs.form.phone', 'رقم الهاتف')}
                    type="tel"
                    {...register('phone', {
                      required: t(
                        'joinUs.form.phoneRequired',
                        'رقم الهاتف مطلوب'
                      ),
                      pattern: {
                        value:
                          /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                        message: t(
                          'joinUs.form.phoneInvalid',
                          'رقم الهاتف غير صالح'
                        ),
                      },
                    })}
                    error={!!errors.phone?.message}
                    fullWidth
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div>
                    <label className="block text-sm font-medium text-dark-500 mb-2">
                      {t('joinUs.form.age', 'العمر')}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      {...register('age', {
                        required: t('joinUs.form.ageRequired', 'العمر مطلوب'),
                        min: {
                          value: 1,
                          message: 'العمر يجب أن يكون أكبر من 0',
                        },
                        max: {
                          value: 100,
                          message: 'العمر يجب أن يكون أقل من 100',
                        },
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-dark-500 placeholder:text-dark-300 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                        errors.age ? 'border-error-500' : 'border-primary-300'
                      }`}
                      placeholder={t('joinUs.form.agePlaceholder', 'أدخل عمرك')}
                    />
                    {errors.age && (
                      <p className="text-error-500 text-sm mt-1">
                        {errors.age.message}
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* الحقول الجديدة - بلد الإقامة والجنسية */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-dark-500 mb-2">
                      {t('joinUs.form.countryOfResidence', 'بلد الإقامة')}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('countryOfResidence', {
                        required: t(
                          'joinUs.form.countryOfResidenceRequired',
                          'بلد الإقامة مطلوب'
                        ),
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-dark-500 placeholder:text-dark-300 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                        errors.countryOfResidence
                          ? 'border-error-500'
                          : 'border-primary-300'
                      }`}
                    >
                      <option value="">
                        {t(
                          'joinUs.form.selectCountryOfResidence',
                          'اختر بلد الإقامة'
                        )}
                      </option>
                      {getAllCountries().map((country) => (
                        <option key={country.value} value={country.label}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                    {errors.countryOfResidence && (
                      <p className="text-error-500 text-sm mt-1">
                        {errors.countryOfResidence.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-500 mb-2">
                      {t('joinUs.form.nationality', 'الجنسية')}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('nationality', {
                        required: t(
                          'joinUs.form.nationalityRequired',
                          'الجنسية مطلوبة'
                        ),
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-dark-500 placeholder:text-dark-300 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                        errors.nationality
                          ? 'border-error-500'
                          : 'border-primary-300'
                      }`}
                    >
                      <option value="">
                        {t('joinUs.form.selectNationality', 'اختر الجنسية')}
                      </option>
                      {getAllCountries().map((country) => (
                        <option key={country.value} value={country.label}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                    {errors.nationality && (
                      <p className="text-error-500 text-sm mt-1">
                        {errors.nationality.message}
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* التخصص والوظيفة */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-dark-500 mb-2">
                      {t(
                        'joinUs.form.specialization',
                        'التخصص/المجال الدراسي أو المهني'
                      )}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('specialization', {
                        required: t(
                          'joinUs.form.specializationRequired',
                          'التخصص مطلوب'
                        ),
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-dark-500 placeholder:text-dark-300 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                        errors.specialization
                          ? 'border-error-500'
                          : 'border-primary-300'
                      }`}
                    >
                      <option value="">
                        {t('joinUs.form.selectSpecialization', 'اختر التخصص')}
                      </option>
                      {specializations.map((spec) => (
                        <option key={spec.value} value={spec.label}>
                          {spec.label}
                        </option>
                      ))}
                    </select>
                    {errors.specialization && (
                      <p className="text-error-500 text-sm mt-1">
                        {errors.specialization.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-500 mb-2">
                      {t('joinUs.form.occupation', 'العمل/الوظيفة الحالية')}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('occupation', {
                        required: t(
                          'joinUs.form.occupationRequired',
                          'الوظيفة مطلوبة'
                        ),
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-dark-500 placeholder:text-dark-300 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                        errors.occupation
                          ? 'border-error-500'
                          : 'border-primary-300'
                      }`}
                    >
                      <option value="">
                        {t('joinUs.form.selectOccupation', 'اختر الوظيفة')}
                      </option>
                      {occupations.map((occ) => (
                        <option key={occ.value} value={occ.label}>
                          {occ.label}
                        </option>
                      ))}
                    </select>
                    {errors.occupation && (
                      <p className="text-error-500 text-sm mt-1">
                        {errors.occupation.message}
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* الحالة الاجتماعية */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <div>
                    <label className="block text-sm font-medium text-dark-500 mb-2">
                      {t('joinUs.form.maritalStatus', 'الحالة الاجتماعية')}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('maritalStatus', {
                        required: t(
                          'joinUs.form.maritalStatusRequired',
                          'الحالة الاجتماعية مطلوبة'
                        ),
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-dark-500 placeholder:text-dark-300 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                        errors.maritalStatus
                          ? 'border-error-500'
                          : 'border-primary-300'
                      }`}
                    >
                      <option value="">
                        {t(
                          'joinUs.form.selectMaritalStatus',
                          'اختر الحالة الاجتماعية'
                        )}
                      </option>
                      {maritalStatus.map((status) => (
                        <option key={status.value} value={status.label}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    {errors.maritalStatus && (
                      <p className="text-error-500 text-sm mt-1">
                        {errors.maritalStatus.message}
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* الاهتمامات */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <label className="block text-sm font-medium text-dark-500 mb-2">
                    {t('joinUs.form.interests', 'الاهتمامات')}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="text-gray-500 text-sm mb-3">
                    {t(
                      'joinUs.form.interestsHelp',
                      'اختر اهتماماتك (حد أدنى واحد، حد أقصى 5)'
                    )}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {interests.map((interest) => (
                      <label
                        key={interest.value}
                        className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedInterests.includes(interest.value)
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-300 hover:border-primary-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedInterests.includes(interest.value)}
                          onChange={() => handleInterestToggle(interest.value)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium">
                          {interest.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {selectedInterests.length === 0 && (
                    <p className="text-error-500 text-sm mt-2">
                      {t(
                        'joinUs.form.interestsRequired',
                        'يجب اختيار اهتمام واحد على الأقل'
                      )}
                    </p>
                  )}
                  {selectedInterests.length > 5 && (
                    <p className="text-error-500 text-sm mt-2">
                      {t(
                        'joinUs.form.interestsMax',
                        'يمكن اختيار 5 اهتمامات كحد أقصى'
                      )}
                    </p>
                  )}

                  {/* حقل "أخرى" */}
                  {showOtherInterests && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-dark-500 mb-2">
                        {t('joinUs.form.otherInterests', 'اهتمامات أخرى')}
                      </label>
                      <textarea
                        {...register('otherInterests')}
                        rows={3}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-dark-500 placeholder:text-dark-300 transition-all duration-200 resize-none bg-white/80 backdrop-blur-sm"
                        placeholder={t(
                          'joinUs.form.otherInterestsPlaceholder',
                          'اكتب اهتماماتك الأخرى هنا...'
                        )}
                      />
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <label className="block text-sm font-medium text-dark-500 mb-2">
                    {t('joinUs.form.motivation', 'لماذا ترغب بالانضمام؟')}
                  </label>
                  <textarea
                    rows={5}
                    {...register('motivation', {
                      required: t(
                        'joinUs.form.motivationRequired',
                        'يرجى كتابة سبب رغبتك في الانضمام'
                      ),
                      minLength: {
                        value: 20,
                        message: t(
                          'joinUs.form.motivationMinLength',
                          'السبب يجب أن يكون على الأقل 20 حرف'
                        ),
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-dark-500 placeholder:text-dark-300 transition-all duration-200 resize-none bg-white/80 backdrop-blur-sm ${
                      errors.motivation
                        ? 'border-error-500'
                        : 'border-primary-300'
                    }`}
                    placeholder={t(
                      'joinUs.form.motivationPlaceholder',
                      'لماذا ترغب في الانضمام إلى شبابنا؟'
                    )}
                  />
                  {errors.motivation && (
                    <p className="text-error-500 text-sm mt-1">
                      {errors.motivation.message}
                    </p>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold py-3 px-6 rounded-lg shadow-brand-sm hover:shadow-brand-md transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {t('joinUs.form.send', 'إرسال الطلب')}
                  </Button>

                  {/* Local Alert */}
                  {localAlert.type && (
                    <UnifiedAlert
                      type={localAlert.type}
                      message={localAlert.message}
                      position="button-bottom"
                      duration={5000}
                      onClose={() => setLocalAlert({ type: null, message: '' })}
                    />
                  )}
                </motion.div>
              </form>
            </Card>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default JoinUs;
