
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useAudioPlayer() {
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  // Audio player setup
  useEffect(() => {
    if (audioPlayer) {
      audioPlayer.onended = () => {
        setIsPlaying(false);
      };
      
      return () => {
        audioPlayer.pause();
        audioPlayer.onended = null;
      };
    }
  }, [audioPlayer]);

  // Play/pause audio
  const toggleAudio = (audioUrl: string) => {
    if (currentAudio === audioUrl && isPlaying && audioPlayer) {
      audioPlayer.pause();
      setIsPlaying(false);
    } else {
      if (audioPlayer) {
        audioPlayer.pause();
      }
      
      const newAudioPlayer = new Audio(audioUrl);
      setAudioPlayer(newAudioPlayer);
      setCurrentAudio(audioUrl);
      newAudioPlayer.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Error playing audio:', err);
        toast.error('Failed to play audio');
      });
    }
  };

  // Stop any playing audio
  const stopAudio = () => {
    if (audioPlayer && isPlaying) {
      audioPlayer.pause();
      setIsPlaying(false);
    }
  };

  return {
    currentAudio,
    isPlaying,
    toggleAudio,
    stopAudio
  };
}
