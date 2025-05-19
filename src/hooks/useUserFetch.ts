import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { isValidUrl } from '@/utils/audioUtils';

export interface AudioFile {
  id: string;
  title: string;
  audio_url: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  app_metadata?: Record<string, any>;
  user_metadata?: Record<string, any>;
  last_sign_in_at?: string | null;
  audio_files: AudioFile[];
  country?: string | null;
  city?: string | null;
  gender?: string | null;
  years_experience?: string | null;
  languages?: string[] | null;
  is_available?: boolean;
  role?: string;
  salary_expectation?: string | null;
}

interface UsersResponse {
  users: User[];
}

export const useUserFetch = (currentUser: any) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call our edge function to get all users
      const { data, error } = await supabase.functions.invoke('list-users', {
        body: { businessOnly: false, adminMode: false }  // Set to false to exclude business profiles
      });
      
      if (error) {
        console.error('Error calling edge function:', error);
        setError('Failed to fetch users: ' + error.message);
        toast.error("Failed to load users");
        return;
      }

      // Data contains the users
      const response = data as UsersResponse;
      console.log('Agent profiles found:', response?.users?.length || 0);
      
      if (response?.users) {
        // Process users to ensure audio files have proper URLs and add profile data
        const processedUsers = await Promise.all(response.users.map(async (user) => {
          // Try to get additional profile data from the profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          // Try to get years experience and languages from professional_details
          const { data: professionalData } = await supabase
            .from('professional_details')
            .select('years_experience, languages, salary_expectation')
            .eq('user_id', user.id)
            .single();
          
          // Check if the user has availability information in professional_details
          const { data: availabilityData } = await supabase
            .from('professional_details')
            .select('id')
            .eq('user_id', user.id)
            .single();
          
          // Filter out any audio files with invalid URLs
          let validAudioFiles = user.audio_files || [];
          if (user.audio_files) {
            validAudioFiles = user.audio_files.filter(file => 
              isValidUrl(file.audio_url)
            );
          }
          
          return {
            ...user,
            country: profileData?.country || null,
            city: profileData?.city || null,
            gender: profileData?.gender || null,
            role: profileData?.role || 'agent',
            salary_expectation: professionalData?.salary_expectation?.toString() || null,
            is_available: !!availabilityData, // Available if they have professional details
            years_experience: professionalData?.years_experience || null,
            languages: professionalData?.languages || null,
            audio_files: validAudioFiles
          };
        }));
        
        setUsers(processedUsers);
      } else {
        setError('No users data returned');
        toast.error("No agent profiles found");
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred: ' + err.message);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (userId: string, currentStatus: boolean) => {
    try {
      // For now, we'll store availability in professional_details
      // If the user has professional details, we'll keep them (available)
      // If not, we'll create them (making them available)
      if (currentStatus) {
        // If currently available, remove their professional_details entry
        const { error } = await supabase
          .from('professional_details')
          .delete()
          .eq('user_id', userId);
        
        if (error) {
          console.error('Error updating availability:', error);
          toast.error("Failed to update availability");
          return;
        }
      } else {
        // If currently unavailable, add a professional_details entry
        const { error } = await supabase
          .from('professional_details')
          .insert({ 
            user_id: userId,
            years_experience: '1', // Default value
            languages: ['English'], // Default value
            salary_expectation: '500'  // String value
          });
        
        if (error) {
          console.error('Error updating availability:', error);
          toast.error("Failed to update availability");
          return;
        }
      }
      
      // Update the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, is_available: !currentStatus } 
            : user
        )
      );
      
      toast.success(`Agent is now ${!currentStatus ? 'available' : 'unavailable'}`);
    } catch (err: any) {
      console.error('Unexpected error updating availability:', err);
      toast.error("Failed to update availability");
    }
  };

  useEffect(() => {
    // Fetch users regardless of login status to allow preview mode
    fetchAllUsers();
  }, [currentUser]);

  return { users, loading, error, fetchAllUsers, toggleAvailability };
};
