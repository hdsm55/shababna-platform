// تنسيق التواريخ للعرض باللغة العربية
export const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // إذا كان التاريخ اليوم
  if (diffDays === 0) {
    return 'اليوم';
  }

  // إذا كان التاريخ غداً
  if (diffDays === 1) {
    return 'غداً';
  }

  // إذا كان التاريخ أمس
  if (diffDays === -1) {
    return 'أمس';
  }

  // تنسيق التاريخ باللغة العربية - تقويم ميلادي
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'gregory', // استخدام التقويم الميلادي
  };

  return date.toLocaleDateString('ar-SA', options);
};

export const formatEventTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatEventDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const timeStr = formatEventTime(dateString);

  // إذا كان التاريخ اليوم
  if (diffDays === 0) {
    return `اليوم ${timeStr}`;
  }

  // إذا كان التاريخ غداً
  if (diffDays === 1) {
    return `غداً ${timeStr}`;
  }

  // إذا كان التاريخ أمس
  if (diffDays === -1) {
    return `أمس ${timeStr}`;
  }

  // تنسيق التاريخ باللغة العربية - تقويم ميلادي
  const dateStr = date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'gregory', // استخدام التقويم الميلادي
  });

  return `${dateStr} ${timeStr}`;
};

export const calculateDaysUntil = (dateString: string): number => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getRelativeTimeString = (dateString: string): string => {
  const daysUntil = calculateDaysUntil(dateString);

  if (daysUntil === 0) return 'اليوم';
  if (daysUntil === 1) return 'غداً';
  if (daysUntil === -1) return 'أمس';
  if (daysUntil > 0) return `بعد ${daysUntil} يوم`;
  if (daysUntil < 0) return `منذ ${Math.abs(daysUntil)} يوم`;

  return formatEventDate(dateString);
};

// دالة تنسيق التاريخ الميلادي بتنسيق مختصر
export const formatEventDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // إذا كان التاريخ اليوم
  if (diffDays === 0) {
    return 'اليوم';
  }

  // إذا كان التاريخ غداً
  if (diffDays === 1) {
    return 'غداً';
  }

  // إذا كان التاريخ أمس
  if (diffDays === -1) {
    return 'أمس';
  }

  // تنسيق التاريخ الميلادي مختصر
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    calendar: 'gregory',
  };

  return date.toLocaleDateString('ar-SA', options);
};

// دالة تنسيق التاريخ الميلادي بتنسيق كامل
export const formatEventDateFull = (dateString: string): string => {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'gregory',
  };

  return date.toLocaleDateString('ar-SA', options);
};
