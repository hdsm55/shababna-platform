// Event types
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  category: 'conference' | 'workshop' | 'networking';
  image?: string;
  max_attendees?: number;
  price: number;
  status: 'active' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

// Program types
export interface Program {
  id: number;
  title: string;
  description: string;
  category: 'education' | 'relief' | 'youth' | 'media' | 'daawah';
  image?: string;
  goal_amount?: number;
  current_amount: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// User types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Query parameters
export interface EventsQueryParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProgramsQueryParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}