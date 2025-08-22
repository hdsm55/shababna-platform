import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, ArrowLeft, Home } from 'lucide-react';

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
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-primary-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-8 text-center border border-primary-600"
          >
            {/* Brand Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <span className="text-white text-2xl font-bold">ش</span>
            </motion.div>

            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-red-500/20 border border-red-400 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </motion.div>

            {/* Error Message */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-bold text-white mb-4"
            >
              عذراً، حدث خطأ غير متوقع
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-primary-200 mb-8 leading-relaxed text-sm"
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
                className="mb-6 p-4 bg-primary-700/50 rounded-lg text-left border border-primary-600"
              >
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium text-primary-200 mb-2">
                    تفاصيل الخطأ (للمطورين)
                  </summary>
                  <div className="space-y-2 text-xs">
                    <div>
                      <strong className="text-accent-400">الخطأ:</strong>
                      <span className="text-primary-300">
                        {' '}
                        {this.state.error.message}
                      </span>
                    </div>
                    <div>
                      <strong className="text-accent-400">المكدس:</strong>
                      <pre className="mt-1 p-2 bg-primary-900/50 rounded overflow-x-auto text-primary-300 border border-primary-600">
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
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-lg transition-all duration-200 font-medium transform hover:scale-105 hover:shadow-lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                إعادة المحاولة
              </button>

              <button
                onClick={this.handleGoBack}
                className="flex items-center justify-center px-6 py-3 bg-primary-700/50 hover:bg-primary-600/50 text-primary-200 rounded-lg transition-all duration-200 font-medium border border-primary-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                العودة للخلف
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center px-6 py-3 bg-primary-700/50 hover:bg-primary-600/50 text-primary-200 rounded-lg transition-all duration-200 font-medium border border-primary-600"
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
              className="mt-8 pt-6 border-t border-primary-600"
            >
              <p className="text-xs text-primary-300 mb-2">
                إذا استمرت المشكلة، يرجى التواصل معنا
              </p>
              <a
                href="/contact"
                className="text-accent-400 hover:text-accent-300 text-xs font-medium transition-colors"
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
