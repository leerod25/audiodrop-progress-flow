
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadButtonProps {
  url: string;
  filename?: string;
}

const DownloadButton = ({ 
  url, 
  filename = 'recording.webm' 
}: DownloadButtonProps) => {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Button 
      onClick={handleDownload} 
      variant="outline" 
      size="sm"
      className="flex items-center gap-1"
    >
      <Download className="h-4 w-4" />
      <span>Download</span>
    </Button>
  );
};

export default DownloadButton;
