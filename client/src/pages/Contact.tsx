import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/Button/Button';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import Alert from '../components/common/Alert';
import SEO from '../components/common/SEO';
import { submitContactForm, ContactFormData } from '../services/formsApi';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  User,
  Mail as MailIcon,
  Globe,
} from 'lucide-react';

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

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'البريد الإلكتروني',
      value: 'info@shababna.com',
      description: 'راسلنا عبر البريد الإلكتروني',
      color: 'text-primary-600',
      bgColor: 'bg-gradient-to-br from-primary-50 to-primary-100',
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'الهاتف',
      value: '+966 50 123 4567',
      description: 'اتصل بنا مباشرة',
      color: 'text-accent-600',
      bgColor: 'bg-gradient-to-br from-accent-50 to-accent-100',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'العنوان',
      value: 'الرياض، المملكة العربية السعودية',
      description: 'موقعنا الرئيسي',
      color: 'text-secondary-600',
      bgColor: 'bg-gradient-to-br from-secondary-50 to-secondary-100',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'ساعات العمل',
      value: 'الأحد - الخميس: 9 ص - 6 م',
      description: 'أوقات توفرنا',
      color: 'text-success-600',
      bgColor: 'bg-gradient-to-br from-success-50 to-success-100',
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SEO
        title={t('contact.pageTitle', 'تواصل معنا')}
        description={t(
          'contact.pageDescription',
          'نحن هنا للإجابة على استفساراتك ومساعدتك في كل ما تحتاج.'
        )}
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-40 w-24 h-24 bg-accent-500/20 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-white to-accent-50 rounded-2xl mb-6 shadow-2xl"
          >
            <MessageSquare className="w-12 h-12 text-primary-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-accent-100 bg-clip-text text-transparent"
          >
            {t('contact.title', 'تواصل معنا')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            {t(
              'contact.description',
              'نحن هنا للإجابة على استفساراتك ومساعدتك في كل ما تحتاج. لا تتردد في التواصل معنا.'
            )}
          </motion.p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="group"
              >
                <Card className="p-6 text-center hover:shadow-2xl transition-all duration-300 group-hover:scale-105 border-0 bg-gradient-to-br from-white to-neutral-50">
                  <div
                    className={`${info.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <div className={info.color}>{info.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-gray-600 font-medium mb-1">{info.value}</p>
                  <p className="text-sm text-gray-500">{info.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gradient-to-br from-neutral-50 to-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 shadow-xl"
              >
                <Send className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {t('contact.form.title', 'أرسل لنا رسالة')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t(
                  'contact.form.subtitle',
                  'املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن.'
                )}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-8 md:p-12 border-0 bg-gradient-to-br from-white to-neutral-50 shadow-2xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label={t('contact.form.firstName', 'الاسم الأول')}
                      type="text"
                      icon={<User className="w-4 h-4" />}
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
                      icon={<User className="w-4 h-4" />}
                      {...register('last_name')}
                      error={errors.last_name?.message}
                      fullWidth
                    />
                  </div>

                  <Input
                    label={t('contact.form.email', 'البريد الإلكتروني')}
                    type="email"
                    icon={<MailIcon className="w-4 h-4" />}
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
                    icon={<Phone className="w-4 h-4" />}
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
                    icon={<MessageSquare className="w-4 h-4" />}
                    {...register('subject', {
                      required: t(
                        'contact.form.subjectRequired',
                        'الموضوع مطلوب'
                      ),
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.message', 'الرسالة')}
                    </label>
                    <textarea
                      rows={5}
                      {...register('message', {
                        required: t(
                          'contact.form.messageRequired',
                          'الرسالة مطلوبة'
                        ),
                        minLength: {
                          value: 20,
                          message: t(
                            'contact.form.messageMinLength',
                            'الرسالة يجب أن تكون على الأقل 20 حرف'
                          ),
                        },
                      })}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all duration-200 ${
                        errors.message ? 'border-red-500' : 'border-gray-300'
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
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-xl hover:shadow-2xl transform hover:scale-105"
                    disabled={formStatus === 'submitting'}
                    icon={<Send className="w-5 h-5" />}
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {t('contact.map.title', 'موقعنا')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t(
                'contact.map.description',
                'يمكنك زيارتنا في مقرنا الرئيسي في الرياض.'
              )}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl p-8 shadow-2xl"
          >
            <div className="aspect-video bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Globe className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-700">
                  خريطة تفاعلية
                </p>
                <p className="text-gray-600">سيتم إضافة خريطة تفاعلية هنا</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
