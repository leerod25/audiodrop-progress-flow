
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Agent } from '@/types/agent';

export function useAudioPlayer() {
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);

  // Clean up any playing audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.onended = null;
        audioPlayer.onerror = null;
      }
    };
  }, []);

  // Play/pause audio with improved error handling
  const toggleAudio = (audioUrl: string) => {
    if (!audioUrl) {
      toast.error('No valid audio URL provided');
      return;
    }

    console.log('Attempting to play audio URL:', audioUrl);
    
    if (currentAudio === audioUrl && isPlaying && audioPlayer) {
      audioPlayer.pause();
      setIsPlaying(false);
      return;
    }
    
    // If there's a current audio player, pause it
    if (audioPlayer) {
      audioPlayer.pause();
    }
    
    // Create a new audio player
    const newAudioPlayer = new Audio(audioUrl);
    
    // Set up event listeners
    newAudioPlayer.onplay = () => {
      console.log('Audio playback started');
      setIsPlaying(true);
    };
    
    newAudioPlayer.onended = () => {
      console.log('Audio playback ended');
      setIsPlaying(false);
    };
    
    newAudioPlayer.onpause = () => {
      console.log('Audio playback paused');
      setIsPlaying(false);
    };
    
    newAudioPlayer.onerror = (e) => {
      console.error('Error playing audio:', e);
      console.error('Error details:', newAudioPlayer.error);
      toast.error(`Failed to play audio: ${newAudioPlayer.error?.message || 'Unknown error'}`);
      setIsPlaying(false);
    };
    
    setAudioPlayer(newAudioPlayer);
    setCurrentAudio(audioUrl);
    
    // Try to play the audio
    newAudioPlayer.play()
      .then(() => {
        console.log('Audio playback initiated successfully');
      })
      .catch(err => {
        console.error('Error initiating audio playback:', err);
        toast.error(`Could not play audio: ${err.message}`);
      });
  };

  // Open audio player modal with improved visibility and error handling
  const openAudioModal = (agent: Agent) => {
    if (!agent.audio_url) {
      toast.error('No audio available for this agent');
      return;
    }

    console.log('Opening audio modal with URL:', agent.audio_url);
    setCurrentAgent(agent);
    setShowAudioModal(true);
    
    // Don't auto-play in modal, let user click the play button
    if (audioPlayer) {
      audioPlayer.pause();
      setIsPlaying(false);
    }
  };

  // Close audio modal and clean up audio
  const closeAudioModal = () => {
    if (audioPlayer) {
      audioPlayer.pause();
      setIsPlaying(false);
    }
    setShowAudioModal(false);
    setCurrentAgent(null);
  };

  return {
    currentAudio,
    isPlaying,
    showAudioModal,
    currentAgent,
    toggleAudio,
    openAudioModal,
    closeAudioModal,
    setShowAudioModal
  };
}
