
import React from 'react';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface AudioControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  isLoading: boolean;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  disabled?: boolean;
  className?: string;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  isMuted,
  isLoading,
  onPlayPause,
  onMuteToggle,
  disabled = false,
  className
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button 
        variant="outline" 
        size="sm" 
        className="w-8 h-8 p-0 rounded-full" 
        onClick={onPlayPause}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="w-8 h-8 p-0"
        onClick={onMuteToggle}
        disabled={disabled}
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default AudioControls;
