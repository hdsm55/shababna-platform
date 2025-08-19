import React, { useState, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button/ButtonSimple';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/InputSimple';
import { Alert } from '../components/common/AlertSimple';
import SEO from '../components/common/SEO';
import { submitContactForm, ContactFormData } from '../services/formsApi';

// تحسين الأداء - مكونات منفصلة
const ContactHeader = memo(() => {
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
          {t('contact.title', 'تواصل معنا')}
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="body-text text-dark-400 max-w-2xl mx-auto leading-relaxed"
      >
        {t(
          'contact.description',
          'نحن هنا للإجابة على استفساراتك ومساعدتك في كل ما تحتاج.'
        )}
      </motion.p>
    </motion.div>
  );
});

const ContactForm = memo(() => {
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
  } = useForm<ContactFormData>();
  const isRTL = i18n.dir() === 'rtl';

  const onSubmit = useCallback(
    async (data: ContactFormData) => {
      if (formStatus === 'submitting') return;

      setFormStatus('submitting');
      setFormMsg('');
      setShowAlert(false);

      try {
        const response = await submitContactForm(data);
        setFormStatus('success');
        setFormMsg(
          response.message ||
            t(
              'contact.form.success',
              'تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت ممكن.'
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
          error?.response?.data?.message ||
            t(
              'contact.form.error',
              'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.'
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
            {t('contact.form.title', 'أرسل لنا رسالة')}
          </h2>
          <p className="body-text text-dark-400">
            {t('contact.form.subtitle', 'سنرد عليك في أقرب وقت ممكن')}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                {...register('firstName', {
                  required: t(
                    'contact.form.firstName.required',
                    'الاسم الأول مطلوب'
                  ),
                })}
                placeholder={t(
                  'contact.form.firstName.placeholder',
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
                    'contact.form.lastName.required',
                    'الاسم الأخير مطلوب'
                  ),
                })}
                placeholder={t(
                  'contact.form.lastName.placeholder',
                  'الاسم الأخير'
                )}
                error={errors.lastName?.message}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <Input
              {...register('email', {
                required: t(
                  'contact.form.email.required',
                  'البريد الإلكتروني مطلوب'
                ),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t(
                    'contact.form.email.invalid',
                    'بريد إلكتروني غير صحيح'
                  ),
                },
              })}
              type="email"
              placeholder={t(
                'contact.form.email.placeholder',
                'البريد الإلكتروني'
              )}
              error={errors.email?.message}
              className="w-full"
            />
          </div>

          <div>
            <Input
              {...register('phone', {
                required: t('contact.form.phone.required', 'رقم الهاتف مطلوب'),
              })}
              placeholder={t('contact.form.phone.placeholder', 'رقم الهاتف')}
              error={errors.phone?.message}
              className="w-full"
            />
          </div>

          <div>
            <textarea
              {...register('message', {
                required: t('contact.form.message.required', 'الرسالة مطلوبة'),
                minLength: {
                  value: 10,
                  message: t(
                    'contact.form.message.minLength',
                    'الرسالة يجب أن تكون 10 أحرف على الأقل'
                  ),
                },
              })}
              placeholder={t('contact.form.message.placeholder', 'رسالتك...')}
              rows={5}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                errors.message
                  ? 'border-red-500 bg-red-50'
                  : 'border-neutral-300 hover:border-neutral-400'
              }`}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.message.message}
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
                {t('contact.form.submitting', 'جاري الإرسال...')}
              </span>
            ) : (
              t('contact.form.submit', 'إرسال الرسالة')
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

const ContactInfo = memo(() => {
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-dark-500 mb-3">
          {t('contact.info.title', 'معلومات التواصل')}
        </h2>
        <p className="text-dark-400 max-w-2xl mx-auto">
          {t(
            'contact.info.description',
            'يمكنك التواصل معنا عبر الطرق التالية'
          )}
        </p>
      </motion.div>

      {/* Simple Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Phone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          whileHover={{ y: -4 }}
          className="group"
        >
          <div className="bg-white border border-primary-200 rounded-lg p-4 text-center hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <span className="text-primary-600 text-lg">📞</span>
            </div>
            <h3 className="text-sm font-semibold text-dark-500 mb-1">الهاتف</h3>
            <p className="text-xs text-dark-400">+90 505 050 5645</p>
          </div>
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ y: -4 }}
          className="group"
        >
          <div className="bg-white border border-secondary-200 rounded-lg p-4 text-center hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <span className="text-secondary-600 text-lg">📧</span>
            </div>
            <h3 className="text-sm font-semibold text-dark-500 mb-1">
              البريد الإلكتروني
            </h3>
            <p className="text-xs text-dark-400">info@shaababna.com</p>
          </div>
        </motion.div>

        {/* Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          whileHover={{ y: -4 }}
          className="group"
        >
          <div className="bg-white border border-accent-200 rounded-lg p-4 text-center hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <span className="text-accent-600 text-lg">📍</span>
            </div>
            <h3 className="text-sm font-semibold text-dark-500 mb-1">
              العنوان
            </h3>
            <p className="text-xs text-dark-400">تركيا، إسطنبول</p>
          </div>
        </motion.div>

        {/* Website */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          whileHover={{ y: -4 }}
          className="group"
        >
          <div className="bg-white border border-primary-200 rounded-lg p-4 text-center hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <span className="text-primary-600 text-lg">🌐</span>
            </div>
            <h3 className="text-sm font-semibold text-dark-500 mb-1">الموقع</h3>
            <a
              href="https://shaababna.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-600 hover:text-primary-700 hover:underline transition-colors"
            >
              shaababna.com
            </a>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
});

const Contact: React.FC = () => {
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
        title={t('contact.pageTitle', 'تواصل معنا - منصة شبابنا')}
        description={t(
          'contact.pageDescription',
          'نحن هنا للإجابة على استفساراتك ومساعدتك في كل ما تحتاج.'
        )}
        type="website"
        keywords={['تواصل معنا', 'اتصل بنا', 'منصة شبابنا', 'دعم']}
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <section className="max-w-3xl mx-auto">
          <ContactHeader />
          <ContactForm />
          <ContactInfo />
        </section>
      </div>
    </div>
  );
};

export default Contact;
