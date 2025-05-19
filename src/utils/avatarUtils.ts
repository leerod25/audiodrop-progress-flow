
/**
 * Helper function to get avatar image based on gender
 */
export function getAvatarImage(gender: string | null | undefined) {
  // Default to male avatar if gender is not specified
  if (!gender) {
    return '/lovable-uploads/26bccfed-a9f0-4888-8b2d-7c34fdfe37ed.png';
  }
  
  if (gender === 'male' || gender === 'Male') {
    return '/lovable-uploads/26bccfed-a9f0-4888-8b2d-7c34fdfe37ed.png';
  } else if (gender === 'female' || gender === 'Female') {
    return '/lovable-uploads/7889d5d0-d6bd-4ccf-8dbd-62fe95fc1946.png';
  }
  // Default to male if gender doesn't match known values
  return '/lovable-uploads/26bccfed-a9f0-4888-8b2d-7c34fdfe37ed.png';
}

/**
 * Helper function to get avatar fallback text
 */
export function getAvatarFallback(email: string, gender: string | null | undefined) {
  if (email && email.length > 0) {
    return email.charAt(0).toUpperCase();
  }
  return gender === 'female' || gender === 'Female' ? 'F' : 'M'; // Default to M if not female
}
