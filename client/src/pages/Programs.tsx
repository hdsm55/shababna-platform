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
  Search,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '../components/ui/Input/Input';

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

  // Debug: طباعة هيكل البيانات
  console.log('🔍 Programs Data Structure:', programsData);
  console.log('🔍 Programs Loading:', isLoading);
  console.log('🔍 Programs Error:', error);

  const programs = (() => {
    try {
      // هيكل البيانات الفعلي من الخادم
      if (
        programsData?.data?.programs &&
        Array.isArray(programsData.data.programs)
      ) {
        console.log('✅ Found programs in programsData.data.programs');
        return programsData.data.programs;
      }
      if (
        (programsData as any)?.data?.items?.rows &&
        Array.isArray((programsData as any).data.items.rows)
      ) {
        console.log('✅ Found programs in programsData.data.items.rows');
        return (programsData as any).data.items.rows;
      }
      if (
        (programsData as any)?.data?.items &&
        Array.isArray((programsData as any).data.items)
      ) {
        console.log('✅ Found programs in programsData.data.items');
        return (programsData as any).data.items;
      }
      if (
        (programsData as any)?.items &&
        Array.isArray((programsData as any).items)
      ) {
        console.log('✅ Found programs in programsData.items');
        return (programsData as any).items;
      }
      if (Array.isArray(programsData)) {
        console.log('✅ Found programs in programsData array');
        return programsData;
      }
      console.log('❌ No programs found in any expected structure');
      return [];
    } catch (error) {
      console.error('Error parsing programs data:', error);
      return [];
    }
  })();

  console.log('🔍 Final programs:', programs);

  // فلترة البرامج
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const filteredPrograms = programs.filter((program: any) => {
    const matchesCategory =
      categoryFilter === 'all' || program.category === categoryFilter;
    const matchesSearchTerm =
      searchTerm === '' ||
      program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
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
    { value: 'صحية', label: 'صحية' },
    { value: 'تعليمية', label: 'تعليمية' },
    { value: 'اجتماعية', label: 'اجتماعية' },
    { value: 'رياضية', label: 'رياضية' },
    { value: 'ثقافية', label: 'ثقافية' },
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

      {/* Search and Filters Section - Enhanced */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-white to-accent-50 p-6 rounded-2xl shadow-lg border border-accent-100"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar - Enhanced */}
            <div className="relative w-full lg:w-96">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-accent-400" />
              </div>
              <Input
                ref={inputRef}
                type="text"
                placeholder={t(
                  'programs.search.placeholder',
                  'ابحث في البرامج...'
                )}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 pr-4 py-3 bg-white border-accent-200 focus:border-accent-500 focus:ring-accent-500 shadow-sm"
                fullWidth
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filters - Enhanced */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <motion.div
                  key={category.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={
                      categoryFilter === category.value ? 'accent' : 'outline'
                    }
                    size="md"
                    onClick={() => setCategoryFilter(category.value)}
                    className={`transition-all duration-200 ${
                      categoryFilter === category.value
                        ? 'shadow-lg shadow-accent-200 ring-2 ring-accent-300'
                        : 'hover:shadow-md hover:shadow-accent-100'
                    }`}
                  >
                    {category.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Results Counter */}
          <div className="text-sm text-gray-600">
            {t('programs.results', 'تم العثور على {{count}} برنامج', {
              count: programs.length,
            })}
          </div>
        </motion.div>
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
                            '/images/program-placeholder.svg'
                          }
                          alt={program.title}
                          className="w-full h-48 object-cover rounded-lg"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            console.log(
                              'Image failed to load:',
                              program.image_url
                            );
                            e.currentTarget.src =
                              '/images/program-placeholder.svg';
                          }}
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
