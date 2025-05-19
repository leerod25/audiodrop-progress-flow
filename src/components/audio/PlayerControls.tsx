
import React, { useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatTime } from './AudioUtils';

interface PlayerControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  isMuted: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onProgressClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  isLoading,
  isMuted,
  progress,
  duration,
  currentTime,
  onPlayPause,
  onMuteToggle,
  onProgressClick
}) => {
  const progressRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="w-8 h-8 p-0 rounded-full" 
        onClick={onPlayPause}
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
          onClick={onProgressClick}
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
        onClick={onMuteToggle}
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
      
      <span className="text-xs text-slate-500 w-12 text-right">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
};

export default PlayerControls;
