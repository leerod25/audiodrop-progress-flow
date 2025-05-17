
import { useState, useEffect } from 'react';
import { useUserFetch } from './users/useUserFetch';
import { useAudioPlayback } from './users/useAudioPlayback';

export const useUsersData = (currentUser: any) => {
  const { users, loading, error, fetchAllUsers } = useUserFetch(currentUser);
  const { expandedUser, playingAudio, toggleUserExpand, handleAudioPlay } = useAudioPlayback();

  return {
    users,
    loading,
    error,
    expandedUser,
    playingAudio,
    fetchAllUsers,
    toggleUserExpand,
    handleAudioPlay,
  };
};
