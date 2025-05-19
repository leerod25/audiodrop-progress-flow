
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
    // For blob URLs (used in some browsers for generated audio)
    if (url.startsWith('blob:')) {
      return true;
    }
    // For data URLs (sometimes used for audio files)
    if (url.startsWith('data:audio/')) {
      return true;
    }
    // For Supabase storage URLs
    if (url.includes('supabase.co/storage/v1/object/public/')) {
      return true;
    }
    // For relative paths, we'll consider them valid if they match certain patterns
    if (url.startsWith('path/') || url.startsWith('/') || /^[a-zA-Z0-9]/.test(url)) {
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error validating URL:', e);
    return false;
  }
}

/**
 * Checks if the browser supports audio playback
 * @returns boolean indicating if audio is supported
 */
export function isBrowserAudioSupported(): boolean {
  try {
    // Check if the Audio constructor is available
    if (typeof Audio !== 'undefined') {
      const audio = new Audio();
      // Check if the browser can play common audio formats
      const canPlayMp3 = audio.canPlayType('audio/mpeg') !== '';
      const canPlayWebm = audio.canPlayType('audio/webm') !== '';
      const canPlayWav = audio.canPlayType('audio/wav') !== '';
      const canPlayOgg = audio.canPlayType('audio/ogg') !== '';
      
      console.log('Browser audio support:', {
        mp3: audio.canPlayType('audio/mpeg'),
        webm: audio.canPlayType('audio/webm'),
        wav: audio.canPlayType('audio/wav'),
        ogg: audio.canPlayType('audio/ogg')
      });
      
      return canPlayMp3 || canPlayWebm || canPlayWav || canPlayOgg;
    }
    return false;
  } catch (e) {
    console.error('Error checking audio support:', e);
    return false;
  }
}

/**
 * Check if a specific audio format is supported by the browser
 * @param mimeType The MIME type to check (e.g., 'audio/mpeg', 'audio/wav')
 * @returns boolean indicating if the format is supported
 */
export function isAudioFormatSupported(mimeType: string): boolean {
  try {
    const audio = new Audio();
    return audio.canPlayType(mimeType) !== '';
  } catch (e) {
    console.error('Error checking audio format support:', e);
    return false;
  }
}

/**
 * Converts a Blob to a base64 string
 * @param blob The audio blob to convert
 * @returns Promise resolving to the base64 string
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Creates a valid audio URL from various sources
 * @param source Either a URL string, Blob, or File
 * @returns Promise resolving to a playable audio URL
 */
export async function createAudioUrl(source: string | Blob | File): Promise<string> {
  try {
    // If it's already a string URL, validate it
    if (typeof source === 'string') {
      if (isValidUrl(source)) {
        return source;
      }
      throw new Error('Invalid audio URL');
    }
    
    // If it's a Blob or File, create an object URL
    return URL.createObjectURL(source);
  } catch (e) {
    console.error('Error creating audio URL:', e);
    throw new Error('Failed to create playable audio URL');
  }
}
