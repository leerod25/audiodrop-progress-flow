
import React, { useState, useEffect } from 'react';
import AudioRecorder from '@/components/AudioRecorder';
import { useAudioSave } from '@/hooks/useAudioSave';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function UploadAudio() {
  const [blob, setBlob] = useState<Blob|null>(null);
  const [previewUrl, setPreviewUrl] = useState<string|null>(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  const { saveAudio } = useAudioSave();

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        toast.error('You must be logged in to upload audio');
        navigate('/auth');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const onRecordingComplete = (recordedBlob: Blob, url: string) => {
    setBlob(recordedBlob);
    setPreviewUrl(url);
  };

  const handleSave = async () => {
    console.log("🔍 handleSave fired");
    console.log("   user:", user);
    console.log("   blob:", blob);
    console.log("   title:", title);
    
    if (!blob || !title.trim()) {
      console.warn("Missing blob or title");
      toast.error('Please provide a title for your audio');
      return;
    }
    
    try {
      await saveAudio(blob, title, user, setUploading);
      console.log("✅ saveAudio resolved");
      // Reset state after successful save
      setBlob(null);
      setPreviewUrl(null);
      setTitle('');
      
      // Navigate to profile page after successful save
      navigate('/profile');
    } catch (err) {
      console.error("❌ saveAudio threw:", err);
      // Errors are already toasted in hook
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 max-w-3xl">
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Record & Save Audio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <AudioRecorder onRecordingComplete={onRecordingComplete} />

          {previewUrl && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="audio-title">Audio Title</Label>
                <Input
                  id="audio-title"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Enter a title for your recording"
                  className="w-full"
                />
              </div>
              
              <audio controls src={previewUrl} className="w-full" />
              
              <Button 
                onClick={handleSave} 
                disabled={uploading || !title.trim()} 
                className="w-full"
              >
                {uploading ? 'Saving...' : 'Save Recording'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
