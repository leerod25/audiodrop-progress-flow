
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface DownloadButtonProps {
  url: string;
  filename?: string;
}

const DownloadButton = ({ 
  url, 
  filename = 'recording.webm' 
}: DownloadButtonProps) => {
  const handleDownload = () => {
    try {
      console.log(`Starting download from URL: ${url}, filename: ${filename}`);
      
      // Create a blob link for the audio
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();
        })
        .then(blob => {
          // Create a link element
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          
          // Append to the document
          document.body.appendChild(link);
          
          // Trigger download
          link.click();
          
          // Cleanup
          setTimeout(() => {
            window.URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
          }, 100);
          
          toast.success(`Downloading ${filename}`);
        })
        .catch(error => {
          console.error('Download error:', error);
          toast.error('Failed to download file. Please try again.');
        });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file. Please try again.');
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Button 
        onClick={handleDownload} 
        variant="outline" 
        size="sm"
        className="flex items-center gap-1 transition-colors duration-200 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-purple-300"
      >
        <Download className="h-4 w-4" />
        <span>Download</span>
      </Button>
    </motion.div>
  );
};

export default DownloadButton;
