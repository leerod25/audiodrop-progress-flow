
import { User } from '@/hooks/users/useUserFetch';
import { Agent } from '@/types/Agent';

/**
 * Converts a User object to an Agent object
 * @param user The user object to convert
 * @returns An Agent object
 */
export function convertUserToAgent(user: User): Agent {
  const agent: Agent = {
    id: user.id,
    email: user.email || '',
    created_at: user.created_at || new Date().toISOString(),
    has_audio: Boolean(user.audio_files?.length),
    country: user.country || null,
    city: user.city || null,
    is_favorite: false, // Default value since User doesn't have is_favorite
    gender: user.gender || null,
  };

  // Add audio URL if available
  if (user.audio_files && user.audio_files.length > 0) {
    agent.audio_url = user.audio_files[0].audio_url;
  }

  // Map audio files to audioUrls format
  if (user.audio_files && user.audio_files.length > 0) {
    agent.audioUrls = user.audio_files.map(file => ({
      id: file.id,
      title: file.title || 'Untitled Recording',
      url: file.audio_url,
      updated_at: file.created_at
    }));
  }

  // Add additional fields if available
  if (user.full_name) {
    agent.full_name = user.full_name;
  }
  
  if (user.years_experience) {
    agent.computer_skill_level = user.years_experience;
  }

  return agent;
}

/**
 * Formats a user ID for display
 * @param id The user ID to format
 * @returns A formatted user ID (shortened with ellipsis)
 */
export function formatUserId(id: string): string {
  return id.substring(0, 8) + '…';
}
