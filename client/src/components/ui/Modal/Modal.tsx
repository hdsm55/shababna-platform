import React, { useEffect, useRef } from 'react';
import { getCardClasses } from '../../common/DesignSystem';
import { DESIGN_SYSTEM } from '../../common/DesignSystem';
import { Button } from '../Button/ButtonSimple';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  dir?: 'rtl' | 'ltr';
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  actions,
  dir,
  className = '',
  children,
  ...props
}) => {
  const direction =
    dir ||
    (typeof document !== 'undefined'
      ? (document.documentElement.dir as 'rtl' | 'ltr')
      : 'rtl');
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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      dir={direction}
    >
      {/* الخلفية */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="إغلاق المودال"
      />
      {/* المودال */}
      <div
        ref={modalRef}
        className={[
          'relative w-full max-w-4xl max-h-[90vh] overflow-y-auto',
          getCardClasses('elevated'),
          'rounded-xl shadow-xl bg-white',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          className,
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-desc' : undefined}
        tabIndex={-1}
        {...props}
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس المودال */}
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-neutral-200 px-6 py-4 flex-shrink-0">
            <div>
              {title && (
                <h3 id="modal-title" className="text-lg font-medium">
                  {title}
                </h3>
              )}
              {description && (
                <p id="modal-desc" className="mt-1 text-sm text-neutral-500">
                  {description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-500"
              aria-label="إغلاق"
            >
              ×
            </Button>
          </div>
        )}
        {/* محتوى المودال */}
        <div className="overflow-y-auto flex-1">{children}</div>
        {/* أزرار الإجراءات */}
        {actions && (
          <div className="flex justify-end gap-2 px-6 pb-4 flex-shrink-0 border-t border-neutral-200">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';
