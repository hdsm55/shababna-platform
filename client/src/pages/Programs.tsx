import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/Button/Button';
import { Card } from '../components/ui/Card/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import { fetchPrograms } from '../services/programsApi';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Program {
  id: number;
  title: string;
  description: string;
  category: string;
  goal_amount?: number;
  current_amount?: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at?: string;
  image_url?: string;
}

const Programs: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  // جلب البرامج
  const {
    data: programsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['programs'],
    queryFn: () => fetchPrograms({ page: 1, limit: 12 }),
    staleTime: 5 * 60 * 1000,
  });

  const programs = programsData?.data?.items || [];

  // فلترة البرامج
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredPrograms = programs.filter((program: any) => {
    const matchesCategory =
      categoryFilter === 'all' || program.category === categoryFilter;
    return matchesCategory;
  });

  const getStatusColor = (status: string) => {
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (status: string) => {
    return 'نشط';
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const categories = [
    { value: 'all', label: 'جميع الفئات' },
    { value: 'education', label: 'التعليم' },
    { value: 'health', label: 'الصحة' },
    { value: 'social', label: 'اجتماعي' },
    { value: 'technology', label: 'التكنولوجيا' },
  ];

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={t('programs.seo.title', 'البرامج - منصة شبابنا العالمية')}
        description={t(
          'programs.seo.description',
          'اكتشف برامجنا المتنوعة في مجالات التعليم والصحة والتكنولوجيا والمجتمع.'
        )}
        type="website"
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-primary-900 mb-6"
          >
            {t('programs.hero.title', 'برامجنا المتنوعة')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-primary-700 max-w-3xl mx-auto mb-8"
          >
            {t(
              'programs.hero.subtitle',
              'اكتشف برامجنا المتنوعة في مجالات التعليم والصحة والتكنولوجيا والمجتمع. انضم إلينا في صناعة التغيير الإيجابي.'
            )}
          </motion.p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {t('programs.results', 'نتائج البحث:')} {filteredPrograms.length}{' '}
              {t('programs.program', 'برنامج')}
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <Alert type="error">
              {t(
                'programs.error',
                'حدث خطأ أثناء جلب البرامج. يرجى المحاولة لاحقًا.'
              )}
            </Alert>
          ) : filteredPrograms.length === 0 ? (
            <Alert type="info">
              {t('programs.noPrograms', 'لا توجد برامج متاحة حالياً.')}
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program: any) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6">
                      {/* Program Image */}
                      <div className="mb-4">
                        <img
                          src={
                            program.image_url ||
                            '/images/program-placeholder.jpg'
                          }
                          alt={program.title}
                          className="w-full h-48 object-cover rounded-lg"
                          loading="lazy"
                          onError={(e) =>
                            (e.currentTarget.src = '/images/fallback.jpg')
                          }
                        />
                      </div>

                      {/* Program Status */}
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            'active'
                          )}`}
                        >
                          {getStatusText('active')}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          {program.participants_count || 0}
                        </div>
                      </div>

                      {/* Program Title */}
                      <h3 className="text-xl font-bold text-primary-900 mb-2">
                        {program.title}
                      </h3>

                      {/* Program Description */}
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {program.description}
                      </p>

                      {/* Progress Bar */}
                      {program.goal_amount && program.current_amount && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>{t('programs.progress', 'التقدم')}</span>
                            <span>
                              {getProgressPercentage(
                                program.current_amount,
                                program.goal_amount
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${getProgressPercentage(
                                  program.current_amount,
                                  program.goal_amount
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>
                              {t('programs.raised', 'تم جمع')}: $
                              {program.current_amount.toLocaleString()}
                            </span>
                            <span>
                              {t('programs.goal', 'الهدف')}: $
                              {program.goal_amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Program Details */}
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            {formatDate(program.start_date)} -{' '}
                            {formatDate(program.end_date)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          <span>{program.category}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link to={`/programs/${program.id}`}>
                        <Button className="w-full">
                          {t('programs.viewDetails', 'عرض التفاصيل')}
                          <ArrowRight className="w-4 h-4 mr-2" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('programs.cta.title', 'انضم إلينا في صناعة التغيير')}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            {t(
              'programs.cta.description',
              'ساعدنا في تحقيق أهدافنا ودعم برامجنا المتنوعة. كل مساهمة تحدث فرقاً.'
            )}
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/join-us">
              <Button size="lg" className="bg-accent-500 hover:bg-accent-600">
                {t('programs.cta.join', 'انضم إلينا')}
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary-900"
              >
                {t('programs.cta.contact', 'تواصل معنا')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;
