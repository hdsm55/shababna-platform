import React, { useState, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button/ButtonSimple';
import { Card } from '../components/ui/Card/Card';
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-dark-500 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-arabic">
          {t('contact.title', 'تواصل معنا')}
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-lg text-dark-400 max-w-2xl mx-auto leading-relaxed font-arabic"
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
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-12"
    >
      <Card className="p-8 shadow-brand-lg border-0">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-dark-500 mb-2 font-arabic">
            {t('contact.form.title', 'أرسل رسالة')}
          </h2>
          <p className="text-dark-400 font-arabic">
            {t(
              'contact.form.subtitle',
              'املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن'
            )}
          </p>
        </div>

        {showAlert && (
          <Alert
            type={formStatus === 'success' ? 'success' : 'error'}
            message={formMsg}
            onClose={() => setShowAlert(false)}
            className="mb-6"
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-dark-500 mb-2 font-arabic"
              >
                {t('contact.form.firstName', 'الاسم الأول')} *
              </label>
              <input
                type="text"
                placeholder={t(
                  'contact.form.firstNamePlaceholder',
                  'أدخل اسمك الأول'
                )}
                {...register('first_name', {
                  required: t(
                    'contact.form.firstNameRequired',
                    'الاسم الأول مطلوب'
                  ),
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-arabic ${
                  errors.first_name
                    ? 'border-error-500'
                    : 'border-secondary-200'
                }`}
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-error-500 font-arabic">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-dark-500 mb-2 font-arabic"
              >
                {t('contact.form.lastName', 'اسم العائلة')} *
              </label>
              <input
                type="text"
                placeholder={t(
                  'contact.form.lastNamePlaceholder',
                  'أدخل اسم عائلتك'
                )}
                {...register('last_name', {
                  required: t(
                    'contact.form.lastNameRequired',
                    'اسم العائلة مطلوب'
                  ),
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-arabic ${
                  errors.last_name ? 'border-error-500' : 'border-secondary-200'
                }`}
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-error-500 font-arabic">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-dark-500 mb-2 font-arabic"
            >
              {t('contact.form.email', 'البريد الإلكتروني')} *
            </label>
            <input
              type="email"
              placeholder={t(
                'contact.form.emailPlaceholder',
                'أدخل بريدك الإلكتروني'
              )}
              {...register('email', {
                required: t(
                  'contact.form.emailRequired',
                  'البريد الإلكتروني مطلوب'
                ),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t(
                    'contact.form.emailInvalid',
                    'البريد الإلكتروني غير صحيح'
                  ),
                },
              })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-arabic ${
                errors.email ? 'border-error-500' : 'border-secondary-200'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error-500 font-arabic">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-dark-500 mb-2 font-arabic"
            >
              {t('contact.form.phone', 'رقم الهاتف')}
            </label>
            <input
              type="tel"
              placeholder={t(
                'contact.form.phonePlaceholder',
                'أدخل رقم هاتفك (اختياري)'
              )}
              {...register('phone')}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-arabic border-secondary-200"
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-dark-500 mb-2 font-arabic"
            >
              {t('contact.form.subject', 'الموضوع')} *
            </label>
            <input
              type="text"
              placeholder={t(
                'contact.form.subjectPlaceholder',
                'أدخل موضوع رسالتك'
              )}
              {...register('subject', {
                required: t('contact.form.subjectRequired', 'الموضوع مطلوب'),
              })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-arabic ${
                errors.subject ? 'border-error-500' : 'border-secondary-200'
              }`}
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-error-500 font-arabic">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-dark-500 mb-2 font-arabic"
            >
              {t('contact.form.message', 'الرسالة')} *
            </label>
            <textarea
              id="message"
              {...register('message', {
                required: t('contact.form.messageRequired', 'الرسالة مطلوبة'),
                minLength: {
                  value: 10,
                  message: t(
                    'contact.form.messageMinLength',
                    'يجب أن تكون الرسالة 10 أحرف على الأقل'
                  ),
                },
              })}
              rows={5}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-arabic ${
                errors.message ? 'border-error-500' : 'border-secondary-200'
              }`}
              placeholder={t(
                'contact.form.messagePlaceholder',
                'اكتب رسالتك هنا...'
              )}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-error-500 font-arabic">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="text-center">
            <Button
              type="submit"
              disabled={formStatus === 'submitting'}
              className="w-full md:w-auto px-8 py-3 text-lg font-semibold font-arabic"
            >
              {formStatus === 'submitting' ? (
                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('contact.form.sending', 'جاري الإرسال...')}</span>
                </div>
              ) : (
                t('contact.form.send', 'إرسال الرسالة')
              )}
            </Button>
          </div>
        </form>
      </Card>
    </motion.section>
  );
});

const ContactInfo = memo(() => {
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-12"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-dark-500 mb-2 font-arabic">
          {t('contact.info.title', 'معلومات التواصل')}
        </h2>
        <p className="text-dark-400 font-arabic">
          {t(
            'contact.info.subtitle',
            'يمكنك التواصل معنا من خلال الطرق التالية'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Phone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ y: -4 }}
          className="group"
        >
          <div className="bg-white border border-primary-200 rounded-lg p-4 text-center hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <span className="text-primary-600 text-lg">📞</span>
            </div>
            <h3 className="text-sm font-semibold text-dark-500 mb-1 font-arabic">
              {t('contact.info.phone', 'الهاتف')}
            </h3>
            <p className="text-xs text-dark-400 font-arabic">
              +90 212 123 45 67
            </p>
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
            <h3 className="text-sm font-semibold text-dark-500 mb-1 font-arabic">
              {t('contact.info.email', 'البريد الإلكتروني')}
            </h3>
            <p className="text-xs text-dark-400 font-arabic">
              info@shaababna.com
            </p>
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
            <h3 className="text-sm font-semibold text-dark-500 mb-1 font-arabic">
              {t('contact.info.address', 'العنوان')}
            </h3>
            <p className="text-xs text-dark-400 font-arabic">تركيا، إسطنبول</p>
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
            <h3 className="text-sm font-semibold text-dark-500 mb-1 font-arabic">
              {t('contact.info.website', 'الموقع')}
            </h3>
            <a
              href="https://shaababna.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-600 hover:text-primary-700 hover:underline transition-colors font-arabic"
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
    <div className="page-container bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden font-arabic">
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
