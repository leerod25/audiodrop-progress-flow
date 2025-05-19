
import React from 'react';
import { FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

export interface SkillsSectionProps {
  specializedSkills: string[];
  additionalSkills: string[];
  onSpecializedSkillsChange: (skills: string[]) => void;
  onAdditionalSkillsChange: (skills: string[]) => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
  specializedSkills,
  additionalSkills,
  onSpecializedSkillsChange,
  onAdditionalSkillsChange
}) => {
  const [newSpecializedSkill, setNewSpecializedSkill] = React.useState('');
  const [newAdditionalSkill, setNewAdditionalSkill] = React.useState('');

  const addSpecializedSkill = () => {
    if (newSpecializedSkill.trim() && !specializedSkills.includes(newSpecializedSkill.trim())) {
      onSpecializedSkillsChange([...specializedSkills, newSpecializedSkill.trim()]);
      setNewSpecializedSkill('');
    }
  };

  const addAdditionalSkill = () => {
    if (newAdditionalSkill.trim() && !additionalSkills.includes(newAdditionalSkill.trim())) {
      onAdditionalSkillsChange([...additionalSkills, newAdditionalSkill.trim()]);
      setNewAdditionalSkill('');
    }
  };

  const removeSpecializedSkill = (skill: string) => {
    onSpecializedSkillsChange(specializedSkills.filter(s => s !== skill));
  };

  const removeAdditionalSkill = (skill: string) => {
    onAdditionalSkillsChange(additionalSkills.filter(s => s !== skill));
  };

  const handleSpecializedKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSpecializedSkill();
    }
  };

  const handleAdditionalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAdditionalSkill();
    }
  };

  return (
    <FormField
      name="skills"
      render={() => (
        <FormItem className="space-y-4">
          <div>
            <FormLabel>Specialized Skills</FormLabel>
            <div className="flex gap-2 mt-1">
              <Input
                value={newSpecializedSkill}
                onChange={(e) => setNewSpecializedSkill(e.target.value)}
                onKeyDown={handleSpecializedKeyDown}
                placeholder="Add a specialized skill"
                className="flex-1"
              />
              <Button type="button" onClick={addSpecializedSkill} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {specializedSkills.length === 0 && (
                <FormDescription>Add your core professional skills</FormDescription>
              )}
              {specializedSkills.map((skill) => (
                <Badge 
                  key={skill} 
                  className="flex items-center gap-1 px-3 py-1.5"
                >
                  {skill}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeSpecializedSkill(skill)} 
                  />
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <FormLabel>Additional Skills</FormLabel>
            <div className="flex gap-2 mt-1">
              <Input
                value={newAdditionalSkill}
                onChange={(e) => setNewAdditionalSkill(e.target.value)}
                onKeyDown={handleAdditionalKeyDown}
                placeholder="Add additional skill"
                className="flex-1"
              />
              <Button type="button" onClick={addAdditionalSkill} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {additionalSkills.length === 0 && (
                <FormDescription>Add supplementary skills</FormDescription>
              )}
              {additionalSkills.map((skill) => (
                <Badge 
                  key={skill} 
                  variant="outline"
                  className="flex items-center gap-1 px-3 py-1.5"
                >
                  {skill}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeAdditionalSkill(skill)} 
                  />
                </Badge>
              ))}
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};

export default SkillsSection;
