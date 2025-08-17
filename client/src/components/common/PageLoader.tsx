import React from 'react';
import SimplePageLoader from './SimplePageLoader';

interface PageLoaderProps {
  message?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'جاري تحميل الصفحة...',
}) => {
  return <SimplePageLoader message={message} />;
};

export default PageLoader;
