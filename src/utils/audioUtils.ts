
/**
 * Checks if a URL is valid for audio playback
 * @param url The URL to validate
 * @returns boolean indicating if the URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    if (!url) return false;
    // Check if it's a valid URL format
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return true;
    }
    // For relative paths, we'll consider them valid if they match certain patterns
    if (url.startsWith('path/') || url.startsWith('/') || /^[a-zA-Z0-9]/.test(url)) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}
