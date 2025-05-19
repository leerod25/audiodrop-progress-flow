
export interface Agent {
  id: string;
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
}
