import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchBlogs } from '../../services/blogsApi';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { Link } from 'react-router-dom';
import { Blog } from '../../types';

const BlogsDashboard: React.FC = () => {
  const { data, isLoading, error, refetch } = useQuery(
    ['dashboard-blogs'],
    fetchBlogs
  );
  const blogs: Blog[] = data || [];

  // حالة النافذة المنبثقة (للتطوير لاحقًا)
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');

  return (
    <DashboardLayout>
      <section className="py-8 px-4" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-primary-700">
            إدارة المقالات
          </h1>
          <Button
            onClick={() => {
              setModalType('add');
              setSelectedBlog(null);
              setModalOpen(true);
            }}
          >
            إضافة مقالة جديدة
          </Button>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <Alert type="error">
            حدث خطأ أثناء جلب المقالات. يرجى المحاولة لاحقًا.
          </Alert>
        ) : blogs.length === 0 ? (
          <Alert type="info">لا توجد مقالات متاحة حالياً.</Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <Card key={blog.id} className="flex flex-col gap-2">
                {blog.image_url && (
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="w-full h-40 object-cover rounded-t-lg mb-2"
                    loading="lazy"
                  />
                )}
                <div className="flex flex-col gap-1 p-2">
                  <h2 className="text-lg font-bold text-primary-700 mb-1 line-clamp-2">
                    {blog.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <span>
                      بواسطة {blog.author_name || `#${blog.author_id}`}
                    </span>
                    <span>•</span>
                    <span>
                      {blog.created_at
                        ? new Date(blog.created_at).toLocaleDateString('ar-EG')
                        : ''}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2 line-clamp-3">
                    {blog.content?.slice(0, 100) || ''}
                    {blog.content?.length > 100 ? '...' : ''}
                  </p>
                  <div className="flex gap-2 mt-auto">
                    <Link to={`/blogs/${blog.id}`}>
                      <Button size="sm" variant="outline">
                        عرض
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setModalType('edit');
                        setSelectedBlog(blog);
                        setModalOpen(true);
                      }}
                    >
                      تعديل
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      color="red"
                      onClick={() => {
                        /* حذف لاحقًا */
                      }}
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        {/* نافذة منبثقة لإضافة/تعديل المقالة (للتطوير لاحقًا) */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={
            modalType === 'add'
              ? 'إضافة مقالة'
              : modalType === 'edit'
              ? 'تعديل مقالة'
              : 'تفاصيل المقالة'
          }
        >
          <div className="text-center text-gray-500 py-8">
            نموذج إضافة/تعديل المقالة قيد التطوير...
          </div>
        </Modal>
      </section>
    </DashboardLayout>
  );
};

export default BlogsDashboard;
