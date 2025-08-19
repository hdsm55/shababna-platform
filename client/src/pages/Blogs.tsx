import React, { useState, useRef, memo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBlogs } from '../services/blogsApi';
import { Card } from '../components/ui/Card/Card';
import { Alert } from '../components/common/AlertSimple';
import { Button } from '../components/ui/Button/ButtonSimple';
import SEO from '../components/common/SEO';
import UnifiedLoader from '../components/common/UnifiedLoader';
import { useTranslation } from 'react-i18next';
import LazyImage from '../components/common/LazyImage';
import { useDebounce } from '../hooks/useDebounce';
import { Input } from '../components/ui/Input/InputSimple';
import { Skeleton } from '../components/common/Skeleton';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, Eye, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// تحسين الأداء - مكونات منفصلة
const BlogsHeader = memo(() => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="text-center mb-12"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="inline-block"
      >
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-dark-500 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          {t('blogs.title', 'المدونة')}
        </h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-lg text-dark-400 max-w-2xl mx-auto leading-relaxed"
      >
        {t('blogs.subtitle', 'اكتشف أحدث المقالات والتدوينات من مجتمع شبابنا')}
      </motion.p>
    </motion.div>
  );
});

const SearchSection = memo(
  ({
    searchTerm,
    setSearchTerm,
    isLoading,
    inputRef,
  }: {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    isLoading: boolean;
    inputRef: React.RefObject<HTMLInputElement>;
  }) => {
    const { t } = useTranslation();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-10"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-primary-400" />
            </div>
            <Input
              ref={inputRef}
              type="text"
              placeholder={t('common.search', 'بحث عن مقال...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-10 py-3 bg-white border-primary-200 focus:border-primary-500 focus:ring-primary-500 shadow-sm"
              fullWidth
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {isLoading && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 rtl:left-3 rtl:right-auto">
                <UnifiedLoader type="inline" size="sm" />
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
);

const BlogCard = memo(({ blog, index }: { blog: any; index: number }) => {
  const { t, i18n } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="flex flex-col h-full shadow-brand-sm hover:shadow-brand-md transition-all duration-300 bg-gradient-to-br from-white via-primary-50/20 to-secondary-50/20 backdrop-blur-sm border border-primary-200">
        <div className="h-48 w-full rounded-lg overflow-hidden mb-4 bg-neutral-100 flex items-center justify-center">
          {blog.image_url ? (
            <LazyImage
              src={blog.image_url}
              alt={blog.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-4xl">
              <span>📝</span>
            </div>
          )}
        </div>

        <div className="flex-1 p-4">
          <h2 className="text-xl font-bold text-dark-500 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {blog.title}
          </h2>

          <div className="text-sm text-dark-400 mb-4 line-clamp-3 leading-relaxed">
            {blog.content?.slice(0, 120) || ''}
            {blog.content?.length > 120 ? '...' : ''}
          </div>

          <div className="flex items-center justify-between mb-4 text-xs text-dark-300">
            <div className="flex items-center gap-2">
              <User className="w-3 h-3" />
              <span>{blog.author || 'فريق شبابنا'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>
                {blog.created_at
                  ? new Date(blog.created_at).toLocaleDateString('en-US')
                  : ''}
              </span>
            </div>
          </div>

          <Link to={`/blogs/${blog.id}`} className="block">
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md group-hover:shadow-lg"
            >
              <span>{t('blogs.readMore', 'اقرأ المزيد')}</span>
              <ArrowRight className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
});

const LoadingSkeleton = memo(() => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * idx }}
          className="bg-white rounded-xl shadow p-6 flex flex-col gap-4"
        >
          <Skeleton height={180} className="w-full mb-4" />
          <Skeleton height={24} width="60%" />
          <Skeleton height={16} width="40%" />
          <Skeleton height={16} width="80%" />
          <div className="flex gap-2 mt-2">
            <Skeleton height={32} width={80} />
            <Skeleton height={32} width={80} />
          </div>
        </motion.div>
      ))}
    </div>
  );
});

const BlogsStats = memo(() => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: '📝',
      title: t('blogs.stats.articles', 'مقالات'),
      value: '50+',
    },
    {
      icon: '👥',
      title: t('blogs.stats.authors', 'كتّاب'),
      value: '15+',
    },
    {
      icon: '📅',
      title: t('blogs.stats.months', 'شهور'),
      value: '12+',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-12 mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group"
          >
            <div className="bg-white border border-primary-200 rounded-lg p-6 text-center hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <h3 className="text-2xl font-bold text-primary-600 mb-2">
                {stat.value}
              </h3>
              <p className="text-sm text-dark-400">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
});

const Blogs: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const inputRef = useRef<HTMLInputElement>(null);
  const isRTL = i18n.dir() === 'rtl';

  const { data, isLoading, error } = useQuery({
    queryKey: ['blogs', debouncedSearch],
    queryFn: () =>
      fetchBlogs(debouncedSearch ? { search: debouncedSearch } : {}),
  });

  const blogs = data || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-accent-200 rounded-full blur-2xl opacity-25" />
      </motion.div>

      <SEO
        title={t('blogs.pageTitle', 'المدونة - منصة شبابنا')}
        description={t(
          'blogs.pageDescription',
          'اكتشف أحدث المقالات والتدوينات من مجتمع شبابنا'
        )}
        type="website"
        keywords={['مدونة', 'مقالات', 'تدوينات', 'منصة شبابنا']}
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <section className="max-w-6xl mx-auto">
          <BlogsHeader />
          <BlogsStats />
          <SearchSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isLoading={isLoading}
            inputRef={inputRef}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center min-h-[60vh]"
              >
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                  <p className="text-gray-600 text-lg">جاري تحميل المدونة...</p>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Alert type="error">
                  {t(
                    'blogs.error',
                    'حدث خطأ أثناء جلب التدوينات. يرجى المحاولة لاحقًا.'
                  )}
                </Alert>
              </motion.div>
            ) : blogs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Alert type="info">
                  {t('blogs.empty', 'لا توجد تدوينات متاحة حالياً.')}
                </Alert>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog: any, index: number) => (
                  <BlogCard key={blog.id} blog={blog} index={index} />
                ))}
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Blogs;
