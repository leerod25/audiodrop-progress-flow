
import React from 'react';
import { FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export interface LanguagesSectionProps {
  languages: string[];
  onLanguagesChange: (languages: string[]) => void;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({ 
  languages, 
  onLanguagesChange 
}) => {
  const [newLanguage, setNewLanguage] = React.useState('');

  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      onLanguagesChange([...languages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    onLanguagesChange(languages.filter(lang => lang !== language));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLanguage();
    }
  };

  return (
    <FormField
      name="languages"
      render={() => (
        <FormItem className="space-y-1">
          <FormLabel>Languages</FormLabel>
          <div className="flex gap-2">
            <Input
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a language"
              className="flex-1"
            />
            <Button type="button" onClick={addLanguage} size="sm">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {languages.length === 0 && (
              <FormDescription>Add languages you speak fluently</FormDescription>
            )}
            {languages.map((language) => (
              <Badge 
                key={language} 
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1.5"
              >
                {language}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeLanguage(language)} 
                />
              </Badge>
            ))}
          </div>
        </FormItem>
      )}
    />
  );
};

export default LanguagesSection;
