import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  Send,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { submitContactForm, ContactFormData } from '../services/formsApi';
import {
  AccessibleSection,
  AccessibleCard,
  AccessibleButton,
  SkipToContent,
} from '../components/common/AccessibleComponents';

// Using imported ContactFormData from formsApi

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await submitContactForm(data);
      console.log('Contact form submitted successfully:', response);
      reset();
      // يمكن إضافة إشعار نجاح هنا
    } catch (error) {
      console.error('Contact form submission failed:', error);
      // يمكن إضافة إشعار خطأ هنا
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      content: t('contact.info.address'),
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      icon: Phone,
      title: 'Phone',
      content: t('contact.info.phone'),
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
    },
    {
      icon: Mail,
      title: 'Email',
      content: t('contact.info.email'),
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
    },
    {
      icon: Clock,
      title: 'Office Hours',
      content: 'Mon - Fri: 9:00 AM - 6:00 PM',
      color: 'text-success-600',
      bgColor: 'bg-success-50',
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: '#',
      label: 'Facebook',
      color: 'hover:text-blue-600',
    },
    {
      icon: Twitter,
      href: '#',
      label: 'Twitter',
      color: 'hover:text-blue-400',
    },
    {
      icon: Instagram,
      href: '#',
      label: 'Instagram',
      color: 'hover:text-pink-600',
    },
    {
      icon: Linkedin,
      href: '#',
      label: 'LinkedIn',
      color: 'hover:text-blue-700',
    },
  ];

  return (
    <div className="min-h-screen">
      <SkipToContent />
      {/* Header Section */}
      <AccessibleSection variant="content" ariaLabel="قسم رأس صفحة الاتصال">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {t('contact.title')}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('contact.subtitle')}
              </p>
            </motion.div>
          </div>
        </div>
      </AccessibleSection>

      {/* Contact Form & Info Section */}
      <AccessibleSection
        variant="neutral"
        ariaLabel="قسم نموذج الاتصال والمعلومات"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.name')}
                    </label>
                    <input
                      type="text"
                      {...register('first_name', {
                        required: 'Name is required',
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.first_name && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.email')}
                    </label>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email address',
                        },
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.subject')}
                    </label>
                    <input
                      type="text"
                      {...register('subject', {
                        required: 'Subject is required',
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.subject && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.message')}
                    </label>
                    <textarea
                      rows={5}
                      {...register('message', {
                        required: 'Message is required',
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tell us how we can help you..."
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
                    icon={Send}
                    iconPosition="right"
                    className="w-full"
                  >
                    {t('contact.form.send')}
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Get in Touch
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="p-6">
                      <div className="flex items-start space-x-4 rtl:space-x-reverse">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 ${info.bgColor} rounded-xl`}
                        >
                          <info.icon className={`w-6 h-6 ${info.color}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {info.title}
                          </h3>
                          <p className="text-gray-600">{info.content}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Follow Us
                </h3>
                <div className="flex space-x-4 rtl:space-x-reverse">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 transition-colors ${social.color}`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </Card>

              {/* Map Placeholder */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Location
                </h3>
                <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">
                      Interactive map would be here
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </AccessibleSection>
    </div>
  );
};

export default Contact;
