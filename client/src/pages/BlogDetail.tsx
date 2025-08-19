import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBlogById, fetchRelatedBlogs } from '../services/blogsApi';
import UnifiedLoader from '../components/common/UnifiedLoader';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import ShareButtons from '../components/common/ShareButtons';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Bookmark,
  ArrowUp,
} from 'lucide-react';
import LazyImage from '../components/common/LazyImage';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';

const BlogDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [readingProgress, setReadingProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

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
  const blog = data?.data || data;
  console.log('📋 المدونة المعالجة:', blog);
  console.log('📋 المقالات ذات الصلة:', relatedBlogs);
  const isRTL = i18n.dir() === 'rtl';

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return <UnifiedLoader type="centered" message="جاري تحميل المقال..." />;
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert
          type="error"
          message="حدث خطأ أثناء تحميل المقال"
          onClose={() => window.history.back()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Reading Progress Bar */}
      <div className="reading-progress">
        <div
          className="reading-progress-bar"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <SEO
        title={blog.title}
        description={blog.excerpt || blog.content?.substring(0, 160)}
        image={blog.image}
        url={`/blogs/${blog.id}`}
        type="article"
        author={blog.author || 'شبابنا العالمية'}
        publishedTime={blog.created_at}
        modifiedTime={blog.updated_at}
        section="المدونة"
        tags={blog.tags || []}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-20">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2 text-blue-200 mb-4">
              <span className="text-2xl">📝</span>
              <span className="text-sm font-medium">مقال</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-blue-200">
              <span>بواسطة {blog.author || 'شبابنا العالمية'}</span>
              <span>•</span>
              <span>
                {new Date(blog.created_at).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-2">
            {/* Article Image */}
            {blog.image && (
              <div className="mb-8">
                <LazyImage
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Article Meta */}
            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="author-avatar">
                  {blog.author?.charAt(0) || 'ش'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {blog.author || 'شبابنا العالمية'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(blog.created_at).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-full transition-colors ${
                    isLiked
                      ? 'text-red-500 bg-red-50'
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
                  />
                </button>
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-full transition-colors ${
                    isBookmarked
                      ? 'text-blue-500 bg-blue-50'
                      : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <Bookmark
                    className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`}
                  />
                </button>
                <ShareButtons
                  variant="icon"
                  size="sm"
                  title={blog.title}
                  description={blog.excerpt || blog.content?.substring(0, 160)}
                  image={blog.image}
                  url={`${window.location.origin}/blogs/${blog.id}`}
                />
              </div>
            </div>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none">
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(blog.content || ''),
                }}
              />
            </article>

            {/* Article Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">العلامات:</h3>
                <div className="article-tags">
                  {blog.tags.map((tag: string, index: number) => (
                    <span key={index} className="article-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Share Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">مشاركة المقال</h3>
              <div className="space-y-3">
                <ShareButtons
                  variant="button"
                  size="sm"
                  title={blog.title}
                  description={blog.excerpt || blog.content?.substring(0, 160)}
                  image={blog.image}
                  url={`${window.location.origin}/blogs/${blog.id}`}
                  className="w-full"
                />
              </div>
            </div>

            {/* Related Articles */}
            {relatedBlogs && relatedBlogs.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">مقالات ذات صلة</h3>
                <div className="space-y-4">
                  {relatedBlogs.map((relatedBlog: any) => (
                    <Link
                      key={relatedBlog.id}
                      to={`/blogs/${relatedBlog.id}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        {relatedBlog.image && (
                          <img
                            src={relatedBlog.image}
                            alt={relatedBlog.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {relatedBlog.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(
                              relatedBlog.created_at
                            ).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="floating-actions">
        <button onClick={handleLike} className="floating-action-btn">
          <Heart
            className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : ''}`}
          />
        </button>
        <button onClick={handleBookmark} className="floating-action-btn">
          <Bookmark
            className={`w-5 h-5 ${
              isBookmarked ? 'text-blue-500 fill-current' : ''
            }`}
          />
        </button>
        <ShareButtons
          variant="floating"
          size="md"
          title={blog.title}
          description={blog.excerpt || blog.content?.substring(0, 160)}
          image={blog.image}
          url={`${window.location.origin}/blogs/${blog.id}`}
        />
        <button onClick={scrollToTop} className="floating-action-btn">
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default BlogDetail;
