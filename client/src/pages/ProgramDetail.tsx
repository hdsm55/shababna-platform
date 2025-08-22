import React, { useState, memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SEO from '../components/common/SEO';
import { Button } from '../components/ui/Button/ButtonSimple';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/InputSimple';
import { Alert } from '../components/common/AlertSimple';
import UnifiedLoader from '../components/common/UnifiedLoader';
import { fetchProgramById } from '../services/programsApi';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl } from '../config/environment';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Bookmark,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  TrendingUp,
  Target,
  Award,
  DollarSign,
  Eye,
  Heart,
  Star,
} from 'lucide-react';
import ShareButtons from '../components/common/ShareButtons';

interface DonationForm {
  // مشترك
  amount: number;
  email: string;
  phone: string;
  message?: string;

  // نوع الداعم
  supporterType: 'individual' | 'organization';

  // حقول الأفراد
  firstName: string;
  lastName: string;

  // حقول المؤسسات
  orgName?: string;
  contactPerson?: string;
  website?: string;
  partnershipType?: string; // شريك تنفيذي / راعٍ / شريك إعلامي ...
}

// تحسين الأداء - مكونات منفصلة
const ProgramHeader = memo(({ program }: { program: any }) => {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'قيد الانتظار';
      case 'cancelled':
        return 'ملغي';
      default:
        return 'غير محدد';
    }
  };

  const calculateProgress = () => {
    if (!program?.target_amount || !program?.current_amount) return 0;
    return Math.min(
      (program.current_amount / program.target_amount) * 100,
      100
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="text-center mb-8"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="inline-block"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-dark-500 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          {program?.title}
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center justify-center gap-4 mb-6"
      >
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
            program?.status
          )}`}
        >
          {getStatusText(program?.status)}
        </span>
        <div className="flex items-center gap-2 text-dark-400">
          <Eye className="w-4 h-4" />
          <span className="text-sm">مشاهدات: {program?.views || 0}</span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-lg text-dark-400 max-w-3xl mx-auto leading-relaxed mb-6"
      >
        {program?.description}
      </motion.p>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="max-w-md mx-auto"
      >
        <div className="bg-white rounded-lg p-4 border border-primary-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-dark-500">
              {t('program.progress', 'التقدم المالي')}
            </span>
            <span className="text-sm text-primary-600 font-bold">
              {calculateProgress().toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-dark-400 mt-2">
            <span>{program?.current_amount?.toLocaleString() || 0} ريال</span>
            <span>{program?.target_amount?.toLocaleString() || 0} ريال</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

const ProgramInfo = memo(({ program }: { program: any }) => {
  const { t, i18n } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const infoItems = [
    {
      icon: Calendar,
      label: t('program.startDate', 'تاريخ البداية'),
      value: formatDate(program?.start_date),
    },
    {
      icon: Clock,
      label: t('program.duration', 'المدة'),
      value: `${program?.duration || 0} ${t('program.months', 'شهر')}`,
    },
    {
      icon: MapPin,
      label: t('program.location', 'الموقع'),
      value: program?.location || t('program.online', 'أونلاين'),
    },
    {
      icon: Users,
      label: t('program.participants', 'المشاركين'),
      value: `${program?.participants || 0} ${t('program.person', 'شخص')}`,
    },
    {
      icon: Target,
      label: t('program.targetAmount', 'الهدف المالي'),
      value: `${program?.target_amount?.toLocaleString() || 0} ريال`,
    },
    {
      icon: DollarSign,
      label: t('program.currentAmount', 'المبلغ المحقق'),
      value: `${program?.current_amount?.toLocaleString() || 0} ريال`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-8"
    >
      <Card className="p-6 bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 backdrop-blur-sm border border-primary-200">
        <h2 className="text-xl font-bold text-dark-500 mb-6 text-center">
          {t('program.details', 'تفاصيل البرنامج')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {infoItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-3 p-4 bg-white rounded-lg border border-primary-100 hover:shadow-md transition-all duration-300"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-dark-400">{item.label}</p>
                <p className="font-semibold text-dark-500">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
});

const DonationForm = memo(
  ({
    program,
    showDonation,
    setShowDonation,
    donationForm,
    setDonationForm,
    donationStatus,
    setDonationStatus,
    donationMessage,
    setDonationMessage,
  }: {
    program: any;
    showDonation: boolean;
    setShowDonation: (show: boolean) => void;
    donationForm: DonationForm;
    setDonationForm: (form: DonationForm) => void;
    donationStatus: 'idle' | 'loading' | 'success' | 'error';
    setDonationStatus: (
      status: 'idle' | 'loading' | 'success' | 'error'
    ) => void;
    donationMessage: string;
    setDonationMessage: (message: string) => void;
  }) => {
    const { t } = useTranslation();

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        setDonationStatus('loading');
        setDonationMessage('');

        try {
          const response = await fetch('/api/donations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              program_id: program.id,
              ...donationForm,
            }),
          });

          if (!response.ok) throw new Error('فشل في التبرع');

          setDonationStatus('success');
          setDonationMessage(
            t('program.donation.success', 'تم التبرع بنجاح! شكراً لك')
          );
          setDonationForm({
            amount: 100,
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            message: '',
          });

          setTimeout(() => {
            setShowDonation(false);
            setDonationStatus('idle');
          }, 3000);
        } catch (error) {
          setDonationStatus('error');
          setDonationMessage(
            t('program.donation.error', 'حدث خطأ أثناء التبرع')
          );
        }
      },
      [
        program?.id,
        donationForm,
        t,
        setDonationForm,
        setShowDonation,
        setDonationStatus,
      ]
    );

    return (
      <AnimatePresence>
        {showDonation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDonation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-dark-500 mb-4 text-center">
                {t('program.donation.title', 'تبرع للبرنامج')}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-500 mb-2">
                    {t('program.donation.amount', 'مبلغ التبرع')}
                  </label>
                  <Input
                    type="number"
                    value={donationForm.amount}
                    onChange={(e) =>
                      setDonationForm({
                        ...donationForm,
                        amount: Number(e.target.value),
                      })
                    }
                    min="1"
                    required
                    fullWidth
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t('program.donation.firstName', 'الاسم الأول')}
                    type="text"
                    value={donationForm.firstName}
                    onChange={(e) =>
                      setDonationForm({
                        ...donationForm,
                        firstName: e.target.value,
                      })
                    }
                    required
                    fullWidth
                  />
                  <Input
                    label={t('program.donation.lastName', 'الاسم الأخير')}
                    type="text"
                    value={donationForm.lastName}
                    onChange={(e) =>
                      setDonationForm({
                        ...donationForm,
                        lastName: e.target.value,
                      })
                    }
                    required
                    fullWidth
                  />
                </div>

                <Input
                  label={t('program.donation.email', 'البريد الإلكتروني')}
                  type="email"
                  value={donationForm.email}
                  onChange={(e) =>
                    setDonationForm({ ...donationForm, email: e.target.value })
                  }
                  required
                  fullWidth
                />

                <Input
                  label={t('program.donation.phone', 'رقم الهاتف')}
                  type="tel"
                  value={donationForm.phone}
                  onChange={(e) =>
                    setDonationForm({ ...donationForm, phone: e.target.value })
                  }
                  required
                  fullWidth
                />

                <div>
                  <label className="block text-sm font-medium text-dark-500 mb-2">
                    {t('program.donation.message', 'رسالة (اختياري)')}
                  </label>
                  <textarea
                    rows={3}
                    value={donationForm.message}
                    onChange={(e) =>
                      setDonationForm({
                        ...donationForm,
                        message: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-900 placeholder:text-neutral-400 bg-white resize-none"
                    placeholder={t(
                      'program.donation.messagePlaceholder',
                      'رسالة إضافية...'
                    )}
                  />
                </div>

                {donationMessage && (
                  <Alert
                    type={donationStatus === 'success' ? 'success' : 'error'}
                    className="mt-4"
                  >
                    {donationMessage}
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDonation(false)}
                    className="flex-1"
                  >
                    {t('common.cancel', 'إلغاء')}
                  </Button>
                  <Button
                    type="submit"
                    loading={donationStatus === 'loading'}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                  >
                    {t('program.donation.submit', 'تبرع')}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

const ProgramDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isRTL = i18n.dir() === 'rtl';

  const [showDonation, setShowDonation] = useState(false);
  const [donationForm, setDonationForm] = useState<DonationForm>({
    amount: 100,
    supporterType: 'individual',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    orgName: '',
    contactPerson: '',
    website: '',
    partnershipType: '',
  });
  const [donationStatus, setDonationStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [donationMessage, setDonationMessage] = useState('');

  // Fetch program details
  const {
    data: programData,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['program', id],
    queryFn: () => fetchProgramById(id!),
    enabled: !!id,
    retry: (failureCount, error: any) => {
      // Retry for backend idle time
      if (failureCount < 3) {
        if (error?.isBackendIdle) return true;
        if (error?.response?.status >= 500) return true;
        if (error?.code === 'ECONNABORTED') return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const program = programData?.data || programData;
  const isBackendIdle = (error as any)?.isBackendIdle;

  // إرسال نموذج الدعم الداخلي
  const handleInlineDonationSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setDonationStatus('loading');
      setDonationMessage('');

      try {
        const response = await fetch('/api/donations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            program_id: program?.id,
            support_type: donationForm.supporterType,
            amount: donationForm.amount,
            email: donationForm.email,
            phone: donationForm.phone,
            message: donationForm.message,
            first_name:
              donationForm.supporterType === 'individual'
                ? donationForm.firstName
                : undefined,
            last_name:
              donationForm.supporterType === 'individual'
                ? donationForm.lastName
                : undefined,
            org_name:
              donationForm.supporterType === 'organization'
                ? donationForm.orgName
                : undefined,
            contact_person:
              donationForm.supporterType === 'organization'
                ? donationForm.contactPerson
                : undefined,
            website:
              donationForm.supporterType === 'organization'
                ? donationForm.website
                : undefined,
            partnership_type:
              donationForm.supporterType === 'organization'
                ? donationForm.partnershipType
                : undefined,
          }),
        });

        if (!response.ok) throw new Error('فشل في إرسال الدعم');

        setDonationStatus('success');
        setDonationMessage('تم استلام طلب الدعم بنجاح. شكرًا لك!');
        setDonationForm({
          amount: 100,
          supporterType: 'individual',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
          orgName: '',
          contactPerson: '',
          website: '',
          partnershipType: '',
        });
        setTimeout(() => setDonationStatus('idle'), 3000);
      } catch (err) {
        setDonationStatus('error');
        setDonationMessage('حدث خطأ أثناء إرسال طلب الدعم');
      }
    },
    [program?.id, donationForm]
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('section') === 'donate') {
      const el = document.getElementById('donate');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.search]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <UnifiedLoader
          type="centered"
          size="lg"
          isBackendIdle={isBackendIdle}
          text={
            isBackendIdle
              ? 'الخادم يستيقظ، يرجى الانتظار...'
              : 'جاري تحميل تفاصيل البرنامج...'
          }
        />
      </div>
    );
  }

  // Show error state
  if (isError || !program) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <Alert type="error">
          {t('program.notFound', 'لم يتم العثور على البرنامج')}
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-accent-200 rounded-full blur-2xl opacity-25" />
      </motion.div>

      <SEO
        title={`${program.title} - منصة شبابنا`}
        description={program.description}
        type="website"
        keywords={['برنامج', program.title, 'منصة شبابنا']}
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <section className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('common.back', 'العودة للبرامج')}
            </Link>
          </motion.div>

          <ProgramHeader program={program} />
          <ProgramInfo program={program} />

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Button
              onClick={() => {
                const el = document.getElementById('donate');
                if (el)
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Heart className="w-5 h-5 mr-2" />
              {t('program.donate', 'تبرع للبرنامج')}
            </Button>

            <ShareButtons
              variant="button"
              size="md"
              title={program.title}
              description={program.description}
              image={program.image}
              url={`${window.location.origin}/programs/${program.id}`}
              className="border-primary-200 text-primary-600 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg transition-all duration-300"
            />
          </motion.div>

          {/* Additional Info */}
          {program.additional_info && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="p-6 bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 backdrop-blur-sm border border-primary-200">
                <h3 className="text-lg font-bold text-dark-500 mb-4">
                  {t('program.additionalInfo', 'معلومات إضافية')}
                </h3>
                <div className="prose prose-sm text-dark-400">
                  {program.additional_info}
                </div>
              </Card>
            </motion.div>
          )}
        </section>
      </div>

      {/* Inline Donation Section */}
      <motion.div
        id="donate"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-8 px-4"
      >
        <Card className="p-6 border border-primary-200 bg-white/90 backdrop-blur-sm max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-dark-500 mb-6 text-center">
            {t('program.donation.title', 'ادعم البرنامج')}
          </h3>
          <form onSubmit={handleInlineDonationSubmit} className="space-y-5">
            {/* نوع الداعم */}
            <div>
              <label className="block text-sm font-medium text-dark-500 mb-2">
                نوع الداعم
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={
                    donationForm.supporterType === 'individual'
                      ? 'primary'
                      : 'outline'
                  }
                  className={
                    donationForm.supporterType === 'individual'
                      ? 'bg-primary-600 text-white'
                      : ''
                  }
                  onClick={() =>
                    setDonationForm({
                      ...donationForm,
                      supporterType: 'individual',
                    })
                  }
                >
                  فرد
                </Button>
                <Button
                  type="button"
                  variant={
                    donationForm.supporterType === 'organization'
                      ? 'primary'
                      : 'outline'
                  }
                  className={
                    donationForm.supporterType === 'organization'
                      ? 'bg-primary-600 text-white'
                      : ''
                  }
                  onClick={() =>
                    setDonationForm({
                      ...donationForm,
                      supporterType: 'organization',
                    })
                  }
                >
                  مؤسسة/شركة
                </Button>
              </div>
            </div>

            <Input
              label={t('program.donation.amount', 'مبلغ التبرع')}
              type="number"
              value={donationForm.amount}
              onChange={(e) =>
                setDonationForm({
                  ...donationForm,
                  amount: Number(e.target.value),
                })
              }
              min="1"
              required
              fullWidth
            />
            {donationForm.supporterType === 'individual' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('program.donation.firstName', 'الاسم الأول')}
                  type="text"
                  value={donationForm.firstName}
                  onChange={(e) =>
                    setDonationForm({
                      ...donationForm,
                      firstName: e.target.value,
                    })
                  }
                  required
                  fullWidth
                />
                <Input
                  label={t('program.donation.lastName', 'الاسم الأخير')}
                  type="text"
                  value={donationForm.lastName}
                  onChange={(e) =>
                    setDonationForm({
                      ...donationForm,
                      lastName: e.target.value,
                    })
                  }
                  required
                  fullWidth
                />
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  label={t('program.organization.name', 'اسم المؤسسة')}
                  type="text"
                  value={donationForm.orgName}
                  onChange={(e) =>
                    setDonationForm({
                      ...donationForm,
                      orgName: e.target.value,
                    })
                  }
                  required
                  fullWidth
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={t(
                      'program.organization.contact',
                      'اسم مسؤول التواصل'
                    )}
                    type="text"
                    value={donationForm.contactPerson}
                    onChange={(e) =>
                      setDonationForm({
                        ...donationForm,
                        contactPerson: e.target.value,
                      })
                    }
                    required
                    fullWidth
                  />
                  <Input
                    label={t(
                      'program.organization.website',
                      'الموقع الإلكتروني (اختياري)'
                    )}
                    type="url"
                    value={donationForm.website}
                    onChange={(e) =>
                      setDonationForm({
                        ...donationForm,
                        website: e.target.value,
                      })
                    }
                    fullWidth
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-500 mb-2">
                    نوع الشراكة
                  </label>
                  <select
                    value={donationForm.partnershipType}
                    onChange={(e) =>
                      setDonationForm({
                        ...donationForm,
                        partnershipType: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-900 bg-white"
                    required
                  >
                    <option value="" disabled>
                      اختر نوع الشراكة
                    </option>
                    <option value="sponsor">راعٍ</option>
                    <option value="implementer">شريك تنفيذي</option>
                    <option value="media">شريك إعلامي</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
              </div>
            )}
            <Input
              label={t('program.donation.email', 'البريد الإلكتروني')}
              type="email"
              value={donationForm.email}
              onChange={(e) =>
                setDonationForm({ ...donationForm, email: e.target.value })
              }
              required
              fullWidth
            />
            <Input
              label={t('program.donation.phone', 'رقم الهاتف')}
              type="tel"
              value={donationForm.phone}
              onChange={(e) =>
                setDonationForm({ ...donationForm, phone: e.target.value })
              }
              required
              fullWidth
            />
            <div>
              <label className="block text-sm font-medium text-dark-500 mb-2">
                {t('program.donation.message', 'رسالة (اختياري)')}
              </label>
              <textarea
                rows={3}
                value={donationForm.message}
                onChange={(e) =>
                  setDonationForm({ ...donationForm, message: e.target.value })
                }
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-900 placeholder:text-neutral-400 bg-white resize-none"
              />
            </div>
            {donationMessage && (
              <Alert
                type={donationStatus === 'success' ? 'success' : 'error'}
                className="mt-2"
              >
                {donationMessage}
              </Alert>
            )}
            <div className="flex gap-3">
              <Button
                type="submit"
                loading={donationStatus === 'loading'}
                className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
              >
                {t('program.donation.submit', 'إرسال الدعم')}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      <DonationForm
        program={program}
        showDonation={showDonation}
        setShowDonation={setShowDonation}
        donationForm={donationForm}
        setDonationForm={setDonationForm}
        donationStatus={donationStatus}
        setDonationStatus={setDonationStatus}
        donationMessage={donationMessage}
        setDonationMessage={setDonationMessage}
      />
    </div>
  );
};

export default ProgramDetail;
