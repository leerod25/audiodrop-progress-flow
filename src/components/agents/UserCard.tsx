
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp, Clock, MapPin, PlayCircle, Lock } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import UserAudioFiles, { AudioFile } from './UserAudioFiles';
import { Link } from 'react-router-dom';

interface User {
  id: string;
  email: string | null;
  created_at: string;
  audio_files?: AudioFile[];
  country?: string | null;
  city?: string | null;
  gender?: string | null;
  years_experience?: string | null;
  languages?: string[] | null;
}

interface UserCardProps {
  user: User;
  isExpanded: boolean;
  playingAudio: string | null;
  toggleExpand: () => void;
  onAudioPlay: (audioId: string) => void;
  showLoginPrompt?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  isExpanded,
  playingAudio,
  toggleExpand,
  onAudioPlay,
  showLoginPrompt = false
}) => {
  
  return (
    <>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{user.email?.split('@')[0] || 'Anonymous Agent'}</h3>
            <div className="text-sm text-gray-500 mt-1 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Joined {formatDate(user.created_at)}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleExpand} className="p-1">
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>

        {/* Show basic info */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {user.country && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm">{`${user.city || 'Unknown'}, ${user.country}`}</span>
            </div>
          )}
          {user.gender && (
            <div className="flex items-center">
              <span className="text-sm">{user.gender}</span>
            </div>
          )}
          {user.years_experience && (
            <div className="flex items-center col-span-2">
              <span className="text-sm">{user.years_experience} years experience</span>
            </div>
          )}
        </div>

        {/* Languages Section */}
        {user.languages && user.languages.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-2">Languages Spoken:</div>
            <div className="flex flex-wrap gap-2">
              {user.languages.map((lang, idx) => (
                <Badge key={idx} variant="secondary">{lang}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Show expanded content */}
        {isExpanded && (
          <div className="mt-4">
            <Separator className="my-4" />
            
            {/* Audio files section */}
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Audio Samples:</h4>
              
              {user.audio_files && user.audio_files.length > 0 ? (
                <UserAudioFiles 
                  audioFiles={user.audio_files}
                  playingAudio={playingAudio}
                  onPlay={onAudioPlay}
                  showLoginPrompt={showLoginPrompt}
                />
              ) : (
                <p className="text-sm text-gray-500">No audio samples available.</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-50 px-4 py-2">
        <div className="w-full flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 p-0"
            onClick={toggleExpand}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </Button>
          
          <div className="flex gap-2">
            {showLoginPrompt ? (
              <Button asChild variant="outline" size="sm" className="flex items-center gap-1">
                <Link to="/auth">
                  <Lock className="h-3 w-3" />
                  View Full Profile
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <PlayCircle className="h-3 w-3" />
                {user.audio_files?.length || 0} Samples
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </>
  );
};

export default UserCard;
