import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProgram } from '../../../services/programsApi';
import axios from 'axios';

const NewProgram: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [success, setSuccess] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('start_date', startDate);
      formData.append('end_date', endDate);
      if (image) {
        formData.append('image', image);
      }
      // أضف category و goal_amount إذا كانت موجودة في الفورم
      // formData.append('category', category);
      // formData.append('goal_amount', goalAmount);
      await axios.post('/api/programs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/programs');
      }, 1200);
    } catch (err: any) {
      setError('حدث خطأ أثناء إضافة البرنامج');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          إضافة برنامج جديد
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">اسم البرنامج</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">الوصف</label>
            <textarea
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">صورة البرنامج</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="معاينة الصورة"
                className="mt-2 rounded shadow w-32 h-32 object-cover"
              />
            )}
            <p className="text-xs text-gray-500 mt-1">
              المقاس المفضل للصورة: 400×400 بكسل (مربع)
            </p>
          </div>
          <div>
            <label className="block mb-1 font-medium">تاريخ البداية</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">تاريخ النهاية</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'جاري الإضافة...' : 'إضافة البرنامج'}
          </button>
          {success && (
            <div className="text-green-600 text-center font-semibold mt-2">
              تمت إضافة البرنامج بنجاح!
            </div>
          )}
          {error && (
            <div className="text-red-600 text-center font-semibold mt-2">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewProgram;
