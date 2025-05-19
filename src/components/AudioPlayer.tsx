
import React from 'react';
import { cn } from '@/lib/utils';
import { useAudioPlayerState } from '@/hooks/useAudioPlayerState';
import AudioControls from '@/components/audio/AudioControls';
import AudioProgressBar from '@/components/audio/AudioProgressBar';
import { formatTime } from '@/utils/timeUtils';

interface AudioPlayerProps {
  audioUrl: string;
  requiresPermission?: boolean;
  suppressErrors?: boolean;
  autoPlay?: boolean;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  requiresPermission = false,
  suppressErrors = false,
  autoPlay = false,
  className
}) => {
  const {
    isPlaying,
    isMuted,
    progress,
    duration,
    currentTime,
    error,
    isLoading,
    isReady,
    togglePlay,
    toggleMute,
    seek
  } = useAudioPlayerState(audioUrl, { suppressErrors, autoPlay });

  if (error && !suppressErrors) {
    return (
      <div className={cn("text-red-500 text-sm p-2 rounded bg-red-50", className)}>
        {error}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <div className="flex items-center space-x-2">
        <AudioControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          isLoading={isLoading}
          onPlayPause={togglePlay}
          onMuteToggle={toggleMute}
          disabled={!isReady}
        />
        
        <div className="flex-grow">
          <AudioProgressBar 
            progress={progress} 
            onSeek={seek} 
            disabled={!isReady}
          />
        </div>
        
        <span className="text-xs text-slate-500 w-16 text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;
