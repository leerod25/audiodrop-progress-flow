
import { supabase } from '@/integrations/supabase/client';

// Predefined sample audio URLs (using standard audio formats that work across browsers)
const sampleAudios = [
  '/lovable-uploads/sample-audio-1.mp3',
  '/lovable-uploads/sample-audio-2.mp3',
  '/lovable-uploads/sample-audio-3.mp3',
  '/lovable-uploads/sample-audio-4.mp3',
  '/lovable-uploads/sample-audio-5.mp3',
];

// Avatar images for profiles
const avatarImages = {
  boy: '/lovable-uploads/8ae8fb9c-1ded-47ae-aa00-f2952d6a80b1.png',
  girl: '/lovable-uploads/eeac5d8e-0ba7-49d3-9235-4e6b321390bd.png'
};

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
  
  // Instead of random selection, use a fixed audio URL for testing
  const audioUrl = '/lovable-uploads/sample-notification.mp3';
  
  return {
    id: `fake-${gender}-${index}`,
    has_audio: true,
    audio_url: audioUrl,
    country: location.country,
    city: location.city,
    computer_skill_level: skillLevel,
    is_favorite: Math.random() > 0.7, // 30% chance to be favorited
    avatar_url: avatarImages[gender],
    name: name,
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
