import { http } from './api';
import { Event, PaginatedResponse, EventsQueryParams } from '../types';

// Fetch events with filters and pagination
export const fetchEvents = async (params: EventsQueryParams = {}): Promise<PaginatedResponse<Event>> => {
  const { category, search, page = 1, limit = 10 } = params;

  const queryParams = new URLSearchParams();
  if (category) queryParams.append('category', category);
  if (search) queryParams.append('search', search);
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());

  const response = await http.get(`/events?${queryParams.toString()}`);
  return response.data;
};

// Fetch a single event by ID
export const fetchEventById = async (id: number): Promise<Event> => {
  const response = await http.get(`/events/${id}`);
  return response.data.data;
};

// Register for an event
export const registerForEvent = async (eventId: number): Promise<{ success: boolean; message: string }> => {
  const response = await http.post(`/events/${eventId}/register`);
  return response.data;
};

// Get user's event registrations
export const fetchUserRegistrations = async (): Promise<Event[]> => {
  const response = await http.get('/events/my-registrations');
  return response.data.data;
};