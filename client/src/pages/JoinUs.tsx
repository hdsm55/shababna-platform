import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Send, Users, Globe, Heart } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

interface JoinUsFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  age: number;
  interests: string[];
  motivation: string;
}

const JoinUs: React.FC = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<JoinUsFormData>();

  const onSubmit = async (data: JoinUsFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Form submitted:', data);
    // Handle form submission here
  };

  const interestOptions = [
    'Leadership Development',
    'Technology & Innovation',
    'Social Impact',
    'Entrepreneurship',
    'Community Service',
    'Environmental Sustainability',
    'Education & Mentoring',
    'Arts & Culture',
  ];

  const benefits = [
    {
      icon: Users,
      title: 'Global Network',
      description: 'Connect with like-minded youth from around the world',
    },
    {
      icon: Globe,
      title: 'International Programs',
      description: 'Access to exclusive programs and workshops',
    },
    {
      icon: Heart,
      title: 'Make Impact',
      description: 'Contribute to meaningful projects and initiatives',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {t('joinUs.title')}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('joinUs.subtitle')}
              </p>
            </motion.div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-4">
                    <benefit.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('joinUs.form.firstName')}
                    </label>
                    <input
                      type="text"
                      {...register('firstName', { required: 'First name is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.firstName && (
                      <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('joinUs.form.lastName')}
                    </label>
                    <input
                      type="text"
                      {...register('lastName', { required: 'Last name is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.lastName && (
                      <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('joinUs.form.email')}
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email address'
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('joinUs.form.phone')}
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'Phone number is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('joinUs.form.country')}
                    </label>
                    <select
                      {...register('country', { required: 'Country is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select a country</option>
                      <option value="saudi-arabia">Saudi Arabia</option>
                      <option value="turkey">Turkey</option>
                      <option value="uae">United Arab Emirates</option>
                      <option value="egypt">Egypt</option>
                      <option value="jordan">Jordan</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.country && (
                      <p className="text-red-600 text-sm mt-1">{errors.country.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('joinUs.form.age')}
                    </label>
                    <input
                      type="number"
                      min="16"
                      max="35"
                      {...register('age', { 
                        required: 'Age is required',
                        min: { value: 16, message: 'Must be at least 16 years old' },
                        max: { value: 35, message: 'Must be 35 years old or younger' }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.age && (
                      <p className="text-red-600 text-sm mt-1">{errors.age.message}</p>
                    )}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('joinUs.form.interests')}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {interestOptions.map((interest) => (
                      <label key={interest} className="flex items-center">
                        <input
                          type="checkbox"
                          value={interest}
                          {...register('interests')}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="ml-2 rtl:mr-2 rtl:ml-0 text-sm text-gray-700">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Motivation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('joinUs.form.motivation')}
                  </label>
                  <textarea
                    rows={4}
                    {...register('motivation', { required: 'Please tell us why you want to join' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell us about your motivation and what you hope to achieve..."
                  />
                  {errors.motivation && (
                    <p className="text-red-600 text-sm mt-1">{errors.motivation.message}</p>
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    loading={isSubmitting}
                    icon={Send}
                    iconPosition="right"
                    className="w-full"
                  >
                    {t('joinUs.form.submit')}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default JoinUs;