import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface PasswordMatchIndicatorProps {
  password: string;
  confirmPassword: string;
  className?: string;
}

const PasswordMatchIndicator: React.FC<PasswordMatchIndicatorProps> = ({
  password,
  confirmPassword,
  className = '',
}) => {
  const getMatchInfo = (password: string, confirmPassword: string) => {
    if (!password || !confirmPassword) return null;

    const isMatch = password === confirmPassword;
    const hasConfirmPassword = confirmPassword.length > 0;
    const passwordLength = password.length;
    const confirmLength = confirmPassword.length;

    return {
      isMatch,
      hasConfirmPassword,
      passwordLength,
      confirmLength,
    };
  };

  const matchInfo = getMatchInfo(password, confirmPassword);

  if (!password || !confirmPassword) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`mt-2 ${className}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {matchInfo?.isMatch ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <Clock className="w-4 h-4 text-yellow-500" />
        )}
        <span
          className={`text-sm font-medium ${
            matchInfo?.isMatch ? 'text-green-600' : 'text-yellow-600'
          }`}
        >
          {matchInfo?.isMatch
            ? 'كلمتا المرور متطابقتان'
            : 'جاري التحقق من تطابق كلمتي المرور'}
        </span>
      </div>

      {/* تفاصيل التطابق */}
      <div className="space-y-1">
        <div
          className={`flex items-center gap-1 text-xs ${
            password.length > 0 ? 'text-green-600' : 'text-gray-400'
          }`}
        >
          <CheckCircle className="w-3 h-3" />
          <span>كلمة المرور الأولى: {password.length} حرف</span>
        </div>
        <div
          className={`flex items-center gap-1 text-xs ${
            confirmPassword.length > 0 ? 'text-green-600' : 'text-gray-400'
          }`}
        >
          <CheckCircle className="w-3 h-3" />
          <span>كلمة المرور الثانية: {confirmPassword.length} حرف</span>
        </div>
        <div
          className={`flex items-center gap-1 text-xs ${
            matchInfo?.isMatch ? 'text-green-600' : 'text-gray-400'
          }`}
        >
          <CheckCircle className="w-3 h-3" />
          <span>التطابق: {matchInfo?.isMatch ? 'نعم' : 'لا'}</span>
        </div>
      </div>

      {/* رسائل إضافية */}
      <AnimatePresence>
        {confirmPassword && !matchInfo?.isMatch && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs text-red-600 mt-2 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            كلمتا المرور غير متطابقتين
          </motion.p>
        )}
      </AnimatePresence>

      {/* مؤشر بصري للتطابق */}
      <div className="mt-2">
        <div className="flex space-x-1">
          <div
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              password.length > 0 ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          />
          <div
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              confirmPassword.length > 0 ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          />
          <div
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              matchInfo?.isMatch ? 'bg-green-500' : 'bg-gray-200'
            }`}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {password.length > 0 &&
            confirmPassword.length > 0 &&
            !matchInfo?.isMatch &&
            'تحقق من تطابق كلمتي المرور'}
          {matchInfo?.isMatch && 'تم التحقق من التطابق بنجاح'}
        </p>
      </div>
    </motion.div>
  );
};

export default PasswordMatchIndicator;
