import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link,
  Copy,
  Check,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
  variant?: 'button' | 'icon' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showCopyButton?: boolean;
  showWhatsApp?: boolean;
  showTelegram?: boolean;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'شبابنا العالمية',
  description = 'منصة تطوير الشباب المسلم',
  image = '/images/hero-bg.jpg',
  variant = 'button',
  size = 'md',
  className = '',
  showCopyButton = true,
  showWhatsApp = true,
  showTelegram = true,
}) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareData = {
    title,
    text: description,
    url,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.log('Error copying:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`,
  };

  const handleShare = (platform: string) => {
    const link = shareLinks[platform as keyof typeof shareLinks];
    if (link) {
      window.open(link, '_blank', 'width=600,height=400');
    }
    setShowModal(false);
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonVariants = {
    button: (
      <button
        onClick={handleNativeShare}
        className={`inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${className}`}
      >
        <Share2 className={iconSizes[size]} />
        <span>{t('common.share', 'مشاركة')}</span>
      </button>
    ),
    icon: (
      <button
        onClick={handleNativeShare}
        className={`${sizeClasses[size]} bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${className}`}
      >
        <Share2 className={iconSizes[size]} />
      </button>
    ),
    floating: (
      <button
        onClick={handleNativeShare}
        className={`${sizeClasses[size]} bg-white text-primary-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 border border-primary-200 ${className}`}
      >
        <Share2 className={iconSizes[size]} />
      </button>
    ),
  };

  return (
    <>
      {buttonVariants[variant]}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-dark-500 mb-2">
                  {t('common.share', 'مشاركة')}
                </h3>
                <p className="text-sm text-dark-400">
                  {t('common.shareDescription', 'شارك هذا المحتوى مع أصدقائك')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  <Facebook className="w-5 h-5" />
                  <span className="text-sm">فيسبوك</span>
                </button>

                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  <Twitter className="w-5 h-5" />
                  <span className="text-sm">تويتر</span>
                </button>

                <button
                  onClick={() => handleShare('linkedin')}
                  className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                  <span className="text-sm">لينكد إن</span>
                </button>

                {showWhatsApp && (
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                    <span className="text-sm">واتساب</span>
                  </button>
                )}

                {showTelegram && (
                  <button
                    onClick={() => handleShare('telegram')}
                    className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                    <span className="text-sm">تليجرام</span>
                  </button>
                )}
              </div>

              {showCopyButton && (
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-600">
                        {t('common.copied', 'تم النسخ')}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span className="text-sm">
                        {t('common.copyLink', 'نسخ الرابط')}
                      </span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => setShowModal(false)}
                className="w-full mt-3 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
              >
                {t('common.cancel', 'إلغاء')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShareButtons;
