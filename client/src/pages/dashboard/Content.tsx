import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchContent } from '../../services/dashboardApi';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import {
  AccessibleSection,
  SkipToContent,
} from '../../components/common/AccessibleComponents';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import Input from '../../components/common/Input';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Trash2,
  FileText,
  Image,
  Video,
  File,
  Calendar,
  User,
  Tag,
  Globe,
  Lock,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Download,
  Upload,
  Copy,
  Share,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  Newspaper,
  FileImage,
  FileVideo,
  FileAudio,
  Archive,
  Settings,
  EyeOff,
  Eye as EyeIcon,
} from 'lucide-react';

interface Content {
  id: string;
  title: string;
  type: 'article' | 'image' | 'video' | 'document' | 'audio';
  category: 'news' | 'events' | 'programs' | 'resources' | 'gallery';
  status: 'published' | 'draft' | 'archived' | 'pending';
  author: string;
  publishDate: string;
  lastModified: string;
  views: number;
  likes: number;
  shares: number;
  tags: string[];
  description: string;
  content: string;
  thumbnail?: string;
  fileSize?: number;
  duration?: number;
  language: 'ar' | 'en' | 'tr';
  isPublic: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

const ContentDashboard: React.FC = () => {
  // جلب قائمة المحتوى
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-content'],
    queryFn: () => fetchContent(),
  });

  // حالة النافذة المنبثقة
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');

  // حالة الفلترة والبحث
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // نموذج البيانات
  const [form, setForm] = useState({
    title: '',
    type: '',
    category: '',
    description: '',
    content: '',
    tags: '',
    language: 'ar',
    isPublic: true,
    isFeatured: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });
  const [formError, setFormError] = useState('');

  // بيانات افتراضية للمحتوى
  const mockContent: Content[] = [
    {
      id: '1',
      title: 'ملتقى الشباب العربي 2024',
      type: 'article',
      category: 'events',
      status: 'published',
      author: 'أحمد محمد',
      publishDate: '2024-06-01T10:30:00Z',
      lastModified: '2024-06-01T10:30:00Z',
      views: 1250,
      likes: 89,
      shares: 45,
      tags: ['شباب', 'ملتقى', 'عربي'],
      description: 'ملتقى سنوي يجمع الشباب العربي لمناقشة القضايا المعاصرة',
      content: 'محتوى تفصيلي عن الملتقى...',
      language: 'ar',
      isPublic: true,
      isFeatured: true,
      seoTitle: 'ملتقى الشباب العربي 2024 - شبابنا',
      seoDescription: 'ملتقى سنوي يجمع الشباب العربي لمناقشة القضايا المعاصرة',
      seoKeywords: ['شباب', 'ملتقى', 'عربي', '2024'],
    },
    {
      id: '2',
      title: 'ورشة التطوير المهني',
      type: 'video',
      category: 'programs',
      status: 'published',
      author: 'فاطمة علي',
      publishDate: '2024-05-30T14:20:00Z',
      lastModified: '2024-05-30T14:20:00Z',
      views: 890,
      likes: 67,
      shares: 23,
      tags: ['تطوير', 'مهني', 'ورشة'],
      description: 'ورشة تدريبية حول التطوير المهني للشباب',
      content: 'فيديو الورشة...',
      thumbnail: '/thumbnails/workshop.jpg',
      duration: 120,
      language: 'ar',
      isPublic: true,
      isFeatured: false,
    },
    {
      id: '3',
      title: 'معرض الصور - فعالية الشباب',
      type: 'image',
      category: 'gallery',
      status: 'published',
      author: 'عمر خالد',
      publishDate: '2024-05-29T09:15:00Z',
      lastModified: '2024-05-29T09:15:00Z',
      views: 650,
      likes: 45,
      shares: 12,
      tags: ['معرض', 'صور', 'فعالية'],
      description: 'معرض صور من فعالية الشباب الأخيرة',
      content: 'مجموعة من الصور...',
      thumbnail: '/thumbnails/gallery.jpg',
      fileSize: 2048,
      language: 'ar',
      isPublic: true,
      isFeatured: false,
    },
    {
      id: '4',
      title: 'دليل البرامج التعليمية',
      type: 'document',
      category: 'resources',
      status: 'draft',
      author: 'سارة أحمد',
      publishDate: '2024-05-28T16:45:00Z',
      lastModified: '2024-05-28T16:45:00Z',
      views: 0,
      likes: 0,
      shares: 0,
      tags: ['دليل', 'برامج', 'تعليمية'],
      description: 'دليل شامل للبرامج التعليمية المتاحة',
      content: 'محتوى الدليل...',
      fileSize: 5120,
      language: 'ar',
      isPublic: false,
      isFeatured: false,
    },
    {
      id: '5',
      title: 'بودكاست الشباب والتطوع',
      type: 'audio',
      category: 'programs',
      status: 'pending',
      author: 'يوسف عبدالله',
      publishDate: '2024-05-27T11:30:00Z',
      lastModified: '2024-05-27T11:30:00Z',
      views: 0,
      likes: 0,
      shares: 0,
      tags: ['بودكاست', 'شباب', 'تطوع'],
      description: 'بودكاست عن دور الشباب في التطوع المجتمعي',
      content: 'ملف صوتي...',
      duration: 1800,
      language: 'ar',
      isPublic: true,
      isFeatured: false,
    },
  ];

  const content = data?.data?.items || mockContent;

  // فلترة المحتوى
  const filteredContent = content.filter((item: any) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag: string) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesCategory =
      categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  const handleOpenModal = (
    type: 'add' | 'edit' | 'view',
    content?: Content
  ) => {
    setModalType(type);
    setFormError('');

    if (type === 'add') {
      setForm({
        title: '',
        type: '',
        category: '',
        description: '',
        content: '',
        tags: '',
        language: 'ar',
        isPublic: true,
        isFeatured: false,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
      });
      setSelectedContent(null);
    } else if (content) {
      setSelectedContent(content);
      setForm({
        title: content.title,
        type: content.type,
        category: content.category,
        description: content.description,
        content: content.content,
        tags: content.tags.join(', '),
        language: content.language,
        isPublic: content.isPublic,
        isFeatured: content.isFeatured,
        seoTitle: content.seoTitle || '',
        seoDescription: content.seoDescription || '',
        seoKeywords: content.seoKeywords?.join(', ') || '',
      });
    }

    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedContent(null);
    setFormError('');
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.type || !form.category || !form.description) {
      setFormError('الحقول الأساسية مطلوبة');
      return;
    }
    // هنا سيتم الربط مع API لاحقًا
    console.log('Form submitted:', form);
    setModalOpen(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return FileText;
      case 'image':
        return Image;
      case 'video':
        return Video;
      case 'document':
        return File;
      case 'audio':
        return FileAudio;
      default:
        return FileText;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'article':
        return 'مقال';
      case 'image':
        return 'صورة';
      case 'video':
        return 'فيديو';
      case 'document':
        return 'مستند';
      case 'audio':
        return 'صوتي';
      default:
        return 'غير محدد';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'news':
        return 'أخبار';
      case 'events':
        return 'فعاليات';
      case 'programs':
        return 'برامج';
      case 'resources':
        return 'موارد';
      case 'gallery':
        return 'معرض';
      default:
        return 'غير محدد';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'منشور';
      case 'draft':
        return 'مسودة';
      case 'archived':
        return 'مؤرشف';
      case 'pending':
        return 'قيد المراجعة';
      default:
        return 'غير محدد';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <DashboardLayout>
        <SkipToContent />
        <AccessibleSection>
          <Alert type="error" title="خطأ في تحميل البيانات">
            حدث خطأ أثناء جلب قائمة المحتوى. يرجى المحاولة مرة أخرى.
          </Alert>
        </AccessibleSection>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SkipToContent />

      <AccessibleSection>
        <div className="max-w-7xl mx-auto py-6 px-2 sm:px-4 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                إدارة المحتوى
              </h1>
              <p className="text-gray-600">إدارة وتنظيم جميع أنواع المحتوى</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" icon={Upload} aria-label="رفع ملفات">
                رفع ملفات
              </Button>
              <Button
                onClick={() => handleOpenModal('add')}
                aria-label="إضافة محتوى جديد"
                icon={Plus}
              >
                إضافة محتوى
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="البحث في المحتوى..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rtl:pr-10 rtl:pl-4"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  icon={Filter}
                >
                  الفلاتر
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setTypeFilter('all');
                    setCategoryFilter('all');
                    setStatusFilter('all');
                  }}
                >
                  إعادة تعيين
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      النوع
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">جميع الأنواع</option>
                      <option value="article">مقال</option>
                      <option value="image">صورة</option>
                      <option value="video">فيديو</option>
                      <option value="document">مستند</option>
                      <option value="audio">صوتي</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الفئة
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">جميع الفئات</option>
                      <option value="news">أخبار</option>
                      <option value="events">فعاليات</option>
                      <option value="programs">برامج</option>
                      <option value="resources">موارد</option>
                      <option value="gallery">معرض</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الحالة
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="published">منشور</option>
                      <option value="draft">مسودة</option>
                      <option value="archived">مؤرشف</option>
                      <option value="pending">قيد المراجعة</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الترتيب
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="newest">الأحدث</option>
                      <option value="oldest">الأقدم</option>
                      <option value="title">العنوان</option>
                      <option value="views">المشاهدات</option>
                      <option value="likes">الإعجابات</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Content Grid */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((item: any) => {
                const TypeIcon = getTypeIcon(item.type);
                return (
                  <Card
                    key={item.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <TypeIcon className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item.author}
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`خيارات محتوى ${item.title}`}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Status and Type Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {getStatusText(item.status)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {getTypeText(item.type)}
                        </span>
                      </div>

                      {/* Description */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.tags
                          .slice(0, 3)
                          .map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        {item.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4 text-center text-sm">
                        <div>
                          <div className="flex items-center justify-center text-blue-600 mb-1">
                            <Eye className="w-4 h-4" />
                          </div>
                          <div className="font-medium text-gray-900">
                            {item.views}
                          </div>
                          <div className="text-xs text-gray-500">مشاهدة</div>
                        </div>
                        <div>
                          <div className="flex items-center justify-center text-red-600 mb-1">
                            <Heart className="w-4 h-4" />
                          </div>
                          <div className="font-medium text-gray-900">
                            {item.likes}
                          </div>
                          <div className="text-xs text-gray-500">إعجاب</div>
                        </div>
                        <div>
                          <div className="flex items-center justify-center text-green-600 mb-1">
                            <Share className="w-4 h-4" />
                          </div>
                          <div className="font-medium text-gray-900">
                            {item.shares}
                          </div>
                          <div className="text-xs text-gray-500">مشاركة</div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="space-y-2 mb-4 text-xs text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-2 rtl:ml-2 rtl:mr-0" />
                          <span>{formatDate(item.publishDate)}</span>
                        </div>
                        {item.fileSize && (
                          <div className="flex items-center">
                            <File className="w-3 h-3 mr-2 rtl:ml-2 rtl:mr-0" />
                            <span>{formatFileSize(item.fileSize)}</span>
                          </div>
                        )}
                        {item.duration && (
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-2 rtl:ml-2 rtl:mr-0" />
                            <span>{formatDuration(item.duration)}</span>
                          </div>
                        )}
                      </div>

                      {/* Visibility and Featured */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {item.isPublic ? (
                            <Globe className="w-4 h-4 text-green-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-600" />
                          )}
                          <span className="text-xs text-gray-600">
                            {item.isPublic ? 'عام' : 'خاص'}
                          </span>
                        </div>
                        {item.isFeatured && (
                          <Star className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleOpenModal('view', item)}
                          icon={Eye}
                          className="flex-1"
                        >
                          عرض
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleOpenModal('edit', item)}
                          icon={Edit}
                          className="flex-1"
                        >
                          تعديل
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredContent.length === 0 && !isLoading && (
            <Card className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لا يوجد محتوى
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all'
                  ? 'لا يوجد محتوى تطابق معايير البحث المحددة'
                  : 'ابدأ بإضافة محتوى جديد'}
              </p>
              <Button onClick={() => handleOpenModal('add')} icon={Plus}>
                إضافة محتوى جديد
              </Button>
            </Card>
          )}

          {/* Modal */}
          <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            title={
              modalType === 'add'
                ? 'إضافة محتوى جديد'
                : modalType === 'edit'
                ? 'تعديل المحتوى'
                : 'تفاصيل المحتوى'
            }
          >
            {modalType === 'view' && selectedContent ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  {(() => {
                    const TypeIcon = getTypeIcon(selectedContent.type);
                    return (
                      <div className="p-3 bg-primary-100 rounded-lg">
                        <TypeIcon className="w-6 h-6 text-primary-600" />
                      </div>
                    );
                  })()}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedContent.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedContent.author}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      النوع
                    </label>
                    <span className="text-gray-900">
                      {getTypeText(selectedContent.type)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الفئة
                    </label>
                    <span className="text-gray-900">
                      {getCategoryText(selectedContent.category)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الوصف
                  </label>
                  <p className="text-gray-900">{selectedContent.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تاريخ النشر
                    </label>
                    <p className="text-gray-900">
                      {formatDate(selectedContent.publishDate)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      آخر تعديل
                    </label>
                    <p className="text-gray-900">
                      {formatDate(selectedContent.lastModified)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      {selectedContent.views}
                    </div>
                    <div className="text-xs text-gray-600">مشاهدة</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">
                      {selectedContent.likes}
                    </div>
                    <div className="text-xs text-gray-600">إعجاب</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {selectedContent.shares}
                    </div>
                    <div className="text-xs text-gray-600">مشاركة</div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleOpenModal('edit', selectedContent)}
                    className="flex-1"
                  >
                    تعديل المحتوى
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleCloseModal}
                    className="flex-1"
                  >
                    إغلاق
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <Alert type="error" className="mb-4">
                    {formError}
                  </Alert>
                )}

                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    العنوان
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="عنوان المحتوى"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      النوع
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">اختر النوع</option>
                      <option value="article">مقال</option>
                      <option value="image">صورة</option>
                      <option value="video">فيديو</option>
                      <option value="document">مستند</option>
                      <option value="audio">صوتي</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      الفئة
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">اختر الفئة</option>
                      <option value="news">أخبار</option>
                      <option value="events">فعاليات</option>
                      <option value="programs">برامج</option>
                      <option value="resources">موارد</option>
                      <option value="gallery">معرض</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    الوصف
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="وصف المحتوى"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    المحتوى
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="محتوى النص أو الكود"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    الكلمات المفتاحية
                  </label>
                  <Input
                    id="tags"
                    name="tags"
                    type="text"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="كلمة مفتاحية 1, كلمة مفتاحية 2, ..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="language"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      اللغة
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={form.language}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                      <option value="tr">Türkçe</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <input
                      id="isPublic"
                      name="isPublic"
                      type="checkbox"
                      checked={form.isPublic}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isPublic"
                      className="mr-2 rtl:ml-2 rtl:mr-0 text-sm text-gray-700"
                    >
                      محتوى عام
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="isFeatured"
                      name="isFeatured"
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isFeatured"
                      className="mr-2 rtl:ml-2 rtl:mr-0 text-sm text-gray-700"
                    >
                      محتوى مميز
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {modalType === 'add' ? 'إضافة المحتوى' : 'حفظ التغييرات'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCloseModal}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            )}
          </Modal>
        </div>
      </AccessibleSection>
    </DashboardLayout>
  );
};

export default ContentDashboard;
