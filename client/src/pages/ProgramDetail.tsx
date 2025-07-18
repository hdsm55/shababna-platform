import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Target,
  Heart,
  Users,
  Calendar,
  MapPin,
  ArrowLeft,
  Share2,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Globe,
  Star,
  Award,
} from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Skeleton } from '../components/ui/Skeleton';
import { fetchProgramById } from '../services/programsApi';
import { Program } from '../types';

const ProgramDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  // إزالة أي متغيرات أو دوال تخص التبرع العام
  // توحيد النموذج ليشمل دعم مالي أو تطوعي أو شراكة
  const [supportForm, setSupportForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    amount: '',
    message: '',
    supportType: 'donation', // 'donation' | 'volunteer' | 'partnership'
  });
  const [isSupporting, setIsSupporting] = useState(false);
  const [supportStatus, setSupportStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const isRTL = i18n.dir() === 'rtl';

  // Fetch program details
  const {
    data: program,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['program', id],
    queryFn: () => fetchProgramById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setDonationStatus('idle');
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto">
          <Skeleton height={220} className="mb-8" />
          <Skeleton height={40} className="mb-4" />
          <Skeleton height={24} className="mb-6" />
          <Skeleton height={16} className="mb-2" />
          <Skeleton height={16} className="mb-2" />
          <Skeleton height={16} className="mb-8" />
          <Skeleton height={48} className="mb-4" />
        </div>
      </div>
    );
  }

  if (isError || !program) {
    let errorMsg = t('common.error.message');
    if (error && error instanceof Error && error.message.includes('404')) {
      errorMsg = t(
        'programs.notFound',
        'عذراً، لم يتم العثور على هذا البرنامج.'
      );
    }
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Alert variant="error" className="max-w-2xl mb-8">
          {errorMsg}
        </Alert>
        <Button as={Link} to="/programs" variant="primary" icon={<ArrowLeft />}>
          {t('common.backToPrograms', 'العودة للبرامج')}
        </Button>
      </div>
    );
  }

  // تم حذف progressPercentage وقسم التقدم بالكامل لأنه غير مدعوم في نوع Program

  return (
    <div className="min-h-screen bg-neutral">
      {/* Hero Section */}
      <SectionTitle
        title={program.title}
        description={program.description}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="text-center mt-10"
      />
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
        {/* Main Info */}
        <Card
          variant="elevated"
          dir={isRTL ? 'rtl' : 'ltr'}
          className="md:col-span-2"
        >
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-primary" />
            <span className="font-bold text-lg">{program.title}</span>
            <span className="ml-2 px-3 py-1 text-xs rounded-full bg-accent text-white">
              {program.category}
            </span>
          </div>
          <div className="flex items-center gap-3 text-secondary text-sm mb-2">
            <Calendar className="text-primary" />
            <span>{program.start_date}</span>
          </div>
          <div className="flex items-center gap-3 text-secondary text-sm mb-2">
            <Users className="text-accent" />
            <span>{t('programs.beneficiaries', 'المستفيدون')}</span>
          </div>
          <div className="my-4">
            {/* تم حذف زر التبرع لأنه غير مدعوم */}
            <Button variant="outline" icon={<Share2 />}>
              {t('programs.share')}
            </Button>
          </div>
        </Card>
        {/* تم حذف نموذج التبرع بالكامل */}
      </div>
    </div>
  );
};

export default ProgramDetail;
