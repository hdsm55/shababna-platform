import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBlogById } from '../services/blogsApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import { ArrowLeft } from 'lucide-react';
import LazyImage from '../components/common/LazyImage';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';

const BlogDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery(['blog', id], () =>
    fetchBlogById(id!)
  );
  const blog = data?.data;
  const isRTL = i18n.dir() === 'rtl';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Alert type="error">
          {t('blogs.error', 'حدث خطأ أو لم يتم العثور على التدوينة.')}
        </Alert>
        <Link to="/blogs" className="mt-6">
          <Button variant="primary" icon={ArrowLeft}>
            {t('blogs.back', 'العودة للمدونة')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <section
      className="py-12 min-h-screen bg-white"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SEO
        title={blog.title}
        description={blog.content?.slice(0, 120)}
        type="article"
      />
      <div className="max-w-3xl mx-auto px-4">
        {blog.image_url && (
          <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8 shadow-lg">
            <LazyImage
              src={blog.image_url}
              alt={blog.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary-800 mb-4 leading-tight drop-shadow-sm">
          {blog.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-neutral-500 mb-8">
          <span>
            {t('blogs.by', 'بواسطة')} {blog.author || 'فريق شبابنا'}
          </span>
          <span>•</span>
          <span>
            {blog.created_at
              ? new Date(blog.created_at).toLocaleDateString(
                  i18n.language === 'ar' ? 'ar-EG' : 'en-US'
                )
              : ''}
          </span>
        </div>
        <div
          className="prose prose-lg max-w-none text-gray-800 mb-12"
          dir="auto"
        >
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.content),
            }}
          />
        </div>
        <div className="mt-8 flex justify-end">
          <Link to="/blogs">
            <Button variant="outline">
              {t('blogs.back', 'العودة للمدونة')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogDetail;
