import { http } from './api';
import { Blog } from '../types';

export const fetchBlogs = async (): Promise<Blog[]> => {
  const res = await http.get('/blogs');
  console.log('API Response:', res);
  return res.data.data || res.data;
};

export const fetchBlogById = async (id: string | number): Promise<Blog> => {
  console.log('🔍 جلب المدونة برقم:', id);
  const res = await http.get(`/blogs/${id}`);
  console.log('📊 استجابة API المدونة:', res.data);
  return res.data;
};

export const createBlog = async (data: Partial<Blog>) => {
  const res = await http.post('/blogs', data);
  return res.data.data;
};

export const updateBlog = async (id: number, data: Partial<Blog>) => {
  const res = await http.put(`/blogs/${id}`, data);
  return res.data.data;
};

export const deleteBlog = async (id: number) => {
  const res = await http.delete(`/blogs/${id}`);
  return res.data.data;
};

export const fetchRelatedBlogs = async (currentBlogId: string | number, limit: number = 3): Promise<Blog[]> => {
  console.log('🔍 جلب المقالات ذات الصلة للمدونة:', currentBlogId);
  const res = await http.get('/blogs');
  const allBlogs = res.data.data || res.data;

  // استبعاد المدونة الحالية وجلب مقالات أخرى
  const relatedBlogs = allBlogs
    .filter((blog: Blog) => blog.id !== Number(currentBlogId))
    .slice(0, limit);

  console.log('📊 المقالات ذات الصلة:', relatedBlogs);
  return relatedBlogs;
};