import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SEO from '../components/common/SEO';
import { Button } from '../components/ui/Button/Button';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import { useAlert } from '../components/common/AlertProvider';
import {
  useUnifiedLoading,
  PageLoader,
} from '../components/common/UnifiedLoadingStates';
import UnifiedAlert from '../components/common/UnifiedAlert';
import { fetchProgramById } from '../services/programsApi';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl } from '../config/environment';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Share2,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  TrendingUp,
  Target,
  Award,
  Tag,
  DollarSign,
  Heart,
} from 'lucide-react';

interface DonationForm {
  amount: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message?: string;
}

const ProgramDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const isRTL = i18n.dir() === 'rtl';

  // التبرع مدمج داخل صفحة التفاصيل؛ لا حاجة لعرضه في نافذة
  const [donationForm, setDonationForm] = useState<DonationForm>({
    amount: 100,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const { success: showSuccess, error: showError } = useAlert();
  const { withButtonLoading } = useUnifiedLoading();

  // Local alert state for form notifications
  const [localAlert, setLocalAlert] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

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
  const isBackendIdle = (isError ? error : (null as any))?.isBackendIdle;

  // Show loading state
  if (isLoading) {
    return (
      <PageLoader
        message={
          isBackendIdle
            ? 'الخادم يستيقظ، يرجى الانتظار...'
            : 'جاري تحميل تفاصيل البرنامج...'
        }
        fullScreen={true}
        variant={isBackendIdle ? 'pulse' : 'brand'}
      />
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="text-red-800 font-semibold mb-2">خطأ في التحميل</h3>
            <p className="text-red-700">
              {isBackendIdle
                ? 'الخادم يستيقظ، يرجى المحاولة مرة أخرى'
                : 'حدث خطأ أثناء تحميل تفاصيل البرنامج'}
            </p>
          </div>
          <Button onClick={() => window.location.reload()} className="mt-4">
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();

    await withButtonLoading(async () => {
      try {
        console.log('🚀 إرسال طلب التبرع:', {
          supporter_name: `${donationForm.firstName} ${donationForm.lastName}`,
          supporter_email: donationForm.email,
          amount: donationForm.amount,
        });

        // إرسال البيانات الفعلية للـ API

        const response = await fetch(`${getApiUrl()}/programs/${id}/support`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            supporter_name: `${donationForm.firstName} ${donationForm.lastName}`,
            supporter_email: donationForm.email,
            supporter_phone: donationForm.phone,
            support_type: 'donation',
            message: donationForm.message,
            amount: donationForm.amount,
          }),
        });

        console.log('📡 استجابة الخادم:', response.status, response.statusText);

        // التحقق من وجود محتوى في الاستجابة
        const responseText = await response.text();
        console.log('📄 محتوى الاستجابة:', responseText);

        if (!response.ok) {
          let errorMessage = `فشل في التبرع (${response.status})`;

          if (responseText) {
            try {
              const errorData = JSON.parse(responseText);
              errorMessage = errorData.message || errorMessage;
            } catch (e) {
              console.log('❌ فشل في تحليل JSON للخطأ:', e);
            }
          }

          throw new Error(errorMessage);
        }

        // تحليل JSON فقط إذا كان هناك محتوى
        let result;
        if (responseText) {
          try {
            result = JSON.parse(responseText);
            console.log('✅ نتيجة التبرع:', result);
          } catch (e) {
            console.error('❌ فشل في تحليل JSON:', e);
            throw new Error('استجابة غير صحيحة من الخادم');
          }
        } else {
          console.log('⚠️ استجابة فارغة من الخادم');
          result = { success: false, message: 'استجابة فارغة من الخادم' };
        }

        if (result.success) {
          setLocalAlert({
            type: 'success',
            message: 'شكراً لك على دعمك!',
          });
          // إعادة تعيين النموذج
          setDonationForm({
            amount: 100,
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            message: '',
          });
        } else {
          throw new Error(result.message || 'حدث خطأ أثناء التبرع');
        }
      } catch (err) {
        console.error('❌ Donation error:', err);
        setLocalAlert({
          type: 'error',
          message:
            err instanceof Error
              ? err.message
              : 'حدث خطأ أثناء التبرع. يرجى المحاولة مرة أخرى.',
        });
      }
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDonationForm({
      ...donationForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SEO
        title={`${program.title} - منصة شبابنا العالمية`}
        description={program.description}
        type="website"
      />

      {/* Back Button */}
      <section className="container mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/programs">
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('programDetail.backToPrograms', 'العودة إلى البرامج')}
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Program Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Program Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative h-80 md:h-96 rounded-2xl shadow-2xl overflow-hidden">
                <img
                  src={program.image_url || '/images/programs-default.jpg'}
                  alt={program.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/images/programs-default.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white bg-opacity-90 hover:bg-opacity-100"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    {program.category}
                  </span>
                </div>

                {program.goal_amount && program.current_amount && (
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white bg-opacity-95 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                      {getProgressPercentage(
                        program.current_amount,
                        program.goal_amount
                      ).toFixed(1)}
                      % ممول
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Program Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-8 shadow-xl border-0">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {program.category}
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    {program.title}
                  </h1>
                </div>

                {/* Program Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center p-6 bg-blue-50 rounded-2xl">
                    <Calendar className="w-6 h-6 mr-4 text-blue-500" />
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        من {formatDate(program.start_date)}
                        {program.end_date !== program.start_date &&
                          ` إلى ${formatDate(program.end_date)}`}
                      </div>
                      <div className="text-gray-600">مدة البرنامج</div>
                    </div>
                  </div>

                  <div className="flex items-center p-6 bg-green-50 rounded-2xl">
                    <TrendingUp className="w-6 h-6 mr-4 text-green-500" />
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        {program.category}
                      </div>
                      <div className="text-gray-600">نوع البرنامج</div>
                    </div>
                  </div>

                  {program.goal_amount && program.current_amount && (
                    <>
                      <div className="flex items-center p-6 bg-purple-50 rounded-2xl">
                        <DollarSign className="w-6 h-6 mr-4 text-purple-500" />
                        <div>
                          <div className="font-bold text-gray-900 text-lg">
                            ${program.current_amount.toLocaleString()}
                          </div>
                          <div className="text-gray-600">
                            تم جمعه من ${program.goal_amount.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center p-6 bg-orange-50 rounded-2xl">
                        <Heart className="w-6 h-6 mr-4 text-orange-500" />
                        <div>
                          <div className="font-bold text-gray-900 text-lg">
                            {getProgressPercentage(
                              program.current_amount,
                              program.goal_amount
                            ).toFixed(1)}
                            %
                          </div>
                          <div className="text-gray-600">نسبة التمويل</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Funding Progress */}
                {program.goal_amount && program.current_amount && (
                  <div className="p-6 bg-gray-50 rounded-2xl mb-8">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-gray-900 text-lg">
                        حالة التمويل
                      </span>
                      <span className="text-gray-600">
                        {getProgressPercentage(
                          program.current_amount,
                          program.goal_amount
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-300"
                        style={{
                          width: `${getProgressPercentage(
                            program.current_amount,
                            program.goal_amount
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-gray-600 mt-3">
                      <span>
                        ${program.current_amount.toLocaleString()} تم جمعه
                      </span>
                      <span>${program.goal_amount.toLocaleString()} الهدف</span>
                    </div>
                  </div>
                )}

                {/* Program Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-blue-500" />
                    {t('programDetail.about', 'عن البرنامج')}
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {program.description}
                  </p>

                  {/* Enhanced Additional Details */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-2xl">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-800">
                        <Target className="w-6 h-6" />
                        {t('programDetail.objectives', 'أهداف البرنامج')}
                      </h3>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span>تطوير المهارات الشخصية والمهنية</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span>بناء مجتمع شبابي قوي ومتضامن</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span>تعزيز القيم الإسلامية والأخلاقية</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-orange-800">
                        <Tag className="w-6 h-6" />
                        {t('programDetail.benefits', 'الفوائد المتوقعة')}
                      </h3>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-orange-500 mr-3" />
                          <span>شهادات معتمدة للمشاركين</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-orange-500 mr-3" />
                          <span>فرص عمل وترقيات مهنية</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-orange-500 mr-3" />
                          <span>شبكة علاقات مهنية قوية</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-t pt-8">
                  <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-xl">
                    <Phone className="w-6 h-6 text-blue-500" />
                    معلومات التواصل
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                      href="tel:+905050505645"
                      className="flex items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                    >
                      <Phone className="w-5 h-5 mr-3 text-green-500" />
                      <span className="font-semibold text-green-700">
                        +905050505645
                      </span>
                    </a>
                    <a
                      href="mailto:info@shababna.com"
                      className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      <Mail className="w-5 h-5 mr-3 text-blue-500" />
                      <span className="font-semibold text-blue-700">
                        info@shababna.com
                      </span>
                    </a>
                    <a
                      href="https://maps.app.goo.gl/yz4Nc1RmLt6CuTh47"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <MapPin className="w-5 h-5 mr-3 text-red-500" />
                      <span className="font-semibold text-red-700">
                        موقعنا على الخريطة
                      </span>
                    </a>
                    <a
                      href="https://shababna.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                    >
                      <Globe className="w-5 h-5 mr-3 text-purple-500" />
                      <span className="font-semibold text-purple-700">
                        www.shababna.com
                      </span>
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Donation Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6 shadow-2xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 sticky top-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    دعم البرنامج
                  </h2>
                  <p className="text-gray-600">
                    أكمل البيانات التالية للمساهمة
                  </p>
                </div>

                {/* Program Summary */}
                <div className="bg-white p-4 rounded-xl mb-6 border border-blue-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">
                    {program.title}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>من {formatDate(program.start_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-red-500" />
                      <span className="truncate">{program.category}</span>
                    </div>
                    {program.goal_amount && program.current_amount && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span>
                          {getProgressPercentage(
                            program.current_amount,
                            program.goal_amount
                          ).toFixed(1)}
                          % ممول
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <form onSubmit={handleDonation} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      مبلغ المساهمة <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="amount"
                      type="number"
                      placeholder="100"
                      value={donationForm.amount.toString()}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="h-12"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        الاسم الأول <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="firstName"
                        placeholder="أدخل اسمك الأول"
                        value={donationForm.firstName}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        اسم العائلة <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="lastName"
                        placeholder="أدخل اسم العائلة"
                        value={donationForm.lastName}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      value={donationForm.email}
                      onChange={handleInputChange}
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      رقم الجوال <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="phone"
                      placeholder="+90 505 050 56 45"
                      value={donationForm.phone}
                      onChange={handleInputChange}
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      رسالة (اختياري)
                    </label>
                    <textarea
                      name="message"
                      placeholder="اكتب أي رسالة إضافية..."
                      value={donationForm.message}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-24"
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 h-14 shadow-lg"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Heart className="w-5 h-5" />
                      <span>تأكيد المساهمة</span>
                    </div>
                  </Button>

                  {/* Local Alert */}
                  {localAlert.type && (
                    <UnifiedAlert
                      type={localAlert.type}
                      message={localAlert.message}
                      position="button-bottom"
                      duration={5000}
                      onClose={() => setLocalAlert({ type: null, message: '' })}
                    />
                  )}
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
