
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      // This is important to make it work on more browsers
      a.style.display = 'none';
      document.body.appendChild(a);
      // Trigger the download
      a.click();
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
      }, 100);
      
      console.log(`Downloading file: ${filename} from URL: ${url}`);
    } catch (error) {
      console.error('Download error:', error);
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
