
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

// Sample profile data made to match the Agent type more closely
const sampleProfiles: SampleAgent[] = [
  {
    id: "agent-sample-1",
    full_name: "Sarah Johnson",
    country: "United States",
    city: "New York",
    gender: "female",
    computer_skill_level: "Expert",
    created_at: new Date().toISOString(),
    audioUrls: [
      {
        id: "greeting-1",
        title: "Professional Greeting",
        url: "https://assets.mixkit.co/sfx/preview/mixkit-female-voice-saying-hello-85.mp3",
        updated_at: new Date().toISOString(),
      },
      {
        id: "voicemail-1",
        title: "Voicemail Message",
        url: "https://assets.mixkit.co/sfx/preview/mixkit-female-voice-saying-thank-you-for-calling-54.mp3",
        updated_at: new Date(Date.now() - 86400000).toISOString(),
      }
    ],
  },
  {
    id: "agent-sample-2",
    full_name: "Michael Chen",
    country: "Canada",
    city: "Toronto",
    gender: "male",
    computer_skill_level: "Intermediate",
    created_at: new Date().toISOString(),
    audioUrls: [
      {
        id: "welcome-2",
        title: "Welcome Message",
        url: "https://assets.mixkit.co/sfx/preview/mixkit-male-voice-chanting-hello-53.mp3",
        updated_at: new Date().toISOString(),
      }
    ],
  },
  {
    id: "agent-sample-3",
    full_name: "Emma Wilson",
    country: "United Kingdom",
    city: "London",
    gender: "female",
    computer_skill_level: "Advanced",
    created_at: new Date().toISOString(),
    audioUrls: [
      {
        id: "intro-3",
        title: "Business Introduction",
        url: "https://assets.mixkit.co/sfx/preview/mixkit-female-saying-welcome-1469.mp3",
        updated_at: new Date().toISOString(),
      }
    ],
  },
  {
    id: "agent-sample-4",
    full_name: "David Rodriguez",
    country: "Spain",
    city: "Madrid",
    gender: "male",
    computer_skill_level: "Expert",
    created_at: new Date().toISOString(),
    audioUrls: [
      {
        id: "welcome-4",
        title: "Friendly Greeting",
        url: "https://assets.mixkit.co/sfx/preview/mixkit-male-voice-saying-thank-you-55.mp3",
        updated_at: new Date().toISOString(),
      }
    ],
  },
  {
    id: "agent-sample-5",
    full_name: "Olivia Kim",
    country: "South Korea",
    city: "Seoul",
    gender: "female",
    computer_skill_level: "Intermediate",
    created_at: new Date().toISOString(),
    audioUrls: [
      {
        id: "intro-5",
        title: "Professional Introduction",
        url: "https://assets.mixkit.co/sfx/preview/mixkit-female-professional-introduction-98.mp3",
        updated_at: new Date().toISOString(),
      }
    ],
  }
];

export default sampleProfiles;
