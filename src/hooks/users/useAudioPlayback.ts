
import { useState } from 'react';
import { toast } from "sonner";
import { isValidUrl } from '@/utils/audioUtils';

export const useAudioPlayback = () => {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

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
          // Check if audio source exists and is valid
          if (!audioElement.src || audioElement.src === window.location.href) {
            console.error('Audio source is missing or invalid');
            toast.error('Audio file URL is not valid');
            return;
          }
          
          // Check if the audio URL is valid before trying to play
          if (!isValidUrl(audioElement.src)) {
            console.error('Invalid audio URL:', audioElement.src);
            toast.error('Invalid audio URL format');
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
              toast.error('Failed to play audio: ' + (err.message || 'Unknown error'));
            });
        }
      }
    } catch (err) {
      console.error('Unexpected error in handleAudioPlay:', err);
      toast.error('An error occurred when trying to play audio');
    }
  };

  return { expandedUser, playingAudio, toggleUserExpand, handleAudioPlay };
};
