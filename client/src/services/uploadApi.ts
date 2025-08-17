import { http } from './api';

export interface UploadResponse {
  success: boolean;
  message: string;
  url?: string;
  filename?: string;
  size?: number;
}

// رفع صورة واحدة
export const uploadImage = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await http.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Upload error:', error);
    throw new Error(
      error.response?.data?.message || 'حدث خطأ أثناء رفع الصورة'
    );
  }
};

// رفع عدة صور
export const uploadMultipleImages = async (files: File[]): Promise<UploadResponse[]> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};

// حذف صورة
export const deleteImage = async (filename: string): Promise<UploadResponse> => {
  try {
    const response = await http.delete(`/upload/image/${filename}`);
    return response.data;
  } catch (error: any) {
    console.error('Delete image error:', error);
    throw new Error(
      error.response?.data?.message || 'حدث خطأ أثناء حذف الصورة'
    );
  }
};

// جلب قائمة الصور
export const getImages = async (): Promise<{ success: boolean; images: any[] }> => {
  try {
    const response = await http.get('/upload/images');
    return response.data;
  } catch (error: any) {
    console.error('Get images error:', error);
    throw new Error(
      error.response?.data?.message || 'حدث خطأ أثناء جلب الصور'
    );
  }
};