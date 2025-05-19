
import { Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LanguagesSectionProps {
  languages: string[];
}

const LanguagesSection = ({ languages }: LanguagesSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Languages
        </CardTitle>
      </CardHeader>
      <CardContent>
        {languages && languages.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {languages.map(lang => (
              <Badge key={lang} variant="secondary">{lang}</Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No languages specified</p>
        )}
      </CardContent>
    </Card>
  );
};

export default LanguagesSection;
