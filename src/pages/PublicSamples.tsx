
import React, { useState } from "react";
import sampleProfiles from "@/data/sampleProfiles";
import AgentListCard from "@/components/agent/AgentListCard";
import { Agent } from "@/types/Agent";
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

export default function PublicSamplesPage() {
  const [playing, setPlaying] = useState<{ id: string; url: string } | null>(null);

  const handlePlay = (agent: Agent) => {
    // Always grab first clip
    const clip = agent.audioUrls?.[0]?.url;
    if (clip) setPlaying({ id: agent.id, url: clip });
    else if (playing?.id === agent.id) {
      // Toggle off if already playing
      setPlaying(null);
    }
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
          {sampleProfiles.map(agent => (
            <div key={agent.id}>
              <AgentListCard
                agent={{
                  ...agent,
                  has_audio: agent.audioUrls.length > 0,
                }}
                onViewDetails={() => {}}
                onAddToTeam={() => {}}
                onPlaySample={() => handlePlay({
                  ...agent,
                  has_audio: agent.audioUrls.length > 0,
                })}
              />

              {playing?.id === agent.id && (
                <div className="mt-2 p-4 bg-gray-100 rounded">
                  <audio controls autoPlay className="w-full">
                    <source src={playing.url} type="audio/mpeg" />
                    Your browser doesn't support audio playback.
                  </audio>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
