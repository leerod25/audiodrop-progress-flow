
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";
import AudioRecordingItem from '@/components/AudioRecordingItem';
import { toast } from 'sonner';
import { Audio } from '@/hooks/useUserAudios';

interface ProfileAudioListProps {
  audios: Audio[];
  loading: boolean;
  deleteAudio: (id: string) => Promise<boolean>;
  renameAudio: (id: string, newTitle: string) => Promise<boolean>;
}

const ProfileAudioList = ({ audios, loading, deleteAudio, renameAudio }: ProfileAudioListProps) => {
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Handle audio playback and errors
  const handlePlayAudio = (audioId: string, audioUrl: string) => {
    try {
      // Create an audio element to test if the URL is playable
      const audio = new Audio(audioUrl);
      
      // Set event handlers
      audio.onplay = () => {
        setPlayingAudioId(audioId);
      };
      
      audio.onended = audio.onpause = () => {
        setPlayingAudioId(null);
      };
      
      audio.onerror = (e) => {
        console.error('Error playing audio:', e);
        toast.error('Failed to play this audio recording. The file may be unavailable or in an unsupported format.');
        setPlayingAudioId(null);
      };
      
      // Log the URL we're trying to play
      console.log('Attempting to play audio URL:', audioUrl);
      
      // Try to play the audio
      audio.play().catch(err => {
        console.error('Audio playback rejected:', err);
        toast.error('Browser blocked autoplay. Please try again with a user interaction.');
      });
      
    } catch (error) {
      console.error('Error setting up audio playback:', error);
      toast.error('Error playing audio recording');
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Your Recordings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading && (
          <div className="space-y-4">
            {[0, 1, 2].map(i => (
              <div key={i} className="p-4 border rounded-md space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-1/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        )}

        {!loading && audios.length === 0 && (
          <div className="text-center p-6">
            <p className="mb-4 text-gray-600">You haven't saved any audio yet.</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild className="transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300">
                <Link to="/upload">Record Your First Audio</Link>
              </Button>
            </motion.div>
          </div>
        )}

        {!loading && audios.length > 0 && (
          <AnimatePresence>
            <div className="space-y-4">
              {audios.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <AudioRecordingItem
                    id={item.id}
                    title={item.title}
                    audioUrl={item.audio_url}
                    createdAt={item.created_at}
                    onDelete={deleteAudio}
                    onRename={renameAudio}
                    onPlay={() => handlePlayAudio(item.id, item.audio_url)}
                    isPlaying={playingAudioId === item.id}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileAudioList;
