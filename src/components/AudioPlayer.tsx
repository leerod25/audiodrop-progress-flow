
import React from 'react';
import { cn } from '@/lib/utils';
import PlayerControls from './audio/PlayerControls';
import { useAudioPlayerControls } from '@/hooks/useAudioPlayerControls';

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
  const {
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
  } = useAudioPlayerControls(audioUrl, suppressErrors);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    seekToPosition(pos);
  };

  const handleVolumeChange = (values: number[]) => {
    adjustVolume(values[0]);
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
      <PlayerControls 
        isPlaying={isPlaying}
        isLoading={isLoading}
        isMuted={isMuted}
        progress={progress}
        duration={duration}
        currentTime={audioRef.current?.currentTime || 0}
        volume={volume}
        onPlayPause={togglePlay}
        onMuteToggle={toggleMute}
        onProgressClick={handleProgressClick}
        onVolumeChange={handleVolumeChange}
      />
    </div>
  );
};

export default AudioPlayer;
