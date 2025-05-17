
import { useState, useEffect, useRef } from 'react';
import { toast } from "sonner";
import { isValidUrl } from '@/utils/audioUtils';

export const useAudioPlayback = () => {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioElementsRef = useRef<Record<string, HTMLAudioElement>>({});

  // Use effect to cleanup audio elements when component unmounts
  useEffect(() => {
    return () => {
      // Stop and cleanup all audio elements on unmount
      Object.values(audioElementsRef.current).forEach(audio => {
        try {
          audio.pause();
          audio.src = '';
        } catch (e) {
          console.error('Error cleaning up audio element:', e);
        }
      });
    };
  }, []);

  // Toggle expanded state for a user
  const toggleUserExpand = (userId: string) => {
    // If we're closing the currently expanded user, stop any playing audio
    if (expandedUser === userId && playingAudio) {
      stopCurrentAudio();
    }
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  // Stop currently playing audio
  const stopCurrentAudio = () => {
    if (playingAudio && audioElementsRef.current[playingAudio]) {
      try {
        const audioElement = audioElementsRef.current[playingAudio];
        audioElement.pause();
        audioElement.currentTime = 0;
        console.log(`Stopped audio: ${playingAudio}`);
      } catch (err) {
        console.error('Error stopping audio:', err);
      }
      setPlayingAudio(null);
    }
  };

  // Handle audio playback
  const handleAudioPlay = (audioId: string) => {
    try {
      console.log(`Handling audio play request for: ${audioId}`);
      
      // If the same audio is already playing, stop it
      if (playingAudio === audioId) {
        stopCurrentAudio();
        return;
      }
      
      // Stop any currently playing audio
      stopCurrentAudio();
      
      // Update state first to show the AudioPlayer component
      setPlayingAudio(audioId);
      
      // Either the AudioPlayer component will handle actual playback,
      // or we'll fall back to the hidden audio element if needed
      
      // Get a reference to the hidden audio element for fallback purposes
      const audioElement = document.getElementById(audioId) as HTMLAudioElement;
      
      if (audioElement) {
        // Cache the element for future use
        audioElementsRef.current[audioId] = audioElement;
      } else {
        console.log(`Audio element with ID ${audioId} not found in DOM, using AudioPlayer component instead.`);
      }
    } catch (err) {
      console.error('Unexpected error in handleAudioPlay:', err);
      toast.error('An error occurred when trying to play audio');
      setPlayingAudio(null);
    }
  };

  return { expandedUser, playingAudio, toggleUserExpand, handleAudioPlay };
};
