
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
    is_favorite: Boolean(user.is_favorite),
    gender: user.gender || null,
  };

  // Add audio URL if available
  if (user.audio_files && user.audio_files.length > 0) {
    agent.audio_url = user.audio_files[0].url;
  }

  // Map audio files to audioUrls format
  if (user.audio_files && user.audio_files.length > 0) {
    agent.audioUrls = user.audio_files.map(file => ({
      id: file.id,
      title: file.title || 'Untitled Recording',
      url: file.url,
      updated_at: file.updated_at
    }));
  }

  // Add profile fields if available
  if (user.profile) {
    agent.full_name = user.profile.full_name || null;
    agent.phone = user.profile.phone || null;
    agent.bio = user.profile.bio || null;
    
    // Handle computer skill level
    if (user.profile.computer_skill_level) {
      agent.computer_skill_level = user.profile.computer_skill_level;
    }
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
