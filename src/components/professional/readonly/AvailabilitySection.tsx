
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AvailabilitySectionProps {
  availability: string[];
}

const AvailabilitySection = ({ availability }: AvailabilitySectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Availability
        </CardTitle>
      </CardHeader>
      <CardContent>
        {availability && availability.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {availability.map(time => (
              <Badge key={time} variant="secondary">{time}</Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No availability specified</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailabilitySection;
