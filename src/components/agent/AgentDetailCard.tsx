
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Download, Trash } from 'lucide-react';
import { useAgentAudio } from '@/hooks/useAgentAudio';
import { Agent } from '@/types/Agent';
import { Skeleton } from "@/components/ui/skeleton";
import DownloadButton from '@/components/DownloadButton';
import { useUserContext } from '@/contexts/UserContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDate } from '@/utils/dateUtils';

interface AgentDetailCardProps {
  agent: Agent;
  isBusinessAccount?: boolean;
  formatUserId?: (id: string) => string;
  toggleFavorite: (agentId: string, currentStatus: boolean) => void;
  isOwnProfile?: boolean;
  onDeleteRecording?: (audioId: string) => Promise<void>;
  deleteLoading?: string | null;
}

const AgentDetailCard: React.FC<AgentDetailCardProps> = ({
  agent,
  isBusinessAccount = false,
  formatUserId = (id) => id.substring(0, 8) + '...',
  toggleFavorite,
  isOwnProfile = false,
  onDeleteRecording,
  deleteLoading = null
}) => {
  const { userRole } = useUserContext();
  const isAdmin = userRole === 'admin';
  
  // Determine if we should fetch from storage
  const shouldUseHook = !agent.audioUrls || agent.audioUrls.length === 0;
  // Always call hook; we'll decide which list to display
  const { audioList, loading, error } = useAgentAudio(agent.id);

  // Use provided audioUrls if non-empty, else fallback to hook results
  const displayAudioList =
    agent.audioUrls && agent.audioUrls.length > 0
      ? agent.audioUrls.map((url, idx) => ({
          id: String(url.id || idx),
          title: url.title || `Recording ${idx + 1}`,
          url: url.url,
          updated_at: url.updated_at || ''
        }))
      : audioList;
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Agent: {formatUserId(agent.id)}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          {agent.country}{agent.city ? ` · ${agent.city}` : ''}
          {agent.computer_skill_level && ` · Skill: ${agent.computer_skill_level}`}
        </p>
        
        {isBusinessAccount && (
          <Button 
            variant={agent.is_favorite ? "default" : "outline"} 
            size="sm"
            onClick={() => toggleFavorite(agent.id, !!agent.is_favorite)}
            className="mb-4"
          >
            <Star className={`mr-1 h-4 w-4 ${agent.is_favorite ? 'fill-white' : ''}`} />
            {agent.is_favorite ? 'Remove from Team' : 'Add to Team'}
          </Button>
        )}
        
        {/* Admin-only private details section */}
        {isAdmin && (
          <div className="my-4 p-4 bg-gray-50 rounded border">
            <h3 className="font-medium text-lg mb-2">Private Details</h3>
            {agent.full_name && <p><strong>Full Name:</strong> {agent.full_name}</p>}
            {agent.email && <p><strong>Email:</strong> {agent.email}</p>}
            {agent.phone && <p><strong>Phone:</strong> {agent.phone}</p>}
            {agent.bio && <p><strong>Bio:</strong> {agent.bio}</p>}
          </div>
        )}
        
        {/* Audio recordings display */}
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Audio Recordings</h3>
          
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded"
              >
                Retry
              </button>
            </div>
          ) : displayAudioList.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No recordings available.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayAudioList.map((audio) => (
                <div key={audio.id} className="p-3 border rounded-lg">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{audio.title}</span><br />
                        {audio.updated_at && (
                          <small className="text-gray-500">
                            {formatDate(audio.updated_at)}
                          </small>
                        )}
                      </div>
                      
                      <div className="flex gap-1">
                        {/* Download button for admin users */}
                        {isAdmin && (
                          <DownloadButton 
                            url={audio.url} 
                            filename={`${agent.id}_${audio.title.replace(/\s+/g, '_')}.webm`} 
                          />
                        )}
                        
                        {/* Delete button for user's own recordings */}
                        {isOwnProfile && onDeleteRecording && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Recording</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this recording? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                  onClick={() => onDeleteRecording(audio.id)}
                                  disabled={deleteLoading === audio.id}
                                >
                                  {deleteLoading === audio.id ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <audio 
                        controls 
                        preload="none" 
                        className="w-full"
                        src={audio.url}
                      >
                        Your browser does not support audio playback.
                      </audio>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentDetailCard;
