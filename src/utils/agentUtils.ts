
import { User } from '@/hooks/users/useUserFetch';
import { Agent } from '@/types/Agent';

/**
 * Converts a User object to an Agent object
 */
export const convertUserToAgent = (user: User, teamIds: string[] = []): Agent => {
  // Get audio files if they exist
  const audioUrls = user.audio_files ? 
    user.audio_files.map(file => ({
      id: file.id,
      title: file.title,
      url: file.audio_url,
      updated_at: file.created_at
    })) : 
    undefined;
  
  return {
    id: user.id,
    has_audio: user.audio_files && user.audio_files.length > 0,
    audioUrls: audioUrls,
    country: user.country || null,
    city: user.city || null,
    gender: user.gender || null,
    is_favorite: teamIds.includes(user.id)
  };
};
