import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import {
  Heart,
  DollarSign,
  Users,
  Target,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  TrendingUp,
  Globe,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import SectionTitle from '../components/common/SectionTitle';
import {
  AccessibleSection,
  AccessibleCard,
  AccessibleButton,
  SkipToContent,
} from '../components/common/AccessibleComponents';

const Donations: React.FC = () => {
  const { t } = useTranslation();
  const [donationForm, setDonationForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    amount: '',
    program: '',
    message: '',
    isAnonymous: false,
  });
  const [isDonating, setIsDonating] = useState(false);
  const [donationStatus, setDonationStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

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
        program: '',
        message: '',
        isAnonymous: false,
      });
    } catch (err) {
      setDonationStatus('error');
    } finally {
      setIsDonating(false);
    }
  };

  const donationOptions = [
    {
      amount: 25,
      description: 'Provides educational materials for one student',
      icon: Target,
      popular: false,
    },
    {
      amount: 50,
      description: 'Supports a family with basic necessities',
      icon: Heart,
      popular: true,
    },
    {
      amount: 100,
      description: 'Funds a complete educational program',
      icon: Users,
      popular: false,
    },
    {
      amount: 250,
      description: 'Creates lasting community impact',
      icon: Globe,
      popular: false,
    },
  ];

  const impactStats = [
    {
      number: '500+',
      label: 'Students Supported',
      icon: Users,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      number: '$50K+',
      label: 'Funds Raised',
      icon: DollarSign,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
    },
    {
      number: '25+',
      label: 'Communities Impacted',
      icon: Globe,
      color: 'text-accent-600',
      bgColor: 'bg-accent-100',
    },
    {
      number: '95%',
      label: 'Success Rate',
      icon: TrendingUp,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100',
    },
  ];

  return (
    <div className="min-h-screen">
      <SkipToContent />
      <SEO
        title="Donations"
        description="Support Shababna Global's mission to empower youth worldwide. Your donation helps fund programs, events, and initiatives that create positive change."
        type="website"
      />

      {/* Hero Section */}
      <AccessibleSection variant="hero" ariaLabel="قسم رأس صفحة التبرعات">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 shadow-lg">
                <Heart className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">
                  Make a Difference
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight text-shadow-lg">
                Support Our Mission
              </h1>
              <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                Your generous donation helps us create lasting positive change
                in communities around the world. Every contribution makes a real
                difference.
              </p>
            </motion.div>
          </div>
        </div>
      </AccessibleSection>

      {/* Impact Stats Section */}
      <AccessibleSection variant="content" ariaLabel="قسم إحصائيات التأثير">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group cursor-pointer"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 ${stat.bgColor} rounded-xl mb-4 group-hover:scale-110 transition-all duration-300`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {stat.number}
                </div>
                <div className="text-sm text-neutral-600 group-hover:text-neutral-800 transition-colors">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AccessibleSection>

      {/* Donation Options Section */}
      <AccessibleSection variant="neutral" ariaLabel="قسم خيارات التبرع">
        <div className="container">
          <div className="text-center mb-16">
            <SectionTitle
              variant="centered"
              size="lg"
              className="text-neutral-900"
            >
              Choose Your Impact
            </SectionTitle>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Select a donation amount that matches your desired impact level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  hover
                  variant={option.popular ? 'accent' : 'elevated'}
                  className={`h-full cursor-pointer relative ${
                    option.popular ? 'ring-2 ring-accent-500' : ''
                  }`}
                  onClick={() =>
                    setDonationForm({
                      ...donationForm,
                      amount: option.amount.toString(),
                    })
                  }
                >
                  {option.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center p-6">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 ${
                        option.popular ? 'bg-accent-100' : 'bg-primary-100'
                      } rounded-xl mb-4`}
                    >
                      <option.icon
                        className={`w-8 h-8 ${
                          option.popular
                            ? 'text-accent-600'
                            : 'text-primary-600'
                        }`}
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                      ${option.amount}
                    </h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </AccessibleSection>

      {/* Donation Form Section */}
      <AccessibleSection variant="content" ariaLabel="قسم نموذج التبرع">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card variant="elevated">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Make Your Donation
                </h2>

                {donationStatus === 'success' && (
                  <Alert
                    type="success"
                    title="Thank you for your donation!"
                    className="mb-6"
                  >
                    Your generous contribution will make a real difference.
                    We'll send you a confirmation email shortly.
                  </Alert>
                )}

                {donationStatus === 'error' && (
                  <Alert type="error" title="Donation failed" className="mb-6">
                    There was an error processing your donation. Please try
                    again.
                  </Alert>
                )}

                <form onSubmit={handleDonation} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      label="Program (Optional)"
                      value={donationForm.program}
                      onChange={(e) =>
                        setDonationForm({
                          ...donationForm,
                          program: e.target.value,
                        })
                      }
                      icon={Target}
                    />
                  </div>

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

                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={donationForm.isAnonymous}
                      onChange={(e) =>
                        setDonationForm({
                          ...donationForm,
                          isAnonymous: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <label
                      htmlFor="anonymous"
                      className="text-sm text-neutral-700"
                    >
                      Make this donation anonymous
                    </label>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={isDonating}
                    fullWidth
                    icon={Heart}
                    iconPosition="right"
                  >
                    {isDonating ? 'Processing...' : 'Donate Now'}
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <Card>
                <h3 className="text-xl font-bold text-neutral-900 mb-6">
                  Why Donate?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900">
                        Direct Impact
                      </h4>
                      <p className="text-sm text-neutral-600">
                        Your donation goes directly to programs that create real
                        change in communities.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="flex-shrink-0 w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-success-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900">
                        Transparency
                      </h4>
                      <p className="text-sm text-neutral-600">
                        We provide regular updates on how your donations are
                        being used.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="flex-shrink-0 w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-accent-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900">
                        Proven Results
                      </h4>
                      <p className="text-sm text-neutral-600">
                        Our programs have a 95% success rate in achieving their
                        goals.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-xl font-bold text-neutral-900 mb-6">
                  How Your Donation Helps
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Education</span>
                    <span className="text-sm font-medium text-neutral-900">
                      40%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: '40%' }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">
                      Community Development
                    </span>
                    <span className="text-sm font-medium text-neutral-900">
                      30%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-success-600 h-2 rounded-full"
                      style={{ width: '30%' }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">
                      Emergency Relief
                    </span>
                    <span className="text-sm font-medium text-neutral-900">
                      20%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-accent-600 h-2 rounded-full"
                      style={{ width: '20%' }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">
                      Administrative
                    </span>
                    <span className="text-sm font-medium text-neutral-900">
                      10%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-secondary-600 h-2 rounded-full"
                      style={{ width: '10%' }}
                    ></div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </AccessibleSection>
    </div>
  );
};

export default Donations;
