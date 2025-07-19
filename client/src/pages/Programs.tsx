import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { DESIGN_SYSTEM } from '../components/common/DesignSystem';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Skeleton from '../components/common/Skeleton';
import Alert from '../components/common/Alert';
import { useDebounce } from '../hooks/useDebounce';
import { fetchPrograms } from '../services/programsApi';
import { Program } from '../types';
import LazyImage from '../components/common/LazyImage';
import { supportProgram } from '../services/programsApi';
import Modal from '../components/common/Modal';

const Programs: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    note: '',
    programId: null,
  });
  const [supportStatus, setSupportStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const filters = [
    { key: 'all', label: t('programs.filter.all', 'كل البرامج') },
    { key: 'education', label: t('programs.filter.education', 'تعليم') },
    { key: 'technology', label: t('programs.filter.technology', 'تقنية') },
    {
      key: 'entrepreneurship',
      label: t('programs.filter.entrepreneurship', 'ريادة أعمال'),
    },
    { key: 'volunteering', label: t('programs.filter.volunteering', 'تطوع') },
  ];

  const queryParams: any = {};
  if (selectedFilter !== 'all') queryParams.category = selectedFilter;

  const {
    data: programsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['programs', { ...queryParams, search: debouncedSearch }],
    queryFn: () => fetchPrograms({ ...queryParams, search: debouncedSearch }),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const programs = programsData?.data?.items || [];
  console.log('programsData:', programsData);
  console.log('programs:', programs);
  const pagination = programsData?.data?.pagination;

  const handleFilterChange = (filterKey: string) => {
    setSelectedFilter(filterKey);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupportStatus('idle');
    try {
      if (!supportForm.programId) return;
      const payload = {
        supporter_name: supportForm.name.trim(),
        supporter_email: supportForm.email.trim(),
        phone: supportForm.phone.trim(),
        amount: supportForm.amount.trim(),
        note: supportForm.note.trim(),
      };
      if (
        !payload.supporter_name ||
        !payload.supporter_email ||
        !payload.amount
      ) {
        setSupportStatus('error');
        return;
      }
      const res = await supportProgram(supportForm.programId, payload);
      if (res.success) {
        setSupportStatus('success');
        setSupportForm({
          name: '',
          email: '',
          phone: '',
          amount: '',
          note: '',
          programId: null,
        });
      } else {
        setSupportStatus('error');
      }
    } catch {
      setSupportStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={t('programs.title', 'برامج شبابنا')}
        description={t(
          'programs.subtitle',
          'برامج تطويرية عصرية للشباب المسلم في تركيا والعالم'
        )}
        type="website"
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-6 text-center">
            {t('programs.title', 'برامج شبابنا')}
          </h1>
          <p className="text-lg md:text-2xl text-neutral-700 mb-8 text-center">
            {t(
              'programs.subtitle',
              'برامج تطويرية عصرية للشباب المسلم في تركيا والعالم'
            )}
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative w-full max-w-md">
              <Input
                ref={inputRef}
                type="text"
                placeholder={t('common.search', 'بحث')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
                fullWidth
              />
              {isLoading && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 rtl:left-3 rtl:right-auto">
                  <Skeleton width={24} height={24} />
                </span>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {filters.map((filter) => (
                <Button
                  key={filter.key}
                  variant={
                    selectedFilter === filter.key ? 'primary' : 'outline'
                  }
                  size="md"
                  onClick={() => handleFilterChange(filter.key)}
                  className={
                    selectedFilter === filter.key
                      ? 'ring-2 ring-primary-400'
                      : ''
                  }
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 mb-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow p-6 flex flex-col gap-4"
              >
                <Skeleton height={180} className="w-full mb-4" />
                <Skeleton height={24} width="60%" />
                <Skeleton height={16} width="40%" />
                <Skeleton height={16} width="80%" />
                <div className="flex gap-2 mt-2">
                  <Skeleton height={32} width={80} />
                  <Skeleton height={32} width={80} />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <Alert type="error">
            {t('programs.error', 'حدث خطأ أثناء جلب البرامج')}
          </Alert>
        ) : programs.length === 0 ? (
          <Alert type="info">
            {t('programs.noPrograms', 'لا توجد برامج نشطة حالياً.')}
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program: Program) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  variant="elevated"
                  padding="lg"
                  className="flex flex-col h-full shadow-lg hover:shadow-2xl transition-all group"
                >
                  <div className="h-44 w-full rounded-lg overflow-hidden mb-4 bg-neutral-100 flex items-center justify-center">
                    <img
                      src={program.image_url || '/images/islamic-youth.jpg'}
                      alt={program.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-primary-800 mb-2 line-clamp-2">
                    {program.title}
                  </h2>
                  <div className="text-sm text-neutral-600 mb-2 line-clamp-3">
                    {program.description}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setShowSupportModal(true);
                        setSupportForm((f) => ({
                          ...f,
                          programId: program.id,
                        }));
                      }}
                    >
                      {t('programs.support', 'ادعم البرنامج')}
                    </Button>
                    <Button variant="outline" size="sm">
                      {t('buttons.details', 'تفاصيل أكثر')}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <section className="container mx-auto px-4 my-8 flex justify-center">
          <div className="flex gap-2">
            {Array.from({ length: pagination.totalPages }, (_, idx) => (
              <Button
                key={idx + 1}
                variant={pagination.page === idx + 1 ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </Button>
            ))}
          </div>
        </section>
      )}

      <Modal
        open={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        title="دعم البرنامج"
      >
        <form onSubmit={handleSupport} className="space-y-4 p-2">
          <Input
            label="الاسم الكامل"
            value={supportForm.name}
            onChange={(e) =>
              setSupportForm((f) => ({ ...f, name: e.target.value }))
            }
            required
            fullWidth
          />
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={supportForm.email}
            onChange={(e) =>
              setSupportForm((f) => ({ ...f, email: e.target.value }))
            }
            required
            fullWidth
          />
          <Input
            label="رقم الجوال (اختياري)"
            value={supportForm.phone}
            onChange={(e) =>
              setSupportForm((f) => ({ ...f, phone: e.target.value }))
            }
            fullWidth
          />
          <Input
            label="المبلغ (USD)"
            type="number"
            value={supportForm.amount}
            onChange={(e) =>
              setSupportForm((f) => ({ ...f, amount: e.target.value }))
            }
            required
            fullWidth
          />
          <Input
            label="ملاحظة (اختياري)"
            value={supportForm.note}
            onChange={(e) =>
              setSupportForm((f) => ({ ...f, note: e.target.value }))
            }
            fullWidth
          />
          {supportStatus === 'success' && (
            <Alert type="success">
              تم تسجيل دعمك بنجاح! سنقوم بالتواصل معك قريباً.
            </Alert>
          )}
          {supportStatus === 'error' && (
            <Alert type="error">يرجى تعبئة جميع الحقول المطلوبة.</Alert>
          )}
          <div className="flex gap-2 justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSupportModal(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" variant="primary">
              تأكيد الدعم
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Programs;
