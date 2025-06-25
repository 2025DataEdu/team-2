
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DistanceSelectorProps {
  selectedDistance: number;
  onDistanceChange: (distance: number) => void;
  distances?: number[];
}

const DistanceSelector = ({ 
  selectedDistance, 
  onDistanceChange, 
  distances = [1, 3, 5, 10, 15] 
}: DistanceSelectorProps) => {
  return (
    <div className="mb-4">
      <div className="text-sm font-medium text-gray-700 mb-2">검색 반경</div>
      <div className="flex gap-2 flex-wrap">
        {distances.map((distance) => (
          <Badge
            key={distance}
            variant={selectedDistance === distance ? "default" : "outline"}
            className={`cursor-pointer transition-colors ${
              selectedDistance === distance 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'hover:bg-gray-100'
            }`}
            onClick={() => onDistanceChange(distance)}
          >
            {distance}km
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default DistanceSelector;
