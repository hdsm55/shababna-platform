import React, { useState, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button/ButtonSimple';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/InputSimple';
import { Alert } from '../components/common/AlertSimple';
import SEO from '../components/common/SEO';
import { countries } from '../utils/countries';

interface JoinUsFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // مطلوب
  country: string;
  age: number; // مطلوب
  motivation: string; // مطلوب
}

const JoinUs: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );
  const [formMsg, setFormMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JoinUsFormData>();
  const isRTL = i18n.dir() === 'rtl';

  const onSubmit = async (data: JoinUsFormData) => {
    setFormStatus('idle');
    setFormMsg('');
    setShowAlert(false);
    try {
      // إرسال البيانات فعليًا إلى API
      const res = await fetch('/api/forms/join-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          country: data.country,
          age: data.age,
          motivation: data.motivation,
        }),
      });
      if (!res.ok) throw new Error('فشل في إرسال الطلب');
      setFormStatus('success');
      setFormMsg(
        t(
          'joinUs.form.success',
          'تم إرسال طلب الانضمام بنجاح! سنراجع طلبك ونتواصل معك قريبًا.'
        )
      );
      reset();
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    } catch (error) {
      setFormStatus('error');
      setFormMsg(
        t(
          'joinUs.form.error',
          'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.'
        )
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    }
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
                    error={errors.firstName?.message}
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
                    error={errors.lastName?.message}
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
                    error={errors.email?.message}
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
                    error={errors.phone?.message}
                    fullWidth
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-dark-500 mb-2">
                      {t('joinUs.form.country', 'الدولة')}
                    </label>
                    <select
                      {...register('country', {
                        required: t(
                          'joinUs.form.countryRequired',
                          'الدولة مطلوبة'
                        ),
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-dark-500 placeholder:text-dark-300 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                        errors.country
                          ? 'border-error-500'
                          : 'border-primary-300'
                      }`}
                    >
                      <option value="">
                        {t('joinUs.form.selectCountry', 'اختر الدولة')}
                      </option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.ar}>
                          {country.ar}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <p className="text-error-500 text-sm mt-1">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                  <Input
                    label={t('joinUs.form.age', 'العمر')}
                    type="number"
                    {...register('age', {
                      required: t('joinUs.form.ageRequired', 'العمر مطلوب'),
                      min: { value: 1, message: 'العمر يجب أن يكون أكبر من 0' },
                      max: {
                        value: 100,
                        message: 'العمر يجب أن يكون أقل من 100',
                      },
                    })}
                    error={errors.age?.message}
                    fullWidth
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
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
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    loading={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold py-3 px-6 rounded-lg shadow-brand-sm hover:shadow-brand-md transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t('joinUs.form.sending', 'جاري الإرسال...')
                      : t('joinUs.form.send', 'إرسال الطلب')}
                  </Button>
                </motion.div>

                {showAlert && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert
                      type={formStatus === 'success' ? 'success' : 'error'}
                      className="mt-4"
                      onClose={() => setShowAlert(false)}
                    >
                      {formMsg}
                    </Alert>
                  </motion.div>
                )}
              </form>
            </Card>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default JoinUs;
