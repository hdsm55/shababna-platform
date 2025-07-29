import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  className = '',
}) => {
  const calculateStrength = (password: string): number => {
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return strength;
  };

  const getStrengthInfo = (strength: number) => {
    if (strength <= 2) {
      return {
        label: 'ضعيفة',
        color: 'text-red-500',
        bgColor: 'bg-red-500',
        icon: AlertTriangle,
        message: 'يجب أن تحتوي على 6 أحرف على الأقل',
      };
    } else if (strength === 3) {
      return {
        label: 'متوسطة',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500',
        icon: AlertTriangle,
        message: 'أضف أرقام أو رموز لتحسين القوة',
      };
    } else if (strength === 4) {
      return {
        label: 'جيدة',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500',
        icon: Shield,
        message: 'كلمة مرور جيدة',
      };
    } else {
      return {
        label: 'قوية',
        color: 'text-green-500',
        bgColor: 'bg-green-500',
        icon: CheckCircle,
        message: 'كلمة مرور قوية جداً',
      };
    }
  };

  const strength = calculateStrength(password);
  const strengthInfo = getStrengthInfo(strength);
  const IconComponent = strengthInfo.icon;

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`mt-2 ${className}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <IconComponent className={`w-4 h-4 ${strengthInfo.color}`} />
        <span className={`text-sm font-medium ${strengthInfo.color}`}>
          {strengthInfo.label}
        </span>
      </div>

      <div className="flex space-x-1 mb-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <motion.div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              strength >= level ? strengthInfo.bgColor : 'bg-gray-200'
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: strength >= level ? 1 : 0 }}
            transition={{ duration: 0.3, delay: level * 0.1 }}
          />
        ))}
      </div>

      <p className="text-xs text-gray-500">{strengthInfo.message}</p>

      {/* متطلبات إضافية */}
      <div className="mt-2 space-y-1">
        <div
          className={`flex items-center gap-1 text-xs ${
            password.length >= 6 ? 'text-green-600' : 'text-gray-400'
          }`}
        >
          <CheckCircle className="w-3 h-3" />
          <span>6 أحرف على الأقل</span>
        </div>
        <div
          className={`flex items-center gap-1 text-xs ${
            /[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'
          }`}
        >
          <CheckCircle className="w-3 h-3" />
          <span>حرف كبير</span>
        </div>
        <div
          className={`flex items-center gap-1 text-xs ${
            /[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'
          }`}
        >
          <CheckCircle className="w-3 h-3" />
          <span>رقم</span>
        </div>
        <div
          className={`flex items-center gap-1 text-xs ${
            /[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'
          }`}
        >
          <CheckCircle className="w-3 h-3" />
          <span>رمز خاص</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PasswordStrengthIndicator;
