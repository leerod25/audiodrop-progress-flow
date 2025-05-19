
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
import { motion } from 'framer-motion';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto py-10 px-4 md:px-6 max-w-3xl"
    >
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Record & Save Audio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recording Instructions */}
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle className="font-medium mb-2">Recording Instructions</AlertTitle>
            <AlertDescription className="text-sm">
              <ul className="list-disc pl-5 space-y-1">
                <li>Find a quiet environment with minimal background noise</li>
                <li>Speak slowly and clearly</li>
                <li>Keep a consistent distance from the microphone</li>
                <li>Maintain a professional tone</li>
                <li><strong>Do not provide any personal information</strong></li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Script Template */}
          <Alert className="border-purple-200 bg-purple-50">
            <AlertCircle className="h-4 w-4 text-purple-500" />
            <AlertTitle className="font-medium mb-2">Suggested Script Template</AlertTitle>
            <AlertDescription className="text-sm">
              <p className="italic text-gray-600 mb-2">Feel free to customize this template:</p>
              <div className="p-3 bg-white rounded-md border border-purple-100">
                "Hello, thank you for considering me for your project. I have [X] years of experience in [industry/role]. I have worked on both inbound and outbound projects. I'm comfortable with computers and various software applications. I'm detail-oriented and focused on delivering quality results."
              </div>
              <p className="mt-2 text-sm text-red-500 font-medium">
                Any misuse of the recording feature can result in your account being suspended or banned.
              </p>
            </AlertDescription>
          </Alert>

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
                  className="w-full transition-colors duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
              </div>
              
              <audio controls src={previewUrl} className="w-full" />
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Button 
                  onClick={handleSave} 
                  disabled={uploading || !title.trim()} 
                  className="w-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  {uploading ? 'Saving...' : 'Save Recording'}
                </Button>
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
