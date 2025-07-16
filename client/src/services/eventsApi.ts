import { http } from './api';
import { Event, PaginatedResponse, EventsQueryParams, ApiResponse } from '../types';

// Fetch events with filters and pagination
export const fetchEvents = async (params: EventsQueryParams = {}): Promise<PaginatedResponse<Event>> => {
  const { category, search, page = 1, limit = 10, status } = params;

  const queryParams = new URLSearchParams();
  if (category) queryParams.append('category', category);
  if (search) queryParams.append('search', search);
  if (status) queryParams.append('status', status);
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());

  const response = await http.get(`/events?${queryParams.toString()}`);
  return response.data;
};

// Fetch a single event by ID
export const fetchEventById = async (id: number | string): Promise<Event> => {
  const response = await http.get(`/events/${id}`);
  if (!response.data || !response.data.data) {
    throw new Error('404: Event not found');
  }
  return response.data.data;
};

// Create a new event (admin only) - supports FormData for image upload
export const createEvent = async (eventData: Partial<Event> | FormData): Promise<ApiResponse<Event>> => {
  const headers = eventData instanceof FormData
    ? { 'Content-Type': 'multipart/form-data' }
    : { 'Content-Type': 'application/json' };

  const response = await http.post('/events', eventData, { headers });
  return response.data;
};

// Update an event (admin only) - supports FormData for image upload
export const updateEvent = async (id: number, eventData: Partial<Event> | FormData): Promise<ApiResponse<Event>> => {
  const headers = eventData instanceof FormData
    ? { 'Content-Type': 'multipart/form-data' }
    : { 'Content-Type': 'application/json' };

  const response = await http.put(`/events/${id}`, eventData, { headers });
  return response.data;
};

// Delete an event (admin only)
export const deleteEvent = async (id: number): Promise<ApiResponse<void>> => {
  const response = await http.delete(`/events/${id}`);
  return response.data;
};

// Register for an event
export const registerForEvent = async (
  eventId: number | string,
  registrationData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    organization?: string;
  }
): Promise<ApiResponse<any>> => {
  // تحويل الحقول إلى snake_case
  const payload = {
    first_name: registrationData.firstName,
    last_name: registrationData.lastName,
    email: registrationData.email,
    phone: registrationData.phone,
    organization: registrationData.organization,
  };
  const response = await http.post(`/events/${eventId}/register`, payload);
  return response.data;
};

// Get user's event registrations
export const fetchUserRegistrations = async (): Promise<ApiResponse<Event[]>> => {
  const response = await http.get('/events/user/registrations');
  return response.data;
};

// Cancel event registration
export const cancelEventRegistration = async (eventId: number): Promise<ApiResponse<void>> => {
  const response = await http.delete(`/events/${eventId}/register`);
  return response.data;
};