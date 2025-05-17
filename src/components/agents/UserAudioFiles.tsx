
import React, { useState } from 'react';
import { 
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Volume2, ExternalLink } from "lucide-react";
import { formatDate } from '@/utils/dateUtils';
import { toast } from 'sonner';

interface AudioFile {
  id: string;
  title: string;
  audio_url: string;
  created_at: string;
}

interface UserAudioFilesProps {
  audioFiles?: AudioFile[];
  playingAudio: string | null;
  handleAudioPlay: (audioId: string) => void;
}

const UserAudioFiles: React.FC<UserAudioFilesProps> = ({ 
  audioFiles,
  playingAudio,
  handleAudioPlay
}) => {
  const [failedAudio, setFailedAudio] = useState<Record<string, boolean>>({});
  
  // If no audio files or empty array
  if (!audioFiles || audioFiles.length === 0) {
    return (
      <div>
        <h3 className="font-medium text-lg mb-2">Audio Files (0)</h3>
        <p className="text-sm text-gray-500 italic">No audio files found for this user</p>
      </div>
    );
  }

  const handleAudioError = (fileId: string, title: string) => {
    setFailedAudio(prev => ({ ...prev, [fileId]: true }));
    toast.error(`Could not load audio: ${title}`);
  };

  return (
    <div>
      <h3 className="font-medium text-lg mb-2">Audio Files ({audioFiles.length})</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audioFiles.map(file => (
            <TableRow key={file.id}>
              <TableCell>{file.title}</TableCell>
              <TableCell>{formatDate(file.created_at)}</TableCell>
              <TableCell className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex items-center space-x-1"
                    onClick={() => handleAudioPlay(`audio-${file.id}`)}
                    disabled={failedAudio[file.id]}
                  >
                    <Volume2 className="h-4 w-4" />
                    <span>{playingAudio === `audio-${file.id}` ? 'Pause' : 'Play'}</span>
                  </Button>
                  
                  {file.audio_url && (
                    <Button
                      size="sm"
                      variant="link"
                      className="flex items-center space-x-1"
                      asChild
                    >
                      <a href={file.audio_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        <span>Open</span>
                      </a>
                    </Button>
                  )}
                </div>
                
                <audio 
                  id={`audio-${file.id}`}
                  src={file.audio_url}
                  className="hidden"
                  onError={() => handleAudioError(file.id, file.title)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserAudioFiles;
