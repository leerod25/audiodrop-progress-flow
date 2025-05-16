
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

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
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl]);

  const updateProgress = () => {
    const audio = audioRef.current;
    if (audio) {
      const value = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(value) ? 0 : value);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleError = (e: Event) => {
    if (!suppressErrors) {
      setError('Error loading audio');
      console.error('Audio player error:', e);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error('Error playing audio:', err);
          setError('Could not play audio');
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
        >
          {isPlaying ? (
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
              className="absolute top-0 left-0 h-2 bg-primary rounded-full" 
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
