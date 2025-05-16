
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User, FileAudio, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Agent {
  id: string;
  has_audio: boolean;
  country?: string | null;
  city?: string | null;
  computer_skill_level?: string | null;
}

const AgentPreview: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        
        // First get all profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, country, city, computer_skill_level');
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          toast.error('Failed to load agent profiles');
          return;
        }

        // Then check which ones have audio
        const { data: audioData, error: audioError } = await supabase
          .from('audio_metadata')
          .select('user_id')
          .order('created_at', { ascending: false });
        
        if (audioError) {
          console.error('Error fetching audio data:', audioError);
        }
        
        // Create a set of user IDs who have audio
        const usersWithAudio = new Set(audioData?.map(a => a.user_id) || []);
        
        // Map profiles to agents with audio info
        const agentsWithAudioInfo = profiles?.map(profile => ({
          id: profile.id,
          has_audio: usersWithAudio.has(profile.id),
          country: profile.country,
          city: profile.city,
          computer_skill_level: profile.computer_skill_level
        })) || [];
        
        setAgents(agentsWithAudioInfo);
      } catch (err) {
        console.error('Unexpected error in AgentPreview:', err);
        toast.error('An error occurred while loading agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Format the user ID to show only first 8 characters
  const formatUserId = (id: string) => `${id.substring(0, 8)}...`;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Agent Preview</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} className="shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4 mt-4">
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No agents found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <Card key={agent.id} className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4 mt-2">
                  <div className="flex items-center">
                    <User className="mr-2 text-gray-500" size={18} />
                    <span className="font-semibold text-gray-700">{formatUserId(agent.id)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FileAudio className="mr-1 text-blue-500" size={18} />
                    {agent.has_audio ? (
                      <CheckCircle className="text-green-500" size={18} />
                    ) : (
                      <XCircle className="text-red-500" size={18} />
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  <p>{agent.country} {agent.city ? `· ${agent.city}` : ''}</p>
                  {agent.computer_skill_level && (
                    <p className="mt-1">Skill level: {agent.computer_skill_level}</p>
                  )}
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/agent/${agent.id}`)}
                    disabled={true} // Disabled until we implement individual agent view
                    className="text-sm"
                  >
                    View Details
                  </Button>
                  
                  <Button 
                    variant={agent.has_audio ? "default" : "ghost"}
                    size="sm"
                    disabled={!agent.has_audio}
                    className="text-sm"
                  >
                    Listen Audio
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentPreview;
