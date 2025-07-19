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

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery(['blog', id], () =>
    fetchBlogById(id!)
  );
  const blog = data?.data;

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
        <Alert type="error">حدث خطأ أو لم يتم العثور على التدوينة.</Alert>
        <Link to="/blogs" className="mt-6">
          <Button variant="primary" icon={ArrowLeft}>
            العودة للمدونة
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="py-12 min-h-screen bg-white" dir="rtl">
      <div className="max-w-3xl mx-auto px-4">
        {blog.image_url && (
          <LazyImage
            src={blog.image_url}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        )}
        <h1 className="text-3xl font-bold text-primary-700 mb-4 line-clamp-2">
          {blog.title}
        </h1>
        <div className="text-sm text-gray-500 mb-6">
          بواسطة {blog.author} -{' '}
          {blog.created_at
            ? new Date(blog.created_at).toLocaleDateString('ar-EG')
            : ''}
        </div>
        <div className="prose prose-lg max-w-none text-gray-800" dir="auto">
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.content),
            }}
          />
        </div>
        <div className="mt-8">
          <Link to="/blogs">
            <Button variant="outline" icon={ArrowLeft}>
              العودة للمدونة
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogDetail;
