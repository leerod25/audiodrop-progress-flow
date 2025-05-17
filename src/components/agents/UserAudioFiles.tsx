import React, { useState, useEffect } from 'react';
import { 
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Volume2, ExternalLink, AlertCircle, Download } from "lucide-react";
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
  
  // Reset failed audio when component receives new audio files
  useEffect(() => {
    if (audioFiles && audioFiles.length > 0) {
      setFailedAudio({});
    }
  }, [audioFiles]);
  
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
    console.error(`Audio load error for file: ${title}, ID: ${fileId}`);
    setFailedAudio(prev => ({ ...prev, [fileId]: true }));
    toast.error(`Could not load audio: ${title}`);
  };

  // Extract filename from URL for download
  const getFileName = (title: string, url: string) => {
    try {
      // Try to get the filename from the URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      // If we have a valid filename with extension, use it
      if (fileName && fileName.includes('.')) {
        return fileName;
      }
      
      // Otherwise, use the title with a default extension
      return `${title || 'audio'}.mp3`;
    } catch (e) {
      return `${title || 'audio'}.mp3`;
    }
  };

  // Check if URL is valid
  const isValidUrl = (url: string): boolean => {
    try {
      if (!url) return false;
      // Check if it's a valid URL format
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return true;
      }
      // For relative paths, we'll consider them valid if they don't start with special characters
      if (url.startsWith('path/') || url.startsWith('/') || /^[a-zA-Z0-9]/.test(url)) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
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
              <TableCell>
                <div className="flex items-center space-x-2">
                  {failedAudio[file.id] || !isValidUrl(file.audio_url) ? (
                    <div className="flex items-center text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>Audio unavailable</span>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex items-center space-x-1"
                      onClick={() => handleAudioPlay(`audio-${file.id}`)}
                    >
                      <Volume2 className="h-4 w-4" />
                      <span>{playingAudio === `audio-${file.id}` ? 'Pause' : 'Play'}</span>
                    </Button>
                  )}
                  
                  {isValidUrl(file.audio_url) && (
                    <>
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
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center space-x-1"
                        asChild
                      >
                        <a 
                          href={file.audio_url} 
                          download={getFileName(file.title, file.audio_url)}
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </a>
                      </Button>
                    </>
                  )}
                </div>
                
                {isValidUrl(file.audio_url) && (
                  <audio 
                    id={`audio-${file.id}`}
                    src={file.audio_url}
                    className="hidden"
                    onError={() => handleAudioError(file.id, file.title)}
                    preload="none"
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserAudioFiles;
