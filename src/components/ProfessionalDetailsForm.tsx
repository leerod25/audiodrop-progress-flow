
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Languages, Briefcase, Calendar, DollarSign, Clock, Computer } from "lucide-react";

type ProfessionalDetailsData = {
  languages: string[];
  specialized_skills: string[];
  additional_skills: string[];
  years_experience: string;
  availability: string[];
  salary_expectation: number | null;
  computer_skill_level: string;
};

interface ProfessionalDetailsFormProps {
  userId: string;
}

const ProfessionalDetailsForm = ({ userId }: ProfessionalDetailsFormProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProfessionalDetailsData>({
    languages: [],
    specialized_skills: [],
    additional_skills: [],
    years_experience: '',
    availability: [],
    salary_expectation: 500, // Set default to 500 USD
    computer_skill_level: '',
  });

  const form = useForm<ProfessionalDetailsData>({
    defaultValues: data,
  });

  useEffect(() => {
    const fetchProfessionalDetails = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('professional_details')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching professional details:", error);
          toast.error("Failed to load professional data.");
        }

        if (data) {
          const formattedData = {
            languages: data.languages || [],
            specialized_skills: data.specialized_skills || [],
            additional_skills: data.additional_skills || [],
            years_experience: data.years_experience || '',
            availability: data.availability || [],
            salary_expectation: data.salary_expectation || 500, // Default to 500 if null
            computer_skill_level: data.computer_skill_level || '',
          };
          
          setData(formattedData);
          form.reset(formattedData);
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfessionalDetails();
    }
  }, [userId, form]);

  const onSubmit = async (formData: ProfessionalDetailsData) => {
    setLoading(true);
    try {
      // First check if the user already has a professional details record
      const { data: existingData, error: checkError } = await supabase
        .from('professional_details')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking existing professional details:", checkError);
        toast.error("Failed to update professional details.");
        return;
      }
      
      let error;
      
      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('professional_details')
          .update({
            languages: formData.languages,
            specialized_skills: formData.specialized_skills,
            additional_skills: formData.additional_skills,
            years_experience: formData.years_experience,
            availability: formData.availability,
            salary_expectation: formData.salary_expectation,
            computer_skill_level: formData.computer_skill_level,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);
        
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('professional_details')
          .insert({
            user_id: userId,
            languages: formData.languages,
            specialized_skills: formData.specialized_skills,
            additional_skills: formData.additional_skills,
            years_experience: formData.years_experience,
            availability: formData.availability,
            salary_expectation: formData.salary_expectation,
            computer_skill_level: formData.computer_skill_level,
            updated_at: new Date().toISOString(),
          });
        
        error = insertError;
      }

      if (error) {
        console.error("Error updating professional details:", error);
        toast.error("Failed to update professional details.");
      } else {
        toast.success("Professional details updated successfully!");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <Label>Languages</Label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <Label>Specialized Skills</Label>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>

        <Skeleton className="h-10 w-[100px]" />
      </motion.div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <Label className="text-lg font-medium">Languages</Label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="english" 
                checked={data.languages.includes('English')} 
                onCheckedChange={(checked) => {
                  const newLanguages = checked 
                    ? [...data.languages, 'English'] 
                    : data.languages.filter(lang => lang !== 'English');
                  setData({...data, languages: newLanguages});
                }}
              />
              <Label htmlFor="english">English</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="spanish" 
                checked={data.languages.includes('Spanish')} 
                onCheckedChange={(checked) => {
                  const newLanguages = checked 
                    ? [...data.languages, 'Spanish'] 
                    : data.languages.filter(lang => lang !== 'Spanish');
                  setData({...data, languages: newLanguages});
                }}
              />
              <Label htmlFor="spanish">Spanish</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="french" 
                checked={data.languages.includes('French')} 
                onCheckedChange={(checked) => {
                  const newLanguages = checked 
                    ? [...data.languages, 'French'] 
                    : data.languages.filter(lang => lang !== 'French');
                  setData({...data, languages: newLanguages});
                }}
              />
              <Label htmlFor="french">French</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mandarin" 
                checked={data.languages.includes('Mandarin')} 
                onCheckedChange={(checked) => {
                  const newLanguages = checked 
                    ? [...data.languages, 'Mandarin'] 
                    : data.languages.filter(lang => lang !== 'Mandarin');
                  setData({...data, languages: newLanguages});
                }}
              />
              <Label htmlFor="mandarin">Mandarin</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="german" 
                checked={data.languages.includes('German')} 
                onCheckedChange={(checked) => {
                  const newLanguages = checked 
                    ? [...data.languages, 'German'] 
                    : data.languages.filter(lang => lang !== 'German');
                  setData({...data, languages: newLanguages});
                }}
              />
              <Label htmlFor="german">German</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="portuguese" 
                checked={data.languages.includes('Portuguese')} 
                onCheckedChange={(checked) => {
                  const newLanguages = checked 
                    ? [...data.languages, 'Portuguese'] 
                    : data.languages.filter(lang => lang !== 'Portuguese');
                  setData({...data, languages: newLanguages});
                }}
              />
              <Label htmlFor="portuguese">Portuguese</Label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <Label className="text-lg font-medium">Specialized Skills</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="outbound-lead-gen" 
                checked={data.specialized_skills.includes('Outbound Lead Generation')} 
                onCheckedChange={(checked) => {
                  const newSkills = checked 
                    ? [...data.specialized_skills, 'Outbound Lead Generation'] 
                    : data.specialized_skills.filter(skill => skill !== 'Outbound Lead Generation');
                  setData({...data, specialized_skills: newSkills});
                }}
              />
              <Label htmlFor="outbound-lead-gen">Outbound Lead Generation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="appointment-setting" 
                checked={data.specialized_skills.includes('Appointment Setting')} 
                onCheckedChange={(checked) => {
                  const newSkills = checked 
                    ? [...data.specialized_skills, 'Appointment Setting'] 
                    : data.specialized_skills.filter(skill => skill !== 'Appointment Setting');
                  setData({...data, specialized_skills: newSkills});
                }}
              />
              <Label htmlFor="appointment-setting">Appointment Setting</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="virtual-assistant" 
                checked={data.specialized_skills.includes('Virtual Assistant')} 
                onCheckedChange={(checked) => {
                  const newSkills = checked 
                    ? [...data.specialized_skills, 'Virtual Assistant'] 
                    : data.specialized_skills.filter(skill => skill !== 'Virtual Assistant');
                  setData({...data, specialized_skills: newSkills});
                }}
              />
              <Label htmlFor="virtual-assistant">Virtual Assistant</Label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <Label className="text-lg font-medium">Additional Skills</Label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="customer-service" 
                checked={data.additional_skills.includes('Customer Service')} 
                onCheckedChange={(checked) => {
                  const newSkills = checked 
                    ? [...data.additional_skills, 'Customer Service'] 
                    : data.additional_skills.filter(skill => skill !== 'Customer Service');
                  setData({...data, additional_skills: newSkills});
                }}
              />
              <Label htmlFor="customer-service">Customer Service</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="technical-support" 
                checked={data.additional_skills.includes('Technical Support')} 
                onCheckedChange={(checked) => {
                  const newSkills = checked 
                    ? [...data.additional_skills, 'Technical Support'] 
                    : data.additional_skills.filter(skill => skill !== 'Technical Support');
                  setData({...data, additional_skills: newSkills});
                }}
              />
              <Label htmlFor="technical-support">Technical Support</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sales" 
                checked={data.additional_skills.includes('Sales')} 
                onCheckedChange={(checked) => {
                  const newSkills = checked 
                    ? [...data.additional_skills, 'Sales'] 
                    : data.additional_skills.filter(skill => skill !== 'Sales');
                  setData({...data, additional_skills: newSkills});
                }}
              />
              <Label htmlFor="sales">Sales</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="collections" 
                checked={data.additional_skills.includes('Collections')} 
                onCheckedChange={(checked) => {
                  const newSkills = checked 
                    ? [...data.additional_skills, 'Collections'] 
                    : data.additional_skills.filter(skill => skill !== 'Collections');
                  setData({...data, additional_skills: newSkills});
                }}
              />
              <Label htmlFor="collections">Collections</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="healthcare" 
                checked={data.additional_skills.includes('Healthcare')} 
                onCheckedChange={(checked) => {
                  const newSkills = checked 
                    ? [...data.additional_skills, 'Healthcare'] 
                    : data.additional_skills.filter(skill => skill !== 'Healthcare');
                  setData({...data, additional_skills: newSkills});
                }}
              />
              <Label htmlFor="healthcare">Healthcare</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="multilingual" 
                checked={data.additional_skills.includes('Multilingual')} 
                onCheckedChange={(checked) => {
                  const newSkills = checked 
                    ? [...data.additional_skills, 'Multilingual'] 
                    : data.additional_skills.filter(skill => skill !== 'Multilingual');
                  setData({...data, additional_skills: newSkills});
                }}
              />
              <Label htmlFor="multilingual">Multilingual</Label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Label className="text-lg font-medium">Years of Experience</Label>
          </div>
          <RadioGroup 
            value={data.years_experience} 
            onValueChange={(value) => setData({...data, years_experience: value})}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="less_than_1_year" id="less_than_1_year" />
              <Label htmlFor="less_than_1_year">Less than 1 year</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1_3_years" id="1_3_years" />
              <Label htmlFor="1_3_years">1-3 years</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3_5_years" id="3_5_years" />
              <Label htmlFor="3_5_years">3-5 years</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5_10_years" id="5_10_years" />
              <Label htmlFor="5_10_years">5-10 years</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="more_than_10_years" id="more_than_10_years" />
              <Label htmlFor="more_than_10_years">More than 10 years</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Computer className="h-4 w-4 text-muted-foreground" />
            <Label className="text-lg font-medium">Computer Skills</Label>
          </div>
          <RadioGroup 
            value={data.computer_skill_level} 
            onValueChange={(value) => setData({...data, computer_skill_level: value})}
            className="space-y-4"
          >
            <div className="flex items-start space-x-3 p-3 border rounded-md hover:bg-slate-50">
              <RadioGroupItem value="beginner" id="beginner_level" className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor="beginner_level" className="font-medium">Beginner</Label>
                <p className="text-sm text-muted-foreground">Can browse the internet, check emails, and use basic applications like word processors. Familiar with fundamental computer operations and simple file management.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 border rounded-md hover:bg-slate-50">
              <RadioGroupItem value="intermediate" id="intermediate_level" className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor="intermediate_level" className="font-medium">Intermediate</Label>
                <p className="text-sm text-muted-foreground">Comfortable with various software applications, spreadsheet manipulation, online collaboration tools, and basic troubleshooting. Can learn new applications quickly and adapt to different systems.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 border rounded-md hover:bg-slate-50">
              <RadioGroupItem value="advanced" id="advanced_level" className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor="advanced_level" className="font-medium">Advanced</Label>
                <p className="text-sm text-muted-foreground">Proficient with CRM systems, project management software, and advanced data analysis tools. Can quickly master complex applications, manage databases, and customize software settings for optimal performance.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 border rounded-md hover:bg-slate-50">
              <RadioGroupItem value="expert" id="expert_level" className="mt-1" />
              <div className="space-y-1">
                <Label htmlFor="expert_level" className="font-medium">Expert</Label>
                <p className="text-sm text-muted-foreground">Highly skilled with enterprise-level systems, specialized industry software, automation tools, and advanced data processing. Can develop macros, create workflows, integrate systems, and provide technical support to others.</p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Label className="text-lg font-medium">Availability</Label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="morning" 
                checked={data.availability.includes('Morning (6am-12pm)')} 
                onCheckedChange={(checked) => {
                  const newAvailability = checked 
                    ? [...data.availability, 'Morning (6am-12pm)'] 
                    : data.availability.filter(time => time !== 'Morning (6am-12pm)');
                  setData({...data, availability: newAvailability});
                }}
              />
              <Label htmlFor="morning">Morning (6am-12pm)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="afternoon" 
                checked={data.availability.includes('Afternoon (12pm-6pm)')} 
                onCheckedChange={(checked) => {
                  const newAvailability = checked 
                    ? [...data.availability, 'Afternoon (12pm-6pm)'] 
                    : data.availability.filter(time => time !== 'Afternoon (12pm-6pm)');
                  setData({...data, availability: newAvailability});
                }}
              />
              <Label htmlFor="afternoon">Afternoon (12pm-6pm)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="night" 
                checked={data.availability.includes('Night (6pm-12am)')} 
                onCheckedChange={(checked) => {
                  const newAvailability = checked 
                    ? [...data.availability, 'Night (6pm-12am)'] 
                    : data.availability.filter(time => time !== 'Night (6pm-12am)');
                  setData({...data, availability: newAvailability});
                }}
              />
              <Label htmlFor="night">Night (6pm-12am)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="weekends" 
                checked={data.availability.includes('Weekends')} 
                onCheckedChange={(checked) => {
                  const newAvailability = checked 
                    ? [...data.availability, 'Weekends'] 
                    : data.availability.filter(time => time !== 'Weekends');
                  setData({...data, availability: newAvailability});
                }}
              />
              <Label htmlFor="weekends">Weekends</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="part-time" 
                checked={data.availability.includes('Part-time')} 
                onCheckedChange={(checked) => {
                  const newAvailability = checked 
                    ? [...data.availability, 'Part-time'] 
                    : data.availability.filter(time => time !== 'Part-time');
                  setData({...data, availability: newAvailability});
                }}
              />
              <Label htmlFor="part-time">Part-time</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="full-time" 
                checked={data.availability.includes('Full-time')} 
                onCheckedChange={(checked) => {
                  const newAvailability = checked 
                    ? [...data.availability, 'Full-time'] 
                    : data.availability.filter(time => time !== 'Full-time');
                  setData({...data, availability: newAvailability});
                }}
              />
              <Label htmlFor="full-time">Full-time</Label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <Label className="text-lg font-medium">Desired Monthly Salary (USD)</Label>
          </div>
          <div className="max-w-xs">
            <Input
              type="number"
              id="salary_expectation"
              placeholder="e.g., 3000"
              value={data.salary_expectation || 500}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : 500; // Default to 500 if empty
                setData({ ...data, salary_expectation: value });
              }}
              className="w-full"
            />
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          Update Professional Details
        </Button>
      </form>
    </Form>
  );
};

export default ProfessionalDetailsForm;
