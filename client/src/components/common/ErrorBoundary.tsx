import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // يمكن إضافة إرسال الخطأ إلى خدمة مراقبة الأخطاء هنا
    // مثل Sentry أو LogRocket
    if (process.env.NODE_ENV === 'production') {
      // إرسال الخطأ إلى خدمة المراقبة
      // reportError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleGoBack = () => {
    window.history.back();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </motion.div>

            {/* Error Message */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-900 mb-4"
            >
              عذراً، حدث خطأ غير متوقع
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 mb-8"
            >
              حدث خطأ أثناء تحميل هذه الصفحة. يرجى المحاولة مرة أخرى أو العودة
              إلى الصفحة الرئيسية.
            </motion.p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.5 }}
                className="mb-6 p-4 bg-gray-100 rounded-lg text-left"
              >
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    تفاصيل الخطأ (للمطورين)
                  </summary>
                  <div className="space-y-2 text-xs">
                    <div>
                      <strong>الخطأ:</strong> {this.state.error.message}
                    </div>
                    <div>
                      <strong>المكدس:</strong>
                      <pre className="mt-1 p-2 bg-gray-200 rounded overflow-x-auto">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </div>
                </details>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <button
                onClick={this.handleRetry}
                className="flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                إعادة المحاولة
              </button>

              <button
                onClick={this.handleGoBack}
                className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                العودة للخلف
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                <Home className="w-4 h-4 mr-2" />
                الصفحة الرئيسية
              </button>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 pt-6 border-t border-gray-200"
            >
              <p className="text-sm text-gray-500 mb-2">
                إذا استمرت المشكلة، يرجى التواصل معنا
              </p>
              <a
                href="/contact"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                تواصل مع الدعم الفني
              </a>
            </motion.div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
