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
  phone: string;
  country: string;
  age: number;
  motivation: string;
}

// تحسين الأداء - مكونات منفصلة
const JoinUsHeader = memo(() => {
  const { t } = useTranslation();

  return (
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
        <h1 className="section-title mb-4 text-dark-500 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          {t('joinUs.title', 'انضم إلينا')}
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="body-text text-dark-400 max-w-2xl mx-auto leading-relaxed"
      >
        {t(
          'joinUs.subtitle',
          'انضم إلى مجتمع شبابنا وكن جزءاً من التغيير الإيجابي في العالم'
        )}
      </motion.p>
    </motion.div>
  );
});

const JoinUsForm = memo(() => {
  const { t, i18n } = useTranslation();
  const [formStatus, setFormStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [formMsg, setFormMsg] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JoinUsFormData>();
  const isRTL = i18n.dir() === 'rtl';

  const onSubmit = useCallback(
    async (data: JoinUsFormData) => {
      if (formStatus === 'submitting') return;

      setFormStatus('submitting');
      setFormMsg('');
      setShowAlert(false);

      try {
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
            'تم إرسال طلب الانضمام بنجاح! سنتواصل معك قريباً.'
          )
        );
        reset();
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setFormStatus('idle');
        }, 5000);
      } catch (error: any) {
        setFormStatus('error');
        setFormMsg(
          error?.message ||
            t(
              'joinUs.form.error',
              'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.'
            )
        );
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setFormStatus('idle');
        }, 5000);
      }
    },
    [formStatus, t, reset]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="max-w-2xl mx-auto"
    >
      <Card className="p-8 bg-white shadow-brand-lg border border-neutral-200">
        <div className="text-center mb-8">
          <h2 className="card-title text-dark-500 mb-2">
            {t('joinUs.form.title', 'نموذج الانضمام')}
          </h2>
          <p className="body-text text-dark-400">
            {t(
              'joinUs.form.subtitle',
              'املأ النموذج أدناه للانضمام إلى مجتمعنا'
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                {...register('firstName', {
                  required: t(
                    'joinUs.form.firstName.required',
                    'الاسم الأول مطلوب'
                  ),
                })}
                placeholder={t(
                  'joinUs.form.firstName.placeholder',
                  'الاسم الأول'
                )}
                error={errors.firstName?.message}
                className="w-full"
              />
            </div>
            <div>
              <Input
                {...register('lastName', {
                  required: t(
                    'joinUs.form.lastName.required',
                    'الاسم الأخير مطلوب'
                  ),
                })}
                placeholder={t(
                  'joinUs.form.lastName.placeholder',
                  'الاسم الأخير'
                )}
                error={errors.lastName?.message}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                {...register('email', {
                  required: t(
                    'joinUs.form.email.required',
                    'البريد الإلكتروني مطلوب'
                  ),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t(
                      'joinUs.form.email.invalid',
                      'بريد إلكتروني غير صحيح'
                    ),
                  },
                })}
                type="email"
                placeholder={t(
                  'joinUs.form.email.placeholder',
                  'البريد الإلكتروني'
                )}
                error={errors.email?.message}
                className="w-full"
              />
            </div>
            <div>
              <Input
                {...register('phone', {
                  required: t('joinUs.form.phone.required', 'رقم الهاتف مطلوب'),
                })}
                placeholder={t('joinUs.form.phone.placeholder', 'رقم الهاتف')}
                error={errors.phone?.message}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <select
                {...register('country', {
                  required: t('joinUs.form.country.required', 'الدولة مطلوبة'),
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                  errors.country
                    ? 'border-red-500 bg-red-50'
                    : 'border-neutral-300 hover:border-neutral-400'
                }`}
              >
                <option value="">
                  {t('joinUs.form.country.placeholder', 'اختر الدولة')}
                </option>
                {countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
            <div>
              <Input
                {...register('age', {
                  required: t('joinUs.form.age.required', 'العمر مطلوب'),
                  min: {
                    value: 16,
                    message: t(
                      'joinUs.form.age.min',
                      'يجب أن يكون العمر 16 سنة على الأقل'
                    ),
                  },
                  max: {
                    value: 35,
                    message: t(
                      'joinUs.form.age.max',
                      'يجب أن يكون العمر 35 سنة كحد أقصى'
                    ),
                  },
                })}
                type="number"
                placeholder={t('joinUs.form.age.placeholder', 'العمر')}
                error={errors.age?.message}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <textarea
              {...register('motivation', {
                required: t('joinUs.form.motivation.required', 'الدافع مطلوب'),
                minLength: {
                  value: 20,
                  message: t(
                    'joinUs.form.motivation.minLength',
                    'الدافع يجب أن يكون 20 حرف على الأقل'
                  ),
                },
              })}
              placeholder={t(
                'joinUs.form.motivation.placeholder',
                'لماذا تريد الانضمام إلى مجتمعنا؟'
              )}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                errors.motivation
                  ? 'border-red-500 bg-red-50'
                  : 'border-neutral-300 hover:border-neutral-400'
              }`}
            />
            {errors.motivation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.motivation.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={formStatus === 'submitting'}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 text-lg font-semibold shadow-brand-md hover:shadow-brand-lg transform hover:scale-105 transition-all duration-300"
          >
            {formStatus === 'submitting' ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t('joinUs.form.submitting', 'جاري الإرسال...')}
              </span>
            ) : (
              t('joinUs.form.submit', 'إرسال طلب الانضمام')
            )}
          </Button>
        </form>

        {showAlert && (
          <Alert
            type={formStatus === 'success' ? 'success' : 'error'}
            message={formMsg}
            onClose={() => setShowAlert(false)}
            className="mt-6"
          />
        )}
      </Card>
    </motion.div>
  );
});

const JoinUsBenefits = memo(() => {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: '🤝',
      title: t('joinUs.benefits.community', 'مجتمع داعم'),
      description: t(
        'joinUs.benefits.communityDesc',
        'انضم إلى مجتمع من الشباب المتحمسين للتغيير'
      ),
    },
    {
      icon: '🌟',
      title: t('joinUs.benefits.opportunities', 'فرص التطوير'),
      description: t(
        'joinUs.benefits.opportunitiesDesc',
        'احصل على فرص تدريبية وتطويرية مميزة'
      ),
    },
    {
      icon: '🌍',
      title: t('joinUs.benefits.impact', 'تأثير عالمي'),
      description: t(
        'joinUs.benefits.impactDesc',
        'ساهم في إحداث تغيير إيجابي في العالم'
      ),
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-12"
    >
      <h2 className="text-2xl font-bold text-dark-500 mb-8 text-center">
        {t('joinUs.benefits.title', 'مزايا الانضمام')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group"
          >
            <div className="bg-white border border-primary-200 rounded-lg p-6 text-center hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">{benefit.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-dark-500 mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-dark-400">{benefit.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
});

const JoinUs: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
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
        title={t('joinUs.pageTitle', 'انضم إلينا - منصة شبابنا')}
        description={t(
          'joinUs.pageDescription',
          'انضم إلى مجتمع شبابنا وكن جزءاً من التغيير الإيجابي في العالم'
        )}
        type="website"
        keywords={['انضم إلينا', 'عضوية', 'منصة شبابنا', 'مجتمع']}
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <section className="max-w-4xl mx-auto">
          <JoinUsHeader />
          <JoinUsForm />
          <JoinUsBenefits />
        </section>
      </div>
    </div>
  );
};

export default JoinUs;
