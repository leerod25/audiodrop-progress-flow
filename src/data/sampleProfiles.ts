
export interface SampleAgent {
  id: string;
  country: string;
  city: string;
  audioUrls: { id: string; title: string; url: string; updated_at: string }[];
  created_at: string; // Add this field to fix type issues
}

// Use a public sample audio URL
const sampleAudioUrl = "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav";

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
