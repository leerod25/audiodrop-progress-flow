
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from '@/utils/dateUtils';
import UserAudioFiles from './UserAudioFiles';
import { useUserContext } from '@/contexts/UserContext';
import { Heart, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string | null;
  app_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
  created_at: string;
  last_sign_in_at?: string | null;
  audio_files?: AudioFile[];
  country?: string | null;
  city?: string | null;
  gender?: string | null;
  years_experience?: string | null;
  languages?: string[] | null;
}

interface AudioFile {
  id: string;
  title: string;
  audio_url: string;
  created_at: string;
}

interface UserCardProps {
  user: User;
  expandedUser: string | null;
  playingAudio: string | null;
  toggleUserExpand: (userId: string) => void;
  handleAudioPlay: (audioId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  expandedUser,
  playingAudio,
  toggleUserExpand,
  handleAudioPlay
}) => {
  const { user: currentUser, userRole } = useUserContext();
  const isAgent = userRole === "agent";
  const isBusiness = userRole === "business";
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = React.useState(false);
  
  // Generate a profile ID from the first 6 characters of the user ID
  const profileId = user.id.substring(0, 6).toUpperCase();

  // Check if this agent is in favorites when component mounts
  React.useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (currentUser && isBusiness) {
        try {
          const { data, error } = await supabase
            .rpc('get_business_favorites', { business_user_id: currentUser.id });
          
          if (error) {
            console.error('Error checking favorite status:', error);
            return;
          }
          
          // Check if user.id is in the favorites array
          if (data && Array.isArray(data)) {
            setIsFavorite(data.includes(user.id));
          }
        } catch (err) {
          console.error('Error checking favorite status:', err);
        }
      }
    };
    
    checkFavoriteStatus();
  }, [currentUser, user.id, isBusiness]);

  // Handle adding to favorites
  const handleAddToFavorites = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to add agents to your team");
      return;
    }

    if (userRole !== 'business') {
      toast.error("Only business accounts can add agents to their team");
      return;
    }

    try {
      setIsAddingToFavorites(true);
      
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase.rpc('remove_business_favorite', { 
          business_user_id: currentUser.id, 
          agent_user_id: user.id 
        });

        if (error) throw error;
        toast.success('Agent removed from your team');
        setIsFavorite(false);
      } else {
        // Add to favorites
        const { error } = await supabase.rpc('add_business_favorite', { 
          business_user_id: currentUser.id, 
          agent_user_id: user.id 
        });

        if (error) throw error;
        toast.success('Agent added to your team');
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast.error('Failed to update your team');
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  // Handle connect now
  const handleConnectNow = () => {
    toast.success(`Connection request sent for agent ${profileId}`);
    // In a real application, this would send a notification to administrators
    // and potentially store the request in a database
  };
  
  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader 
        className="cursor-pointer bg-gray-50" 
        onClick={() => toggleUserExpand(user.id)}
      >
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Profile ID: {profileId}</CardTitle>
          <div className="text-sm text-blue-600 hover:underline">
            {expandedUser === user.id ? 'Hide Details' : 'Show Details'}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={expandedUser === user.id ? "block" : "hidden"}>
        {isAgent ? (
          // Limited view for agents - only show message that preview is not available
          <div className="p-4 text-center text-gray-500">
            <p>NO PREVIEW AVAILABLE</p>
          </div>
        ) : (
          // Full view for business and admin users
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <p className="font-medium">Languages Spoken</p>
              <p className="text-sm text-gray-600">
                {user.languages && user.languages.length > 0 
                  ? user.languages.join(', ') 
                  : 'Not specified'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-gray-600">
                  {user.country || 'Unknown'}{user.city ? `, ${user.city}` : ''}
                </p>
              </div>
              <div>
                <p className="font-medium">Gender</p>
                <p className="text-sm text-gray-600">{user.gender || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Experience</p>
                <p className="text-sm text-gray-600">{user.years_experience || 'Not specified'} years</p>
              </div>
              <div>
                <p className="font-medium">Last Sign In</p>
                <p className="text-sm text-gray-600">{formatDate(user.last_sign_in_at)}</p>
              </div>
            </div>
            
            {isBusiness && (
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Button
                  variant="outline"
                  className={isFavorite ? "bg-pink-50 text-pink-600 border-pink-200" : ""} 
                  onClick={handleAddToFavorites}
                  disabled={isAddingToFavorites}
                >
                  <Heart className={isFavorite ? "fill-pink-500 text-pink-500" : ""} size={16} />
                  {isFavorite ? 'Remove from Team' : 'Add to My Team'}
                </Button>
                
                <Button
                  onClick={handleConnectNow}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Send size={16} />
                  Connect Now
                </Button>
              </div>
            )}
            
            <UserAudioFiles 
              audioFiles={user.audio_files} 
              playingAudio={playingAudio}
              handleAudioPlay={handleAudioPlay}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCard;
