
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, Lock } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import { Link } from 'react-router-dom';

export interface AudioFile {
  id: string;
  title: string;
  audio_url: string;
  created_at: string;
}

export interface UserAudioFilesProps {
  audioFiles: AudioFile[];
  playingAudio: string | null;
  onPlay: (audioId: string) => void;
  showLoginPrompt?: boolean;
}

const UserAudioFiles: React.FC<UserAudioFilesProps> = ({
  audioFiles,
  playingAudio,
  onPlay,
  showLoginPrompt = false
}) => {
  if (!audioFiles || audioFiles.length === 0) {
    return <p className="text-sm text-gray-500">No audio samples available</p>;
  }

  return (
    <div className="space-y-2">
      {audioFiles.map((file) => (
        <div
          key={file.id}
          className="p-2 border rounded-md flex items-center justify-between bg-gray-50"
        >
          <div className="flex-1">
            <p className="text-sm font-medium truncate">{file.title}</p>
            <p className="text-xs text-gray-500">Uploaded {formatDate(file.created_at)}</p>
          </div>
          
          {showLoginPrompt ? (
            <Button asChild variant="outline" size="sm" className="flex items-center gap-1">
              <Link to="/auth">
                <Lock className="h-3 w-3" />
                Login to Listen
              </Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 ${
                playingAudio === file.id ? "text-blue-600" : ""
              }`}
              onClick={() => onPlay(file.id)}
            >
              <PlayCircle className="h-4 w-4" />
              {playingAudio === file.id ? "Playing" : "Play"}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserAudioFiles;
