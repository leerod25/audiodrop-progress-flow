
import React, { useState } from 'react';
import { Pencil, Trash, Check, X } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';
import DownloadButton from '@/components/DownloadButton';

interface AudioRecordingItemProps {
  id: string;
  title: string;
  audioUrl: string;
  createdAt: string;
  onDelete: (id: string) => Promise<boolean>;
  onRename: (id: string, newTitle: string) => Promise<boolean>;
}

const AudioRecordingItem = ({
  id,
  title,
  audioUrl,
  createdAt,
  onDelete,
  onRename
}: AudioRecordingItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRenameSubmit = async () => {
    if (newTitle.trim() === title) {
      setIsEditing(false);
      return;
    }
    
    const success = await onRename(id, newTitle);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(id);
    setIsDeleting(false);
  };

  const formattedDate = new Date(createdAt).toLocaleString();

  return (
    <div className="p-4 border rounded-md space-y-2 transition-all duration-200 hover:shadow-md">
      <div className="flex justify-between items-center">
        {!isEditing ? (
          <>
            <h3 className="font-medium">{title}</h3>
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  onClick={() => setIsEditing(true)} 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Rename</span>
                </Button>
              </motion.div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </motion.div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Recording</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300">Cancel</AlertDialogCancel>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <AlertDialogAction 
                        onClick={handleDelete} 
                        className="bg-red-500 hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </AlertDialogAction>
                    </motion.div>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <DownloadButton 
                url={audioUrl} 
                filename={`${title}.webm`}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center w-full gap-2">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-grow transition-colors duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              placeholder="Recording title"
              autoFocus
            />
            <div className="flex gap-1">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  onClick={handleRenameSubmit} 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 text-green-500 hover:text-green-600 hover:bg-green-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  <Check className="h-4 w-4" />
                  <span className="sr-only">Save</span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  onClick={() => {
                    setNewTitle(title);
                    setIsEditing(false);
                  }}
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Cancel</span>
                </Button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
      
      <audio controls src={audioUrl} className="w-full transition-all duration-200 hover:opacity-95" />
      
      <p className="text-xs text-gray-500">
        Recorded on {formattedDate}
      </p>
    </div>
  );
};

export default AudioRecordingItem;
