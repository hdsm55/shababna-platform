import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import {
  Target,
  Users,
  Clock,
  ArrowRight,
  Heart,
  HandHeart,
  Filter,
  Search,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchPrograms } from '../services/programsApi';
import { Program } from '../types';
import {
  AccessibleSection,
  AccessibleCard,
  AccessibleButton,
  SkipToContent,
} from '../components/common/AccessibleComponents';

const Programs: React.FC = () => {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const filters = [
    { key: 'all', label: t('programs.filter.all') },
    { key: 'education', label: t('programs.filter.education') },
    { key: 'technology', label: t('programs.filter.technology') },
    { key: 'entrepreneurship', label: t('programs.filter.entrepreneurship') },
    { key: 'volunteering', label: t('programs.filter.volunteering') },
  ];

  // Prepare query parameters
  const queryParams = {
    category: selectedFilter === 'all' ? undefined : selectedFilter,
    search: searchTerm || undefined,
    page: currentPage,
    limit: 10,
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
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const programs = programsData?.data?.items || [];
  const pagination = programsData?.data?.pagination;

  // Handle filter changes
  const handleFilterChange = (filterKey: string) => {
    setSelectedFilter(filterKey);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen">
      <SkipToContent />
      <SEO
        title="Programs"
        description="Explore our comprehensive youth development programs including leadership training, skill development, and community engagement initiatives."
        type="website"
      />

      {/* Header Section */}
      <AccessibleSection variant="hero" ariaLabel="قسم رأس صفحة البرامج">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                {t('programs.title')}
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                {t('programs.subtitle')}
              </p>
            </motion.div>
          </div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col lg:flex-row gap-4 mb-8"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent shadow-sm bg-white/10 backdrop-blur-sm text-white placeholder-white/70"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => handleFilterChange(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedFilter === filter.key
                      ? 'bg-white text-primary-600 shadow-lg'
                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </AccessibleSection>

      {/* Stats Section */}
      <AccessibleSection variant="content" ariaLabel="قسم إحصائيات البرامج">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: programs.length.toString(),
                label: 'Total Programs',
                icon: Target,
              },
              {
                number: programs
                  .filter((p) => p.current_amount > 0)
                  .length.toString(),
                label: 'Funded',
                icon: Heart,
              },
              {
                number: programs
                  .filter((p) => p.category === 'education')
                  .length.toString(),
                label: 'Education',
                icon: Users,
              },
              {
                number: programs
                  .filter((p) => p.category === 'media')
                  .length.toString(),
                label: 'Media',
                icon: Clock,
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group cursor-pointer"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary-100 rounded-xl mb-4 group-hover:bg-secondary-200 transition-colors">
                  <stat.icon className="w-6 h-6 text-secondary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-secondary-600 transition-colors">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AccessibleSection>

      {/* Programs Grid */}
      <AccessibleSection variant="neutral" ariaLabel="قسم شبكة البرامج">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="animate-pulse">
                  <div className="bg-gray-200 rounded-xl h-48 w-full mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/3 mb-4" />
                  <div className="flex gap-2">
                    <div className="h-10 bg-gray-200 rounded w-1/2" />
                    <div className="h-10 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-800 font-medium mb-2">
                  {t('common.error.title')}
                </p>
                <p className="text-red-600 text-sm mb-4">
                  {error instanceof Error
                    ? error.message
                    : t('common.error.message')}
                </p>
                <Button onClick={() => refetch()} variant="outline" size="sm">
                  {t('common.retry')}
                </Button>
              </div>
            </div>
          )}

          {/* Programs Grid */}
          {!isLoading && !isError && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {programs.map((program: Program, index: number) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      hover
                      variant="elevated"
                      className="overflow-hidden group focus-within:ring-2 focus-within:ring-secondary-400 focus-within:ring-offset-2 transition-shadow duration-300 shadow-md hover:shadow-2xl border border-transparent hover:border-secondary-200"
                    >
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={
                            program.image ||
                            'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg'
                          }
                          alt={program.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 text-sm font-medium bg-primary-100 text-primary-800 rounded-full">
                            {program.category}
                          </span>
                          <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                            <div className="flex items-center">
                              <Target className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                              {/* {program.is_active ? 'Active' : 'Inactive'} */}
                            </div>
                            {program.goal_amount && (
                              <div className="flex items-center">
                                <Heart className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                                ${program.current_amount}/${program.goal_amount}
                              </div>
                            )}
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {program.title}
                        </h3>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                          {program.description}
                        </p>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">
                            Progress
                          </h4>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{
                                width: `${
                                  program.goal_amount
                                    ? (program.current_amount /
                                        program.goal_amount) *
                                      100
                                    : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {program.goal_amount
                              ? `${Math.round(
                                  (program.current_amount /
                                    program.goal_amount) *
                                    100
                                )}% of goal reached`
                              : 'No funding goal set'}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            size="sm"
                            icon={ArrowRight}
                            iconPosition="right"
                            className="flex-1 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                            onClick={() => {
                              // فتح مودال دعم البرنامج أو الانتقال لصفحة التفاصيل
                              navigate(`/programs/${program.id}`);
                            }}
                          >
                            {t('programs.support')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Heart}
                            className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                            onClick={() => {
                              // TODO: Open donation modal
                              console.log('Donate to program:', program.id);
                            }}
                          >
                            {t('programs.donate')}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={HandHeart}
                            className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                            onClick={() => {
                              // TODO: Open sponsorship modal
                              console.log('Sponsor program:', program.id);
                            }}
                          >
                            {t('programs.sponsor')}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {programs.length === 0 && !isLoading && (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <svg
                    width="64"
                    height="64"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="mb-4 text-gray-300"
                  >
                    <path
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-gray-500 text-lg">
                    {searchTerm || selectedFilter !== 'all'
                      ? t(
                          'programs.emptySearch',
                          'لا توجد برامج مطابقة للبحث أو الفلتر.'
                        )
                      : t('programs.empty', 'لا توجد برامج متاحة حالياً.')}
                  </p>
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {pagination.totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </AccessibleSection>

      {/* CTA Section */}
      <AccessibleSection variant="primary" ariaLabel="قسم دعوة للعمل">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Support Our Programs
            </h2>
            <p className="text-xl text-secondary-100 mb-8 max-w-2xl mx-auto">
              Your contribution helps us create lasting impact in communities
              around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                icon={Heart}
                className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Make a Donation
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-secondary-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Become a Sponsor
              </Button>
            </div>
          </motion.div>
        </div>
      </AccessibleSection>
    </div>
  );
};

export default Programs;
