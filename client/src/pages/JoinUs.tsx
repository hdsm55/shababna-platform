import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/Button/Button';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import Alert from '../components/common/Alert';
import SEO from '../components/common/SEO';
import { countries } from '../utils/countries';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Globe,
  Calendar,
  MessageSquare,
  Users,
  Award,
  Heart,
  Sparkles,
  Target,
  CheckCircle,
} from 'lucide-react';

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

  const benefits = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'مجتمع نشط',
      description: 'انضم إلى مجتمع من الشباب الطموحين والمبدعين',
      color: 'text-primary-600',
      bgColor: 'bg-gradient-to-br from-primary-50 to-primary-100',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'فرص تطويرية',
      description: 'برامج تدريبية وورش عمل لتنمية مهاراتك',
      color: 'text-accent-600',
      bgColor: 'bg-gradient-to-br from-accent-50 to-accent-100',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'بيئة داعمة',
      description: 'بيئة آمنة وداعمة للتطوير والنمو الشخصي',
      color: 'text-success-600',
      bgColor: 'bg-gradient-to-br from-success-50 to-success-100',
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'تجارب فريدة',
      description: 'فعاليات وأنشطة مميزة ومبتكرة',
      color: 'text-secondary-600',
      bgColor: 'bg-gradient-to-br from-secondary-50 to-secondary-100',
    },
  ];

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
      className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SEO
        title={t('joinUs.title')}
        description={t('joinUs.subtitle')}
        type="website"
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-secondary-600 via-secondary-700 to-secondary-800 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-40 w-24 h-24 bg-primary-500/20 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-white to-primary-50 rounded-2xl mb-6 shadow-2xl"
          >
            <Users className="w-12 h-12 text-secondary-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent"
          >
            {t('joinUs.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            {t('joinUs.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
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
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl mb-6 shadow-xl"
            >
              <Target className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">
              {t('joinUs.benefits.title', 'لماذا تنضم إلينا؟')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t(
                'joinUs.benefits.subtitle',
                'اكتشف الفوائد التي ستحصل عليها عند الانضمام إلى مجتمعنا.'
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="group"
              >
                <Card className="p-6 text-center hover:shadow-2xl transition-all duration-300 group-hover:scale-105 border-0 bg-gradient-to-br from-white to-neutral-50">
                  <div
                    className={`${benefit.bgColor} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <div className={benefit.color}>{benefit.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-gradient-to-br from-neutral-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
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
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl mb-6 shadow-xl"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">
                {t('joinUs.form.title', 'نموذج الانضمام')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t(
                  'joinUs.form.subtitle',
                  'املأ النموذج أدناه لطلب الانضمام إلى مجتمعنا.'
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
                      label={t('joinUs.form.firstName')}
                      type="text"
                      icon={<User className="w-4 h-4" />}
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
                      icon={<User className="w-4 h-4" />}
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
                      icon={<Mail className="w-4 h-4" />}
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
                      icon={<Phone className="w-4 h-4" />}
                      {...register('phone', {
                        required: t(
                          'joinUs.form.phoneRequired',
                          'رقم الهاتف مطلوب'
                        ),
                      })}
                      error={errors.phone?.message}
                      fullWidth
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('joinUs.form.country')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          {...register('country', {
                            required: t(
                              'joinUs.form.countryRequired',
                              'الدولة مطلوبة'
                            ),
                          })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all duration-200"
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
                    </div>
                    <Input
                      label={t('joinUs.form.age')}
                      type="number"
                      icon={<Calendar className="w-4 h-4" />}
                      {...register('age', {
                        required: t('joinUs.form.ageRequired', 'العمر مطلوب'),
                        min: {
                          value: 1,
                          message: 'العمر يجب أن يكون أكبر من 0',
                        },
                      })}
                      error={errors.age?.message}
                      fullWidth
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('joinUs.form.motivation')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                        <MessageSquare className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        rows={4}
                        {...register('motivation', {
                          required: t(
                            'joinUs.form.motivationRequired',
                            'يرجى كتابة سبب رغبتك في الانضمام'
                          ),
                        })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all duration-200"
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
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    loading={isSubmitting}
                    className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
                    disabled={isSubmitting}
                    icon={<CheckCircle className="w-5 h-5" />}
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary-600 via-secondary-700 to-primary-600 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-primary-500/20 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-white to-primary-50 rounded-2xl mb-6 shadow-2xl"
            >
              <Heart className="w-12 h-12 text-secondary-600" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
              {t('joinUs.cta.title', 'انضم إلى مجتمعنا اليوم')}
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              {t(
                'joinUs.cta.description',
                'كن جزءاً من مجتمع شبابنا وشارك في صناعة التغيير الإيجابي.'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1"
              >
                {t('joinUs.cta.join', 'انضم الآن')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-secondary-900 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm"
              >
                {t('joinUs.cta.learn', 'اعرف المزيد')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default JoinUs;
