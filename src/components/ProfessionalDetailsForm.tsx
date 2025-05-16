
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
import { Languages, Briefcase, Calendar, DollarSign, Clock } from "lucide-react";

type ProfessionalDetailsData = {
  languages: string[];
  specialized_skills: string[];
  additional_skills: string[];
  years_experience: string;
  availability: string[];
  salary_expectation: number | null;
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
      const { error } = await supabase
        .from('professional_details')
        .upsert({
          user_id: userId,
          languages: formData.languages,
          specialized_skills: formData.specialized_skills,
          additional_skills: formData.additional_skills,
          years_experience: formData.years_experience,
          availability: formData.availability,
          salary_expectation: formData.salary_expectation,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

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
