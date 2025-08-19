// تحسينات الأداء المتقدمة لمنصة شبابنا

// تحسين تحميل الصور
export const optimizeImage = (src: string, width: number = 800) => {
  if (!src) return '';

  try {
    const url = new URL(src, window.location.origin);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', '85'); // جودة 85%
    url.searchParams.set('fm', 'webp'); // تنسيق WebP
    return url.toString();
  } catch {
    return src;
  }
};

// تحسين التمرير السلس
export const smoothScroll = (element: HTMLElement | null, offset: number = 0) => {
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

// تحسين الرسوم المتحركة
export const optimizedAnimation = {
  fast: {
    duration: 0.2,
    ease: 'easeOut'
  },
  normal: {
    duration: 0.3,
    ease: 'easeOut'
  },
  slow: {
    duration: 0.5,
    ease: 'easeOut'
  }
};

// تحسين التخزين المؤقت
export const cacheConfig = {
  events: {
    staleTime: 30 * 60 * 1000, // 30 دقيقة
    gcTime: 60 * 60 * 1000, // ساعة واحدة
  },
  programs: {
    staleTime: 30 * 60 * 1000, // 30 دقيقة
    gcTime: 60 * 60 * 1000, // ساعة واحدة
  },
  blogs: {
    staleTime: 60 * 60 * 1000, // ساعة واحدة
    gcTime: 2 * 60 * 60 * 1000, // ساعتان
  }
};

// تحسين تحميل المكونات
export const lazyLoadConfig = {
  threshold: 0.1,
  rootMargin: '50px'
};

// تحسين الأداء للرسوم المتحركة
export const performanceOptimizations = {
  // تقليل استخدام GPU
  willChange: 'auto',

  // تحسين التمرير
  scrollBehavior: 'smooth',

  // تحسين التحميل
  loading: 'lazy' as const,

  // تحسين الصور
  imageOptimization: {
    format: 'webp',
    quality: 85,
    width: 800
  }
};

// تحسين الاستعلامات
export const queryOptimizations = {
  // منع إعادة التحميل غير الضرورية
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,

  // تحسين التخزين المؤقت
  staleTime: 30 * 60 * 1000,
  gcTime: 60 * 60 * 1000,

  // تحسين الأداء
  retry: 1,
  retryDelay: 1000
};

// تحسين التحميل التدريجي
export const progressiveLoading = {
  // تحميل أولي سريع
  initial: {
    opacity: 0,
    y: 10
  },

  // تحميل نهائي
  animate: {
    opacity: 1,
    y: 0
  },

  // انتقال سلس
  transition: {
    duration: 0.3,
    ease: 'easeOut'
  }
};

// تحسين الأداء للعناصر الثقيلة
export const heavyElementOptimizations = {
  // استخدام Intersection Observer
  useIntersectionObserver: true,

  // تحميل تدريجي
  progressiveLoading: true,

  // تحسين الذاكرة
  memoryOptimization: true,

  // تقليل إعادة الرسم
  reduceRepaints: true
};

// تحسين الأداء للصفحة الرئيسية
export const homePageOptimizations = {
  // تحميل أولي سريع
  fastInitialLoad: true,

  // تحميل تدريجي للمحتوى
  progressiveContentLoading: true,

  // تحسين الصور
  imageOptimization: true,

  // تحسين الرسوم المتحركة
  animationOptimization: true,

  // تحسين الاستعلامات
  queryOptimization: true
};

// تحسين SEO
export const seoOptimizations = {
  // تحسين العناوين
  titleOptimization: true,

  // تحسين الوصف
  descriptionOptimization: true,

  // تحسين الكلمات المفتاحية
  keywordOptimization: true,

  // تحسين الروابط
  linkOptimization: true,

  // تحسين الصور
  imageSeoOptimization: true
};

// تحسين إمكانية الوصول
export const accessibilityOptimizations = {
  // تحسين التنقل بالكيبورد
  keyboardNavigation: true,

  // تحسين قارئ الشاشة
  screenReaderOptimization: true,

  // تحسين التباين
  contrastOptimization: true,

  // تحسين التركيز
  focusOptimization: true,

  // تحسين النصوص البديلة
  altTextOptimization: true
};

export default {
  optimizeImage,
  smoothScroll,
  optimizedAnimation,
  cacheConfig,
  lazyLoadConfig,
  performanceOptimizations,
  queryOptimizations,
  progressiveLoading,
  heavyElementOptimizations,
  homePageOptimizations,
  seoOptimizations,
  accessibilityOptimizations
};

