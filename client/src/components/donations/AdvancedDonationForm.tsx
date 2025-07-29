import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Alert } from '../common/Alert';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { CreditCard, Bank, Wallet, Globe, Gift, Heart } from 'lucide-react';
import { api } from '../../services/api';

interface DonationFormData {
  amount: string;
  currency: string;
  donorName: string;
  donorEmail: string;
  phone: string;
  programId: string;
  programName: string;
  message: string;
  paymentMethod: 'stripe' | 'iyzico' | 'bank' | 'cash';
  anonymous: boolean;
}

interface Program {
  id: number;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
}

interface PaymentSettings {
  stripe: {
    enabled: boolean;
    publishableKey: string;
  };
  iyzico: {
    enabled: boolean;
  };
  currencies: string[];
  paymentMethods: string[];
}

const AdvancedDonationForm: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<DonationFormData>({
    amount: '',
    currency: 'USD',
    donorName: '',
    donorEmail: '',
    phone: '',
    programId: '',
    programName: '',
    message: '',
    paymentMethod: 'stripe',
    anonymous: false,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // جلب البرامج
  const { data: programs } = useQuery({
    queryKey: ['programs'],
    queryFn: () => api.get('/programs').then((res) => res.data),
  });

  // جلب إعدادات المدفوعات
  const { data: paymentSettings } = useQuery({
    queryKey: ['payment-settings'],
    queryFn: () =>
      api.get('/payments/settings').then((res) => res.data.settings),
  });

  const handleInputChange = (
    field: keyof DonationFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProgramChange = (programId: string) => {
    const program = programs?.data?.find(
      (p: Program) => p.id.toString() === programId
    );
    setFormData((prev) => ({
      ...prev,
      programId,
      programName: program?.title || '',
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('يرجى إدخال مبلغ صحيح');
      return false;
    }
    if (!formData.donorName && !formData.anonymous) {
      setError('يرجى إدخال اسم المتبرع');
      return false;
    }
    if (!formData.donorEmail) {
      setError('يرجى إدخال البريد الإلكتروني');
      return false;
    }
    return true;
  };

  const handleStripePayment = async () => {
    try {
      setIsProcessing(true);
      setError('');

      const response = await api.post('/payments/stripe/create-session', {
        amount: parseFloat(formData.amount),
        currency: formData.currency.toLowerCase(),
        donorName: formData.donorName,
        donorEmail: formData.donorEmail,
        programId: formData.programId,
        programName: formData.programName,
        message: formData.message,
        phone: formData.phone,
      });

      if (response.data.success) {
        // تحميل Stripe
        const stripe = await loadStripe(
          paymentSettings?.stripe?.publishableKey || ''
        );
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({
            sessionId: response.data.sessionId,
          });
          if (error) {
            setError('حدث خطأ أثناء توجيه الدفع');
          }
        }
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || 'حدث خطأ أثناء إنشاء جلسة الدفع'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIyzicoPayment = async () => {
    try {
      setIsProcessing(true);
      setError('');

      const response = await api.post('/payments/iyzico/create-session', {
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        donorName: formData.donorName,
        donorEmail: formData.donorEmail,
        programId: formData.programId,
        programName: formData.programName,
        message: formData.message,
        phone: formData.phone,
      });

      if (response.data.success) {
        // إنشاء نافذة Iyzico
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://sandbox-api.iyzipay.com';
        form.innerHTML = response.data.checkoutFormContent;
        document.body.appendChild(form);
        form.submit();
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || 'حدث خطأ أثناء إنشاء جلسة الدفع'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsProcessing(true);
      setError('');

      if (formData.paymentMethod === 'stripe') {
        await handleStripePayment();
      } else if (formData.paymentMethod === 'iyzico') {
        await handleIyzicoPayment();
      } else {
        // دفع يدوي (بنك أو نقد)
        const response = await api.post('/donations', {
          donor_name: formData.anonymous ? 'مجهول' : formData.donorName,
          amount: parseFloat(formData.amount),
          program_id: formData.programId || null,
          payment_method: formData.paymentMethod,
          status: 'pending',
          notes: formData.message,
        });

        if (response.data.success) {
          setSuccess('تم إرسال طلب التبرع بنجاح! سنتواصل معك قريباً.');
          setFormData({
            amount: '',
            currency: 'USD',
            donorName: '',
            donorEmail: '',
            phone: '',
            programId: '',
            programName: '',
            message: '',
            paymentMethod: 'stripe',
            anonymous: false,
          });
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'حدث خطأ أثناء إرسال التبرع');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'stripe':
        return <CreditCard className="w-5 h-5" />;
      case 'iyzico':
        return <Globe className="w-5 h-5" />;
      case 'bank':
        return <Bank className="w-5 h-5" />;
      case 'cash':
        return <Wallet className="w-5 h-5" />;
      default:
        return <Gift className="w-5 h-5" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'stripe':
        return 'بطاقة ائتمان (دولية)';
      case 'iyzico':
        return 'بطاقة ائتمان (تركية)';
      case 'bank':
        return 'تحويل بنكي';
      case 'cash':
        return 'نقداً';
      default:
        return 'تبرع';
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Heart className="w-6 h-6 text-red-500" />
          تبرع الآن
        </CardTitle>
        <p className="text-gray-600">
          اختر البرنامج والمبلغ وطريقة الدفع المناسبة لك
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" title="خطأ">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="default" title="نجح">
              {success}
            </Alert>
          )}

          {/* اختيار البرنامج */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              اختر البرنامج (اختياري)
            </label>
            <select
              value={formData.programId}
              onChange={(e) => handleProgramChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">تبرع عام</option>
              {programs?.data?.map((program: Program) => (
                <option key={program.id} value={program.id}>
                  {program.title} - {program.current_amount}/
                  {program.goal_amount} ريال
                </option>
              ))}
            </select>
          </div>

          {/* المبلغ والعملة */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">المبلغ *</label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="أدخل المبلغ"
                min="1"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">العملة</label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">دولار أمريكي</option>
                <option value="EUR">يورو</option>
                <option value="SAR">ريال سعودي</option>
                <option value="AED">درهم إماراتي</option>
                <option value="TRY">ليرة تركية</option>
              </select>
            </div>
          </div>

          {/* معلومات المتبرع */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={formData.anonymous}
                onChange={(e) =>
                  handleInputChange('anonymous', e.target.checked)
                }
                className="w-4 h-4"
              />
              <label htmlFor="anonymous" className="text-sm">
                تبرع مجهول
              </label>
            </div>

            {!formData.anonymous && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  اسم المتبرع *
                </label>
                <Input
                  type="text"
                  value={formData.donorName}
                  onChange={(e) =>
                    handleInputChange('donorName', e.target.value)
                  }
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                البريد الإلكتروني *
              </label>
              <Input
                type="email"
                value={formData.donorEmail}
                onChange={(e) =>
                  handleInputChange('donorEmail', e.target.value)
                }
                placeholder="أدخل بريدك الإلكتروني"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                رقم الهاتف (اختياري)
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="أدخل رقم هاتفك"
              />
            </div>
          </div>

          {/* طريقة الدفع */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">طريقة الدفع</label>
            <div className="grid grid-cols-2 gap-3">
              {paymentSettings?.stripe?.enabled && (
                <button
                  type="button"
                  onClick={() => handleInputChange('paymentMethod', 'stripe')}
                  className={`p-3 border rounded-lg flex items-center gap-2 transition-colors ${
                    formData.paymentMethod === 'stripe'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-sm">بطاقة ائتمان</span>
                </button>
              )}

              {paymentSettings?.iyzico?.enabled && (
                <button
                  type="button"
                  onClick={() => handleInputChange('paymentMethod', 'iyzico')}
                  className={`p-3 border rounded-lg flex items-center gap-2 transition-colors ${
                    formData.paymentMethod === 'iyzico'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-sm">بطاقة تركية</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleInputChange('paymentMethod', 'bank')}
                className={`p-3 border rounded-lg flex items-center gap-2 transition-colors ${
                  formData.paymentMethod === 'bank'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Bank className="w-5 h-5" />
                <span className="text-sm">تحويل بنكي</span>
              </button>

              <button
                type="button"
                onClick={() => handleInputChange('paymentMethod', 'cash')}
                className={`p-3 border rounded-lg flex items-center gap-2 transition-colors ${
                  formData.paymentMethod === 'cash'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Wallet className="w-5 h-5" />
                <span className="text-sm">نقداً</span>
              </button>
            </div>
          </div>

          {/* رسالة إضافية */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              رسالة إضافية (اختياري)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="اكتب رسالة إضافية..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* زر التبرع */}
          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 text-lg font-medium"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                جاري المعالجة...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                تبرع الآن
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdvancedDonationForm;
