/**
 * Loading Components Export - تصدير مكونات التحميل
 * مكون موحد لجميع حالات التحميل في التطبيق
 */

// المكون الرئيسي الموحد
export { default as UnifiedLoader } from './UnifiedLoader';

// مكونات التحميل المتخصصة (للحفاظ على التوافق مع الكود الموجود)
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as AppLoader } from './AppLoader';
export { default as BackendIdleHandler } from './BackendIdleHandler';
export { default as PageLoadingWrapper } from './PageLoadingWrapper';

/**
 * استخدامات موصى بها:
 *
 * 1. للتحميل العام: UnifiedLoader
 * 2. لتحميل التطبيق: AppLoader
 * 3. لتحميل الصفحات: PageLoadingWrapper
 * 4. للخادم المجاني: BackendIdleHandler
 * 5. للتحميل السريع: LoadingSpinner
 */
