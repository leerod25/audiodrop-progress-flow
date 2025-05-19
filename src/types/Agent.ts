
export interface Agent {
  id: string;
  email: string; // Required field
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
  audio_files?: any[]; 
  
  // Fields required for User compatibility
  full_name?: string | null;
  phone?: string | null;
  bio?: string | null;
  
  // Add fields to fix type errors
  is_available?: boolean;
  years_experience?: string | null;
  languages?: string[] | null;
  created_at: string; // Required field
}
