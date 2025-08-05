import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/Button/Button';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import Alert from '../components/common/Alert';
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
    <div className="bg-neutral-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={t('joinUs.title')}
        description={t('joinUs.subtitle')}
        type="website"
      />
      <section className="py-16 bg-gradient-to-br from-primary-50 via-white to-accent-50 text-center mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-primary-700">
            {t('joinUs.title')}
          </h1>
          <p className="text-lg md:text-2xl text-neutral-700 mb-8">
            {t('joinUs.subtitle')}
          </p>
        </div>
      </section>
      <section className="container mx-auto px-4 max-w-3xl">
        <Card variant="default" size="lg" className="mb-8">
          <h2 className="text-2xl font-bold text-primary-700 mb-6 text-center">
            {t('joinUs.form.title', 'نموذج الانضمام')}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t('joinUs.form.firstName')}
                type="text"
                {...register('firstName', {
                  required: t(
                    'joinUs.form.firstNameRequired',
                    'الاسم الأول مطلوب'
                  ),
                })}
                error={errors.firstName?.message}
                fullWidth
              />
              <Input
                label={t('joinUs.form.lastName')}
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t('joinUs.form.email')}
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
                label={t('joinUs.form.phone')}
                type="tel"
                {...register('phone', {
                  required: t('joinUs.form.phoneRequired', 'رقم الهاتف مطلوب'),
                })}
                error={errors.phone?.message}
                fullWidth
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  {t('joinUs.form.country')}
                </label>
                <select
                  {...register('country', {
                    required: t('joinUs.form.countryRequired', 'الدولة مطلوبة'),
                  })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-900 placeholder:text-neutral-400"
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
                  <p className="text-red-600 text-sm mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>
              <Input
                label={t('joinUs.form.age')}
                type="number"
                {...register('age', {
                  required: t('joinUs.form.ageRequired', 'العمر مطلوب'),
                  min: { value: 1, message: 'العمر يجب أن يكون أكبر من 0' },
                })}
                error={errors.age?.message}
                fullWidth
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {t('joinUs.form.motivation')}
              </label>
              <textarea
                rows={4}
                {...register('motivation', {
                  required: t(
                    'joinUs.form.motivationRequired',
                    'يرجى كتابة سبب رغبتك في الانضمام'
                  ),
                })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-900 placeholder:text-neutral-400"
                placeholder={t(
                  'joinUs.form.motivationPlaceholder',
                  'لماذا ترغب في الانضمام إلى شبابنا؟'
                )}
              />
              {errors.motivation && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.motivation.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              loading={isSubmitting}
              className="w-full"
              disabled={isSubmitting}
            >
              {t('joinUs.form.send')}
            </Button>
            {showAlert && (
              <Alert
                type={formStatus === 'success' ? 'success' : 'error'}
                className="mt-4"
                onClose={() => setShowAlert(false)}
              >
                {formMsg}
              </Alert>
            )}
          </form>
        </Card>
      </section>
    </div>
  );
};

export default JoinUs;
