// Event types
export interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  category: string; // دعم جميع الفئات
  image_url?: string; // تحديث الحقل ليكون مطابقاً لقاعدة البيانات
  max_attendees?: number;
  attendees: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
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
  start_date: string;
  end_date: string;
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
  status?: string;
}

export interface ProgramsQueryParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}