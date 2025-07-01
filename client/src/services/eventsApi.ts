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
export const fetchEventById = async (id: number): Promise<ApiResponse<Event>> => {
  const response = await http.get(`/events/${id}`);
  return response.data;
};

// Create a new event (admin only)
export const createEvent = async (eventData: Partial<Event>): Promise<ApiResponse<Event>> => {
  const response = await http.post('/events', eventData);
  return response.data;
};

// Update an event (admin only)
export const updateEvent = async (id: number, eventData: Partial<Event>): Promise<ApiResponse<Event>> => {
  const response = await http.put(`/events/${id}`, eventData);
  return response.data;
};

// Delete an event (admin only)
export const deleteEvent = async (id: number): Promise<ApiResponse<void>> => {
  const response = await http.delete(`/events/${id}`);
  return response.data;
};

// Register for an event
export const registerForEvent = async (eventId: number, userId: number): Promise<ApiResponse<any>> => {
  const response = await http.post(`/events/${eventId}/register`, { user_id: userId });
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