
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { sampleAgents } from '@/data/sampleAgents';
import AudioPlayer from '@/components/AudioPlayer';

export default function PublicWelcomeAudio() {
  // We know sampleAgents[0] has your public audio
  const agent = sampleAgents[0];
  const welcome = agent.audioUrls?.find(a => a.id === 'sample-audio-1');

  if (!welcome) return null;

  return (
    <Card className="max-w-md mx-auto mt-12">
      <CardHeader>
        <CardTitle>Welcome Message</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Hear directly from our team—no sign-in required.
        </p>
        
        {/* Using our enhanced AudioPlayer component */}
        <AudioPlayer 
          audioUrl={welcome.url} 
          suppressErrors={true} 
        />
        
        {/* Fallback native audio element */}
        <audio controls className="w-full mt-4 hidden">
          <source src={welcome.url} type="audio/mpeg" />
          Your browser doesn't support audio playback.
        </audio>
      </CardContent>
    </Card>
  );
}
