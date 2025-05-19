
import React from 'react';
import { cn } from '@/lib/utils';

interface AudioProgressBarProps {
  progress: number;
  onSeek: (position: number) => void;
  disabled?: boolean;
  className?: string;
}

const AudioProgressBar: React.FC<AudioProgressBarProps> = ({ 
  progress, 
  onSeek,
  disabled = false,
  className
}) => {
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (disabled) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = ((e.clientX - rect.left) / rect.width) * 100;
    onSeek(pos);
  };

  return (
    <div 
      className={cn(
        "w-full h-2 bg-slate-200 rounded-full cursor-pointer relative",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={handleProgressClick}
    >
      <div 
        className="absolute top-0 left-0 h-2 bg-primary rounded-full transition-all" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default AudioProgressBar;
