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
  Trophy,
  Target,
  Award,
  Sparkles,
  Heart,
  Eye,
  Zap,
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
  participants_count?: number;
}

const Programs: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  // جلب البرامج مع تحسين الاستعلام
  const {
    data: programsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['programs'],
    queryFn: () => fetchPrograms({ page: 1, limit: 12 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const programs = programsData?.data?.items || [];

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
    return 'bg-gradient-to-r from-success-500 to-success-600 text-white';
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
    { value: 'all', label: 'جميع الفئات', icon: <Eye className="w-4 h-4" /> },
    { value: 'تقني', label: 'تقني', icon: <Zap className="w-4 h-4" /> },
    {
      value: 'ريادة أعمال',
      label: 'ريادة أعمال',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    { value: 'اجتماعي', label: 'اجتماعي', icon: <Users className="w-4 h-4" /> },
    { value: 'تعليمي', label: 'تعليمي', icon: <Award className="w-4 h-4" /> },
    { value: 'صحي', label: 'صحي', icon: <Heart className="w-4 h-4" /> },
    { value: 'ثقافي', label: 'ثقافي', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SEO
        title={t('programs.seo.title', 'البرامج - منصة شبابنا العالمية')}
        description={t(
          'programs.seo.description',
          'اكتشف برامجنا المتنوعة في مجالات التعليم والصحة والتكنولوجيا والمجتمع.'
        )}
        type="website"
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-accent-600 via-accent-700 to-accent-800 text-white overflow-hidden">
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
            <Trophy className="w-12 h-12 text-accent-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent"
          >
            {t('programs.hero.title', 'برامجنا المتنوعة')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-white to-accent-50 p-8 rounded-3xl shadow-2xl border border-accent-100"
        >
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
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
                className="pl-12 pr-4 py-4 bg-white border-accent-200 focus:border-accent-500 focus:ring-accent-500 shadow-lg rounded-xl"
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
                    icon={category.icon}
                  >
                    {category.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Results Counter */}
          <div className="mt-6 pt-6 border-t border-accent-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-accent-600 font-medium">
                {t('programs.results', 'تم العثور على {count} برنامج', {
                  count: filteredPrograms.length,
                })}
              </p>
              {error && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="text-accent-600"
                >
                  إعادة المحاولة
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Programs Grid */}
      <section className="py-12 bg-gradient-to-br from-neutral-50 to-accent-50">
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
              {filteredPrograms.map((program: any, index: number) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 group-hover:scale-105 border-0 bg-gradient-to-br from-white to-accent-50">
                    <div className="p-6">
                      {/* Program Image */}
                      <div className="mb-6">
                        <div className="relative overflow-hidden rounded-2xl">
                          <img
                            src={
                              program.image_url ||
                              '/images/program-placeholder.svg'
                            }
                            alt={program.title}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              console.log(
                                'Image failed to load:',
                                program.image_url
                              );
                              e.currentTarget.src =
                                '/images/program-placeholder.svg';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          <div className="absolute top-4 right-4">
                            <div className="flex items-center text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-white text-sm font-medium ml-1">
                                مميز
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Program Status */}
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg ${getStatusColor(
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
                      <h3 className="text-xl font-bold text-primary-900 mb-3 group-hover:text-accent-600 transition-colors">
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
                              className="bg-gradient-to-r from-accent-500 to-primary-500 h-2 rounded-full transition-all duration-300"
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
                        <Button className="w-full group-hover:shadow-lg transform group-hover:scale-105">
                          <span className="flex items-center justify-center">
                            عرض التفاصيل
                            <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                          </span>
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
      <section className="py-20 bg-gradient-to-r from-accent-600 via-accent-700 to-primary-600 text-white relative overflow-hidden">
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
              <Target className="w-12 h-12 text-accent-600" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
              {t('programs.cta.title', 'انضم إلينا في صناعة التغيير')}
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              {t(
                'programs.cta.description',
                'ساعدنا في تحقيق أهدافنا ودعم برامجنا المتنوعة. كل مساهمة تحدث فرقاً.'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/join-us">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1"
                >
                  {t('programs.cta.join', 'انضم إلينا')}
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-accent-900 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm"
                >
                  {t('programs.cta.contact', 'تواصل معنا')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Programs;
