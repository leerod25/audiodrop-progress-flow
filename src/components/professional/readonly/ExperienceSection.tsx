
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExperienceSectionProps {
  experience: string;
}

const ExperienceSection = ({ experience }: ExperienceSectionProps) => {
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

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Years of Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{experience ? formatYearsExperience(experience) : 'Not specified'}</p>
      </CardContent>
    </Card>
  );
};

export default ExperienceSection;
