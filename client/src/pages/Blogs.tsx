import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBlogs } from '../services/blogsApi';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Alert from '../components/common/Alert';
import { Link } from 'react-router-dom';

const Blogs: React.FC = () => {
  const { data, isLoading, error } = useQuery(['blogs'], fetchBlogs);
  const blogs = data || [];

  return (
    <section className="py-12 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary-700 mb-8 text-center">
          المدونة
        </h1>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <Alert type="error">
            حدث خطأ أثناء جلب التدوينات. يرجى المحاولة لاحقًا.
          </Alert>
        ) : !Array.isArray(blogs) || blogs.length === 0 ? (
          <Alert type="info">لا توجد تدوينات متاحة حالياً.</Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog: any) => (
              <Card key={blog.id} className="flex flex-col gap-4">
                {blog.image_url && (
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                    loading="lazy"
                  />
                )}
                <div className="p-4 flex-1 flex flex-col" dir="rtl">
                  <h2 className="text-xl font-bold text-primary-700 mb-2 line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3" dir="auto">
                    {blog.content?.slice(0, 120) || ''}
                    {blog.content?.length > 120 ? '...' : ''}
                  </p>
                  <div className="flex items-center justify-between mt-auto text-xs text-gray-500">
                    <span>
                      بواسطة {blog.author_name || `#${blog.author_id}`}
                    </span>
                    <span aria-label="تاريخ النشر">
                      {blog.created_at
                        ? new Date(blog.created_at).toLocaleDateString('ar-EG')
                        : ''}
                    </span>
                  </div>
                  <Link
                    to={`/blogs/${blog.id}`}
                    className="text-primary-600 hover:underline text-sm font-medium mt-2"
                  >
                    اقرأ المزيد
                  </Link>
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
