import React from 'react';

const Blog: React.FC = () => {
  return (
    <div className="container mx-auto py-8 text-center rtl:text-right ltr:text-left">
      <h1 className="text-3xl font-bold mb-4">المدونة</h1>
      <p className="text-lg text-gray-600">
        قريبًا ستجد هنا مقالات وأخبار المنصة.
      </p>
    </div>
  );
};

export default Blog;
