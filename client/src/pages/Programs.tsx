import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  MapPin,
  Users,
  Search,
  Clock,
  Info,
  Filter,
  Eye,
  Heart,
  Share2,
  ArrowRight,
  ChevronDown,
  Target,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

import { fetchPrograms } from '../services/programsApi';
import { Program } from '../types';
import SEO from '../components/common/SEO';
import { Button } from '../components/ui/Button/ButtonSimple';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/InputSimple';
import { Modal } from '../components/ui/Modal/ModalSimple';
import CenteredLoader from '../components/common/CenteredLoader';
import { useDebounce } from '../hooks/useDebounce';

const Programs: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [donationForm, setDonationForm] = useState({
    amount: '',
    name: '',
    email: '',
    message: '',
  });

  const filters = [
    {
      key: 'all',
      label: t('programs.filter.all', 'كل البرامج'),
      icon: '🎯',
      color: 'blue',
    },
    {
      key: 'education',
      label: t('programs.filter.education', 'التعليم'),
      icon: '📚',
      color: 'green',
    },
    {
      key: 'health',
      label: t('programs.filter.health', 'الصحة'),
      icon: '🏥',
      color: 'red',
    },
    {
      key: 'environment',
      label: t('programs.filter.environment', 'البيئة'),
      icon: '🌱',
      color: 'emerald',
    },
    {
      key: 'community',
      label: t('programs.filter.community', 'المجتمع'),
      icon: '🤝',
      color: 'purple',
    },
    {
      key: 'technology',
      label: t('programs.filter.technology', 'التكنولوجيا'),
      icon: '💻',
      color: 'indigo',
    },
  ];

  // Prepare query parameters
  const queryParams = {
    category: selectedFilter === 'all' ? undefined : selectedFilter,
    search: debouncedSearch || undefined,
    page: currentPage,
    limit: 9,
  };

  // Fetch programs using React Query
  const {
    data: programsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['programs', queryParams],
    queryFn: () => fetchPrograms(queryParams),
    retry: 3,
    staleTime: 0,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  const programs = programsData?.data?.programs || [];
  const pagination = programsData?.data?.pagination;

  const handleDonationClick = (program: Program) => {
    setSelectedProgram(program);
    setShowDonationModal(true);
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setShowDonationModal(false);
      setDonationForm({
        amount: '',
        name: '',
        email: '',
        message: '',
      });
      setSelectedProgram(null);

      await refetch();
      queryClient.invalidateQueries({ queryKey: ['programs'] });

      alert('تم التبرع بنجاح!');
    } catch (error) {
      console.error('خطأ في التبرع:', error);
      alert('حدث خطأ في التبرع. حاول مرة أخرى.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setDonationForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('❌ Invalid date string:', dateString);
        return 'تاريخ غير صحيح';
      }
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('❌ Error formatting date:', error);
      return 'تاريخ غير صحيح';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'completed':
        return 'مكتمل';
      case 'paused':
        return 'متوقف مؤقتاً';
      case 'cancelled':
        return 'ملغي';
      default:
        return 'غير محدد';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      education: '📚',
      health: '🏥',
      environment: '🌱',
      community: '🤝',
      technology: '💻',
    };
    return categoryMap[category] || '🎯';
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      education: 'bg-green-100 text-green-800',
      health: 'bg-red-100 text-red-800',
      environment: 'bg-emerald-100 text-emerald-800',
      community: 'bg-purple-100 text-purple-800',
      technology: 'bg-indigo-100 text-indigo-800',
    };
    return colorMap[category] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className="page-container bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/30">
      <SEO
        title={t('programs.pageTitle', 'البرامج - منصة شبابنا')}
        description={t(
          'programs.pageDescription',
          'اكتشف البرامج وساهم في تحقيق أهدافها'
        )}
        type="website"
      />

      {/* Professional Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-20"></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-blue-900/60 to-slate-800/80"></div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-center space-y-6"
          >
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {t('programs.title', 'البرامج')}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8"
            >
              {t(
                'programs.description',
                'اكتشف البرامج المميزة وساهم في تحقيق أهدافها لبناء مستقبل أفضل'
              )}
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex justify-center items-center gap-6"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {programs?.length || 0}
                </div>
                <div className="text-blue-200 text-sm">برنامج متاح</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {programs?.filter((p) => p.status === 'active').length || 0}
                </div>
                <div className="text-blue-200 text-sm">نشط</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {programs?.filter((p) => p.status === 'completed').length ||
                    0}
                </div>
                <div className="text-blue-200 text-sm">مكتمل</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Enhanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 space-y-6"
        >
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={t(
                  'programs.searchPlaceholder',
                  'البحث في البرامج...'
                )}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 text-lg"
                size="lg"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              الفلاتر
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </div>

          {/* Filter Tabs */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap justify-center gap-3 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
                  {filters.map((filter) => (
                    <motion.div
                      key={filter.key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={
                          selectedFilter === filter.key ? 'primary' : 'outline'
                        }
                        size="md"
                        onClick={() => setSelectedFilter(filter.key)}
                        className={`text-sm flex items-center gap-2 transition-all duration-300 ${
                          selectedFilter === filter.key
                            ? 'shadow-lg shadow-blue-500/25'
                            : 'hover:shadow-md'
                        }`}
                      >
                        <span className="text-lg">{filter.icon}</span>
                        {filter.label}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-20"
          >
            <CenteredLoader />
          </motion.div>
        )}

        {/* Error State */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600 mb-4">
                  {error?.message ||
                    t('programs.error', 'حدث خطأ في تحميل البرامج')}
                </p>
                <Button variant="primary" onClick={() => refetch()}>
                  {t('common.retry', 'إعادة المحاولة')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Programs Display */}
        {!isLoading && !isError && (
          <AnimatePresence mode="wait">
            {programs && programs.length > 0 ? (
              <motion.div
                key="grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {programs.map((program: Program, index: number) => (
                  <motion.div
                    key={program.id}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="group"
                  >
                    <Card
                      variant="elevated"
                      className="h-full overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500"
                    >
                      {/* Program Image/Header */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={
                            program.image_url || '/images/programs-default.jpg'
                          }
                          alt={program.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src =
                              '/images/programs-default.jpg';
                          }}
                        />

                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor(
                              program.status
                            )}`}
                          >
                            {getStatusText(program.status)}
                          </span>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getCategoryColor(
                              program.category
                            )}`}
                          >
                            {program.category}
                          </span>
                        </div>

                        {/* Action Buttons Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                              onClick={() =>
                                navigate(`/programs/${program.id}`)
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                            >
                              <Heart className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Program Content */}
                      <div className="p-6 space-y-4">
                        {/* Title and Description */}
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                            {program.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                            {program.description}
                          </p>
                        </div>

                        {/* Program Details */}
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-3 text-gray-600">
                            <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="font-medium">
                              {formatDate(program.start_date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-600">
                            <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span className="line-clamp-1 font-medium">
                              {program.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-600">
                            <Users className="w-4 h-4 text-purple-500 flex-shrink-0" />
                            <span className="font-medium">
                              {program.participants_count || 0} مشارك
                            </span>
                          </div>
                        </div>

                        {/* Funding Progress */}
                        {program.goal_amount && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>التمويل</span>
                              <span className="font-medium">
                                {formatCurrency(program.current_amount || 0)} /{' '}
                                {formatCurrency(program.goal_amount)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
                                style={{
                                  width: `${calculateProgress(
                                    program.current_amount || 0,
                                    program.goal_amount
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 text-center">
                              {Math.round(
                                calculateProgress(
                                  program.current_amount || 0,
                                  program.goal_amount
                                )
                              )}
                              % محقق
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-4 space-y-3">
                          <Button
                            variant="primary"
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3"
                            onClick={() => handleDonationClick(program)}
                          >
                            <DollarSign className="w-4 h-4 mr-2" />
                            تبرع الآن
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full flex items-center justify-center gap-2 group-hover:border-blue-500 group-hover:text-blue-600 transition-all duration-300"
                            onClick={() => navigate(`/programs/${program.id}`)}
                          >
                            <Info className="w-4 h-4" />
                            التفاصيل الكاملة
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <Card className="max-w-md mx-auto p-12">
                  <div className="text-8xl mb-6">🎯</div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">
                    لا توجد برامج متاحة
                  </h3>
                  <p className="text-gray-500 mb-6 leading-relaxed">
                    لا توجد برامج متاحة حالياً. تحقق لاحقاً من البرامج الجديدة
                    أو جرب تغيير الفلاتر.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button variant="primary" onClick={() => refetch()}>
                      تحديث الصفحة
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedFilter('all');
                        setSearchTerm('');
                      }}
                    >
                      إعادة تعيين الفلاتر
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Enhanced Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-16"
          >
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2"
                >
                  السابق
                </Button>

                <div className="flex gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-12 h-12"
                        >
                          {page}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="flex items-center gap-2"
                >
                  التالي
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Donation Modal */}
      <Modal
        open={showDonationModal}
        onClose={() => {
          setShowDonationModal(false);
          setSelectedProgram(null);
          setDonationForm({
            amount: '',
            name: '',
            email: '',
            message: '',
          });
        }}
        title={t('programs.donation.title', 'تبرع للبرنامج')}
      >
        {selectedProgram && (
          <div className="space-y-6">
            {/* Program Info */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <h3 className="font-bold text-xl mb-3 text-gray-900">
                {selectedProgram.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {selectedProgram.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="font-medium">
                    الهدف: {formatCurrency(selectedProgram.goal_amount || 0)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">
                    المحقق:{' '}
                    {formatCurrency(selectedProgram.current_amount || 0)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Donation Form */}
            <form onSubmit={handleDonationSubmit} className="space-y-4">
              <Input
                label={t('programs.donation.amount', 'مبلغ التبرع')}
                type="number"
                value={donationForm.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                required
                min="1"
                step="0.01"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t('programs.donation.name', 'الاسم')}
                  value={donationForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
                <Input
                  label={t('programs.donation.email', 'البريد الإلكتروني')}
                  type="email"
                  value={donationForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <Input
                label={t('programs.donation.message', 'رسالة (اختياري)')}
                value={donationForm.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                multiline
                rows={3}
              />

              <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" className="flex-1">
                  {t('programs.donation.submit', 'تأكيد التبرع')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDonationModal(false);
                    setSelectedProgram(null);
                    setDonationForm({
                      amount: '',
                      name: '',
                      email: '',
                      message: '',
                    });
                  }}
                >
                  {t('common.cancel', 'إلغاء')}
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Programs;
