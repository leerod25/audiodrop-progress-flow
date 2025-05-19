
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { isValidUrl } from '@/utils/audioUtils';

interface AudioPlayerOptions {
  suppressErrors?: boolean;
  autoPlay?: boolean;
}

export const useAudioPlayerState = (audioUrl: string, options: AudioPlayerOptions = {}) => {
  const { suppressErrors = false, autoPlay = false } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Validate URL
  useEffect(() => {
    if (!isValidUrl(audioUrl)) {
      const errorMessage = `Invalid audio URL: ${audioUrl}`;
      setError(errorMessage);
      if (!suppressErrors) {
        console.error(errorMessage);
      }
      return;
    }

    // Clean up previous audio instance
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    console.log(`AudioPlayer: Setting up audio with URL: ${audioUrl}`);
    
    // Create audio element on mount or when URL changes
    const audio = new Audio();
    audioRef.current = audio;
    setIsReady(false);
    setIsLoading(true);

    // Set up event listeners
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      setIsReady(true);
      console.log(`Audio metadata loaded: duration ${audio.duration}s`);
      
      if (autoPlay) {
        play();
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      const value = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(value) ? 0 : value);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
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
          case 4: errorMessage = 'Audio format not supported'; break;
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
      setIsReady(true);
      console.log('Audio can play now');
    };

    // Set audio source
    audio.src = audioUrl;
    audio.preload = "metadata";
    
    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplaythrough', handleCanPlay);

    // Clean up on unmount or when URL changes
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
      setIsReady(false);
    };
  }, [audioUrl, suppressErrors, autoPlay]);

  // Play/pause control
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !isReady) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error('Error playing audio:', err);
          if (!suppressErrors) {
            toast.error('Could not play audio. Try again or use a different browser.');
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  // Direct play method
  const play = () => {
    const audio = audioRef.current;
    if (!audio || !isReady || isPlaying) return;
    
    setIsLoading(true);
    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(err => {
        console.error('Error playing audio:', err);
        if (!suppressErrors) {
          toast.error('Could not play audio. Try again or use a different browser.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Direct pause method
  const pause = () => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;
    
    audio.pause();
    setIsPlaying(false);
  };

  // Toggle mute
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.muted = !audio.muted;
    setIsMuted(!isMuted);
  };

  // Seek to position
  const seek = (position: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const seekTime = (position / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  return {
    isPlaying,
    isMuted,
    progress,
    duration,
    currentTime,
    error,
    isLoading,
    isReady,
    togglePlay,
    play,
    pause,
    toggleMute,
    seek
  };
};
