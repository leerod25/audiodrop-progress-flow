
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";
import AudioRecordingItem from '@/components/AudioRecordingItem';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Audio {
  id: string;
  title: string;
  audio_url: string;
  created_at: string;
}

interface ProfileAudioListProps {
  userId?: string;
  audios?: Audio[];
  loading?: boolean;
  deleteAudio?: (id: string) => Promise<boolean>;
  renameAudio?: (id: string, newTitle: string) => Promise<boolean>;
}

const ProfileAudioList = ({ userId, audios: propAudios, loading: propLoading, deleteAudio: propDeleteAudio, renameAudio: propRenameAudio }: ProfileAudioListProps) => {
  const [audios, setAudios] = useState<Audio[]>(propAudios || []);
  const [loading, setLoading] = useState<boolean>(propLoading !== undefined ? propLoading : true);

  useEffect(() => {
    if (propAudios) {
      setAudios(propAudios);
      return;
    }
    
    if (!userId) return;
    
    const fetchAudios = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('audio_recordings')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setAudios(data || []);
      } catch (err) {
        console.error('Error fetching audio recordings:', err);
        toast.error('Failed to load audio recordings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAudios();
  }, [userId, propAudios]);
  
  const deleteAudio = async (id: string) => {
    if (propDeleteAudio) {
      return propDeleteAudio(id);
    }
    
    try {
      // First, get the audio URL
      const { data: audioData } = await supabase
        .from('audio_recordings')
        .select('audio_url')
        .eq('id', id)
        .single();
        
      if (!audioData?.audio_url) {
        throw new Error('Audio file not found');
      }
      
      // Extract the path from the URL
      const urlParts = audioData.audio_url.split('/');
      const filePath = `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1]}`;
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('audio')
        .remove([filePath]);
        
      if (storageError) {
        console.error('Error deleting audio file:', storageError);
      }
      
      // Delete the record
      const { error } = await supabase
        .from('audio_recordings')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the UI
      setAudios(current => current.filter(audio => audio.id !== id));
      toast.success('Audio deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting audio:', err);
      toast.error('Failed to delete audio');
      return false;
    }
  };
  
  const renameAudio = async (id: string, newTitle: string) => {
    if (propRenameAudio) {
      return propRenameAudio(id, newTitle);
    }
    
    try {
      const { error } = await supabase
        .from('audio_recordings')
        .update({ title: newTitle })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the UI
      setAudios(current => 
        current.map(audio => 
          audio.id === id ? {...audio, title: newTitle} : audio
        )
      );
      
      toast.success('Audio renamed successfully');
      return true;
    } catch (err) {
      console.error('Error renaming audio:', err);
      toast.error('Failed to rename audio');
      return false;
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Your Recordings</CardTitle>
        <Button variant="outline" asChild className="flex items-center gap-2">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
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
            <div className="mt-4">
              <Button variant="outline" asChild className="flex items-center gap-2">
                <Link to="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
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
