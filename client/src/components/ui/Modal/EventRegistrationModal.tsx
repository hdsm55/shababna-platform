import React, { useEffect, useRef } from 'react';
import { Button } from '../Button/ButtonSimple';
import { Input } from '../Input/InputSimple';
import { Card } from '../Card/Card';
import { X, Calendar, MapPin, Users, Clock, CheckCircle } from 'lucide-react';
import { Event } from '../../../types';

interface EventRegistrationModalProps {
  open: boolean;
  onClose: () => void;
  event: Event | null;
  registrationForm: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  open,
  onClose,
  event,
  registrationForm,
  onInputChange,
  onSubmit,
  isLoading = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // إغلاق عند الضغط على Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  // منع التمرير عند فتح المودال
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open || !event) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'conference':
        return '🎤';
      case 'workshop':
        return '🔧';
      case 'seminar':
        return '📚';
      case 'training':
        return '💡';
      case 'networking':
        return '🤝';
      default:
        return '📅';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* الخلفية */}
      <div
        className="fixed inset-0 bg-black/95 backdrop-blur-xl"
        onClick={onClose}
        aria-label="إغلاق النافذة المنبثقة"
      />

      {/* المودال */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white rounded-lg shadow-2xl border border-primary-100 transform transition-all duration-300 ease-out"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس المودال */}
        <div className="flex items-center justify-between p-4 border-b border-primary-100 bg-gradient-to-r from-primary-50 via-white to-secondary-50 rounded-t-lg">
          <div className="flex-1">
            <h3
              id="modal-title"
              className="text-base font-bold text-primary-700 mb-1"
            >
              تسجيل في الفعالية
            </h3>
            <p className="text-xs text-primary-600 font-medium">
              أكمل البيانات التالية للتسجيل في الفعالية
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="ml-2 -mt-1 -mr-1 text-primary-500 hover:text-primary-700 hover:bg-primary-50 rounded-full p-1"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* محتوى المودال */}
        <div className="p-4 space-y-3">
          {/* معلومات الفعالية */}
          <Card className="p-3 bg-gradient-to-br from-primary-50 via-white to-secondary-50 border border-primary-200 shadow-sm">
            <div className="flex items-start gap-3">
              {/* أيقونة الفعالية */}
              <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-md flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-sm">{getEventIcon(event.category)}</span>
              </div>

              {/* تفاصيل الفعالية */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-dark-700 mb-1">
                  {event.title}
                </h4>
                <p className="text-dark-600 text-xs mb-2 leading-relaxed line-clamp-2">
                  {event.description}
                </p>

                {/* معلومات إضافية */}
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div className="flex items-center gap-1 text-primary-700 bg-primary-50 px-2 py-1 rounded">
                    <Calendar className="w-3 h-3 text-primary-600" />
                    <span className="font-semibold">
                      {formatDate(event.start_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-secondary-700 bg-secondary-50 px-2 py-1 rounded">
                    <Clock className="w-3 h-3 text-secondary-600" />
                    <span className="font-semibold">
                      {formatTime(event.start_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-accent-700 bg-accent-50 px-2 py-1 rounded">
                    <MapPin className="w-3 h-3 text-accent-600" />
                    <span className="font-semibold">{event.location}</span>
                  </div>
                  {event.max_attendees && (
                    <div className="flex items-center gap-1 text-dark-600 bg-dark-50 px-2 py-1 rounded">
                      <Users className="w-3 h-3 text-dark-500" />
                      <span className="font-semibold">
                        {event.attendees || 0} / {event.max_attendees} مشارك
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* نموذج التسجيل */}
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="الاسم الأول"
                value={registrationForm.firstName}
                onChange={(e) => onInputChange('firstName', e.target.value)}
                required
                placeholder="أدخل اسمك الأول"
                className="focus:border-primary-500 focus:ring-primary-500 bg-white text-sm"
              />
              <Input
                label="اسم العائلة"
                value={registrationForm.lastName}
                onChange={(e) => onInputChange('lastName', e.target.value)}
                required
                placeholder="أدخل اسم العائلة"
                className="focus:border-primary-500 focus:ring-primary-500 bg-white text-sm"
              />
            </div>

            <Input
              label="البريد الإلكتروني"
              type="email"
              value={registrationForm.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              required
              placeholder="example@email.com"
              className="focus:border-primary-500 focus:ring-primary-500 bg-white text-sm"
            />

            <Input
              label="رقم الهاتف"
              type="tel"
              value={registrationForm.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              required
              placeholder="+90 505 050 56 45"
              className="focus:border-primary-500 focus:ring-primary-500 bg-white text-sm"
            />

            {/* أزرار الإجراءات */}
            <div className="flex gap-2 pt-3 border-t border-primary-100">
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded shadow-md text-sm"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري التسجيل...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" />
                    تأكيد التسجيل
                  </div>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="border-primary-200 text-primary-600 hover:bg-primary-50 disabled:opacity-50 font-semibold py-2 px-3 rounded text-sm"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
