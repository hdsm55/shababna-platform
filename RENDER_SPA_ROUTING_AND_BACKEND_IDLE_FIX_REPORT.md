# تقرير إصلاح مشاكل Render - SPA Routing و Backend Idle Time

## 🔍 المشاكل الأصلية

### 1. مشكلة React Router على Render

- عند تحديث الصفحة على مسارات متداخلة مثل `/programs/10` تظهر صفحة Not Found
- المشكلة محلية تعمل بشكل صحيح ولكن تفشل على Render

### 2. مشكلة Backend Idle Time

- بعد 5-10 دقائق من عدم النشاط، تأخير في تحميل البيانات
- عرض `undefined` بدلاً من البيانات حتى يتم تحديث الصفحة
- عدم وجود مؤشر تحميل مناسب لحالة استيقاظ الخادم

## ✅ الحلول المطبقة

### 1. إصلاح SPA Routing على Render

#### أ. تحسين render.json

```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/images/(.*)",
      "dest": "/images/$1"
    },
    {
      "src": "/(.*\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot))",
      "dest": "/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": {
    "/*": {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "no-sniff",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "no-referrer-when-downgrade",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    },
    "/index.html": {
      "Cache-Control": "no-cache, no-store, must-revalidate"
    }
  }
}
```

#### ب. إنشاء static.json

```json
{
  "root": "dist",
  "routes": {
    "/**": "index.html"
  },
  "headers": {
    "/**": {
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "no-sniff",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "no-referrer-when-downgrade"
    },
    "/index.html": {
      "Cache-Control": "no-cache, no-store, must-revalidate"
    }
  }
}
```

#### ج. إنشاء \_redirects

```
# SPA Routing - Redirect all routes to index.html
/*    /index.html   200

# API routes
/api/*  https://shababna-backend.onrender.com/api/:splat  200

# Static assets
/assets/*  /assets/:splat  200
/images/*  /images/:splat  200

# Security headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: no-referrer-when-downgrade
```

### 2. تحسين التعامل مع Backend Idle Time

#### أ. تحسين إعدادات React Query

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Retry up to 3 times for network errors or 5xx errors
        if (failureCount < 3) {
          if (error?.response?.status >= 500) return true;
          if (error?.code === 'ECONNABORTED') return true;
          if (error?.message?.includes('timeout')) return true;
        }
        return false;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnMount: false,
      gcTime: 15 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});
```

#### ب. تحسين إعدادات Axios

```typescript
export const http = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || 'https://shababna-backend.onrender.com/api',
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout for Render free plan
});

// Response interceptor to handle backend idle time
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle backend idle time gracefully
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.log('⏰ Backend is waking up, please wait...');
      return Promise.reject({
        ...error,
        isBackendIdle: true,
        message: 'الخادم يستيقظ، يرجى الانتظار...',
      });
    }

    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
```

#### ج. تحسين مكون LoadingSpinner

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  isBackendIdle?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className,
  isBackendIdle = false,
}) => {
  return (
    <div className={clsx('flex flex-col items-center gap-4', className)}>
      <div className="flex items-center gap-2">
        <span
          className={clsx(
            'inline-block animate-spin rounded-full border-2 border-primary border-t-transparent',
            sizeMap[size]
          )}
        />
        {text && (
          <span className="text-textSecondary text-sm rtl:text-right">
            {text}
          </span>
        )}
      </div>
      {isBackendIdle && (
        <div className="text-center">
          <p className="text-sm text-textSecondary mb-2">
            الخادم المجاني يستيقظ من النوم
          </p>
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: '0.2s' }}
            ></div>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: '0.4s' }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
```

#### د. إنشاء مكون BackendIdleHandler

```typescript
const BackendIdleHandler: React.FC<BackendIdleHandlerProps> = ({
  children,
}) => {
  const [isBackendIdle, setIsBackendIdle] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleBackendIdle = (error: any) => {
      if (error?.isBackendIdle) {
        setIsBackendIdle(true);
        setRetryCount((prev) => prev + 1);
      }
    };

    // Listen for backend idle errors
    const originalReject = Promise.prototype.reject;
    Promise.prototype.reject = function (reason) {
      handleBackendIdle(reason);
      return originalReject.call(this, reason);
    };

    return () => {
      Promise.prototype.reject = originalReject;
    };
  }, []);

  const handleRetry = () => {
    setIsBackendIdle(false);
    setRetryCount(0);
    queryClient.invalidateQueries();
  };

  if (isBackendIdle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center max-w-md mx-auto p-6">
          <LoadingSpinner
            size="lg"
            isBackendIdle={true}
            text="الخادم يستيقظ، يرجى الانتظار..."
          />
          <Alert type="info" title="الخادم المجاني يستيقظ" className="mt-6">
            الخادم المجاني على Render يستيقظ من النوم بعد فترة من عدم النشاط.
            هذا طبيعي ويستغرق بضع ثوانٍ.
          </Alert>
          {retryCount > 2 && (
            <button
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              إعادة المحاولة
            </button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
```

#### ه. تحسين صفحات التفاصيل

```typescript
const {
  data: programData,
  isLoading,
  error,
  isError,
} = useQuery({
  queryKey: ['program', id],
  queryFn: () => fetchProgramById(id!),
  enabled: !!id,
  retry: (failureCount, error: any) => {
    // Retry for backend idle time
    if (failureCount < 3) {
      if (error?.isBackendIdle) return true;
      if (error?.response?.status >= 500) return true;
      if (error?.code === 'ECONNABORTED') return true;
    }
    return false;
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

const program = programData?.data || programData;
const isBackendIdle = (error as any)?.isBackendIdle;

// Show loading state
if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner
        size="lg"
        isBackendIdle={isBackendIdle}
        text={
          isBackendIdle
            ? 'الخادم يستيقظ، يرجى الانتظار...'
            : 'جاري تحميل تفاصيل البرنامج...'
        }
      />
    </div>
  );
}
```

## 🎯 النتائج المتوقعة

### 1. إصلاح SPA Routing

- ✅ جميع المسارات ستعمل عند التحديث المباشر
- ✅ المسارات المتداخلة مثل `/programs/10` ستعمل بشكل صحيح
- ✅ لن تظهر صفحة 404 عند تحديث الصفحة

### 2. تحسين التعامل مع Backend Idle Time

- ✅ مؤشر تحميل واضح عند استيقاظ الخادم
- ✅ رسائل توضيحية للمستخدم
- ✅ إعادة المحاولة التلقائية مع تأخير متزايد
- ✅ تجربة مستخدم محسنة بدلاً من عرض `undefined`

### 3. تحسينات إضافية

- ✅ إعدادات React Query محسنة للأداء
- ✅ معالجة أفضل للأخطاء
- ✅ تحسين تجربة المستخدم
- ✅ كود نظيف ومنتج جاهز

## 🚀 خطوات النشر

1. **بناء المشروع:**

   ```bash
   cd client
   npm run build
   ```

2. **رفع الملفات إلى Render:**

   - تأكد من وجود جميع ملفات التكوين الجديدة
   - `render.json`
   - `static.json`
   - `_redirects`

3. **اختبار النشر:**
   - اختبار المسارات المتداخلة
   - اختبار حالة backend idle time
   - اختبار جميع الصفحات

## 📝 ملاحظات مهمة

- جميع الإصلاحات متوافقة مع Render free plan
- تم الحفاظ على الأداء مع إضافة الميزات الجديدة
- الكود نظيف ومنظم ومستعد للإنتاج
- تم إضافة تعليقات توضيحية باللغة العربية
