
export interface SampleAgent {
  id: string;
  country: string;
  city: string;
  audioUrls: { id: string; title: string; url: string; updated_at: string }[];
}

// Replace this URL with your actual public audio URL
const yourAudioUrl = "https://example.com/your-public-audio.mp3";

// Your "real" profile data
const me: SampleAgent = {
  id: "leerod25",
  country: "Canada",
  city: "Montreal",
  audioUrls: [
    {
      id: "welcome",
      title: "Welcome Message",
      url: yourAudioUrl,
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
