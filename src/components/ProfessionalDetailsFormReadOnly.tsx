
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Languages, Briefcase, Calendar, DollarSign, Clock, Computer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProfessionalDetailsData = {
  languages: string[];
  specialized_skills: string[];
  additional_skills: string[];
  years_experience: string;
  availability: string[];
  salary_expectation: number | null;
  computer_skill_level: string;
};

interface ProfessionalDetailsFormReadOnlyProps {
  userId: string;
}

const ProfessionalDetailsFormReadOnly = ({ userId }: ProfessionalDetailsFormReadOnlyProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProfessionalDetailsData>({
    languages: [],
    specialized_skills: [],
    additional_skills: [],
    years_experience: '',
    availability: [],
    salary_expectation: null,
    computer_skill_level: '',
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
        }

        if (data) {
          const formattedData = {
            languages: data.languages || [],
            specialized_skills: data.specialized_skills || [],
            additional_skills: data.additional_skills || [],
            years_experience: data.years_experience || '',
            availability: data.availability || [],
            salary_expectation: data.salary_expectation || null,
            computer_skill_level: data.computer_skill_level || '',
          };
          
          setData(formattedData);
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfessionalDetails();
    }
  }, [userId]);

  // Format year experience for display
  const formatYearsExperience = (yearsExp: string) => {
    switch(yearsExp) {
      case 'less_than_1_year': return 'Less than 1 year';
      case '1_3_years': return '1-3 years';
      case '3_5_years': return '3-5 years';
      case '5_10_years': return '5-10 years';
      case 'more_than_10_years': return 'More than 10 years';
      default: return 'Not specified';
    }
  };

  // Format computer skill level for display
  const formatSkillLevel = (skillLevel: string) => {
    switch(skillLevel) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      case 'expert': return 'Expert';
      default: return 'Not specified';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2">
      {/* Language Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Languages
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.languages && data.languages.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.languages.map(lang => (
                <Badge key={lang} variant="secondary">{lang}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No languages specified</p>
          )}
        </CardContent>
      </Card>

      {/* Experience Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Years of Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{data.years_experience ? formatYearsExperience(data.years_experience) : 'Not specified'}</p>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Specialized Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.specialized_skills && data.specialized_skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.specialized_skills.map(skill => (
                <Badge key={skill} variant="outline">{skill}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No specialized skills specified</p>
          )}
        </CardContent>
      </Card>

      {/* Additional Skills Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Additional Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.additional_skills && data.additional_skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.additional_skills.map(skill => (
                <Badge key={skill} variant="outline">{skill}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No additional skills specified</p>
          )}
        </CardContent>
      </Card>

      {/* Computer Skills Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Computer className="h-5 w-5" />
            Computer Skills Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{data.computer_skill_level ? formatSkillLevel(data.computer_skill_level) : 'Not specified'}</p>
        </CardContent>
      </Card>

      {/* Availability Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.availability && data.availability.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.availability.map(time => (
                <Badge key={time} variant="secondary">{time}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No availability specified</p>
          )}
        </CardContent>
      </Card>

      {/* Salary Expectation Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Salary Expectation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.salary_expectation ? (
            <p className="font-medium">${data.salary_expectation} USD per month</p>
          ) : (
            <p className="text-sm text-gray-500">Not specified</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalDetailsFormReadOnly;
