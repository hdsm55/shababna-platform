import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBlogById, fetchRelatedBlogs } from '../services/blogsApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import { ArrowLeft, Share2, ArrowUp } from 'lucide-react';
import SmartImage from '../components/common/SmartImage';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';

const BlogDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => fetchBlogById(id!),
    retry: 3,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const blog = data;

  // إظهار زر العودة للأعلى عند التمرير
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // وظيفة مشاركة بسيطة
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.content?.slice(0, 100),
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // نسخ الرابط للمتصفحات التي لا تدعم المشاركة
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('تم نسخ رابط المقال!');
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  if (error || !blog) {
    console.error('❌ خطأ في تحميل المدونة:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      <SEO
        title={blog.title}
        description={blog.content?.slice(0, 120)}
        type="article"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="relative h-48 w-full max-w-2xl mx-auto mb-6 overflow-hidden rounded-2xl shadow-2xl">
              <SmartImage
                src={blog.image_url}
                alt={blog.title}
                type="blog"
                className="w-full h-full"
                size="md"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            <div className="flex items-center justify-center gap-2 text-primary-100 mb-4">
              <span className="text-sm font-medium">
                {t('blogs.type', 'مقال')}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-primary-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-sm font-bold">
                  {blog.author?.charAt(0) || 'ش'}
                </span>
                <span>
                  {blog.author || t('blogs.defaultAuthor', 'فريق شبابنا')}
                </span>
              </div>
              <span>•</span>
              <span>
                {blog.created_at
                  ? new Date(blog.created_at).toLocaleDateString(
                      i18n.language === 'ar' ? 'ar-EG' : 'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )
                  : ''}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Article Content */}
            <div className="p-8 md:p-12">
              {/* Article Body */}
              <div
                className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                dir="auto"
              >
                {blog.content ? (
                  <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(blog.content),
                    }}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      {t(
                        'blogs.noContent',
                        'لا يوجد محتوى متاح لهذه المقالة حالياً.'
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Article Footer */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex gap-3">
                    <Link to="/blogs">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        {t('blogs.back', 'العودة للمدونة')}
                      </Button>
                    </Link>
                    <Button
                      variant="primary"
                      onClick={handleShare}
                      className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700"
                    >
                      <Share2 className="w-4 h-4" />
                      مشاركة المقال
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* زر العودة للأعلى ثابت */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
          title="العودة للأعلى"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default BlogDetail;
