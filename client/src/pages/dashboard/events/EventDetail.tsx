import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchEventById } from '../../../services/eventsApi';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import Button from '../../../components/common/Button';
import Alert from '../../../components/common/Alert';

const DashboardEventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('رقم الفعالية غير محدد.');
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchEventById(id)
      .then((data) => {
        setEvent(data);
        setError(null);
      })
      .catch(() => {
        setError('تعذر جلب بيانات الفعالية. تحقق من الاتصال أو رقم الفعالية.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-lg text-gray-500">
          جاري تحميل بيانات الفعالية...
        </div>
      </DashboardLayout>
    );
  }

  if (error || !event) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-12">
          <Alert type="error">{error || 'لم يتم العثور على الفعالية.'}</Alert>
          <div className="mt-6 flex gap-4">
            <Button variant="primary" onClick={() => navigate(-1)}>
              العودة
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/dashboard/events')}
            >
              قائمة الفعاليات
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            العودة للفعاليات
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">تفاصيل الفعالية</h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="block text-sm text-gray-500 mb-1">
                اسم الفعالية
              </span>
              <div className="font-bold text-lg text-gray-900">
                {event.title}
              </div>
            </div>
            <div>
              <span className="block text-sm text-gray-500 mb-1">الفئة</span>
              <div>{event.category}</div>
            </div>
            <div>
              <span className="block text-sm text-gray-500 mb-1">الموقع</span>
              <div>{event.location}</div>
            </div>
            <div>
              <span className="block text-sm text-gray-500 mb-1">الحالة</span>
              <div>{event.status}</div>
            </div>
            <div>
              <span className="block text-sm text-gray-500 mb-1">
                تاريخ البداية
              </span>
              <div>{event.start_date}</div>
            </div>
            <div>
              <span className="block text-sm text-gray-500 mb-1">
                تاريخ الانتهاء
              </span>
              <div>{event.end_date}</div>
            </div>
            <div>
              <span className="block text-sm text-gray-500 mb-1">السعة</span>
              <div>{event.max_attendees}</div>
            </div>
            <div>
              <span className="block text-sm text-gray-500 mb-1">الوصف</span>
              <div>{event.description}</div>
            </div>
          </div>
          {event.image_url && (
            <div className="mt-6">
              <span className="block text-sm text-gray-500 mb-1">
                صورة الفعالية
              </span>
              <img
                src={event.image_url}
                alt="صورة الفعالية"
                className="w-64 h-40 object-cover rounded-lg border"
              />
            </div>
          )}
          <div className="flex gap-4 pt-6 border-t mt-6">
            <Link to={`/dashboard/events/${event.id}/edit`}>
              <Button variant="primary">تعديل الفعالية</Button>
            </Link>
            <Button
              variant="secondary"
              onClick={() => navigate('/dashboard/events')}
            >
              قائمة الفعاليات
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardEventDetail;
