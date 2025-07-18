import axios from 'axios';
import { Blog } from '../types';

export const fetchBlogs = async (): Promise<Blog[]> => {
  const res = await axios.get('/api/blogs');
  return res.data;
};

export const fetchBlogById = async (id: string | number): Promise<Blog> => {
  const res = await axios.get(`/api/blogs/${id}`);
  return res.data;
};