
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ChevronDown, ChevronUp, MapPin, Calendar, CalendarClock } from "lucide-react";
import UserAudioFiles from "./UserAudioFiles";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface User {
  id: string;
  email: string | null;
  created_at: string;
  audio_files?: { id: string; title: string; audio_url: string }[];
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
  const audioCount = user.audio_files?.length || 0;
  const hasAudioFiles = audioCount > 0;
  const location = [user.city, user.country].filter(Boolean).join(", ");
  
  return (
    <>
      <CardHeader className="bg-gray-50 p-4 flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{user.email || "Anonymous User"}</h3>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Joined {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={toggleExpand} className="ml-4">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            {location && (
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{location}</span>
              </div>
            )}
            
            {user.years_experience && (
              <div className="flex items-center text-gray-600">
                <CalendarClock className="h-4 w-4 mr-2" />
                <span>{user.years_experience} years experience</span>
              </div>
            )}

            {user.languages && user.languages.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Languages Spoken:</span>
                <div className="flex flex-wrap gap-1">
                  {user.languages.map((language, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div>
            {hasAudioFiles && (
              <div className="flex flex-col items-start md:items-end">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  {audioCount} {audioCount === 1 ? 'Audio File' : 'Audio Files'}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {isExpanded && (
        <>
          {hasAudioFiles ? (
            showLoginPrompt ? (
              <CardFooter className="p-4 pt-0 border-t">
                <div className="w-full p-4 bg-gray-50 rounded-md text-center">
                  <p className="text-gray-600 mb-2">Please log in or register to listen to audio samples</p>
                  <div className="flex justify-center gap-2">
                    <Button asChild size="sm">
                      <Link to="/auth">Log In</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/auth?tab=signup">Sign Up</Link>
                    </Button>
                  </div>
                </div>
              </CardFooter>
            ) : (
              <UserAudioFiles 
                audioFiles={user.audio_files || []} 
                playingAudio={playingAudio}
                onAudioPlay={onAudioPlay}
              />
            )
          ) : (
            <CardFooter className="p-4 pt-0 border-t">
              <p className="text-gray-500">No audio files available</p>
            </CardFooter>
          )}
        </>
      )}
    </>
  );
};

export default UserCard;
