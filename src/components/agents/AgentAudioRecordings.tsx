
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Agent } from '@/types/Agent';
import { useAgentAudio } from '@/hooks/useAgentAudio';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Star, Trash2 } from 'lucide-react';
import { useUserContext } from '@/contexts/UserContext';
import DownloadButton from '@/components/DownloadButton';
import { formatDate } from '@/utils/dateUtils';

interface AgentAudioRecordingsProps {
  agent: Agent;
  isBusinessAccount?: boolean;
  formatUserId?: (id: string) => string;
  isOwnProfile?: boolean;
  onRecordingDeleted?: () => void;
}

const AgentAudioRecordings: React.FC<AgentAudioRecordingsProps> = ({
  agent,
  isBusinessAccount = false,
  formatUserId = (id) => id.substring(0, 8) + '...',
  isOwnProfile = false,
  onRecordingDeleted
}) => {
  const { userRole } = useUserContext();
  const isAdmin = userRole === 'admin';
  
  // Use the enhanced useAgentAudio hook with delete functionality
  const { audioList, loading, error, remove } = useAgentAudio(agent.id);
  
  // Determine which audio list to display (from agent prop or from hook)
  const displayAudioList = agent.audioUrls && agent.audioUrls.length > 0
    ? agent.audioUrls
    : audioList;
    
  const handleDeleteRecording = async (audioId: string) => {
    try {
      await remove(audioId);
      if (onRecordingDeleted) {
        onRecordingDeleted();
      }
    } catch (err) {
      console.error('Error deleting recording:', err);
      // Error handling is done in the hook
    }
  };
  
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
                        {isOwnProfile && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                className="h-8 w-8" 
                                title="Delete recording"
                              >
                                <Trash2 size={16} />
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
                                  onClick={() => handleDeleteRecording(audio.id)}
                                >
                                  Delete
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

export default AgentAudioRecordings;
