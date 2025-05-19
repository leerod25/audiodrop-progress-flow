
export interface SampleAgent {
  id: string;
  country: string;
  city: string;
  audioUrls: { id: string; title: string; url: string; updated_at: string }[];
  created_at: string; 
}

// Use a browser-compatible sample audio URL (MP3 format is more widely supported)
const sampleAudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

// Your "real" profile data
const me: SampleAgent = {
  id: "leerod25",
  country: "Canada",
  city: "Montreal",
  created_at: new Date().toISOString(),
  audioUrls: [
    {
      id: "welcome",
      title: "Welcome Message",
      url: sampleAudioUrl,
      updated_at: new Date().toISOString(),
    },
  ],
};

// Repeat me 6 times with distinct IDs
const sampleProfiles: SampleAgent[] = Array.from({ length: 6 }, (_, i) => ({
  ...me,
  id: `leerod25-${i+1}`,
}));

export default sampleProfiles;
