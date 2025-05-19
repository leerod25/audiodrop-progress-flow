
export interface SampleAgent {
  id: string;
  country: string;
  city: string;
  full_name: string | null;
  gender: string | null;
  computer_skill_level: string | null;
  audioUrls: { id: string; title: string; url: string; updated_at: string }[];
  created_at: string; 
}

// Single "real" clip
const myClip = {
  id: "welcome",
  title: "Welcome Message",
  url: "https://assets.mixkit.co/sfx/preview/mixkit-female-voice-saying-hello-85.mp3",
  updated_at: new Date().toISOString(),
};

// Base agent template
const baseAgent: SampleAgent = {
  id: "leerod25",
  country: "Canada",
  city: "Montreal",
  full_name: "Lee Rodriguez",
  gender: "female",
  computer_skill_level: "Expert",
  audioUrls: [myClip],
  created_at: new Date().toISOString()
};

// Sample profile data made from the base agent template
const sampleProfiles: SampleAgent[] = Array.from({ length: 6 }, (_, i) => ({
  ...baseAgent,
  id: `leerod25-${i+1}`,
  full_name: `Lee Rodriguez ${i+1}`,
  created_at: new Date().toISOString()
}));

export default sampleProfiles;
