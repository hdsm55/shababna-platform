import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer
      className="w-full bg-gray-50 border-t border-gray-100 py-6 mt-12"
      dir="auto"
    >
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} شبابنا. جميع الحقوق محفوظة.
        </div>
        <nav className="flex gap-4 text-sm text-gray-600">
          <a href="/" className="hover:text-primary-600 transition">
            الرئيسية
          </a>
          <a href="/events" className="hover:text-primary-600 transition">
            الفعاليات
          </a>
          <a href="/programs" className="hover:text-primary-600 transition">
            البرامج
          </a>
          <a href="/contact" className="hover:text-primary-600 transition">
            تواصل معنا
          </a>
          <a href="/blogs" className="hover:text-primary-600 transition">
            المدونة
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
