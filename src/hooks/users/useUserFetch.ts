
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { isValidUrl } from '@/utils/audioUtils';

interface AudioFile {
  id: string;
  title: string;
  audio_url: string;
  created_at: string;
}

interface User {
  id: string;
  email: string | null;
  app_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
  created_at: string;
  last_sign_in_at?: string | null;
  audio_files?: AudioFile[];
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
        body: { businessOnly: true }
      });
      
      if (error) {
        console.error('Error calling edge function:', error);
        setError('Failed to fetch users: ' + error.message);
        toast.error("Failed to load users");
        return;
      }

      // Data contains the users
      const response = data as UsersResponse;
      console.log('Business profiles found:', response?.users?.length || 0);
      
      if (response?.users) {
        // Process users to ensure audio files have proper URLs
        const processedUsers = response.users.map(user => {
          if (user.audio_files) {
            // Filter out any audio files with invalid URLs
            const validAudioFiles = user.audio_files.filter(file => 
              isValidUrl(file.audio_url)
            );
            
            // Log info about valid vs. total audio files
            if (validAudioFiles.length !== user.audio_files.length) {
              console.log(`User ${user.id}: ${validAudioFiles.length} valid audio files out of ${user.audio_files.length} total`);
            }
            
            return {
              ...user,
              audio_files: validAudioFiles
            };
          }
          return user;
        });
        
        setUsers(processedUsers);
      } else {
        setError('No users data returned');
        toast.error("No business profiles found");
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred: ' + err.message);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if user is logged in
    if (currentUser) {
      fetchAllUsers();
    } else {
      setLoading(false);
      setError("Please log in to view business profiles");
    }
  }, [currentUser]);

  return { users, loading, error, fetchAllUsers };
};
