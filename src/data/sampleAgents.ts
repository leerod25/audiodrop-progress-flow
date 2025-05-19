
// Sample agents data to display when a user is not logged in

// Use an existing audio URL from the user's profile
export const sampleAudioUrl = "https://hoeprpjndjhhotccljdm.supabase.co/storage/v1/object/public/audio-bucket/recordings/80257eb7-c7d5-4874-bc38-c9cbf12727d4.webm"; 

const sampleAudio = {
  id: "sample-audio-1",
  title: "Welcome Message",
  audio_url: sampleAudioUrl,
  created_at: new Date().toISOString()
};

// Create a sample agent template
const createSampleAgent = (id: string, city: string, country: string) => {
  return {
    id: id,
    email: "",  // No email shown for sample agents
    full_name: `Agent ID: ${id.substring(0, 8)}...`,
    avatar_url: "",
    created_at: new Date().toISOString(),
    audio_files: [sampleAudio],
    country: country,
    city: city,
    gender: "Not specified",
    years_experience: "3+",
    languages: ["English", "Spanish"],
    is_available: true,
    role: "agent",
    has_audio: true,
    audioUrls: [{
      id: "sample-audio-1",
      title: "Welcome Message",
      url: sampleAudioUrl,
      updated_at: new Date().toISOString()
    }]
  };
};

// Create 6 sample agents with the same profile but different locations with valid UUIDs
export const sampleAgents = [
  createSampleAgent("3a067ecc-1234-5678-9abc-def012345678", "New York", "United States"),
  createSampleAgent("4b178fdd-2345-6789-abcd-ef0123456789", "Los Angeles", "United States"),
  createSampleAgent("5c289fee-3456-789a-bcde-f01234567890", "London", "United Kingdom"),
  createSampleAgent("6d39a0ff-4567-89ab-cdef-012345678901", "Sydney", "Australia"),
  createSampleAgent("7e4ab100-5678-9abc-def0-123456789012", "Toronto", "Canada"),
  createSampleAgent("8f5bc201-6789-abcd-ef01-234567890123", "Berlin", "Germany")
];
