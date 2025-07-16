import React from 'react';

const Loader: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`flex justify-center items-center py-8 ${className}`}
    role="status"
    aria-label="جاري التحميل"
  >
    <span className="inline-block w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default Loader;
