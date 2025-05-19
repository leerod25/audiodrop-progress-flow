
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp, Clock, MapPin, PlayCircle, Lock, Globe, Briefcase, User } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import UserAudioFiles, { AudioFile } from './UserAudioFiles';
import { Link } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
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

interface UserCardProps {
  user: User;
  isExpanded: boolean;
  playingAudio: string | null;
  toggleExpand: () => void;
  onAudioPlay: (audioId: string) => void;
  showLoginPrompt?: boolean;
  toggleAvailability?: (userId: string, currentStatus: boolean) => Promise<void>;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  isExpanded,
  playingAudio,
  toggleExpand,
  onAudioPlay,
  showLoginPrompt = false,
  toggleAvailability
}) => {
  // Format the user ID to show only first 8 characters
  const formatUserId = (id: string) => `${id.substring(0, 8)}...`;
  
  const handleAvailabilityToggle = async () => {
    if (toggleAvailability) {
      await toggleAvailability(user.id, !!user.is_available);
    }
  };
  
  return (
    <>
      <CardContent className="p-4">
        {/* User ID and Join Date */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-medium">{formatUserId(user.id)}</h3>
              {toggleAvailability && (
                <Badge 
                  variant={user.is_available ? "success" : "destructive"}
                  className={`ml-2 ${user.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {user.is_available ? 'Available' : 'On Project'}
                </Badge>
              )}
            </div>
            <div className="text-sm text-gray-500 mt-1 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Joined {formatDate(user.created_at)}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleExpand} className="p-1">
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>

        {/* Profile Information Section - Always Visible */}
        <div className="mt-4 space-y-3">
          {/* Location information */}
          {(user.country || user.city) && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
              <span className="text-sm">{[user.city, user.country].filter(Boolean).join(", ")}</span>
            </div>
          )}
          
          {/* Experience information */}
          {user.years_experience && (
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
              <span className="text-sm">{user.years_experience} years experience</span>
            </div>
          )}

          {/* Languages Section */}
          {user.languages && user.languages.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                <div className="text-sm font-medium">Languages:</div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 ml-6">
                {user.languages.map((lang, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">{lang}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Availability toggle for authenticated users */}
          {toggleAvailability && (
            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <span className="text-sm font-medium">Availability Status:</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{user.is_available ? 'Available' : 'On Project'}</span>
                <Switch
                  checked={!!user.is_available}
                  onCheckedChange={handleAvailabilityToggle}
                />
              </div>
            </div>
          )}
        </div>

        {/* Show expanded content */}
        {isExpanded && (
          <div className="mt-4">
            <Separator className="my-4" />
            
            {/* Full view with additional details */}
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <p className="font-medium">User ID</p>
                <p className="text-sm text-gray-600 break-all">{user.id}</p>
                <p className="font-medium">Languages Spoken</p>
                <p className="text-sm text-gray-600">
                  {user.languages && user.languages.length > 0 
                    ? user.languages.join(', ') 
                    : 'Not specified'}
                </p>
              </div>
            </div>
            
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
