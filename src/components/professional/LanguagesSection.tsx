
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Languages } from "lucide-react";

interface LanguagesSectionProps {
  languages: string[];
  onChange: (languages: string[]) => void;
}

const LanguagesSection = ({ languages, onChange }: LanguagesSectionProps) => {
  const handleCheckboxChange = (language: string, checked: boolean) => {
    const newLanguages = checked 
      ? [...languages, language] 
      : languages.filter(lang => lang !== language);
    onChange(newLanguages);
  };

  const languageOptions = [
    'English', 'Spanish', 'French', 'Mandarin', 'German', 'Portuguese'
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Languages className="h-4 w-4 text-muted-foreground" />
        <Label className="text-lg font-medium">Languages</Label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {languageOptions.map(language => (
          <div key={language} className="flex items-center space-x-2">
            <Checkbox 
              id={language.toLowerCase()} 
              checked={languages.includes(language)} 
              onCheckedChange={(checked) => handleCheckboxChange(language, !!checked)}
            />
            <Label htmlFor={language.toLowerCase()}>{language}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguagesSection;
