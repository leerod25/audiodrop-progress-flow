
export interface Agent {
  id: string;
  has_audio: boolean;
  audio_url?: string | null;
  country?: string | null;
  city?: string | null;
  computer_skill_level?: string | null;
  is_favorite?: boolean;
}
