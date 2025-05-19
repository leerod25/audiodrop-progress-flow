
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function useAudioPlayer() {
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Audio player setup
  useEffect(() => {
    if (audioRef.current) {
      // Set up event listeners
      const audio = audioRef.current;
      
      const onEnded = () => setIsPlaying(false);
      const onError = (e: Event) => {
        console.error('Audio playback error:', e);
        toast.error('Failed to play audio');
        setIsPlaying(false);
        setIsLoading(false);
      };
      const onCanPlayThrough = () => {
        setIsLoading(false);
        // Auto-play when loaded (only if we were trying to play)
        if (isLoading && audio) {
          audio.play().catch(err => {
            console.error('Browser prevented autoplay:', err);
            setIsPlaying(false);
            toast.error('Autoplay prevented by browser. Please click play again.');
          });
        }
      };
      
      audio.addEventListener('ended', onEnded);
      audio.addEventListener('error', onError);
      audio.addEventListener('canplaythrough', onCanPlayThrough);
      
      return () => {
        audio.pause();
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', onError);
        audio.removeEventListener('canplaythrough', onCanPlayThrough);
      };
    }
  }, [audioRef.current, isLoading]);

  // Toggle Play/Pause audio
  const toggleAudio = (audioUrl: string) => {
    try {
      console.log('Toggle audio:', audioUrl);
      
      if (currentAudio === audioUrl && isPlaying && audioRef.current) {
        // Pause current audio
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }
      
      if (currentAudio !== audioUrl) {
        // Stop any currently playing audio
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        
        // Create new audio instance or reuse existing
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        
        // Set new source and prepare for playback
        const audio = audioRef.current;
        audio.src = audioUrl;
        audio.currentTime = 0;
        setCurrentAudio(audioUrl);
        setIsLoading(true);
        
        // Try to play immediately (may be prevented by browser policies)
        audio.load();
      } else {
        // Same audio, but we're resuming playback
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            console.error('Error resuming audio playback:', err);
            toast.error('Failed to resume audio playback');
          });
      }
      
      // Update UI state - actual playback will happen in canplaythrough event
      setIsPlaying(true);
      
      console.log('Audio element created and loading started');
    } catch (err) {
      console.error('Error setting up audio playback:', err);
      toast.error('Failed to initialize audio playback');
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  // Stop any playing audio
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;  // Reset to beginning
      setIsPlaying(false);
    }
  };

  return {
    currentAudio,
    isPlaying,
    isLoading,
    toggleAudio,
    stopAudio
  };
}
