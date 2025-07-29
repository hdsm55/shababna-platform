import { http } from './api';
import { Event, PaginatedResponse, EventsQueryParams, ApiResponse } from '../types';

// Cache for events data
const eventsCache = new Map();
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes for events

// Optimized fetch events with caching
export const fetchEvents = async (params: EventsQueryParams = {}): Promise<PaginatedResponse<Event>> => {
  try {
    const { category, search, page = 1, limit = 10, status } = params;

    const queryParams = new URLSearchParams();
    if (category) queryParams.append('category', category);
    if (search) queryParams.append('search', search);
    if (status) queryParams.append('status', status);
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    const cacheKey = `events-${queryParams.toString()}`;
    const cached = eventsCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const response = await http.get(`/events?${queryParams.toString()}`);

    // Cache the response
    eventsCache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now(),
    });

    return response.data;
  } catch (error) {
    console.error('Events API failed:', error);
    throw error;
  }
}

// Optimized fetch single event by ID with caching
export const fetchEventById = async (id: string): Promise<any> => {
  try {
    const cacheKey = `event-${id}`;
    const cached = eventsCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const response = await http.get(`/events/${id}`);

    // Cache the response
    eventsCache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now(),
    });

    return response.data;
  } catch (error) {
    console.error('Event API failed:', error);
    throw error;
  }
}

// Clear events cache
export const clearEventsCache = () => {
  eventsCache.clear();
};

// Clear specific event cache
export const clearEventCache = (id?: string) => {
  if (id) {
    eventsCache.delete(`event-${id}`);
  } else {
    // Clear all events cache
    for (const key of eventsCache.keys()) {
      if (key.startsWith('events-')) {
        eventsCache.delete(key);
      }
    }
  }
};

// Create a new event (admin only) - supports FormData for image upload
export const createEvent = async (eventData: Partial<Event> | FormData): Promise<ApiResponse<Event>> => {
  const headers = eventData instanceof FormData
    ? { 'Content-Type': 'multipart/form-data' }
    : { 'Content-Type': 'application/json' };

  // إذا كان eventData كائن عادي (وليس FormData)، فلنرسل فقط الحقول الفعلية المطلوبة
  let payload = eventData;
  if (!(eventData instanceof FormData)) {
    const {
      title,
      description,
      location,
      start_date,
      end_date,
      category,
      max_attendees,
      attendees = 0,
      image_url = null,
      status = 'upcoming',
    } = eventData as any;
    payload = {
      title,
      description,
      location,
      start_date,
      end_date,
      category,
      max_attendees,
      attendees,
      image_url,
      status,
    };
  }

  const response = await http.post('/events', payload, { headers });

  // Clear events cache after creating new event
  clearEventCache();

  return response.data;
};

// Update an event (admin only) - supports FormData for image upload
export const updateEvent = async (id: number, eventData: Partial<Event> | FormData): Promise<ApiResponse<Event>> => {
  const headers = eventData instanceof FormData
    ? { 'Content-Type': 'multipart/form-data' }
    : { 'Content-Type': 'application/json' };

  const response = await http.put(`/events/${id}`, eventData, { headers });

  // Clear specific event cache and events list cache
  clearEventCache(id.toString());
  clearEventCache();

  return response.data;
};

// Delete an event (admin only)
export const deleteEvent = async (id: number): Promise<ApiResponse<void>> => {
  const response = await http.delete(`/events/${id}`);

  // Clear caches after deletion
  clearEventCache(id.toString());
  clearEventCache();

  return response.data;
};

// Register for an event
export const registerForEvent = async (
  eventId: number | string,
  registrationData: any
): Promise<ApiResponse<any>> => {
  const response = await http.post(`/events/${eventId}/register`, registrationData);

  // Clear event cache after registration
  clearEventCache(eventId.toString());

  return response.data;
};

// Get user's event registrations with caching
export const fetchUserRegistrations = async (): Promise<ApiResponse<Event[]>> => {
  try {
    const cacheKey = 'user-registrations';
    const cached = eventsCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const response = await http.get('/events/user/registrations');

    eventsCache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now(),
    });

    return response.data;
  } catch (error) {
    console.error('User registrations API failed:', error);
    throw error;
  }
};

// Cancel event registration
export const cancelEventRegistration = async (eventId: number): Promise<ApiResponse<void>> => {
  const response = await http.delete(`/events/${eventId}/register`);

  // Clear caches after cancellation
  clearEventCache(eventId.toString());
  eventsCache.delete('user-registrations');

  return response.data;
};