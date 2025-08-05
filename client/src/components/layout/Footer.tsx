import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { subscribeToNewsletter } from '../../services/newsletterApi';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterStatus('loading');
    setErrorMessage('');

    try {
      const response = await subscribeToNewsletter({ email: newsletterEmail });
      console.log('Newsletter subscription response:', response);
      setNewsletterStatus('success');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      setNewsletterStatus('error');

      // تحديد رسالة الخطأ المناسبة
      if (error?.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error?.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('حدث خطأ أثناء الاشتراك، يرجى المحاولة مرة أخرى');
      }

      setTimeout(() => {
        setNewsletterStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  const socialLinks = [
    {
      icon: Facebook,
      href: '#',
      label: 'Facebook',
      color: 'hover:text-blue-600',
    },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-500' },
    {
      icon: Instagram,
      href: '#',
      label: 'Instagram',
      color: 'hover:text-pink-600',
    },
    {
      icon: Linkedin,
      href: '#',
      label: 'LinkedIn',
      color: 'hover:text-blue-700',
    },
  ];

  const quickLinks = [
    { key: 'home', path: '/' },
    { key: 'events', path: '/events' },
    { key: 'programs', path: '/programs' },
    { key: 'joinUs', path: '/join-us' },
    { key: 'contact', path: '/contact' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-900 text-white relative">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">SG</span>
              </div>
              <div>
                <span className="text-xl font-bold">Shababna Global</span>
                <div className="text-sm text-neutral-400 font-medium">
                  Empowering Youth
                </div>
              </div>
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-neutral-400 ${social.color} transition-all duration-300 p-2 rounded-lg hover:bg-neutral-800 hover:scale-110`}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.path}
                    className="text-neutral-300 hover:text-primary-400 transition-all duration-300 text-sm font-medium hover:translate-x-1 rtl:hover:-translate-x-1 inline-block"
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">
              {t('footer.contactInfo')}
            </h3>
            <div className="space-y-4">
              <a
                href="https://maps.app.goo.gl/yz4Nc1RmLt6CuTh47"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 rtl:space-x-reverse group cursor-pointer"
              >
                <div className="w-8 h-8 bg-primary-600/20 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-all duration-300">
                  <MapPin className="w-4 h-4 text-primary-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-neutral-300 text-sm group-hover:text-white transition-colors duration-300">
                  {t('footer.address')}
                </span>
              </a>
              <a
                href="tel:+966501234567"
                className="flex items-center space-x-3 rtl:space-x-reverse group cursor-pointer"
              >
                <div className="w-8 h-8 bg-primary-600/20 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-all duration-300">
                  <Phone className="w-4 h-4 text-primary-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-neutral-300 text-sm group-hover:text-white transition-colors duration-300">
                  {t('footer.phone')}
                </span>
              </a>
              <a
                href="mailto:info@shaababna.com"
                className="flex items-center space-x-3 rtl:space-x-reverse group cursor-pointer"
              >
                <div className="w-8 h-8 bg-primary-600/20 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-all duration-300">
                  <Mail className="w-4 h-4 text-primary-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-neutral-300 text-sm group-hover:text-white transition-colors duration-300">
                  {t('footer.email')}
                </span>
              </a>
            </div>
          </div>

          {/* Newsletter - محسن ومؤكد */}
          <div className="space-y-6 bg-neutral-800/50 p-6 rounded-lg border border-neutral-700">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <Mail className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">
                {t('footer.stayUpdated', 'تابع جديدنا')}
              </h3>
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed">
              {t(
                'home.newsletter.subtitle',
                'كن أول من يعرف عن فعالياتنا وبرامجنا الجديدة. مجتمعنا ينتظرك!'
              )}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder={t(
                    'home.newsletter.placeholder',
                    'بريدك الإلكتروني'
                  )}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-neutral-400 transition-all duration-300 hover:border-neutral-500"
                />
              </div>
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-primary-700 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                {newsletterStatus === 'loading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>
                      {t('home.newsletter.loading', 'جاري الإرسال...')}
                    </span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>{t('buttons.subscribe', 'اشترك')}</span>
                  </>
                )}
              </button>
            </form>

            {/* Status Messages */}
            {newsletterStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg"
              >
                <p className="text-green-400 text-sm text-center">
                  {t('home.newsletter.success', 'تم الاشتراك بنجاح!')}
                </p>
              </motion.div>
            )}
            {newsletterStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
              >
                <p className="text-red-400 text-sm text-center">
                  {errorMessage ||
                    t(
                      'home.newsletter.error',
                      'حدث خطأ، يرجى المحاولة مرة أخرى'
                    )}
                </p>
              </motion.div>
            )}

            {/* Privacy Notice */}
            <p className="text-neutral-400 text-xs text-center">
              {t(
                'home.newsletter.privacy',
                'نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.'
              )}
            </p>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
            <div className="flex space-x-6 rtl:space-x-reverse mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-neutral-400 hover:text-primary-400 text-sm transition-colors duration-300"
              >
                {t('footer.privacyPolicy')}
              </Link>
              <Link
                to="/terms"
                className="text-neutral-400 hover:text-primary-400 text-sm transition-colors duration-300"
              >
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 z-50 flex items-center justify-center hover:shadow-xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
};

export default Footer;
