
export type ProfessionalDetailsData = {
  languages: string[];
  specialized_skills: string[];
  additional_skills: string[];
  years_experience: string;
  availability: string[];
  computer_skill_level: string;
};

export interface ProfessionalDetailsFormProps {
  userId: string;
}
