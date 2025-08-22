import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, Clock } from 'lucide-react';

interface EmailValidatorProps {
  email: string;
  className?: string;
}

const EmailValidator: React.FC<EmailValidatorProps> = ({
  email,
  className = '',
}) => {
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getEmailInfo = (email: string) => {
    if (!email) return null;

    const isValid = validateEmail(email);
    const hasAtSymbol = email.includes('@');
    const hasDomain = email.includes('.');
    const hasLocalPart = email.split('@')[0]?.length > 0;
    const hasDomainPart = email.split('@')[1]?.length > 0;

    return {
      isValid,
      hasAtSymbol,
      hasDomain,
      hasLocalPart,
      hasDomainPart,
    };
  };

  const emailInfo = getEmailInfo(email);

  if (!email) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`mt-2 ${className}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {emailInfo?.isValid ? (
          <CheckCircle className="w-4 h-4 text-success-500" />
        ) : (
          <Clock className="w-4 h-4 text-yellow-500" />
        )}
        <span
          className={`text-sm font-medium ${
            emailInfo?.isValid ? 'text-success-600' : 'text-yellow-600'
          }`}
        >
          {emailInfo?.isValid
            ? 'بريد إلكتروني صحيح'
            : 'جاري التحقق من البريد الإلكتروني'}
        </span>
      </div>

      {/* متطلبات البريد الإلكتروني */}
      <div className="space-y-1">
        <div
          className={`flex items-center gap-1 text-xs ${
            emailInfo?.hasLocalPart ? 'text-success-600' : 'text-gray-400'
          }`}
        >
          <CheckCircle className="w-3 h-3" />
          <span>جزء محلي (قبل @)</span>
        </div>
        <div
          className={`flex items-center gap-1 text-xs ${
            emailInfo?.hasAtSymbol ? 'text-success-600' : 'text-gray-400'
          }`}
        >
          <CheckCircle className="w-3 h-3" />
          <span>رمز @</span>
        </div>
        <div
          className={`flex items-center gap-1 text-xs ${
            emailInfo?.hasDomainPart ? 'text-success-600' : 'text-gray-400'
          }`}
        >
          <CheckCircle className="w-3 h-3" />
          <span>جزء النطاق (بعد @)</span>
        </div>
        <div
          className={`flex items-center gap-1 text-xs ${
            emailInfo?.hasDomain ? 'text-success-600' : 'text-gray-400'
          }`}
        >
          <CheckCircle className="w-3 h-3" />
          <span>نقطة في النطاق</span>
        </div>
      </div>

      {/* رسائل إضافية */}
      <AnimatePresence>
        {email && !emailInfo?.isValid && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs text-yellow-600 mt-2 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            تأكد من صحة تنسيق البريد الإلكتروني
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EmailValidator;
