
import React, { useRef } from 'react';
import { Play, Pause, Volume2, Volume1, VolumeX, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatTime } from './AudioUtils';

interface PlayerControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  isMuted: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  volume: number;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onProgressClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onVolumeChange: (value: number[]) => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  isLoading,
  isMuted,
  progress,
  duration,
  currentTime,
  volume,
  onPlayPause,
  onMuteToggle,
  onProgressClick,
  onVolumeChange
}) => {
  const progressRef = useRef<HTMLDivElement | null>(null);

  // Choose appropriate volume icon based on level
  const VolumeIcon = isMuted ? VolumeX : volume > 0.5 ? Volume2 : Volume1;

  return (
    <div className="flex flex-col space-y-2">
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
          <VolumeIcon className="h-4 w-4" />
        </Button>
        
        <span className="text-xs text-slate-500 w-16 text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      
      {/* Volume control slider */}
      <div className="flex items-center space-x-2 px-1">
        <VolumeIcon className="h-3 w-3 text-slate-500" />
        <Slider
          defaultValue={[volume]}
          max={1}
          step={0.01}
          value={[isMuted ? 0 : volume]}
          onValueChange={onVolumeChange}
          className="w-full h-1.5"
        />
        <span className="text-xs text-slate-500 w-8">
          {Math.round(isMuted ? 0 : volume * 100)}%
        </span>
      </div>
    </div>
  );
};

export default PlayerControls;
