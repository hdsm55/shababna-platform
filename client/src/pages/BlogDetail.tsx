import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBlogById, fetchRelatedBlogs } from '../services/blogsApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import { ArrowLeft, Share2, Heart, Bookmark, ArrowUp } from 'lucide-react';
import SmartImage from '../components/common/SmartImage';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';

const BlogDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [readingProgress, setReadingProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => fetchBlogById(id!),
    retry: 3,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // جلب المقالات ذات الصلة
  const { data: relatedBlogs, isLoading: relatedLoading } = useQuery({
    queryKey: ['related-blogs', id],
    queryFn: () => fetchRelatedBlogs(id!, 3),
    enabled: !!id && !!data,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 دقائق
  });

  console.log('🔍 بيانات المدونة:', data);
  const blog = data;
  console.log('📋 المدونة المعالجة:', blog);
  console.log('📋 المقالات ذات الصلة:', relatedBlogs);

  // Reading progress tracking
  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  // Share functionality
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
      setShowShareModal(true);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically make an API call to update the like status
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically make an API call to update the bookmark status
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <SEO
        title={blog.title}
        description={blog.content?.slice(0, 120)}
        type="article"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-20">
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
            <div className="flex items-center justify-center gap-2 text-blue-200 mb-4">
              <span className="text-sm font-medium">مقال</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-blue-200">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {blog.author?.charAt(0) || 'ش'}
                </span>
                <span>{blog.author || 'فريق شبابنا'}</span>
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
              {/* Reading Time Estimate */}
              <div className="flex items-center gap-4 text-gray-500 mb-8 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {Math.ceil((blog.content?.length || 0) / 200)} دقيقة قراءة
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">مشاهدات</span>
                </div>
              </div>

              {/* Article Body */}
              <div
                className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                dir="auto"
              >
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(blog.content),
                  }}
                />
              </div>

              {/* Article Footer */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">مفيد</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">تعليقات</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">مشاركة</span>
                    </div>
                  </div>

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
                      className="flex items-center gap-2"
                    >
                      مشاركة المقال
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Articles Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              مقالات ذات صلة
            </h2>

            {relatedLoading ? (
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            ) : relatedBlogs && relatedBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    key={relatedBlog.id}
                    to={`/blogs/${relatedBlog.id}`}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1"
                  >
                    <div className="h-48 overflow-hidden">
                      <SmartImage
                        src={relatedBlog.image_url}
                        alt={relatedBlog.title}
                        type="blog"
                        className="w-full h-full"
                        size="md"
                      />
                    </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg mb-2 text-gray-900 hover:text-blue-600 transition-colors">
                          {relatedBlog.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {relatedBlog.content?.slice(0, 100)}...
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{relatedBlog.author || 'فريق شبابنا'}</span>
                          <span>
                            {relatedBlog.created_at
                              ? new Date(
                                  relatedBlog.created_at
                                ).toLocaleDateString(
                                  i18n.language === 'ar' ? 'ar-EG' : 'en-US',
                                  {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  }
                                )
                              : ''}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>لا توجد مقالات ذات صلة متاحة حالياً</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reading Progress Bar */}
      <div className="reading-progress">
        <div
          className="reading-progress-bar"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      {/* Floating Action Buttons */}
      <div className="floating-actions">
        <button
          onClick={handleLike}
          className={`floating-action-btn ${isLiked ? 'text-red-500' : ''}`}
          title="إعجاب"
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={handleBookmark}
          className={`floating-action-btn ${
            isBookmarked ? 'text-blue-500' : ''
          }`}
          title="حفظ"
        >
          <Bookmark
            className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`}
          />
        </button>

        <button
          onClick={handleShare}
          className="floating-action-btn"
          title="مشاركة"
        >
          <Share2 className="w-5 h-5" />
        </button>

        <button
          onClick={scrollToTop}
          className="floating-action-btn"
          title="العودة للأعلى"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4">مشاركة المقال</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      window.location.href
                    )}`,
                    '_blank'
                  );
                  setShowShareModal(false);
                }}
                className="share-btn share-btn-facebook w-full"
              >
                مشاركة على فيسبوك
              </button>
              <button
                onClick={() => {
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      blog?.title
                    )}&url=${encodeURIComponent(window.location.href)}`,
                    '_blank'
                  );
                  setShowShareModal(false);
                }}
                className="share-btn share-btn-twitter w-full"
              >
                مشاركة على تويتر
              </button>
              <button
                onClick={() => {
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      window.location.href
                    )}`,
                    '_blank'
                  );
                  setShowShareModal(false);
                }}
                className="share-btn share-btn-linkedin w-full"
              >
                مشاركة على لينكد إن
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShowShareModal(false);
                  // You could show a toast notification here
                }}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                نسخ الرابط
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
