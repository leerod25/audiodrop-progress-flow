
import React, { useState, useRef, useEffect } from "react";
import { FileAudio, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export type AudioFile = {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  url?: string;
};

interface AudioUploaderProps {
  onFilesChange?: (files: AudioFile[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({
  onFilesChange,
  maxFiles = 10,
  maxSizeMB = 10,
  className,
}) => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  // For demo purposes: simulate upload progress
  useEffect(() => {
    const pendingFiles = audioFiles.filter(file => file.status === "pending");
    
    if (pendingFiles.length === 0) return;
    
    pendingFiles.forEach(file => {
      simulateUpload(file.id);
    });
  }, [audioFiles]);
  
  useEffect(() => {
    if (onFilesChange) {
      onFilesChange(audioFiles);
    }
  }, [audioFiles, onFilesChange]);

  const simulateUpload = (fileId: string) => {
    setAudioFiles(prev => 
      prev.map(file => 
        file.id === fileId ? { ...file, status: "uploading" } : file
      )
    );
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setAudioFiles(prev => 
          prev.map(file => 
            file.id === fileId 
              ? { 
                  ...file, 
                  progress: 100, 
                  status: "success",
                  url: URL.createObjectURL(file.file)
                } 
              : file
          )
        );
        
        toast.success(`Uploaded ${getFileName(audioFiles.find(f => f.id === fileId)?.file.name || '')}`);
        return;
      }
      
      setAudioFiles(prev => 
        prev.map(file => 
          file.id === fileId ? { ...file, progress } : file
        )
      );
    }, 300);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = (file: File) => {
    // Check if file is an audio file
    if (!file.type.startsWith("audio/")) {
      toast.error(`${file.name} is not an audio file`);
      return false;
    }
    
    // Check file size
    if (file.size > maxSizeBytes) {
      toast.error(`${file.name} exceeds the maximum file size of ${maxSizeMB}MB`);
      return false;
    }
    
    return true;
  };

  const processFiles = (files: FileList | null) => {
    if (!files) return;
    
    // Check if adding these files would exceed the maximum
    if (audioFiles.length + files.length > maxFiles) {
      toast.error(`You can only upload a maximum of ${maxFiles} files`);
      return;
    }
    
    const newFiles: AudioFile[] = [];
    
    Array.from(files).forEach(file => {
      if (validateFile(file)) {
        newFiles.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          progress: 0,
          status: "pending"
        });
      }
    });
    
    if (newFiles.length > 0) {
      setAudioFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    
    processFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset file input so the same file can be uploaded again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (id: string) => {
    setAudioFiles(prev => {
      const fileToRemove = prev.find(file => file.id === id);
      if (fileToRemove?.url) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(file => file.id !== id);
    });
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getFileName = (fileName: string) => {
    if (fileName.length <= 20) return fileName;
    const ext = fileName.split('.').pop() || '';
    const name = fileName.substring(0, fileName.length - ext.length - 1);
    return `${name.substring(0, 16)}...${ext}`;
  };

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 transition-all flex flex-col items-center justify-center bg-gradient-to-r",
          isDragging
            ? "border-purple-500 bg-purple-50/80 animate-pulse-border from-purple-50 to-purple-100"
            : "border-gray-300 hover:border-purple-400 from-gray-50 to-gray-100"
        )}
      >
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="p-3 bg-purple-100 rounded-full">
            <FileAudio className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium text-lg text-gray-900">
              Upload audio files
            </h3>
            <p className="text-gray-500 mt-1">
              {isDragging
                ? "Drop your files here"
                : "Drag and drop or click to browse"}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supports MP3, WAV, FLAC, AAC (max {maxSizeMB}MB per file)
            </p>
          </div>
          <Button 
            onClick={handleBrowseClick}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            Select files
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="audio/*"
            multiple
            className="hidden"
          />
        </div>
      </div>

      {/* File List */}
      {audioFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h4 className="font-medium">
              {audioFiles.length} {audioFiles.length === 1 ? "file" : "files"}
            </h4>
          </div>
          <ul className="divide-y">
            {audioFiles.map((audioFile) => (
              <li key={audioFile.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <FileAudio className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {getFileName(audioFile.file.name)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(audioFile.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {audioFile.status === "success" && audioFile.url && (
                      <AudioPreview url={audioFile.url} />
                    )}
                    <button
                      onClick={() => handleRemoveFile(audioFile.id)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                {audioFile.status === "uploading" && (
                  <div className="mt-2">
                    <Progress value={audioFile.progress} className="h-1" />
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.floor(audioFile.progress)}% uploaded
                    </p>
                  </div>
                )}

                {/* Status */}
                {audioFile.status === "success" && (
                  <p className="text-xs text-green-600 mt-1">
                    Upload complete
                  </p>
                )}

                {audioFile.status === "error" && (
                  <p className="text-xs text-red-600 mt-1">
                    Upload failed
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface AudioPreviewProps {
  url: string;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center">
      <audio ref={audioRef} src={url} className="hidden" />
      <button
        onClick={togglePlay}
        className={cn(
          "flex items-center justify-center p-1 rounded-full",
          isPlaying ? "bg-purple-100" : "bg-gray-100"
        )}
      >
        {isPlaying ? (
          <div className="flex items-center space-x-0.5 px-1.5">
            <div className="w-0.5 h-3 bg-purple-600 animate-waveform-1"></div>
            <div className="w-0.5 h-3 bg-purple-600 animate-waveform-2"></div>
            <div className="w-0.5 h-3 bg-purple-600 animate-waveform-3"></div>
            <div className="w-0.5 h-3 bg-purple-600 animate-waveform-4"></div>
            <div className="w-0.5 h-3 bg-purple-600 animate-waveform-5"></div>
          </div>
        ) : (
          <div className="w-4 h-4 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700">▶</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default AudioUploader;
