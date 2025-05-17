
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

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

export const useUsersData = (currentUser: any) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call our edge function to get all users
      const { data, error } = await supabase.functions.invoke('list-users');
      
      if (error) {
        console.error('Error calling edge function:', error);
        setError('Failed to fetch users: ' + error.message);
        toast.error("Failed to load users");
        return;
      }

      // Data contains the users
      const response = data as UsersResponse;
      console.log('Users found:', response?.users?.length || 0);
      
      if (response?.users) {
        // Process users to ensure audio files have proper URLs
        const processedUsers = response.users.map(user => {
          if (user.audio_files) {
            // Filter out any audio files with invalid URLs
            const validAudioFiles = user.audio_files.filter(file => 
              typeof file.audio_url === 'string' && file.audio_url.trim() !== ''
            );
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
        toast.error("No users data returned");
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred: ' + err.message);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Toggle expanded state for a user
  const toggleUserExpand = (userId: string) => {
    // If we're closing the currently expanded user, stop any playing audio
    if (expandedUser === userId && playingAudio) {
      const audioElement = document.getElementById(playingAudio) as HTMLAudioElement;
      if (audioElement) {
        audioElement.pause();
      }
      setPlayingAudio(null);
    }
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  // Handle audio playback
  const handleAudioPlay = (audioId: string) => {
    try {
      if (playingAudio === audioId) {
        // If the same audio is already playing, stop it
        const audioElement = document.getElementById(audioId) as HTMLAudioElement;
        if (audioElement) {
          audioElement.pause();
        }
        setPlayingAudio(null);
      } else {
        // If another audio is playing, stop it first
        if (playingAudio) {
          const previousAudio = document.getElementById(playingAudio) as HTMLAudioElement;
          if (previousAudio) {
            previousAudio.pause();
          }
        }
        
        // Play the new audio
        const audioElement = document.getElementById(audioId) as HTMLAudioElement;
        if (audioElement) {
          // Check if audio exists before trying to play
          if (!audioElement.src || audioElement.src === window.location.href) {
            console.error('Audio source is missing or invalid');
            toast.error('Audio file is not available');
            return;
          }
          
          // Load the audio first to catch any loading errors
          audioElement.load();
          
          audioElement.play()
            .then(() => {
              setPlayingAudio(audioId);
              console.log(`Now playing: ${audioId}`);
              
              // Set up onended handler to reset playingAudio state
              audioElement.onended = () => {
                setPlayingAudio(null);
              };
            })
            .catch(err => {
              console.error('Error playing audio:', err);
              toast.error('Failed to play audio');
            });
        }
      }
    } catch (err) {
      console.error('Unexpected error in handleAudioPlay:', err);
      toast.error('An error occurred when trying to play audio');
    }
  };

  useEffect(() => {
    // Only fetch if user is logged in
    if (currentUser) {
      fetchAllUsers();
    } else {
      setLoading(false);
      setError("Please log in to view users");
    }
  }, [currentUser]);

  return {
    users,
    loading,
    error,
    expandedUser,
    playingAudio,
    fetchAllUsers,
    toggleUserExpand,
    handleAudioPlay,
  };
};
