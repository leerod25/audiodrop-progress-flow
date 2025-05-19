
import { Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SkillsSectionProps {
  specializedSkills: string[];
  additionalSkills: string[];
}

const SkillsSection = ({ specializedSkills, additionalSkills }: SkillsSectionProps) => {
  return (
    <>
      {/* Specialized Skills Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Call Center Specialized Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          {specializedSkills && specializedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {specializedSkills.map(skill => (
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
            Additional Call Center Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          {additionalSkills && additionalSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {additionalSkills.map(skill => (
                <Badge key={skill} variant="outline">{skill}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No additional skills specified</p>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default SkillsSection;
