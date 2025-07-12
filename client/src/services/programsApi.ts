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

// Make a donation to a program
export const donateToProgram = async (programId: number, amount: number): Promise<{ success: boolean; message: string }> => {
  const response = await http.post(`/programs/${programId}/donate`, { amount });
  return response.data;
};

// Get user's donations
export const fetchUserDonations = async (): Promise<any[]> => {
  const response = await http.get('/donations/my-donations');
  return response.data.data;
};

// Create a new program (admin only)
export const createProgram = async (programData: Partial<Program>): Promise<Program> => {
  const response = await http.post('/programs', programData);
  return response.data.data;
};

// Update an existing program (admin only)
export const updateProgram = async (id: number | string, programData: Partial<Program>): Promise<Program> => {
  const response = await http.put(`/programs/${id}`, programData);
  return response.data.data;
};