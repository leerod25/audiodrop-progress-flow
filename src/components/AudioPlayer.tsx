
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AudioPlayerProps {
  audioUrl: string;
  requiresPermission?: boolean;
  suppressErrors?: boolean;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  requiresPermission = false,
  suppressErrors = false,
  className
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create audio element on mount
    const audio = new Audio();
    audioRef.current = audio;

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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * audio.duration;
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (error && !suppressErrors) {
    return (
      <div className={cn("text-red-500 text-sm p-2", className)}>
        {error}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-8 h-8 p-0 rounded-full" 
          onClick={togglePlay}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        
        <div className="flex-grow">
          <div 
            className="w-full h-2 bg-slate-200 rounded-full cursor-pointer relative"
            onClick={handleProgressClick}
            ref={progressRef}
          >
            <div 
              className="absolute top-0 left-0 h-2 bg-primary rounded-full transition-all" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0"
          onClick={toggleMute}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        
        <span className="text-xs text-slate-500 w-12 text-right">
          {audioRef.current 
            ? formatTime(audioRef.current.currentTime) 
            : '0:00'} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;
