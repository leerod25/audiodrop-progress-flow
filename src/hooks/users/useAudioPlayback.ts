
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
      
      // Get or create audio element
      let audioElement = audioElementsRef.current[audioId];
      if (!audioElement) {
        // Find the audio element in the DOM
        audioElement = document.getElementById(audioId) as HTMLAudioElement;
        
        if (!audioElement) {
          console.error('Audio element not found in DOM:', audioId);
          toast.error('Audio element not found');
          return;
        }
        
        // Cache the element for future use
        audioElementsRef.current[audioId] = audioElement;
      }
      
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
      
      // Reset the audio element
      audioElement.currentTime = 0;
      
      // Force a reload to clear any previous errors
      audioElement.load();
      
      console.log(`Attempting to play audio: ${audioId}`);
      
      // Play with promise handling for browsers that support it
      let playPromise;
      try {
        playPromise = audioElement.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setPlayingAudio(audioId);
              console.log(`Now playing: ${audioId}`);
              
              // Set up onended handler to reset playingAudio state
              audioElement.onended = () => {
                console.log(`Playback ended for: ${audioId}`);
                setPlayingAudio(null);
              };
            })
            .catch(err => {
              console.error('Browser prevented audio playback:', err);
              toast.error('Audio playback blocked by browser. Try clicking again or check browser settings.');
              setPlayingAudio(null);
            });
        } else {
          // For older browsers that don't return a promise
          setPlayingAudio(audioId);
          console.log(`Now playing (legacy browser): ${audioId}`);
        }
      } catch (err) {
        console.error('Error initiating playback:', err);
        toast.error('Failed to play audio');
        setPlayingAudio(null);
      }
    } catch (err) {
      console.error('Unexpected error in handleAudioPlay:', err);
      toast.error('An error occurred when trying to play audio');
      setPlayingAudio(null);
    }
  };

  return { expandedUser, playingAudio, toggleUserExpand, handleAudioPlay };
};
