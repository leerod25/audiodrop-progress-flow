
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
    is_favorite: teamIds.includes(user.id),
    // Add private fields as well (they'll only be shown to admins)
    full_name: user.full_name || null,
    email: user.email || null,
    phone: user.phone_number || null, // Updated from phone to phone_number
    bio: user.biography || null, // Updated from bio to biography
    computer_skill_level: user.computer_skills || null // Updated from computer_skill_level to computer_skills
  };
};
