
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
    <div className="p-4 border rounded-md space-y-2">
      <div className="flex justify-between items-center">
        {!isEditing ? (
          <>
            <h3 className="font-medium">{title}</h3>
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setIsEditing(true)} 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Rename</span>
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Recording</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete} 
                      className="bg-red-500 hover:bg-red-600"
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
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
              className="flex-grow"
              placeholder="Recording title"
              autoFocus
            />
            <div className="flex gap-1">
              <Button 
                onClick={handleRenameSubmit} 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 text-green-500 hover:text-green-600 hover:bg-green-50"
              >
                <Check className="h-4 w-4" />
                <span className="sr-only">Save</span>
              </Button>
              <Button 
                onClick={() => {
                  setNewTitle(title);
                  setIsEditing(false);
                }}
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cancel</span>
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <audio controls src={audioUrl} className="w-full" />
      
      <p className="text-xs text-gray-500">
        Recorded on {formattedDate}
      </p>
    </div>
  );
};

export default AudioRecordingItem;
