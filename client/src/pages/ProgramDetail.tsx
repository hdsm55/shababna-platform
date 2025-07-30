import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SEO from '../components/common/SEO';
import { Button } from '../components/ui/Button/Button';
import { Card } from '../components/ui/Card/Card';
import { Input } from '../components/ui/Input/Input';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchProgramById } from '../services/programsApi';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  Phone,
  Mail,
  Globe,
  User,
  CheckCircle,
  TrendingUp,
  Target,
  Award,
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

  const [showDonation, setShowDonation] = useState(false);
  const [donationForm, setDonationForm] = useState<DonationForm>({
    amount: 100,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
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
  } = useQuery({
    queryKey: ['program', id],
    queryFn: () => fetchProgramById(id!),
    enabled: !!id,
  });

  const program = programData?.data || programData;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setDonationStatus('loading');

    try {
      // إرسال البيانات الفعلية للـ API
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
        }/programs/${id}/support`,
        {
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
        }
      );

      if (!response.ok) {
        throw new Error('فشل في التبرع');
      }

      const result = await response.json();

      if (result.success) {
        setDonationStatus('success');
        setDonationMessage('تم التبرع بنجاح! شكراً لك.');
        setShowDonation(false);
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
    } catch (error) {
      console.error('Donation error:', error);
      setDonationStatus('error');
      setDonationMessage('حدث خطأ أثناء التبرع. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDonationForm({
      ...donationForm,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert type="error">
          {t('programDetail.error', 'حدث خطأ أثناء جلب تفاصيل البرنامج.')}
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={`${program.title} - منصة شبابنا العالمية`}
        description={program.description}
        type="program"
      />

      {/* Back Button */}
      <section className="container mx-auto px-4 py-6">
        <Link to="/programs">
          <Button variant="outline" className="flex items-center gap-2">
            {t('programDetail.backToPrograms', 'العودة إلى البرامج')}
          </Button>
        </Link>
      </section>

      {/* Program Header */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Program Image */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={program.image_url || '/images/program-placeholder.svg'}
                alt={program.title}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
                loading="lazy"
                onError={(e) => {
                  console.log('Image failed to load:', program.image_url);
                  e.currentTarget.src = '/images/program-placeholder.svg';
                }}
              />
            </motion.div>
          </div>

          {/* Program Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6 sticky top-6">
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                    {program.category}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Program Title */}
                <h1 className="text-2xl font-bold text-primary-900 mb-4">
                  {program.title}
                </h1>

                {/* Program Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-medium">
                        {formatDate(program.start_date)}
                        {program.end_date !== program.start_date &&
                          ` - ${formatDate(program.end_date)}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <TrendingUp className="w-5 h-5 mr-3" />
                    <span>{program.category}</span>
                  </div>

                  {program.goal_amount && program.current_amount && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">التقدم</span>
                        <span className="font-medium">
                          {getProgressPercentage(
                            program.current_amount,
                            program.goal_amount
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${getProgressPercentage(
                              program.current_amount,
                              program.goal_amount
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>
                          تم جمع: ${program.current_amount.toLocaleString()}
                        </span>
                        <span>
                          الهدف: ${program.goal_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Donation Button */}
                <Button
                  className="w-full mb-4"
                  onClick={() => setShowDonation(true)}
                >
                  {t('programDetail.donate', 'تبرع الآن')}
                </Button>

                {/* Contact Info */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">
                    {t('programDetail.contactInfo', 'معلومات التواصل')}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>+966 50 123 4567</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>programs@shababna.com</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      <span>www.shababna.com</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Program Description */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-primary-900 mb-6">
              {t('programDetail.about', 'عن البرنامج')}
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {program.description}
              </p>

              {/* Additional Details */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-primary-500" />
                    {t('programDetail.objectives', 'أهداف البرنامج')}
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      تطوير المهارات الشخصية والمهنية
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      بناء مجتمع شبابي قوي ومتضامن
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      تعزيز القيم الإسلامية والأخلاقية
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-accent-500" />
                    {t('programDetail.benefits', 'الفوائد المتوقعة')}
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      شهادات معتمدة للمشاركين
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      فرص عمل وترقيات مهنية
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      شبكة علاقات مهنية قوية
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Donation Modal */}
      {showDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">
              {t('programDetail.donate', 'تبرع للبرنامج')}
            </h3>

            <form onSubmit={handleDonation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('programDetail.amount', 'مبلغ التبرع')}
                </label>
                <Input
                  name="amount"
                  type="number"
                  placeholder="100"
                  value={donationForm.amount}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="firstName"
                  placeholder={t('programDetail.firstName', 'الاسم الأول')}
                  value={donationForm.firstName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="lastName"
                  placeholder={t('programDetail.lastName', 'اسم العائلة')}
                  value={donationForm.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Input
                name="email"
                type="email"
                placeholder={t('programDetail.email', 'البريد الإلكتروني')}
                value={donationForm.email}
                onChange={handleInputChange}
                required
              />

              <Input
                name="phone"
                placeholder={t('programDetail.phone', 'رقم الجوال')}
                value={donationForm.phone}
                onChange={handleInputChange}
                required
              />

              <textarea
                name="message"
                placeholder={t('programDetail.message', 'رسالة (اختياري)')}
                value={donationForm.message}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={3}
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDonation(false)}
                  className="flex-1"
                >
                  {t('programDetail.cancel', 'إلغاء')}
                </Button>
                <Button
                  type="submit"
                  disabled={donationStatus === 'loading'}
                  className="flex-1"
                >
                  {donationStatus === 'loading' ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    t('programDetail.submit', 'تأكيد التبرع')
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Donation Status Alert */}
      {donationStatus !== 'idle' && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert
            type={donationStatus === 'success' ? 'success' : 'error'}
            onClose={() => setDonationStatus('idle')}
          >
            {donationMessage}
          </Alert>
        </div>
      )}
    </div>
  );
};

export default ProgramDetail;
