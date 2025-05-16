
import React from "react";
import AudioUploader, { AudioFile } from "@/components/AudioUploader";
import { Button } from "@/components/ui/button";

const Index = () => {
  const handleFilesChange = (files: AudioFile[]) => {
    console.log("Files changed:", files);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 max-w-4xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Audio Uploader
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Drag and drop audio files or browse your device to upload.
          This component supports multiple file uploads with progress tracking.
        </p>
      </header>

      <div className="bg-white rounded-xl shadow-md p-6">
        <AudioUploader 
          onFilesChange={handleFilesChange}
          maxFiles={5}
          maxSizeMB={20}
        />
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          This is a UI-only demonstration. Files are not actually being uploaded to any server.
        </p>
      </div>
    </div>
  );
};

export default Index;
