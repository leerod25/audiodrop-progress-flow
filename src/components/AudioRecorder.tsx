
import React, { FC, useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Square as Stop, AudioWaveform } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob, url: string) => void;
}

const AudioRecorder: FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Clean up blob URL on unmount
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onRecordingComplete(blob, url);
        
        // Stop all audio tracks to turn off the microphone
        stream.getTracks().forEach(track => track.stop());
        
        // Reset recording time and clear timer
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        toast.success("Recording completed");
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast.info("Recording started");
    } catch (err) {
      console.error('Error accessing microphone', err);
      toast.error('Could not access your microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    recordedChunksRef.current = [];
    setRecordingTime(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm p-4 bg-white">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Voice Recorder</h3>
        {isRecording && (
          <div className="flex items-center gap-2 text-red-500 animate-pulse">
            <span className="inline-block h-2 w-2 rounded-full bg-red-500"></span>
            <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {!audioUrl && !isRecording && (
          <div className="flex justify-center">
            <Button 
              onClick={startRecording} 
              className="bg-purple-600 hover:bg-purple-700 h-16 w-16 rounded-full"
              aria-label="Start recording"
            >
              <Mic className="h-8 w-8" />
            </Button>
          </div>
        )}
        
        {isRecording && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className={cn("flex items-end space-x-1 h-16", "mx-auto")}>
                <div className="w-1 bg-purple-400 rounded-t-full animate-waveform-1 h-8"></div>
                <div className="w-1 bg-purple-500 rounded-t-full animate-waveform-2 h-12"></div>
                <div className="w-1 bg-purple-600 rounded-t-full animate-waveform-3 h-16"></div>
                <div className="w-1 bg-purple-700 rounded-t-full animate-waveform-4 h-10"></div>
                <div className="w-1 bg-purple-500 rounded-t-full animate-waveform-5 h-14"></div>
                <div className="w-1 bg-purple-400 rounded-t-full animate-waveform-1 h-9"></div>
                <div className="w-1 bg-purple-600 rounded-t-full animate-waveform-2 h-12"></div>
                <div className="w-1 bg-purple-400 rounded-t-full animate-waveform-3 h-8"></div>
                <div className="w-1 bg-purple-700 rounded-t-full animate-waveform-4 h-16"></div>
                <div className="w-1 bg-purple-500 rounded-t-full animate-waveform-5 h-10"></div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={stopRecording} 
                className="bg-red-500 hover:bg-red-600 h-16 w-16 rounded-full"
                aria-label="Stop recording"
              >
                <Stop className="h-8 w-8" />
              </Button>
            </div>
          </div>
        )}

        {audioUrl && (
          <div className="space-y-4">
            <audio controls src={audioUrl} className="w-full" />
            <div className="flex justify-center gap-2">
              <Button
                onClick={resetRecording}
                variant="outline"
                className="flex-1 max-w-xs"
              >
                Record Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
