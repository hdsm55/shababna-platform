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

  const onSubmit = async (data: ContactFormData) => {
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
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <SEO
        title={t('contact.pageTitle', 'تواصل معنا')}
        description={t(
          'contact.pageDescription',
          'نحن هنا للإجابة على استفساراتك ومساعدتك في كل ما تحتاج.'
        )}
      />

      <section className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {t('contact.title', 'تواصل معنا')}
          </h1>
          <p className="text-lg text-gray-600">
            {t(
              'contact.description',
              'نحن هنا للإجابة على استفساراتك ومساعدتك في كل ما تحتاج.'
            )}
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

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

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-900 placeholder:text-neutral-400 ${
                  errors.message ? 'border-red-500' : 'border-neutral-300'
                }`}
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
              loading={formStatus === 'submitting'}
              className="w-full"
              disabled={formStatus === 'submitting'}
            >
              {formStatus === 'submitting'
                ? t('contact.form.sending', 'جاري الإرسال...')
                : t('contact.form.send', 'إرسال الرسالة')}
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
