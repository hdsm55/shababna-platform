import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

interface InputValidationProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  validationRules?: ValidationRule[];
  showPasswordToggle?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

export const InputValidation: React.FC<InputValidationProps> = ({
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  label,
  required = false,
  disabled = false,
  className = '',
  validationRules = [],
  showPasswordToggle = false,
  maxLength,
  minLength,
  pattern,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Sanitize input value
  const sanitizeInput = (input: string): string => {
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  };

  // Validate input
  const validateInput = (input: string): string[] => {
    const newErrors: string[] = [];

    // Required validation
    if (required && !input.trim()) {
      newErrors.push('هذا الحقل مطلوب');
    }

    // Length validation
    if (minLength && input.length < minLength) {
      newErrors.push(`يجب أن يكون الطول على الأقل ${minLength} أحرف`);
    }

    if (maxLength && input.length > maxLength) {
      newErrors.push(`يجب أن يكون الطول أقل من ${maxLength} أحرف`);
    }

    // Pattern validation
    if (pattern && input && !new RegExp(pattern).test(input)) {
      newErrors.push('القيمة المدخلة غير صحيحة');
    }

    // Type-specific validation
    if (type === 'email' && input) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        newErrors.push('يرجى إدخال بريد إلكتروني صحيح');
      }
    }

    if (type === 'tel' && input) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
      if (!phoneRegex.test(input)) {
        newErrors.push('يرجى إدخال رقم هاتف صحيح');
      }
    }

    if (type === 'url' && input) {
      try {
        new URL(input);
      } catch {
        newErrors.push('يرجى إدخال رابط صحيح');
      }
    }

    // Custom validation rules
    validationRules.forEach((rule) => {
      if (input && !rule.test(input)) {
        newErrors.push(rule.message);
      }
    });

    return newErrors;
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    onChange(sanitizedValue);

    if (isTouched) {
      const newErrors = validateInput(sanitizedValue);
      setErrors(newErrors);
    }
  };

  // Handle blur
  const handleBlur = () => {
    setIsFocused(false);
    setIsTouched(true);
    const newErrors = validateInput(value);
    setErrors(newErrors);
    onBlur?.();
  };

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasErrors = errors.length > 0;
  const isValid = isTouched && !hasErrors && value.trim() !== '';

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isFocused ? 'border-primary-500 focus:ring-primary-500' : ''}
            ${hasErrors ? 'border-red-500 focus:ring-red-500' : ''}
            ${isValid ? 'border-green-500 focus:ring-green-500' : ''}
            ${!isFocused && !hasErrors && !isValid ? 'border-gray-300' : ''}
          `}
        />

        {/* Password Toggle */}
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Validation Icons */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isTouched && (
            <AnimatePresence>
              {hasErrors ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-red-500"
                >
                  <AlertCircle className="w-5 h-5" />
                </motion.div>
              ) : isValid ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-green-500"
                >
                  <CheckCircle className="w-5 h-5" />
                </motion.div>
              ) : null}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Error Messages */}
      <AnimatePresence>
        {hasErrors && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1"
          >
            {errors.map((error, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-sm text-red-600 flex items-center"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Count */}
      {maxLength && (
        <div className="text-xs text-gray-500 text-right">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
};

// Predefined validation rules
export const validationRules = {
  // Email validation
  email: {
    test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'يرجى إدخال بريد إلكتروني صحيح',
  },

  // Phone validation
  phone: {
    test: (value: string) => /^[\+]?[0-9\s\-\(\)]{8,}$/.test(value),
    message: 'يرجى إدخال رقم هاتف صحيح',
  },

  // URL validation
  url: {
    test: (value: string) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message: 'يرجى إدخال رابط صحيح',
  },

  // Strong password validation
  strongPassword: {
    test: (value: string) => {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumbers = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      return (
        value.length >= 8 &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar
      );
    },
    message:
      'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص',
  },

  // Arabic text validation
  arabicText: {
    test: (value: string) => /[\u0600-\u06FF]/.test(value),
    message: 'يرجى إدخال نص باللغة العربية',
  },

  // Numbers only
  numbersOnly: {
    test: (value: string) => /^\d+$/.test(value),
    message: 'يرجى إدخال أرقام فقط',
  },

  // No special characters
  noSpecialChars: {
    test: (value: string) => /^[a-zA-Z0-9\u0600-\u06FF\s]+$/.test(value),
    message: 'لا يُسمح بالرموز الخاصة',
  },
};

export default InputValidation;
