
import { useState } from 'react';
import { useUserFetch } from './users/useUserFetch';
import { useAudioPlayback } from './users/useAudioPlayback';
import { User } from './users/useUserFetch';

export const useUsersData = (currentUser: any) => {
  const { users, loading, error, fetchAllUsers, toggleAvailability } = useUserFetch(currentUser);
  const { expandedUser, playingAudio, toggleUserExpand, handleAudioPlay } = useAudioPlayback();

  console.log("useUsersData hook initialized with users:", users.length);

  return {
    users,
    loading,
    error,
    expandedUser,
    playingAudio,
    fetchAllUsers,
    toggleUserExpand,
    handleAudioPlay,
    toggleAvailability,
  };
};
