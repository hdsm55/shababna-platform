import { http } from './api';
import { Program, PaginatedResponse, ProgramsQueryParams } from '../types';

// Fetch programs with filters and pagination
export const fetchPrograms = async (params: ProgramsQueryParams = {}): Promise<PaginatedResponse<Program>> => {
  const { category, search, page = 1, limit = 10 } = params;

  const queryParams = new URLSearchParams();
  if (category) queryParams.append('category', category);
  if (search) queryParams.append('search', search);
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());

  const response = await http.get(`/programs?${queryParams.toString()}`);
  return response.data;
};

// Fetch a single program by ID
export const fetchProgramById = async (id: number | string): Promise<Program> => {
  const response = await http.get(`/programs/${id}`);
  if (!response.data || !response.data.data) {
    throw new Error('404: Program not found');
  }
  return response.data.data;
};

// دعم برنامج (مالي أو تطوعي أو شراكة)
export const supportProgram = async (programId: number, data: any): Promise<{ success: boolean; message: string }> => {
  const response = await http.post(`/programs/${programId}/support`, data);
  return response.data;
};

// حذف دالة جلب تبرعات المستخدم العامة
// export const fetchUserDonations = async (): Promise<any[]> => {
//   const response = await http.get('/donations/my-donations');
//   return response.data.data;
// };

// Create a new program (admin only) - supports FormData for image upload
export const createProgram = async (programData: Partial<Program> | FormData): Promise<Program> => {
  const headers = programData instanceof FormData
    ? { 'Content-Type': 'multipart/form-data' }
    : { 'Content-Type': 'application/json' };

  const response = await http.post('/programs', programData, { headers });
  return response.data.data;
};

// Update an existing program (admin only) - supports FormData for image upload
export const updateProgram = async (id: number | string, programData: Partial<Program> | FormData): Promise<Program> => {
  const headers = programData instanceof FormData
    ? { 'Content-Type': 'multipart/form-data' }
    : { 'Content-Type': 'application/json' };

  const response = await http.put(`/programs/${id}`, programData, { headers });
  return response.data.data;
};

// Register for a program
export const registerForProgram = async (
  programId: number | string,
  registrationData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    message?: string;
  }
): Promise<{ success: boolean; message: string }> => {
  const response = await http.post(`/programs/${programId}/register`, registrationData);
  return response.data;
};