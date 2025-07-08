import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
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
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchProgramById } from '../services/programsApi';
import { Program } from '../types';
import {
  AccessibleSection,
  AccessibleCard,
  AccessibleButton,
  SkipToContent,
} from '../components/common/AccessibleComponents';

const ProgramDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [donationForm, setDonationForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    amount: '',
    message: '',
  });
  const [isDonating, setIsDonating] = useState(false);
  const [donationStatus, setDonationStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  console.log('Program id from URL:', id);
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
    console.log('Fetched program data:', program);
    console.log('isLoading:', isLoading, 'isError:', isError, 'error:', error);
  }, [program, isLoading, isError, error]);

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDonating(true);
    setDonationStatus('idle');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setDonationStatus('success');
      setDonationForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        amount: '',
        message: '',
      });
    } catch (err) {
      setDonationStatus('error');
    } finally {
      setIsDonating(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'education':
        return 'bg-primary-100 text-primary-800';
      case 'technology':
        return 'bg-accent-100 text-accent-800';
      case 'entrepreneurship':
        return 'bg-secondary-100 text-secondary-800';
      case 'volunteering':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-success-500';
    if (percentage >= 50) return 'bg-warning-500';
    return 'bg-accent-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto animate-pulse">
          <div className="h-56 bg-gray-200 rounded-2xl mb-8" />
          <div className="h-10 bg-gray-200 rounded w-2/3 mb-4" />
          <div className="h-6 bg-gray-100 rounded w-1/2 mb-6" />
          <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-1/3 mb-8" />
          <div className="h-12 bg-gray-200 rounded mb-4 w-full" />
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
      <div className="min-h-screen">
        <SkipToContent />
        <div className="container py-16">
          <Alert
            type="error"
            title={t('common.error.title', 'حدث خطأ')}
            className="max-w-2xl mx-auto"
          >
            {errorMsg}
          </Alert>
          <div className="text-center mt-8">
            <Link to="/programs">
              <Button variant="primary" icon={ArrowLeft} iconPosition="left">
                {t('common.backToPrograms', 'العودة للبرامج')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = program.goal_amount
    ? Math.round((program.current_amount / program.goal_amount) * 100)
    : 0;

  return (
    <div className="min-h-screen">
      <SkipToContent />
      {/* Hero Section */}
      <AccessibleSection variant="hero" ariaLabel="قسم رأس تفاصيل البرنامج">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Program Banner Image */}
        {program.image && (
          <img
            src={program.image}
            alt={program.title}
            className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none"
            style={{ zIndex: 0 }}
          />
        )}
        <div className="relative container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Breadcrumb */}
              <div className="mb-8">
                <Link
                  to="/programs"
                  className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {t('common.backToPrograms')}
                </Link>
              </div>

              {/* Program Header */}
              <div className="mb-6">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(
                    program.category
                  )}`}
                >
                  {program.category.charAt(0).toUpperCase() +
                    program.category.slice(1)}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {program.title}
              </h1>

              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {program.description}
              </p>

              {/* Program Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center text-white/90">
                  <DollarSign className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0" />
                  <div>
                    <div className="font-medium">
                      ${program.current_amount.toLocaleString()}
                    </div>
                    <div className="text-sm opacity-80">Raised</div>
                  </div>
                </div>

                <div className="flex items-center text-white/90">
                  <Target className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0" />
                  <div>
                    <div className="font-medium">
                      ${program.goal_amount?.toLocaleString() || '∞'}
                    </div>
                    <div className="text-sm opacity-80">Goal</div>
                  </div>
                </div>

                <div className="flex items-center text-white/90">
                  <Users className="w-5 h-5 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0" />
                  <div>
                    <div className="font-medium">
                      {program.beneficiaries || 'Unlimited'}
                    </div>
                    <div className="text-sm opacity-80">Beneficiaries</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </AccessibleSection>

      {/* Content Section */}
      <AccessibleSection variant="neutral" ariaLabel="قسم محتوى البرنامج">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Program Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="overflow-hidden">
                  <img
                    src={
                      program.image ||
                      'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg'
                    }
                    alt={program.title}
                    className="w-full h-64 lg:h-80 object-cover"
                  />
                </Card>
              </motion.div>

              {/* Program Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                    About This Program
                  </h2>
                  <div className="prose prose-neutral max-w-none">
                    <p className="text-neutral-600 leading-relaxed mb-6">
                      {program.description}
                    </p>
                    {program.long_description && (
                      <p className="text-neutral-600 leading-relaxed">
                        {program.long_description}
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Program Impact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                    Program Impact
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">
                          Community Impact
                        </h3>
                        <p className="text-sm text-neutral-600">
                          Directly benefiting{' '}
                          {program.beneficiaries || 'hundreds'} of people in the
                          community
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0 w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-success-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">
                          Long-term Benefits
                        </h3>
                        <p className="text-sm text-neutral-600">
                          Creating sustainable change and lasting positive
                          impact
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0 w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                        <Award className="w-6 h-6 text-accent-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">
                          Quality Standards
                        </h3>
                        <p className="text-sm text-neutral-600">
                          Following best practices and international standards
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0 w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-secondary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">
                          Excellence
                        </h3>
                        <p className="text-sm text-neutral-600">
                          Committed to delivering the highest quality outcomes
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Program Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                    Program Timeline
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900">
                          Program Launch
                        </h3>
                        <p className="text-sm text-neutral-600 mb-2">
                          Initial planning and community engagement phase
                        </p>
                        <div className="text-xs text-primary-600 font-medium">
                          Phase 1 - Completed
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0 w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-accent-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900">
                          Active Implementation
                        </h3>
                        <p className="text-sm text-neutral-600 mb-2">
                          Core program activities and direct service delivery
                        </p>
                        <div className="text-xs text-accent-600 font-medium">
                          Phase 2 - In Progress
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="flex-shrink-0 w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-neutral-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900">
                          Expansion & Growth
                        </h3>
                        <p className="text-sm text-neutral-600 mb-2">
                          Scaling successful initiatives and reaching more
                          communities
                        </p>
                        <div className="text-xs text-neutral-600 font-medium">
                          Phase 3 - Planned
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Donation Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card variant="accent">
                  <h3 className="text-xl font-bold text-neutral-900 mb-6">
                    Support This Program
                  </h3>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-neutral-700">
                        Progress
                      </span>
                      <span className="text-sm font-medium text-neutral-700">
                        {progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(
                          progressPercentage
                        )}`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-neutral-600 mt-2">
                      <span>
                        ${program.current_amount.toLocaleString()} raised
                      </span>
                      <span>
                        ${program.goal_amount?.toLocaleString() || '∞'} goal
                      </span>
                    </div>
                  </div>

                  {donationStatus === 'success' && (
                    <Alert
                      type="success"
                      title="Donation successful!"
                      className="mb-6"
                    >
                      Thank you for your generous support! We'll send you a
                      confirmation email shortly.
                    </Alert>
                  )}

                  {donationStatus === 'error' && (
                    <Alert
                      type="error"
                      title="Donation failed"
                      className="mb-6"
                    >
                      There was an error processing your donation. Please try
                      again.
                    </Alert>
                  )}

                  <form onSubmit={handleDonation} className="space-y-4">
                    <Input
                      label="First Name"
                      value={donationForm.firstName}
                      onChange={(e) =>
                        setDonationForm({
                          ...donationForm,
                          firstName: e.target.value,
                        })
                      }
                      required
                      icon={User}
                    />
                    <Input
                      label="Last Name"
                      value={donationForm.lastName}
                      onChange={(e) =>
                        setDonationForm({
                          ...donationForm,
                          lastName: e.target.value,
                        })
                      }
                      required
                      icon={User}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={donationForm.email}
                      onChange={(e) =>
                        setDonationForm({
                          ...donationForm,
                          email: e.target.value,
                        })
                      }
                      required
                      icon={Mail}
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={donationForm.phone}
                      onChange={(e) =>
                        setDonationForm({
                          ...donationForm,
                          phone: e.target.value,
                        })
                      }
                      icon={Phone}
                    />
                    <Input
                      label="Donation Amount ($)"
                      type="number"
                      value={donationForm.amount}
                      onChange={(e) =>
                        setDonationForm({
                          ...donationForm,
                          amount: e.target.value,
                        })
                      }
                      required
                      icon={DollarSign}
                      min="1"
                      step="1"
                    />
                    <Input
                      label="Message (Optional)"
                      value={donationForm.message}
                      onChange={(e) =>
                        setDonationForm({
                          ...donationForm,
                          message: e.target.value,
                        })
                      }
                      icon={Heart}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={isDonating}
                      fullWidth
                    >
                      {isDonating ? 'Processing...' : 'Donate Now'}
                    </Button>
                  </form>
                </Card>
              </motion.div>

              {/* Program Info Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card>
                  <h3 className="text-xl font-bold text-neutral-900 mb-6">
                    Program Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center text-neutral-600">
                      <Target className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0" />
                      <span className="text-sm">{program.category}</span>
                    </div>
                    <div className="flex items-center text-neutral-600">
                      <DollarSign className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0" />
                      <span className="text-sm">
                        ${program.current_amount.toLocaleString()} raised
                      </span>
                    </div>
                    <div className="flex items-center text-neutral-600">
                      <Users className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0" />
                      <span className="text-sm">
                        {program.beneficiaries || 'Unlimited'} beneficiaries
                      </span>
                    </div>
                    <div className="flex items-center text-neutral-600">
                      <Calendar className="w-4 h-4 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0" />
                      <span className="text-sm">Ongoing program</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Share Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Card>
                  <h3 className="text-xl font-bold text-neutral-900 mb-6">
                    Share Program
                  </h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Share2}
                      fullWidth
                      onClick={() => {
                        navigator.share?.({
                          title: program.title,
                          text: program.description,
                          url: window.location.href,
                        });
                      }}
                    >
                      Share Program
                    </Button>
                    <Button variant="ghost" size="sm" icon={Heart} fullWidth>
                      Add to Favorites
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </AccessibleSection>

      {/* Toast for donation status */}
      {donationStatus === 'success' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
          {t('programs.donationSuccess', 'تم التبرع بنجاح!')}
        </div>
      )}
      {donationStatus === 'error' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
          {t('programs.donationError', 'حدث خطأ أثناء التبرع. حاول مرة أخرى.')}
        </div>
      )}

      {/* Suggested Programs Section */}
      <AccessibleSection variant="content" ariaLabel="قسم البرامج المقترحة">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-primary-700 flex items-center gap-2">
            <Target className="w-6 h-6" />
            {t('programs.suggested', 'برامج مقترحة')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* برامج ثابتة كمثال */}
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="h-32 bg-gray-200 rounded-xl mb-4" />
                <div className="h-6 bg-gray-100 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/3" />
              </Card>
            ))}
          </div>
        </div>
      </AccessibleSection>
    </div>
  );
};

export default ProgramDetail;
