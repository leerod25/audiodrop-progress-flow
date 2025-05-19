
// Add any utility functions related to agents here

import { User } from '@/hooks/useUserFetch';

// Convert audio URL to a downloadable link if needed
export const getDownloadableAudioUrl = (audioUrl: string): string => {
  // In a real app, you might need to transform the URL
  // For now, we'll just return the URL as is
  return audioUrl;
};

// Generate a filename for downloaded audio
export const generateAudioFilename = (title: string): string => {
  const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return `${sanitizedTitle}.webm`;
};

export const formatAudioDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Add this to fix the error in Agents.tsx
export const convertUserToAgent = (user: User) => {
  return {
    id: user.id,
    name: user.full_name || 'Unnamed Agent',
    email: user.email,
    location: user.city && user.country ? `${user.city}, ${user.country}` : 'Location not provided',
    experience: user.years_experience || 'Not specified',
    languages: user.languages || [],
    audioSamples: user.audio_files || [],
    isAvailable: user.is_available || false,
    avatar: user.avatar_url || '',
    gender: user.gender || 'Not specified',
    has_audio: user.audio_files && user.audio_files.length > 0,
    audioUrls: user.audio_files?.map(file => ({
      id: file.id,
      title: file.title,
      url: file.audio_url,
      updated_at: file.created_at || new Date().toISOString()
    })) || []
  };
};
