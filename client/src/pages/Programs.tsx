import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
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
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Skeleton } from '../components/ui/Skeleton';
import { QuickActions } from '../components/ui/QuickActions';
import { fetchPrograms } from '../services/programsApi';
import { Program, Pagination } from '../types';

const Programs: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const isRTL = i18n.dir() === 'rtl';

  // Define program categories based on our backend capabilities
  const filters = [
    { key: 'all', label: t('programs.filter.all') },
    { key: 'education', label: t('programs.filter.education') },
    { key: 'youth', label: t('programs.filter.youth') },
    { key: 'community', label: t('programs.filter.community') },
    { key: 'leadership', label: t('programs.filter.leadership') },
  ];

  // Query parameters aligned with backend API
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
    // isError,
  } = useQuery({
    queryKey: ['programs', queryParams],
    queryFn: () => fetchPrograms(queryParams),
  });

  const programs: Program[] = programsData?.data?.items || [];
  const pagination: Pagination | undefined = programsData?.data?.pagination;

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

  // Render program card with donation support
  const ProgramCard: React.FC<{ program: Program }> = ({ program }) => {
    return (
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        {/* Removed image_url usage as it's not defined in Program type */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {t(`programs.categories.${program.category}`)}
            </span>
            {/* Removed is_featured badge as it's not defined in Program type */}
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {program.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-2">
            {program.description}
          </p>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="sm"
                icon={ArrowRight}
                iconPosition="right"
                className="flex-1 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                onClick={() => {
                  navigate(`/programs/${program.id}`);
                }}
              >
                {t('programs.learnMore')}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-neutral">
      {/* SEO component removed due to missing import */}
      {/* Header Section */}
      <SectionTitle
        title={t('programs.title')}
        description={t('programs.subtitle')}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="text-center mt-10"
      />
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto my-8">
        <Input
          type="text"
          placeholder={t('common.search')}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          icon={<Search />}
          dir={isRTL ? 'rtl' : 'ltr'}
          className="flex-1"
        />
        <QuickActions dir={isRTL ? 'rtl' : 'ltr'}>
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={selectedFilter === filter.key ? 'primary' : 'outline'}
              onClick={() => handleFilterChange(filter.key)}
            >
              {filter.label}
            </Button>
          ))}
        </QuickActions>
      </div>
      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto my-8">
        {[
          {
            number: programs.length.toString(),
            label: t('programs.stats.total'),
            icon: Target,
          },
          {
            number: programs
              .filter((p: Program) => (p.registrations?.length ?? 0) > 0)
              .length.toString(),
            label: t('programs.stats.funded'),
            icon: Heart,
          },
          {
            number: programs
              .filter((p: Program) => p.category === 'education')
              .length.toString(),
            label: t('programs.stats.education'),
            icon: Users,
          },
          {
            number: programs
              .filter((p: Program) => p.category === 'media')
              .length.toString(),
            label: t('programs.stats.media'),
            icon: Clock,
          },
        ].map((stat, idx) => (
          <Card key={idx} variant="elevated" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl text-primary">
                {React.createElement(stat.icon)}
              </span>
              <span className="text-2xl font-bold">{stat.number}</span>
            </div>
            <div className="text-lg font-semibold mb-1">{stat.label}</div>
          </Card>
        ))}
      </div>
      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto my-8">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} height={220} />
          ))
        ) : programs.length === 0 ? (
          <Alert variant="info">{t('programs.empty')}</Alert>
        ) : (
          programs.map((program: Program) => (
            <ProgramCard key={program.id} program={program} />
          ))
        )}
      </div>
      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center my-8 gap-2">
          {Array.from({ length: pagination.totalPages }).map((_, idx) => (
            <Button
              key={idx}
              variant={
                pagination.currentPage === idx + 1 ? 'primary' : 'outline'
              }
              onClick={() => handlePageChange(idx + 1)}
            >
              {idx + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Programs;
