
/**
 * Formats seconds into a MM:SS display
 * @param seconds Number of seconds to format
 * @returns A string in the format of MM:SS
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};
