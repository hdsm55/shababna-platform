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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-dark-500 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          {t('contact.title', 'تواصل معنا')}
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-lg text-dark-400 max-w-2xl mx-auto leading-relaxed"
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
    [formStatus, reset, t]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card className="p-6 md:p-8 border border-primary-200 shadow-brand-sm hover:shadow-brand-md transition-all duration-300 bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-dark-500 mb-2">
            {t('contact.form.title', 'أرسل لنا رسالة')}
          </h2>
          <p className="text-dark-400 text-sm">
            {t('contact.form.subtitle', 'سنرد عليك في أقرب وقت ممكن')}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Input
              label={t('contact.form.firstName', 'الاسم الأول')}
              type="text"
              {...register('first_name', {
                required: t(
                  'contact.form.firstNameRequired',
                  'الاسم الأول مطلوب'
                ),
                minLength: {
                  value: 2,
                  message: t(
                    'contact.form.firstNameMinLength',
                    'الاسم الأول يجب أن يكون على الأقل حرفين'
                  ),
                },
              })}
              error={errors.first_name?.message}
              fullWidth
            />
            <Input
              label={t('contact.form.lastName', 'الاسم الأخير')}
              type="text"
              {...register('last_name')}
              error={errors.last_name?.message}
              fullWidth
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              label={t('contact.form.email', 'البريد الإلكتروني')}
              type="email"
              {...register('email', {
                required: t(
                  'contact.form.emailRequired',
                  'البريد الإلكتروني مطلوب'
                ),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t(
                    'contact.form.emailInvalid',
                    'البريد الإلكتروني غير صالح'
                  ),
                },
              })}
              error={errors.email?.message}
              fullWidth
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              label={t('contact.form.phone', 'رقم الهاتف (اختياري)')}
              type="tel"
              {...register('phone', {
                pattern: {
                  value:
                    /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                  message: t(
                    'contact.form.phoneInvalid',
                    'رقم الهاتف غير صالح'
                  ),
                },
              })}
              error={errors.phone?.message}
              fullWidth
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              label={t('contact.form.subject', 'الموضوع')}
              type="text"
              {...register('subject', {
                required: t('contact.form.subjectRequired', 'الموضوع مطلوب'),
                minLength: {
                  value: 5,
                  message: t(
                    'contact.form.subjectMinLength',
                    'الموضوع يجب أن يكون على الأقل 5 أحرف'
                  ),
                },
              })}
              error={errors.subject?.message}
              fullWidth
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-dark-500 mb-2">
              {t('contact.form.message', 'الرسالة')}
            </label>
            <textarea
              rows={5}
              {...register('message', {
                required: t('contact.form.messageRequired', 'الرسالة مطلوبة'),
                minLength: {
                  value: 20,
                  message: t(
                    'contact.form.messageMinLength',
                    'الرسالة يجب أن تكون على الأقل 20 حرف'
                  ),
                },
              })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-dark-500 placeholder:text-dark-300 transition-all duration-200 resize-none bg-white/80 backdrop-blur-sm ${
                errors.message ? 'border-error-500' : 'border-primary-300'
              }`}
              placeholder={t(
                'contact.form.messagePlaceholder',
                'كيف يمكننا مساعدتك؟'
              )}
            />
            {errors.message && (
              <p className="text-error-500 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              size="lg"
              loading={formStatus === 'submitting'}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold py-3 px-6 rounded-lg shadow-brand-sm hover:shadow-brand-md transition-all duration-200 transform hover:scale-[1.02]"
              disabled={formStatus === 'submitting'}
            >
              {formStatus === 'submitting'
                ? t('contact.form.sending', 'جاري الإرسال...')
                : t('contact.form.send', 'إرسال الرسالة')}
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
