
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { isValidUrl } from '@/utils/audioUtils';

export const useAudioPlayerControls = (audioUrl: string, suppressErrors: boolean = false) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(1); // Default to full volume
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (!isValidUrl(audioUrl)) {
      setError(`Invalid audio URL: ${audioUrl}`);
      return;
    }

    console.log(`AudioPlayer: Setting up audio with URL: ${audioUrl}`);
    
    // Create audio element on mount
    const audio = new Audio();
    audioRef.current = audio;

    // Set initial volume
    audio.volume = volume;

    // Set up event listeners
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      console.log(`Audio metadata loaded: duration ${audio.duration}s`);
    };

    const handleTimeUpdate = () => {
      const value = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(value) ? 0 : value);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      audio.currentTime = 0;
    };

    const handleError = (e: Event) => {
      console.error('Audio player error:', e);
      const audioElement = e.target as HTMLAudioElement;
      let errorMessage = 'Error loading audio';
      
      // Get more specific error information if available
      if (audioElement.error) {
        switch (audioElement.error.code) {
          case 1: errorMessage = 'Audio fetching aborted'; break;
          case 2: errorMessage = 'Network error while loading audio'; break;
          case 3: errorMessage = 'Audio decoding failed'; break;
          case 4: errorMessage = 'Audio not supported by your browser'; break;
        }
      }
      
      if (!suppressErrors) {
        setError(errorMessage);
      }
      setIsLoading(false);
      setIsPlaying(false);
    };

    // Handle can play event
    const handleCanPlay = () => {
      setIsLoading(false);
      console.log('Audio can play now');
      if (isPlaying) {
        audio.play().catch(err => {
          console.error('Auto-play prevented:', err);
          setIsPlaying(false);
          if (!suppressErrors) {
            toast.error('Playback blocked by browser. Try clicking play again.');
          }
        });
      }
    };

    // Set audio source
    audio.src = audioUrl;
    audio.preload = "metadata";
    setIsLoading(true);
    audio.load();

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplaythrough', handleCanPlay);

    // Clean up on unmount
    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplaythrough', handleCanPlay);
      
      // Release memory
      URL.revokeObjectURL(audio.src);
      audio.src = '';
      audioRef.current = null;
    };
  }, [audioUrl, suppressErrors]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error playing audio:', err);
          if (!suppressErrors) {
            toast.error('Could not play audio. Try again or use a different browser.');
          }
          setIsLoading(false);
        });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.muted = !audio.muted;
    setIsMuted(!isMuted);
  };

  const seekToPosition = (position: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = position * audio.duration;
  };

  const adjustVolume = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Ensure volume is between 0 and 1
    const newVolume = Math.max(0, Math.min(1, value));
    audio.volume = newVolume;
    setVolume(newVolume);
    
    // Update mute state based on volume
    if (newVolume === 0) {
      audio.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
    }
  };

  return {
    audioRef,
    isPlaying,
    isMuted,
    progress,
    duration,
    volume,
    error,
    isLoading,
    togglePlay,
    toggleMute,
    seekToPosition,
    adjustVolume
  };
};
