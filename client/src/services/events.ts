import { fetchAPI } from '@/utils/api';
import { Event } from '@/types';

interface EventsResponse {
  items: Event[];
  total: number;
}

interface EventFilters {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

interface EventRegistration {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

export const eventsService = {
  async getEvents(filters: EventFilters = {}): Promise<EventsResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    const response = await fetchAPI(`/events?${params.toString()}`);
    return response.data;
  },

  async getEvent(id: string | number): Promise<Event> {
    const response = await fetchAPI(`/events/${id}`);
    return response.data;
  },

  async createEvent(data: Partial<Event>, token: string): Promise<Event> {
    const response = await fetchAPI('/events', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
    return response.data;
  },

  async updateEvent(
    id: string | number,
    data: Partial<Event>,
    token: string
  ): Promise<Event> {
    const response = await fetchAPI(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
    return response.data;
  },

  async deleteEvent(id: string | number, token: string): Promise<void> {
    await fetchAPI(`/events/${id}`, {
      method: 'DELETE',
      token,
    });
  },

  async registerForEvent(
    id: string | number,
    data: EventRegistration
  ): Promise<void> {
    await fetchAPI(`/events/${id}/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getUserEvents(token: string): Promise<Event[]> {
    const response = await fetchAPI('/events/user/registrations', {
      token,
    });
    return response.data;
  },
};
