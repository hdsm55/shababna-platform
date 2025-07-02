import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
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

const Programs: React.FC = () => {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-secondary-50 via-white to-primary-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">
                  {t('programs.title')}
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
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
              <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent shadow-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => handleFilterChange(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedFilter === filter.key
                      ? 'bg-secondary-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-secondary-300'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
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
      </section>

      {/* Programs Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {programs.map((program: Program, index: number) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      hover
                      className="overflow-hidden h-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={
                            program.image ||
                            'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg'
                          }
                          alt={program.title}
                          className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-8">
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
                              // TODO: Navigate to program details
                              console.log('View program details:', program.id);
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
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {searchTerm || selectedFilter !== 'all'
                      ? 'No programs found matching your criteria.'
                      : 'No programs available at the moment.'}
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
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary-600 to-primary-600 relative overflow-hidden">
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
      </section>
    </div>
  );
};

export default Programs;
