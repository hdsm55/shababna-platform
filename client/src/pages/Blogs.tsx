import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBlogs } from '../services/blogsApi';
import { Card } from '../components/ui/Card/Card';
import Alert from '../components/common/Alert';
import { Button } from '../components/ui/Button/Button';
import SEO from '../components/common/SEO';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import LazyImage from '../components/common/LazyImage';
import { useRef, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { Input } from '../components/ui/Input/Input';
import Skeleton from '../components/common/Skeleton';

const Blogs: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading, error } = useQuery(['blogs', debouncedSearch], () =>
    fetchBlogs(debouncedSearch ? { search: debouncedSearch } : {})
  );
  const blogs = data || [];
  const isRTL = i18n.dir() === 'rtl';

  return (
    <section
      className="py-12 min-h-screen bg-neutral-50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SEO
        title={t('blogs.title', 'المدونة')}
        description={t('blogs.subtitle', 'أحدث المقالات والتدوينات من شبابنا')}
        type="website"
      />
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary-700 mb-8 text-center">
          {t('blogs.title', 'المدونة')}
        </h1>
        <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
          <div className="relative w-full max-w-md">
            <Input
              ref={inputRef}
              type="text"
              placeholder={t('common.search', 'بحث')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
              fullWidth
            />
            {isLoading && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 rtl:left-3 rtl:right-auto">
                <LoadingSpinner size="sm" />
              </span>
            )}
          </div>
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
        ) : !Array.isArray(blogs) || blogs.length === 0 ? (
          <Alert type="info">
            {t('blogs.empty', 'لا توجد تدوينات متاحة حالياً.')}
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog: any) => (
              <Card
                key={blog.id}
                variant="default"
                padding="md"
                className="flex flex-col gap-4"
              >
                {blog.image_url && (
                  <LazyImage
                    src={blog.image_url}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <div className="flex-1 flex flex-col">
                  <h2 className="text-xl font-bold text-primary-700 mb-2 line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-neutral-600 mb-4 line-clamp-3" dir="auto">
                    {blog.content?.slice(0, 120) || ''}
                    {blog.content?.length > 120 ? '...' : ''}
                  </p>
                  <div className="flex items-center justify-between mt-auto text-xs text-neutral-500">
                    <span>
                      {t('blogs.by', 'بواسطة')}{' '}
                      {blog.author_name || `#${blog.author_id}`}
                    </span>
                    <span aria-label={t('blogs.date', 'تاريخ النشر')}>
                      {blog.created_at
                        ? new Date(blog.created_at).toLocaleDateString(
                            i18n.language === 'ar' ? 'ar-EG' : 'en-US'
                          )
                        : ''}
                    </span>
                  </div>
                  <a href={`/blogs/${blog.id}`} className="mt-4">
                    <Button size="sm" variant="outline">
                      {t('blogs.readMore', 'اقرأ المزيد')}
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blogs;
