
import { User } from '@/hooks/users/useUserFetch';

// Sample agent data for North America (6 profiles) - REMOVED EMAIL fields
export const sampleAgents: User[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: '', // Removed email
    full_name: 'Agent ID: 550e8400',
    created_at: '2024-01-15',
    audio_files: [],
    country: 'United States',
    city: 'New York',
    gender: 'Male',
    years_experience: '5',
    languages: ['English', 'Spanish'],
    is_available: true,
    role: 'agent'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: '', // Removed email
    full_name: 'Agent ID: 550e8401',
    created_at: '2024-02-10',
    audio_files: [],
    country: 'Mexico',
    city: 'Mexico City',
    gender: 'Female',
    years_experience: '7',
    languages: ['Spanish', 'English'],
    is_available: true,
    role: 'agent'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: '', // Removed email
    full_name: 'Agent ID: 550e8402',
    created_at: '2024-03-05',
    audio_files: [],
    country: 'Canada',
    city: 'Toronto',
    gender: 'Male',
    years_experience: '3',
    languages: ['English', 'French'],
    is_available: false,
    role: 'agent'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: '', // Removed email
    full_name: 'Agent ID: 550e8403',
    created_at: '2024-01-25',
    audio_files: [],
    country: 'El Salvador',
    city: 'San Salvador',
    gender: 'Female',
    years_experience: '4',
    languages: ['Spanish', 'English'],
    is_available: true,
    role: 'agent'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    email: '', // Removed email
    full_name: 'Agent ID: 550e8404',
    created_at: '2024-02-20',
    audio_files: [],
    country: 'United States',
    city: 'Los Angeles',
    gender: 'Male',
    years_experience: '6',
    languages: ['English'],
    is_available: true,
    role: 'agent'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    email: '', // Removed email
    full_name: 'Agent ID: 550e8405',
    created_at: '2024-03-15',
    audio_files: [],
    country: 'Mexico',
    city: 'Guadalajara',
    gender: 'Male',
    years_experience: '8',
    languages: ['Spanish', 'English', 'Portuguese'],
    is_available: true,
    role: 'agent'
  }
];
