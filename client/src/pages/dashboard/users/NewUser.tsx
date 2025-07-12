import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewUser: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // منطق الإضافة الفعلي (API)
    setSuccess(true);
    setTimeout(() => {
      navigate('/dashboard/users');
    }, 1200);
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
          إضافة مستخدم جديد
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">الاسم الأول</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">الاسم الأخير</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">البريد الإلكتروني</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">كلمة المرور</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">الصورة الشخصية</label>
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
                className="mt-2 rounded-full shadow w-32 h-32 object-cover"
              />
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">نبذة عن المستخدم</label>
            <textarea
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
          >
            إضافة المستخدم
          </button>
          {success && (
            <div className="text-green-600 text-center font-semibold mt-2">
              تمت إضافة المستخدم بنجاح!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewUser;
