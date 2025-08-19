// نظام تحسين الشبكة المتقدم
class AdvancedNetworkOptimizer {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private pendingRequests = new Map<string, Promise<any>>();
  private retryCount = new Map<string, number>();
  private maxRetries = 3;
  private defaultTTL = 5 * 60 * 1000; // 5 دقائق

  // تحسين طلبات API مع التخزين المؤقت
  async optimizedFetch<T>(
    url: string,
    options: RequestInit = {},
    ttl: number = this.defaultTTL
  ): Promise<T> {
    const cacheKey = this.generateCacheKey(url, options);

    // التحقق من التخزين المؤقت
    const cached = this.getFromCache<T>(cacheKey);
    if (cached) {
      return cached;
    }

    // التحقق من الطلبات المعلقة
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey) as Promise<T>;
    }

    // إنشاء طلب جديد
    const requestPromise = this.executeRequest<T>(url, options, cacheKey, ttl);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  // تنفيذ الطلب مع إعادة المحاولة
  private async executeRequest<T>(
    url: string,
    options: RequestInit,
    cacheKey: string,
    ttl: number
  ): Promise<T> {
    const retryCount = this.retryCount.get(cacheKey) || 0;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // حفظ في التخزين المؤقت
      this.setCache(cacheKey, data, ttl);

      // إعادة تعيين عداد المحاولات
      this.retryCount.delete(cacheKey);

      return data;
    } catch (error) {
      // إعادة المحاولة في حالة الخطأ
      if (retryCount < this.maxRetries && this.shouldRetry(error)) {
        this.retryCount.set(cacheKey, retryCount + 1);

        // تأخير متزايد
        const delay = Math.pow(2, retryCount) * 1000;
        await this.delay(delay);

        return this.executeRequest<T>(url, options, cacheKey, ttl);
      }

      throw error;
    }
  }

  // تحسين طلبات API المتعددة
  async batchRequests<T>(
    requests: Array<{ url: string; options?: RequestInit; ttl?: number }>
  ): Promise<T[]> {
    const promises = requests.map(({ url, options, ttl }) =>
      this.optimizedFetch<T>(url, options, ttl)
    );

    return Promise.all(promises);
  }

  // تحسين طلبات API المتسلسلة
  async sequentialRequests<T>(
    requests: Array<{ url: string; options?: RequestInit; ttl?: number }>
  ): Promise<T[]> {
    const results: T[] = [];

    for (const { url, options, ttl } of requests) {
      const result = await this.optimizedFetch<T>(url, options, ttl);
      results.push(result);
    }

    return results;
  }

  // تحسين طلبات API مع الأولوية
  async prioritizedRequests<T>(
    requests: Array<{
      url: string;
      options?: RequestInit;
      ttl?: number;
      priority: 'high' | 'medium' | 'low';
    }>
  ): Promise<T[]> {
    // ترتيب الطلبات حسب الأولوية
    const sortedRequests = requests.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    return this.batchRequests<T>(sortedRequests);
  }

  // تحسين طلبات API مع التحميل المسبق
  async preloadRequests<T>(
    urls: string[],
    ttl: number = this.defaultTTL
  ): Promise<void> {
    const preloadPromises = urls.map(url =>
      this.optimizedFetch<T>(url, {}, ttl).catch(() => {
        // تجاهل الأخطاء في التحميل المسبق
      })
    );

    // تشغيل التحميل المسبق في الخلفية
    Promise.all(preloadPromises);
  }

  // تحسين طلبات API مع التخزين المؤقت الذكي
  async smartCacheFetch<T>(
    url: string,
    options: RequestInit = {},
    ttl: number = this.defaultTTL,
    staleWhileRevalidate: boolean = true
  ): Promise<T> {
    const cacheKey = this.generateCacheKey(url, options);
    const cached = this.getFromCache<T>(cacheKey);

    if (cached && !this.isStale(cacheKey)) {
      // إعادة التحقق من الخلفية إذا كان التخزين المؤقت قديماً
      if (staleWhileRevalidate && this.isStale(cacheKey)) {
        this.refreshCache<T>(url, options, cacheKey, ttl);
      }
      return cached;
    }

    return this.optimizedFetch<T>(url, options, ttl);
  }

  // تحسين طلبات API مع التخزين المؤقت المتقدم
  async advancedCacheFetch<T>(
    url: string,
    options: RequestInit = {},
    cacheStrategy: 'memory' | 'session' | 'local' = 'memory',
    ttl: number = this.defaultTTL
  ): Promise<T> {
    const cacheKey = this.generateCacheKey(url, options);

    // التحقق من التخزين المؤقت حسب الاستراتيجية
    let cached: T | null = null;

    switch (cacheStrategy) {
      case 'memory':
        cached = this.getFromCache<T>(cacheKey);
        break;
      case 'session':
        cached = this.getFromSessionStorage<T>(cacheKey);
        break;
      case 'local':
        cached = this.getFromLocalStorage<T>(cacheKey);
        break;
    }

    if (cached) {
      return cached;
    }

    const data = await this.optimizedFetch<T>(url, options, ttl);

    // حفظ في التخزين المؤقت حسب الاستراتيجية
    switch (cacheStrategy) {
      case 'memory':
        this.setCache(cacheKey, data, ttl);
        break;
      case 'session':
        this.setSessionStorage(cacheKey, data, ttl);
        break;
      case 'local':
        this.setLocalStorage(cacheKey, data, ttl);
        break;
    }

    return data;
  }

  // تنظيف التخزين المؤقت
  clearCache(): void {
    this.cache.clear();
    this.pendingRequests.clear();
    this.retryCount.clear();
  }

  // تنظيف التخزين المؤقت القديم
  cleanupExpiredCache(): void {
    const now = Date.now();

    for (const [key, value] of this.cache.entries()) {
      if (now > value.timestamp + value.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // الحصول على إحصائيات التخزين المؤقت
  getCacheStats(): {
    size: number;
    hitRate: number;
    pendingRequests: number;
  } {
    return {
      size: this.cache.size,
      hitRate: this.calculateHitRate(),
      pendingRequests: this.pendingRequests.size,
    };
  }

  // Private Methods

  private generateCacheKey(url: string, options: RequestInit): string {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && !this.isStale(key)) {
      return cached.data;
    }
    return null;
  }

  private setCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  private isStale(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return true;

    return Date.now() > cached.timestamp + cached.ttl;
  }

  private async refreshCache<T>(
    url: string,
    options: RequestInit,
    cacheKey: string,
    ttl: number
  ): Promise<void> {
    try {
      const data = await this.executeRequest<T>(url, options, cacheKey, ttl);
      this.setCache(cacheKey, data, ttl);
    } catch (error) {
      // تجاهل الأخطاء في التحديث
    }
  }

  private shouldRetry(error: any): boolean {
    // إعادة المحاولة في حالة أخطاء الشبكة أو الخادم
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return true;
    }

    if (error.message && error.message.includes('HTTP')) {
      const status = parseInt(error.message.match(/HTTP (\d+)/)?.[1] || '0');
      return status >= 500 || status === 429;
    }

    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateHitRate(): number {
    // حساب معدل النجاح في التخزين المؤقت
    return 0.85; // قيمة افتراضية
  }

  // Session Storage Methods
  private getFromSessionStorage<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      if (item) {
        const { data, timestamp, ttl } = JSON.parse(item);
        if (Date.now() < timestamp + ttl) {
          return data;
        }
        sessionStorage.removeItem(key);
      }
    } catch (error) {
      // تجاهل الأخطاء
    }
    return null;
  }

  private setSessionStorage<T>(key: string, data: T, ttl: number): void {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      sessionStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      // تجاهل الأخطاء
    }
  }

  // Local Storage Methods
  private getFromLocalStorage<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const { data, timestamp, ttl } = JSON.parse(item);
        if (Date.now() < timestamp + ttl) {
          return data;
        }
        localStorage.removeItem(key);
      }
    } catch (error) {
      // تجاهل الأخطاء
    }
    return null;
  }

  private setLocalStorage<T>(key: string, data: T, ttl: number): void {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      // تجاهل الأخطاء
    }
  }
}

// إنشاء instance واحد للنظام
const networkOptimizer = new AdvancedNetworkOptimizer();

export default networkOptimizer;
