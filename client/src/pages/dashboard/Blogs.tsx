import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import {
  fetchBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../../services/blogsApi';
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
  console.log('blogs data:', data);
  console.log('blogs error:', error);
  const blogs: Blog[] = data || [];

  // حالة النافذة المنبثقة (للتطوير لاحقًا)
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');

  // حالة النموذج
  const [form, setForm] = useState({
    title: '',
    content: '',
    author: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [modalMsg, setModalMsg] = useState('');

  // تعبئة النموذج عند التعديل
  useEffect(() => {
    if (modalType === 'edit' && selectedBlog) {
      setForm({
        title: selectedBlog.title || '',
        content: selectedBlog.content || '',
        author: selectedBlog.author || '',
        image_url: selectedBlog.image_url || '',
      });
    } else if (modalType === 'add') {
      setForm({ title: '', content: '', author: '', image_url: '' });
    }
  }, [modalType, selectedBlog]);

  // إضافة أو تعديل مقالة
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      if (modalType === 'add') {
        await createBlog(form);
        setModalMsg(
          `✅ تم إنشاء المقالة "${form.title}" بنجاح! 🎉\n\n` +
            `📅 التاريخ: ${new Date().toLocaleDateString('en-US')}\n` +
            `✍️ الكاتب: ${form.author || 'غير محدد'}\n` +
            `📝 المحتوى: ${form.content.length} حرف`
        );
      } else if (modalType === 'edit' && selectedBlog) {
        await updateBlog(selectedBlog.id, form);
        setModalMsg(
          `✅ تم تحديث المقالة "${form.title}" بنجاح! 🔄\n\n` +
            `📅 آخر تحديث: ${new Date().toLocaleDateString('en-US')}\n` +
            `✍️ الكاتب: ${form.author || 'غير محدد'}\n` +
            `📝 المحتوى: ${form.content.length} حرف`
        );
      }
      setModalOpen(false);
      refetch();
    } catch (err: any) {
      console.error('❌ خطأ في حفظ المقالة:', err);
      let errorMessage = 'حدث خطأ أثناء حفظ البيانات';
      if (err.response?.status === 400) {
        errorMessage =
          '❌ بيانات غير صحيحة:\n' +
          (err.response.data?.message || 'يرجى التحقق من جميع الحقول المطلوبة');
      } else if (err.response?.status === 401) {
        errorMessage =
          '❌ غير مصرح لك بإجراء هذا الإجراء\nيرجى تسجيل الدخول مرة أخرى';
      } else if (err.response?.status === 404) {
        errorMessage = '❌ المقالة غير موجودة\nربما تم حذفها من قبل';
      } else if (err.response?.status === 500) {
        errorMessage = '❌ خطأ في الخادم\nيرجى المحاولة مرة أخرى لاحقاً';
      } else if (err.message?.includes('Network Error')) {
        errorMessage = '❌ مشكلة في الاتصال\nيرجى التحقق من اتصال الإنترنت';
      } else if (err.message?.includes('timeout')) {
        errorMessage = '❌ انتهت مهلة الطلب\nيرجى المحاولة مرة أخرى';
      }
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // حذف مقالة
  const handleDelete = async (id: number) => {
    const blogToDelete = blogs.find((blog) => blog.id === id);
    const blogTitle = blogToDelete?.title || 'المقالة';

    if (
      window.confirm(
        `🗑️ هل أنت متأكد من حذف المقالة "${blogTitle}"؟\n\n` +
          `⚠️ هذا الإجراء لا يمكن التراجع عنه\n` +
          `📊 سيتم حذف جميع البيانات المرتبطة بالمقالة`
      )
    ) {
      setLoading(true);
      try {
        await deleteBlog(id);
        refetch();
        setModalMsg(
          `✅ تم حذف المقالة "${blogTitle}" بنجاح! 🗑️\n\n` +
            `📅 تاريخ الحذف: ${new Date().toLocaleDateString('en-US')}\n` +
            `📊 تم حذف جميع البيانات المرتبطة بالمقالة`
        );
      } catch (err: any) {
        console.error('❌ خطأ في حذف المقالة:', err);
        let errorMessage = 'حدث خطأ أثناء حذف المقالة';
        if (err.response?.status === 404) {
          errorMessage = `❌ المقالة "${blogTitle}" غير موجودة\nربما تم حذفها من قبل`;
        } else if (err.response?.status === 401) {
          errorMessage =
            '❌ غير مصرح لك بحذف المقالات\nيرجى تسجيل الدخول مرة أخرى';
        } else if (err.response?.status === 500) {
          errorMessage = '❌ خطأ في الخادم\nيرجى المحاولة مرة أخرى لاحقاً';
        } else if (err.message?.includes('Network Error')) {
          errorMessage = '❌ مشكلة في الاتصال\nيرجى التحقق من اتصال الإنترنت';
        }
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

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
                      onClick={() => handleDelete(blog.id)}
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
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={
            modalType === 'add'
              ? 'إضافة مقالة'
              : modalType === 'edit'
              ? 'تعديل مقالة'
              : 'تفاصيل المقالة'
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="العنوان"
              className="w-full border rounded p-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="اسم الكاتب"
              className="w-full border rounded p-2"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
            />
            <input
              type="text"
              placeholder="رابط الصورة (اختياري)"
              className="w-full border rounded p-2"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            />
            <textarea
              placeholder="المحتوى"
              className="w-full border rounded p-2 min-h-[120px]"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
            {errorMsg && <div className="text-red-600 text-sm">{errorMsg}</div>}
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" loading={loading}>
                {modalType === 'add' ? 'إضافة' : 'حفظ التعديلات'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Success Message Modal */}
        <Modal
          open={!!modalMsg}
          onClose={() => setModalMsg('')}
          title="نجح العملية! 🎉"
        >
          <div className="text-center py-6">
            <div className="text-success-600 text-lg mb-6 whitespace-pre-line">
              {modalMsg}
            </div>
            <div className="flex justify-center gap-3">
              <Button
                onClick={() => setModalMsg('')}
                variant="primary"
                className="px-6"
              >
                تم
              </Button>
              <Button
                onClick={() => {
                  setModalMsg('');
                  setModalOpen(false);
                }}
                variant="outline"
                className="px-6"
              >
                إغلاق النافذة
              </Button>
            </div>
          </div>
        </Modal>
      </section>
    </DashboardLayout>
  );
};

export default BlogsDashboard;
