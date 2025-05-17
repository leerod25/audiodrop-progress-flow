
/**
 * Format date for better display
 */
export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleString();
};
