import { User } from './../hooks/useUserFetch';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  location: string;
  bio: string;
  skills: string[];
  joinDate: string;
  lastActive: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatUserProfile = (user: User): UserProfile => {
  // Check if user exists
  if (!user) {
    return {
      id: '',
      displayName: '',
      email: '',
      location: '',
      bio: '',
      skills: [],
      joinDate: '',
      lastActive: ''
    };
  }

  // Extract the profile info from the user
  const displayName = user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Anonymous';
  const location = user.city && user.country ? `${user.city}, ${user.country}` : user.city || user.country || 'Not specified';
  // Remove properties that don't exist on the User type
  const bio = user.user_metadata?.biography || 'No biography provided';
  const skills = user.user_metadata?.computer_skills || [];
  
  // Format the dates
  const joinDate = user.created_at ? formatDate(user.created_at) : 'Unknown';
  const lastActive = user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Never';
  
  return {
    id: user.id,
    displayName,
    email: user.email || '',
    location,
    bio,
    skills,
    joinDate,
    lastActive
  };
};
