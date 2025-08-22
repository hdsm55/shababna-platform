import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card/Card';
import { Button } from '../components/ui/Button/Button';
import { Input } from '../components/ui/Input/Input';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/PageLoadingSpinner';
import {
  Users,
  Clock,
  Heart,
  MapPin,
  CheckCircle,
  UserPlus,
} from 'lucide-react';

const Volunteers: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>(
    'success'
  );
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    age: '',
    skills: '',
    interests: '',
    availability: '',
    motivation: '',
    experience: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/volunteers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('تم تسجيل طلب التطوع بنجاح! سنتواصل معك قريباً.');
        setMessageType('success');
        setShowForm(false);
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          country: '',
          city: '',
          age: '',
          skills: '',
          interests: '',
          availability: '',
          motivation: '',
          experience: '',
        });
      } else {
        setMessage(data.message || 'حدث خطأ أثناء التسجيل');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('حدث خطأ في الاتصال بالخادم');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <Heart className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              انضم إلينا كمتطوع
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ساعدنا في بناء مستقبل أفضل للشباب. انضم إلى فريق المتطوعين لدينا
              وساهم في إحداث تغيير إيجابي في المجتمع.
            </p>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-8 mb-12"
          >
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">مجتمع متطوعين</h3>
              <p className="text-gray-600">
                انضم إلى مجتمع من المتطوعين المتحمسين الذين يشاركونك نفس القيم
                والأهداف.
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">مرونة في الوقت</h3>
              <p className="text-gray-600">
                اختر الأوقات التي تناسبك للمساهمة في الأنشطة والفعاليات
                المختلفة.
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">تأثير محلي وعالمي</h3>
              <p className="text-gray-600">
                ساهم في إحداث تغيير إيجابي في مجتمعك المحلي وفي العالم.
              </p>
            </Card>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              انضم كمتطوع الآن
            </Button>
          </motion.div>

          {/* Volunteer Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    نموذج التطوع
                  </h2>
                  <Button
                    variant="ghost"
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </Button>
                </div>

                {message && (
                  <Alert
                    type={messageType}
                    onClose={() => setMessage('')}
                    className="mb-6"
                  >
                    {message}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الاسم الأول *
                      </label>
                      <Input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الاسم الأخير *
                      </label>
                      <Input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        البريد الإلكتروني *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رقم الهاتف
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الدولة *
                      </label>
                      <Input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المدينة
                      </label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العمر
                    </label>
                    <Input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      min="16"
                      max="100"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المهارات والخبرات
                    </label>
                    <textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="اذكر مهاراتك وخبراتك..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاهتمامات
                    </label>
                    <textarea
                      name="interests"
                      value={formData.interests}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="اذكر اهتماماتك..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التوفر
                    </label>
                    <textarea
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="اذكر الأوقات التي تتوفر فيها..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الدافع للتطوع
                    </label>
                    <textarea
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="اذكر دوافعك للتطوع معنا..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الخبرة السابقة في التطوع
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="اذكر خبرتك السابقة في التطوع إن وجدت..."
                    />
                  </div>

                  <div className="flex justify-end space-x-4 space-x-reverse">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      disabled={isLoading}
                    >
                      إلغاء
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          إرسال الطلب
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {/* Statistics Section */}
          <motion.div variants={itemVariants} className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              إحصائيات المتطوعين
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  150+
                </div>
                <div className="text-gray-600">متطوع نشط</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-success-600 mb-2">
                  2,500+
                </div>
                <div className="text-gray-600">ساعة تطوع</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  25+
                </div>
                <div className="text-gray-600">فعالية منظمة</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  15+
                </div>
                <div className="text-gray-600">دولة مشاركة</div>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Volunteers;
