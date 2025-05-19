
import React, { useState } from "react";
import sampleProfiles from "@/data/sampleProfiles";
import AgentListCard from "@/components/agent/AgentListCard";
import { Agent } from "@/types/Agent";
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import AudioPlayer from '@/components/AudioPlayer';
import { toast } from "sonner";

export default function PublicSamplesPage() {
  const [playing, setPlaying] = useState<{ id: string; url: string; title: string } | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  const handlePlay = (agent: Agent) => {
    // Check if agent has audio samples
    if (!agent.audioUrls || agent.audioUrls.length === 0) {
      toast.error("No audio samples available for this agent");
      return;
    }
    
    // Always grab first clip
    const clip = agent.audioUrls[0];
    
    if (clip && clip.url) {
      // If already playing this clip, stop it
      if (playing?.id === agent.id) {
        setPlaying(null);
      } else {
        // Play the new clip
        setAudioError(null); // Reset any previous errors
        setPlaying({ 
          id: agent.id, 
          url: clip.url,
          title: clip.title || "Audio sample" 
        });
        console.log(`Playing audio ${clip.title} from ${clip.url}`);
      }
    } else {
      // No clip available
      toast.error("Audio sample URL is invalid");
    }
  };

  const handleAudioError = (error: string) => {
    setAudioError(error);
    toast.error(error || "Failed to play audio");
    console.error("Audio playback error:", error);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Try Our Voice Agents</h1>
        <p className="text-lg mb-8">
          Listen to sample recordings from our professional voice agents. 
          No sign-up required to preview these samples.
        </p>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sampleProfiles.map(agent => {
            // Convert sample profile to Agent type
            const agentData: Agent = {
              ...agent,
              has_audio: (agent.audioUrls?.length || 0) > 0,
              email: `sample-${agent.id}@example.com`, // Add required email field
              created_at: agent.created_at || new Date().toISOString()
            };
            
            return (
              <div key={agent.id}>
                <AgentListCard
                  agent={agentData}
                  onViewDetails={() => {}}
                  onAddToTeam={() => {}}
                  onPlaySample={() => handlePlay(agentData)}
                />

                {playing?.id === agent.id && (
                  <div className="mt-2 p-4 bg-gray-100 rounded">
                    <h4 className="text-sm font-medium mb-2">{playing.title}</h4>
                    
                    {audioError ? (
                      <div className="p-3 bg-red-50 text-red-600 rounded text-sm">
                        {audioError}
                        <button 
                          className="ml-2 text-red-700 underline" 
                          onClick={() => setAudioError(null)}
                        >
                          Try Again
                        </button>
                      </div>
                    ) : (
                      <AudioPlayer 
                        audioUrl={playing.url} 
                        autoPlay={true}
                        onError={handleAudioError}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
