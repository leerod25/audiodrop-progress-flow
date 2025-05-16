
import { Agent } from '@/types/agent';

export function extractFilterData(agents: Agent[]) {
  // Extract unique values for filter dropdowns
  const uniqueCountries = Array.from(
    new Set(
      agents
        .map(agent => agent.country)
        .filter(Boolean) as string[]
    )
  ).sort();
  
  const uniqueCities = Array.from(
    new Set(
      agents
        .map(agent => agent.city)
        .filter(Boolean) as string[]
    )
  ).sort();
  
  const uniqueSkillLevels = Array.from(
    new Set(
      agents
        .map(agent => agent.computer_skill_level)
        .filter(Boolean) as string[]
    )
  ).sort();

  return {
    countries: uniqueCountries,
    cities: uniqueCities,
    skillLevels: uniqueSkillLevels
  };
}
