
import { supabase } from '@/integrations/supabase/client';

// Predefined sample audio URLs (chime/music sounds)
const sampleAudios = [
  'https://assets.mixkit.co/sfx/preview/mixkit-bell-notification-933.mp3',
  'https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3',
  'https://assets.mixkit.co/sfx/preview/mixkit-clear-announce-tones-2861.mp3',
  'https://assets.mixkit.co/sfx/preview/mixkit-happy-bells-notification-937.mp3',
  'https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3',
];

// Predefined countries and cities
const locations = [
  { country: 'United States', city: 'New York' },
  { country: 'United Kingdom', city: 'London' },
  { country: 'Canada', city: 'Toronto' },
  { country: 'Australia', city: 'Sydney' },
  { country: 'Germany', city: 'Berlin' },
  { country: 'France', city: 'Paris' },
  { country: 'Japan', city: 'Tokyo' },
  { country: 'Brazil', city: 'Rio de Janeiro' },
  { country: 'India', city: 'Mumbai' },
  { country: 'South Africa', city: 'Cape Town' },
];

// Skill levels
const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

// Generate a fake agent profile
const generateFakeProfile = (index: number, gender: 'boy' | 'girl') => {
  const name = `${gender.toUpperCase()}${index}`;
  const location = locations[Math.floor(Math.random() * locations.length)];
  const skillLevel = skillLevels[Math.floor(Math.random() * skillLevels.length)];
  const audioUrl = sampleAudios[Math.floor(Math.random() * sampleAudios.length)];
  
  return {
    id: `fake-${gender}-${index}`,
    has_audio: true,
    audio_url: audioUrl,
    country: location.country,
    city: location.city,
    computer_skill_level: skillLevel,
    is_favorite: Math.random() > 0.7, // 30% chance to be favorited
  };
};

// Generate a list of fake profiles
export const generateFakeProfiles = () => {
  const fakeProfiles = [];
  
  // Generate 5 boy profiles
  for (let i = 1; i <= 5; i++) {
    fakeProfiles.push(generateFakeProfile(i, 'boy'));
  }
  
  // Generate 5 girl profiles
  for (let i = 1; i <= 5; i++) {
    fakeProfiles.push(generateFakeProfile(i, 'girl'));
  }
  
  return fakeProfiles;
};
