import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SmoothPageTransitionProps {
  children: React.ReactNode;
}

const SmoothPageTransition: React.FC<SmoothPageTransitionProps> = ({
  children,
}) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // تحميل فوري بدون تأخير
    setIsTransitioning(false);
  }, [location.pathname]);

  if (isTransitioning) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SmoothPageTransition;
