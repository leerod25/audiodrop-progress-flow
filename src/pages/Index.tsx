
import React, { useState, useEffect } from "react";
import AudioUploader, { AudioFile } from "@/components/AudioUploader";
import AudioRecorder from "@/components/AudioRecorder";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileAudio, Mic, LogIn, User } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

const Index = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleFilesChange = (files: AudioFile[]) => {
    setAudioFiles(files);
    console.log("Files changed:", files);
  };

  const handleRecordingComplete = (blob: Blob, url: string) => {
    console.log("Recording completed:", { blob, url });
    // You can process the recorded audio here or add it to your file list
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 max-w-4xl">
      <header className="mb-8 flex justify-between items-center">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Audio Management
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Upload existing audio files or record new audio directly in your browser.
          </p>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm hidden md:inline">{user.email}</span>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <User className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button asChild>
              <Link to="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                Login / Sign Up
              </Link>
            </Button>
          )}
        </div>
      </header>

      <Tabs defaultValue="record" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="record" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Record Audio
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <FileAudio className="h-4 w-4" />
            Upload Files
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="record">
          <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        </TabsContent>
        
        <TabsContent value="upload" className="bg-white rounded-xl shadow-md p-6">
          <AudioUploader 
            onFilesChange={handleFilesChange}
            maxFiles={5}
            maxSizeMB={20}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          This is a UI-only demonstration. Audio is stored temporarily in the browser.
        </p>
      </div>
    </div>
  );
};

export default Index;
