// Event types
export interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  category: 'workshop' | 'conference' | 'networking';
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  max_attendees?: number;
  current_attendees?: number;
  image_url?: string;
  created_at: string;
  updated_at?: string;
}

// Program types
export interface Program {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at?: string;
  category?: string;
  supporters?: ProgramSupporter[];
  registrations?: ProgramRegistration[];
}

export interface ProgramSupporter {
  id: number;
  program_id: number;
  supporter_name: string;
  supporter_email?: string;
  amount?: number;
  created_at: string;
}

export interface ProgramRegistration {
  id: number;
  program_id: number;
  user_id: number;
  created_at: string;
}

// User types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  is_admin: boolean;
  is_active: boolean;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

// Event Registration types
export interface EventRegistration {
  id: number;
  user_id: number;
  event_id: number;
  registered_at: string;
  event?: Event;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: {
    items: T[];
    pagination: Pagination;
  };
  message: string;
  success: boolean;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Query parameters
export interface EventsQueryParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
}

export interface ProgramsQueryParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}