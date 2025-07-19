import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/Button/Button';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import Alert from '../components/common/Alert';
import SEO from '../components/common/SEO';
import { submitContactForm, ContactFormData } from '../services/formsApi';

const Contact: React.FC = () => {
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
  } = useForm<ContactFormData>();
  const isRTL = i18n.dir() === 'rtl';

  const onSubmit = async (data: ContactFormData) => {
    setFormStatus('idle');
    setFormMsg('');
    setShowAlert(false);
    try {
      await submitContactForm(data);
      setFormStatus('success');
      setFormMsg(
        t(
          'contact.form.success',
          'تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت ممكن.'
        )
      );
      reset();
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    } catch (error) {
      setFormStatus('error');
      setFormMsg(
        t(
          'contact.form.error',
          'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.'
        )
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={t('contact.title')}
        description={t('contact.subtitle')}
        type="website"
      />
      <section className="py-16 bg-gradient-to-br from-primary-50 via-white to-accent-50 text-center mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-primary-700">
            {t('contact.title')}
          </h1>
          <p className="text-lg md:text-2xl text-neutral-700 mb-8">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>
      <section className="container mx-auto px-4 max-w-3xl">
        <Card variant="default" padding="lg" className="mb-8">
          <h2 className="text-2xl font-bold text-primary-700 mb-6 text-center">
            {t('contact.form.title', 'راسلنا مباشرة')}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label={t('contact.form.name')}
              type="text"
              {...register('first_name', {
                required: t('contact.form.nameRequired', 'الاسم مطلوب'),
              })}
              error={errors.first_name?.message}
              fullWidth
            />
            <Input
              label={t('contact.form.email')}
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
            <Input
              label={t('contact.form.subject')}
              type="text"
              {...register('subject', {
                required: t('contact.form.subjectRequired', 'الموضوع مطلوب'),
              })}
              error={errors.subject?.message}
              fullWidth
            />
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {t('contact.form.message')}
              </label>
              <textarea
                rows={5}
                {...register('message', {
                  required: t('contact.form.messageRequired', 'الرسالة مطلوبة'),
                })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-900 placeholder:text-neutral-400"
                placeholder={t(
                  'contact.form.messagePlaceholder',
                  'كيف يمكننا مساعدتك؟'
                )}
              />
              {errors.message && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.message.message}
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
              {t('contact.form.send')}
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

export default Contact;
