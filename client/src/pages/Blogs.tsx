import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBlogs } from '../services/blogsApi';
import { Card } from '../components/ui/Card/Card';
import Alert from '../components/common/Alert';
import { Button } from '../components/ui/Button/ButtonSimple';
import SEO from '../components/common/SEO';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import SmartImage from '../components/common/SmartImage';
import { useDebounce } from '../hooks/useDebounce';
import { Input } from '../components/ui/Input/Input';
import { Skeleton } from '../components/common/Skeleton';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Blogs: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ['blogs', debouncedSearch],
    queryFn: () =>
      fetchBlogs(debouncedSearch ? { search: debouncedSearch } : {}),
  });
  const blogs = data || [];
  const isRTL = i18n.dir() === 'rtl';

  return (
    <section
      className="page-container py-12 bg-neutral-50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SEO
        title={t('blogs.title', 'المدونة')}
        description={t('blogs.subtitle', 'أحدث المقالات والتدوينات من شبابنا')}
        type="website"
      />
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-primary-700 drop-shadow-sm">
            {t('blogs.title', 'المدونة')}
          </h1>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full max-w-md"
          >
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
                <LoadingSpinner size="sm" />
              </span>
            )}
          </motion.div>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
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
              </div>
            ))}
          </div>
        ) : error ? (
          <Alert type="error">
            {t(
              'blogs.error',
              'حدث خطأ أثناء جلب التدوينات. يرجى المحاولة لاحقًا.'
            )}
          </Alert>
        ) : blogs.length === 0 ? (
          <Alert type="info">
            {t('blogs.empty', 'لا توجد تدوينات متاحة حالياً.')}
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog: any) => (
              <Card
                key={blog.id}
                variant="elevated"
                className="flex flex-col h-full shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="h-44 w-full rounded-lg overflow-hidden mb-4">
                  {blog.image_url ? (
                    <SmartImage
                      src={blog.image_url}
                      alt={blog.title}
                      type="blog"
                      className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                      size="sm"
                    />
                  ) : (
                    <SmartImage
                      src={null}
                      alt={blog.title}
                      type="blog"
                      className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                      size="sm"
                    />
                  )}
                </div>
                <h2 className="text-xl font-bold text-primary-800 mb-2 line-clamp-2">
                  {blog.title}
                </h2>
                <div className="text-sm text-neutral-600 mb-2 line-clamp-3">
                  {blog.content?.slice(0, 120) || ''}
                  {blog.content?.length > 120 ? '...' : ''}
                </div>
                <div className="flex items-center justify-between mt-auto text-xs text-neutral-500">
                  <span>
                    {t('blogs.by', 'بواسطة')} {blog.author || 'فريق شبابنا'}
                  </span>
                  <span aria-label={t('blogs.date', 'تاريخ النشر')}>
                    {blog.created_at
                      ? new Date(blog.created_at).toLocaleDateString(
                          i18n.language === 'ar' ? 'ar-EG' : 'en-US'
                        )
                      : ''}
                  </span>
                </div>
                <Link to={`/blogs/${blog.id}`} className="mt-4">
                  <Button size="sm" variant="primary" className="w-full">
                    {t('blogs.readMore', 'اقرأ المزيد')}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blogs;
