
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
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
        className="flex items-center gap-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <Download className="h-4 w-4" />
        <span>Download</span>
      </Button>
    </motion.div>
  );
};

export default DownloadButton;
