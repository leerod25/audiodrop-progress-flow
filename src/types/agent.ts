
// Define the Agent interface to be used across components
export interface Agent {
  id: string;
  has_audio: boolean;
  audio_url?: string | null;
  country?: string | null;
  city?: string | null;
  computer_skill_level?: string | null;
  is_favorite?: boolean;
  avatar_url?: string | null;
  name?: string | null;
  // New fields to help with data validation
  profile_complete?: boolean;
  is_real?: boolean;
}
