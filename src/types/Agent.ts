
export interface Agent {
  id: string;
  email: string;
  created_at: string;
  has_audio: boolean;
  audio_url?: string | null;
  audioUrls?: {
    id: string;
    title: string;
    url: string;
    updated_at: string;
  }[];
  country?: string | null;
  city?: string | null;
  computer_skill_level?: string | null;
  is_favorite?: boolean;
  gender?: string | null;
  audio_files?: any[]; // Add this to match the structure from useUsersData
  
  // Add properties that were missing
  years_experience?: string | null;
  languages?: string[] | null;
  is_available?: boolean;
  
  // Add private fields that only admins should access
  full_name?: string | null;
  phone?: string | null;
  bio?: string | null;
  whatsapp?: string | null;
  
  // Add average rating for business users
  average_rating?: number | null;
}
