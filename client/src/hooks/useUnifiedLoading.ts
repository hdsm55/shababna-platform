import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingType, LoadingSize, LoadingVariant, LoadingColor } from '../components/common/UnifiedLoadingStates';

/**
 * Hook لحالات التحميل الموحدة
 * يوفر واجهة بسيطة لإدارة حالات التحميل في جميع أنحاء التطبيق
 */

interface LoadingState {
  id: string;
  type: LoadingType;
  message?: string;
  size?: LoadingSize;
  variant?: LoadingVariant;
  color?: LoadingColor;
  showTips?: boolean;
}

interface LoadingOptions {
  message?: string;
  size?: LoadingSize;
  variant?: LoadingVariant;
  color?: LoadingColor;
  showTips?: boolean;
  autoHide?: boolean;
  duration?: number;
}

export const useUnifiedLoading = () => {
  const { t } = useTranslation();
  const [loadingStates, setLoadingStates] = useState<LoadingState[]>([]);

  // إضافة حالة تحميل جديدة
  const addLoading = useCallback((
    type: LoadingType,
    options: LoadingOptions = {}
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newLoading: LoadingState = {
      id,
      type,
      message: options.message,
      size: options.size,
      variant: options.variant,
      color: options.color,
      showTips: options.showTips,
    };

    setLoadingStates(prev => [...prev, newLoading]);

    // إخفاء تلقائي إذا تم التحديد
    if (options.autoHide && options.duration) {
      setTimeout(() => {
        removeLoading(id);
      }, options.duration);
    }

    return id;
  }, []);

  // إزالة حالة تحميل
  const removeLoading = useCallback((id: string) => {
    setLoadingStates(prev => prev.filter(state => state.id !== id));
  }, []);

  // إزالة جميع حالات التحميل
  const clearAll = useCallback(() => {
    setLoadingStates([]);
  }, []);

  // دوال مختصرة لأنواع التحميل المختلفة
  const showPageLoading = useCallback((options?: LoadingOptions) => {
    return addLoading('page', {
      size: 'lg',
      variant: 'brand',
      showTips: true,
      message: t('loading.page', 'جاري تحميل الصفحة...'),
      ...options,
    });
  }, [addLoading, t]);

  const showSectionLoading = useCallback((options?: LoadingOptions) => {
    return addLoading('section', {
      size: 'md',
      variant: 'spinner',
      message: t('loading.section', 'جاري التحميل...'),
      ...options,
    });
  }, [addLoading, t]);

  const showButtonLoading = useCallback((options?: LoadingOptions) => {
    return addLoading('button', {
      size: 'sm',
      variant: 'minimal',
      ...options,
    });
  }, [addLoading]);

  const showInlineLoading = useCallback((options?: LoadingOptions) => {
    return addLoading('inline', {
      size: 'xs',
      variant: 'minimal',
      ...options,
    });
  }, [addLoading]);

  const showOverlayLoading = useCallback((options?: LoadingOptions) => {
    return addLoading('overlay', {
      size: 'lg',
      variant: 'brand',
      message: t('loading.processing', 'جاري المعالجة...'),
      ...options,
    });
  }, [addLoading, t]);

  // دوال للعمليات الشائعة
  const showFormLoading = useCallback((formName: string, options?: LoadingOptions) => {
    return showSectionLoading({
      message: t('forms.loading', { form: t(`forms.${formName}`) }),
      ...options,
    });
  }, [showSectionLoading, t]);

  const showOperationLoading = useCallback((operation: string, options?: LoadingOptions) => {
    return showOverlayLoading({
      message: t('operations.loading', { operation: t(`operations.${operation}`) }),
      ...options,
    });
  }, [showOverlayLoading, t]);

  // دوال للإخفاء السريع
  const hidePageLoading = useCallback(() => {
    setLoadingStates(prev => prev.filter(state => state.type !== 'page'));
  }, []);

  const hideSectionLoading = useCallback(() => {
    setLoadingStates(prev => prev.filter(state => state.type !== 'section'));
  }, []);

  const hideButtonLoading = useCallback(() => {
    setLoadingStates(prev => prev.filter(state => state.type !== 'button'));
  }, []);

  const hideInlineLoading = useCallback(() => {
    setLoadingStates(prev => prev.filter(state => state.type !== 'inline'));
  }, []);

  const hideOverlayLoading = useCallback(() => {
    setLoadingStates(prev => prev.filter(state => state.type !== 'overlay'));
  }, []);

  // دوال للتحقق من حالة التحميل
  const isLoading = useCallback((type?: LoadingType) => {
    if (type) {
      return loadingStates.some(state => state.type === type);
    }
    return loadingStates.length > 0;
  }, [loadingStates]);

  const isPageLoading = useCallback(() => isLoading('page'), [isLoading]);
  const isSectionLoading = useCallback(() => isLoading('section'), [isLoading]);
  const isButtonLoading = useCallback(() => isLoading('button'), [isLoading]);
  const isInlineLoading = useCallback(() => isLoading('inline'), [isLoading]);
  const isOverlayLoading = useCallback(() => isLoading('overlay'), [isLoading]);

  // دالة للتحميل مع Promise
  const withLoading = useCallback(async <T>(
    promise: Promise<T>,
    type: LoadingType = 'overlay',
    options?: LoadingOptions
  ): Promise<T> => {
    const loadingId = addLoading(type, options);

    try {
      const result = await promise;
      return result;
    } finally {
      removeLoading(loadingId);
    }
  }, [addLoading, removeLoading]);

  // دالة للتحميل مع callback
  const withButtonLoading = useCallback(async <T>(
    callback: () => Promise<T>,
    options?: LoadingOptions
  ): Promise<T> => {
    const loadingId = showButtonLoading(options);

    try {
      const result = await callback();
      return result;
    } finally {
      removeLoading(loadingId);
    }
  }, [showButtonLoading, removeLoading]);

  return {
    loadingStates,
    addLoading,
    removeLoading,
    clearAll,
    showPageLoading,
    showSectionLoading,
    showButtonLoading,
    showInlineLoading,
    showOverlayLoading,
    showFormLoading,
    showOperationLoading,
    hidePageLoading,
    hideSectionLoading,
    hideButtonLoading,
    hideInlineLoading,
    hideOverlayLoading,
    isLoading,
    isPageLoading,
    isSectionLoading,
    isButtonLoading,
    isInlineLoading,
    isOverlayLoading,
    withLoading,
    withButtonLoading,
  };
};
