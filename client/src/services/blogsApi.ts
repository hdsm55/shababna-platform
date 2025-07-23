import { http } from './api';
import { Blog } from '../types';

export const fetchBlogs = async (): Promise<Blog[]> => {
  const res = await http.get('/blogs');
  console.log('API Response:', res);
  return res.data.data;
};

export const fetchBlogById = async (id: string | number): Promise<Blog> => {
  const res = await http.get(`/blogs/${id}`);
  return res.data.data;
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