import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User, FileAudio, CheckCircle, XCircle, Filter, Star, Play, Pause, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from "@/components/ui/label";
import { useUserContext } from "@/contexts/UserContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { generateFakeProfiles } from '@/utils/fakeProfiles';

interface Agent {
  id: string;
  has_audio: boolean;
  audio_url?: string | null;
  country?: string | null;
  city?: string | null;
  computer_skill_level?: string | null;
  is_favorite?: boolean;
  avatar_url?: string | null;
  name?: string | null;
}

interface FilterValues {
  country: string;
  city: string;
  hasAudio: boolean;
  skillLevel: string;
}

// Define a type for the business_favorites table since it's not in the generated types yet
interface BusinessFavorite {
  id: string;
  business_id: string;
  agent_id: string;
  created_at?: string;
}

const AgentPreview: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [skillLevels, setSkillLevels] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [useFakeData, setUseFakeData] = useState(true);
  const navigate = useNavigate();
  const { user, userRole } = useUserContext();

  const form = useForm<FilterValues>({
    defaultValues: {
      country: '',
      city: '',
      hasAudio: false,
      skillLevel: '',
    },
  });

  // Check if user is business role
  const isBusinessAccount = userRole === 'business';

  // Fixed version of the audio URL construction function
  const constructAudioUrl = (url: string | null): string | null => {
    if (!url) return null;
    
    // If already a full URL, return it
    if (url.startsWith('http')) return url;
    
    // If it's a storage path, construct the full URL
    if (url.startsWith('audio/')) {
      const baseUrl = 'https://icfdrrmmacnmdpnwimya.supabase.co/storage/v1/object/public/';
      return `${baseUrl}${url}`;
    }
    
    // For any other case, return as is
    return url;
  };

  // Fetch agents and populate filter options
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        
        // If using fake data, generate fake profiles
        if (useFakeData) {
          const fakeAgents = generateFakeProfiles();
          
          // Add male profile picture URL to first 5 agents (male profiles)
          const agentsWithPictures = fakeAgents.map((agent, index) => {
            if (index < 5) { // First 5 are males in the fake data
              return {
                ...agent,
                avatar_url: '/lovable-uploads/photo-1581092795360-fd1ca04f0952.jpg'
              };
            }
            return agent;
          });
          
          // Extract unique values for filter dropdowns from fake data
          const uniqueCountries = Array.from(
            new Set(
              fakeAgents
                .map(agent => agent.country)
                .filter(Boolean) as string[]
            )
          ).sort();
          
          const uniqueCities = Array.from(
            new Set(
              fakeAgents
                .map(agent => agent.city)
                .filter(Boolean) as string[]
            )
          ).sort();
          
          const uniqueSkillLevels = Array.from(
            new Set(
              fakeAgents
                .map(agent => agent.computer_skill_level)
                .filter(Boolean) as string[]
            )
          ).sort();
          
          setAgents(agentsWithPictures);
          setFilteredAgents(agentsWithPictures);
          setCountries(uniqueCountries);
          setCities(uniqueCities);
          setSkillLevels(uniqueSkillLevels);
          setLoading(false);
          return;
        }
        
        // Otherwise fetch real data from Supabase
        // First get all profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, country, city, computer_skill_level, full_name');
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          toast.error('Failed to load agent profiles');
          return;
        }

        // Then check which ones have audio
        const { data: audioData, error: audioError } = await supabase
          .from('audio_metadata')
          .select('user_id, audio_url')
          .order('created_at', { ascending: false });
        
        if (audioError) {
          console.error('Error fetching audio data:', audioError);
        }
        
        // Create a map of user IDs to audio URLs with proper URL construction
        const audioMap = new Map<string, string>();
        audioData?.forEach(audio => {
          if (!audioMap.has(audio.user_id)) {
            const fullUrl = constructAudioUrl(audio.audio_url);
            if (fullUrl) {
              audioMap.set(audio.user_id, fullUrl);
            }
          }
        });

        // If business user, get favorites
        let favorites: string[] = [];
        if (isBusinessAccount && user) {
          // Use RPC function to get favorites
          const { data, error } = await supabase
            .rpc('get_business_favorites', { 
              business_user_id: user.id 
            });

          if (error) {
            console.error('Error fetching favorites:', error);
          } else if (data) {
            favorites = data as unknown as string[];
          }
        }
        
        // Map profiles to agents with audio info and favorite status
        // Ensure we're only accessing properties that exist in the profiles table
        const agentsWithAudioInfo = profiles?.map(profile => ({
          id: profile.id,
          has_audio: audioMap.has(profile.id),
          audio_url: audioMap.get(profile.id) || null,
          country: profile.country,
          city: profile.city,
          computer_skill_level: profile.computer_skill_level,
          is_favorite: favorites.includes(profile.id),
          avatar_url: '/lovable-uploads/photo-1581092795360-fd1ca04f0952.jpg', // Add male profile picture
          name: profile.full_name // Use full_name instead of name
        })) || [];
        
        setAgents(agentsWithAudioInfo);
        setFilteredAgents(agentsWithAudioInfo);

        // Extract unique values for filter dropdowns
        const uniqueCountries = Array.from(
          new Set(
            agentsWithAudioInfo
              .map(agent => agent.country)
              .filter(Boolean) as string[]
          )
        ).sort();
        
        const uniqueCities = Array.from(
          new Set(
            agentsWithAudioInfo
              .map(agent => agent.city)
              .filter(Boolean) as string[]
          )
        ).sort();
        
        const uniqueSkillLevels = Array.from(
          new Set(
            agentsWithAudioInfo
              .map(agent => agent.computer_skill_level)
              .filter(Boolean) as string[]
          )
        ).sort();

        setCountries(uniqueCountries);
        setCities(uniqueCities);
        setSkillLevels(uniqueSkillLevels);
      } catch (err) {
        console.error('Unexpected error in AgentPreview:', err);
        toast.error('An error occurred while loading agents');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [user, userRole, isBusinessAccount, useFakeData]);

  // Apply filters whenever form values change
  const applyFilters = (values: FilterValues) => {
    let result = [...agents];
    
    if (values.country) {
      result = result.filter(agent => agent.country === values.country);
    }
    
    if (values.city) {
      result = result.filter(agent => agent.city === values.city);
    }
    
    if (values.hasAudio) {
      result = result.filter(agent => agent.has_audio);
    }
    
    if (values.skillLevel) {
      result = result.filter(agent => agent.computer_skill_level === values.skillLevel);
    }
    
    setFilteredAgents(result);
  };

  // Watch form changes and update filters
  useEffect(() => {
    const subscription = form.watch((value) => {
      applyFilters(value as FilterValues);
    });
    
    return () => subscription.unsubscribe();
  }, [form, agents]);

  // Improved audio player setup with better error handling
  useEffect(() => {
    return () => {
      // Clean up any playing audio when component unmounts
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.onended = null;
        audioPlayer.onerror = null;
      }
    };
  }, []);

  // Play/pause audio with improved error handling
  const toggleAudio = (audioUrl: string) => {
    if (!audioUrl) {
      toast.error('No valid audio URL provided');
      return;
    }

    console.log('Attempting to play audio URL:', audioUrl);
    
    if (currentAudio === audioUrl && isPlaying && audioPlayer) {
      audioPlayer.pause();
      setIsPlaying(false);
      return;
    }
    
    // If there's a current audio player, pause it
    if (audioPlayer) {
      audioPlayer.pause();
    }
    
    // Create a new audio player
    const newAudioPlayer = new Audio(audioUrl);
    
    // Set up event listeners
    newAudioPlayer.onplay = () => {
      console.log('Audio playback started');
      setIsPlaying(true);
    };
    
    newAudioPlayer.onended = () => {
      console.log('Audio playback ended');
      setIsPlaying(false);
    };
    
    newAudioPlayer.onpause = () => {
      console.log('Audio playback paused');
      setIsPlaying(false);
    };
    
    newAudioPlayer.onerror = (e) => {
      console.error('Error playing audio:', e);
      console.error('Error details:', newAudioPlayer.error);
      toast.error(`Failed to play audio: ${newAudioPlayer.error?.message || 'Unknown error'}`);
      setIsPlaying(false);
    };
    
    setAudioPlayer(newAudioPlayer);
    setCurrentAudio(audioUrl);
    
    // Try to play the audio
    newAudioPlayer.play()
      .then(() => {
        console.log('Audio playback initiated successfully');
      })
      .catch(err => {
        console.error('Error initiating audio playback:', err);
        toast.error(`Could not play audio: ${err.message}`);
      });
  };

  // Handle favorites
  const toggleFavorite = async (agentId: string, currentStatus: boolean) => {
    if (!user) {
      toast.error('You must be logged in to add favorites');
      return;
    }

    if (userRole !== 'business') {
      toast.error('Only business accounts can add agents to favorites');
      return;
    }

    try {
      // If using fake data, just update the local state
      if (useFakeData) {
        // Update local state
        setAgents(prevAgents => 
          prevAgents.map(agent => 
            agent.id === agentId ? { ...agent, is_favorite: !currentStatus } : agent
          )
        );
        
        setFilteredAgents(prevAgents => 
          prevAgents.map(agent => 
            agent.id === agentId ? { ...agent, is_favorite: !currentStatus } : agent
          )
        );
        
        toast.success(currentStatus ? 'Agent removed from favorites' : 'Agent added to favorites');
        return;
      }

      if (currentStatus) {
        // Remove from favorites using RPC function with proper typing
        const { error } = await supabase.rpc('remove_business_favorite', { 
          business_user_id: user.id, 
          agent_user_id: agentId 
        } as any); // Use type assertion to bypass TypeScript error

        if (error) throw error;
        toast.success('Agent removed from favorites');
      } else {
        // Add to favorites using RPC function with proper typing
        const { error } = await supabase.rpc('add_business_favorite', { 
          business_user_id: user.id, 
          agent_user_id: agentId 
        } as any); // Use type assertion to bypass TypeScript error

        if (error) throw error;
        toast.success('Agent added to favorites');
      }

      // Update local state
      setAgents(prevAgents => 
        prevAgents.map(agent => 
          agent.id === agentId ? { ...agent, is_favorite: !currentStatus } : agent
        )
      );
      
      setFilteredAgents(prevAgents => 
        prevAgents.map(agent => 
          agent.id === agentId ? { ...agent, is_favorite: !currentStatus } : agent
        )
      );
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast.error('Failed to update favorites');
    }
  };

  // Open audio player modal with improved visibility and error handling
  const openAudioModal = (agent: Agent) => {
    if (!agent.audio_url) {
      toast.error('No audio available for this agent');
      return;
    }

    console.log('Opening audio modal with URL:', agent.audio_url);
    setCurrentAgent(agent);
    setShowAudioModal(true);
    
    // Don't auto-play in modal, let user click the play button
    if (audioPlayer) {
      audioPlayer.pause();
      setIsPlaying(false);
    }
  };

  // Format the user ID to show only first 8 characters
  const formatUserId = (id: string) => `${id.substring(0, 8)}...`;

  // Reset all filters
  const resetFilters = () => {
    form.reset({
      country: '',
      city: '',
      hasAudio: false,
      skillLevel: '',
    });
    setFilteredAgents(agents);
    setShowFilters(false);
  };

  // Close audio modal and clean up audio
  const closeAudioModal = () => {
    if (audioPlayer) {
      audioPlayer.pause();
      setIsPlaying(false);
    }
    setShowAudioModal(false);
    setCurrentAgent(null);
  };

  // Toggle between real and fake data
  const toggleDataSource = () => {
    setUseFakeData(!useFakeData);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agent Preview</h1>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4">
            <Label htmlFor="fake-data-toggle" className="text-sm font-medium">Use Fake Data</Label>
            <Switch
              id="fake-data-toggle"
              checked={useFakeData}
              onCheckedChange={toggleDataSource}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            Filters {showFilters ? '↑' : '↓'}
          </Button>
          
          {showFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
            >
              Reset
            </Button>
          )}
        </div>
      </div>
      
      {useFakeData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6">
          <p className="text-yellow-700 text-sm">
            <strong>Test Mode:</strong> Showing 10 fake profiles (5 boys and 5 girls) with sample audio for testing purposes.
          </p>
        </div>
      )}
      
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Form {...form}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Country dropdown */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Country</Label>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                              {field.value || "Select country"}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuItem onClick={() => field.onChange("")}>
                              Any
                            </DropdownMenuItem>
                            {countries.map((country) => (
                              <DropdownMenuItem 
                                key={country} 
                                onClick={() => field.onChange(country)}
                              >
                                {country}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {/* City dropdown */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <Label>City</Label>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                              {field.value || "Select city"}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuItem onClick={() => field.onChange("")}>
                              Any
                            </DropdownMenuItem>
                            {cities.map((city) => (
                              <DropdownMenuItem 
                                key={city} 
                                onClick={() => field.onChange(city)}
                              >
                                {city}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {/* Skill level dropdown */}
                <FormField
                  control={form.control}
                  name="skillLevel"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Skill Level</Label>
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                              {field.value || "Select skill level"}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuItem onClick={() => field.onChange("")}>
                              Any
                            </DropdownMenuItem>
                            {skillLevels.map((level) => (
                              <DropdownMenuItem 
                                key={level} 
                                onClick={() => field.onChange(level)}
                              >
                                {level}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {/* Has Audio checkbox */}
                <FormField
                  control={form.control}
                  name="hasAudio"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-3 space-y-0 pt-6">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label>Has Audio Only</Label>
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </CardContent>
        </Card>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} className="shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4 mt-4">
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No agents found matching your filters.</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4 mt-2">
                  <div className="flex items-center">
                    {agent.avatar_url ? (
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={agent.avatar_url} alt={`Avatar for ${agent.name || agent.id}`} />
                        <AvatarFallback>
                          <User className="h-6 w-6 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <User className="mr-2 text-gray-500" size={18} />
                    )}
                    <span className="font-semibold text-gray-700">
                      {agent.name || formatUserId(agent.id)}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <FileAudio className="mr-1 text-blue-500" size={18} />
                    {agent.has_audio ? (
                      <CheckCircle className="text-green-500" size={18} />
                    ) : (
                      <XCircle className="text-red-500" size={18} />
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  <p>{agent.country} {agent.city ? `· ${agent.city}` : ''}</p>
                  {agent.computer_skill_level && (
                    <p className="mt-1">Skill level: {agent.computer_skill_level}</p>
                  )}
                </div>
                
                <div className="flex justify-between mt-4">
                  {isBusinessAccount && (
                    <Button 
                      variant={agent.is_favorite ? "default" : "outline"} 
                      size="sm"
                      onClick={() => toggleFavorite(agent.id, !!agent.is_favorite)}
                      className="text-sm"
                    >
                      <Star className={`mr-1 h-4 w-4 ${agent.is_favorite ? 'fill-white' : ''}`} />
                      {agent.is_favorite ? 'Favorited' : 'Add to Team'}
                    </Button>
                  )}
                  
                  {!isBusinessAccount && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={true}
                      className="text-sm invisible" // Hidden for non-business users
                    >
                      View Details
                    </Button>
                  )}
                  
                  <Button 
                    variant={agent.has_audio ? "default" : "outline"}
                    size="sm"
                    disabled={!agent.has_audio}
                    onClick={() => agent.has_audio && agent.audio_url && openAudioModal(agent)}
                    className={`text-sm ${agent.has_audio ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  >
                    <Volume2 className="mr-1 h-4 w-4" />
                    Listen
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Audio Player Modal */}
      <Dialog open={showAudioModal} onOpenChange={setShowAudioModal}>
        <DialogContent onCloseAutoFocus={closeAudioModal} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agent Audio Sample</DialogTitle>
            <DialogDescription>
              Listen to this agent's audio sample
            </DialogDescription>
          </DialogHeader>
          
          {currentAgent && (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center mb-4">
                {currentAgent.avatar_url ? (
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={currentAgent.avatar_url} alt={`Avatar for ${currentAgent.name || currentAgent.id}`} />
                    <AvatarFallback>
                      <User className="h-10 w-10 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-16 w-16 text-gray-400" />
                )}
              </div>
              
              <div className="w-full rounded-md bg-gray-100 p-6">
                <div className="mb-2 text-sm text-gray-500">
                  Agent: {currentAgent.name || formatUserId(currentAgent.id)}
                </div>
                <div className="mb-4 text-sm text-gray-500">
                  {currentAgent.country} {currentAgent.city ? `· ${currentAgent.city}` : ''}
                </div>
                
                <div className="flex justify-center">
                  <Button
                    onClick={() => currentAgent.audio_url && toggleAudio(currentAgent.audio_url)}
                    size="lg"
                    className="mx-auto bg-blue-600 hover:bg-blue-700"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="mr-2 h-5 w-5" />
                        Pause Audio
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        Play Audio
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {isBusinessAccount && !currentAgent.is_favorite && (
                <Button 
                  onClick={() => toggleFavorite(currentAgent.id, !!currentAgent.is_favorite)}
                  variant="outline"
                  className="w-full"
                >
                  <Star className="mr-2 h-4 w-4" />
                  Add to Team
                </Button>
              )}
              
              {isBusinessAccount && currentAgent.is_favorite && (
                <Button 
                  onClick={() => toggleFavorite(currentAgent.id, !!currentAgent.is_favorite)}
                  variant="default"
                  className="w-full"
                >
                  <Star className="mr-2 h-4 w-4 fill-white" />
                  Remove from Team
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentPreview;
