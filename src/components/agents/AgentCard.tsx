
import React, { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, PlayCircle, Play, Pause, FileAudio } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface AudioFile {
  id: string;
  title: string;
  audio_url: string;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  audio_files: AudioFile[];
  country?: string | null;
  city?: string | null;
  gender?: string | null;
  years_experience?: string | null;
  languages?: string[] | null;
  is_available?: boolean;
}

interface AgentCardProps {
  user: User;
  canSeeAudio: boolean;
  avatarImage: string | null;
  getAvatarFallback: (email: string, gender: string | null | undefined) => string;
  onViewProfile: () => void;
  toggleAvailability?: (userId: string, currentStatus: boolean) => Promise<void>;
  isAdminView?: boolean;
  playingAudio?: string | null;
  onPlayAudio?: (audioId: string) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ 
  user, 
  canSeeAudio,
  avatarImage,
  getAvatarFallback,
  onViewProfile,
  toggleAvailability,
  isAdminView = false,
  playingAudio,
  onPlayAudio
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioFiles = canSeeAudio ? user.audio_files : [];
  const hasAudio = audioFiles && audioFiles.length > 0;
  
  const handleAvailabilityToggle = async () => {
    if (toggleAvailability) {
      await toggleAvailability(user.id, !!user.is_available);
    }
  };

  const handlePlayAudio = (audioId: string) => {
    if (onPlayAudio) {
      onPlayAudio(audioId);
    }
    
    // Also control the actual audio element directly
    if (audioRef.current) {
      if (playingAudio === audioId) {
        // If this audio is currently playing, pause it
        audioRef.current.pause();
      } else {
        // If another audio is playing or none is playing, play this one
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
        });
      }
    }
  };

  // Check if this specific audio is playing
  const isThisAudioPlaying = playingAudio === (hasAudio ? audioFiles[0].id : null);
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border">
                {avatarImage ? (
                  <AvatarImage src={avatarImage} alt={user.gender || 'Agent'} />
                ) : (
                  <AvatarImage src="/lovable-uploads/26bccfed-a9f0-4888-8b2d-7c34fdfe37ed.png" alt="Agent" />
                )}
                <AvatarFallback>{getAvatarFallback(user.email, user.gender)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">ID: {user.id.substring(0, 8)}...</h3>
                  {/* Show audio icon if user has audio */}
                  {hasAudio && (
                    <FileAudio className="h-4 w-4 text-green-500" />
                  )}
                </div>
                {/* Location info if available */}
                {(user.country || user.city) && (
                  <p className="text-sm text-gray-500 mt-1">
                    <MapPin className="h-3 w-3 inline-block mr-1" />
                    {[user.city, user.country].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>
            
            {/* Show availability status for all users */}
            <div className="flex items-center">
              <Badge 
                variant={user.is_available ? "default" : "destructive"}
                className="ml-2"
              >
                {user.is_available ? 'Available' : 'On Project'}
              </Badge>
            </div>
          </div>
          
          {/* Show availability toggle for admin view */}
          {isAdminView && toggleAvailability && (
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                Toggle availability:
              </span>
              <Switch
                checked={!!user.is_available}
                onCheckedChange={handleAvailabilityToggle}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          )}
          
          {/* Audio preview section */}
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Audio Samples:</h4>
            
            {hasAudio ? (
              <div className="space-y-2">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500">{audioFiles[0].title}</p>
                    
                    {/* Green Play Sample Button */}
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAudio(audioFiles[0].id);
                      }}
                    >
                      {isThisAudioPlaying ? (
                        <>
                          <Pause className="mr-1 h-3 w-3" />
                          Playing
                        </>
                      ) : (
                        <>
                          <Play className="mr-1 h-3 w-3" />
                          Play Sample
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <audio 
                    ref={audioRef}
                    controls
                    preload="none"
                    className="w-full"
                    src={audioFiles[0].audio_url}
                    onPlay={() => {
                      // Sync the playing state when user uses the native controls
                      if (onPlayAudio) {
                        onPlayAudio(audioFiles[0].id);
                      }
                    }}
                    onPause={() => {
                      // Sync the paused state when user uses the native controls
                      if (onPlayAudio) {
                        onPlayAudio(''); // Clear playing audio
                      }
                    }}
                  >
                    Your browser doesn't support audio.
                  </audio>
                  
                  {audioFiles.length > 1 && (
                    <p className="text-xs text-gray-500 mt-2">
                      +{audioFiles.length - 1} more recordings
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {!canSeeAudio 
                  ? "Audio samples restricted" 
                  : "No audio samples available"}
              </p>
            )}
          </div>
          
          {/* View profile button */}
          <div className="mt-4 flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={onViewProfile}
            >
              View Full Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCard;
