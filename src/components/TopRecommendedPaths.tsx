
import React, { useState } from 'react';
import LocationBasedRecommendedPaths from './LocationBasedRecommendedPaths';
import DistanceSelector from './DistanceSelector';
import { useLocation } from '@/hooks/useLocation';

interface TopRecommendedPathsProps {
  title?: string;
}

const TopRecommendedPaths = ({ title = "추천 산책로 TOP 3" }: TopRecommendedPathsProps) => {
  const [selectedDistance, setSelectedDistance] = useState(5);
  const { latitude, longitude, isLoading: locationLoading, error: locationError } = useLocation();

  if (locationLoading) {
    return (
      <div>
        <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          🚶‍♂️ {title}
        </h4>
        <div className="text-sm text-gray-500">위치 정보를 가져오는 중...</div>
      </div>
    );
  }

  if (locationError || !latitude || !longitude) {
    return (
      <div>
        <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          🚶‍♂️ {title}
        </h4>
        <div className="text-sm text-red-500">
          위치 정보를 가져올 수 없습니다. {locationError}
        </div>
      </div>
    );
  }

  return (
    <div>
      <DistanceSelector 
        selectedDistance={selectedDistance}
        onDistanceChange={setSelectedDistance}
      />
      
      <LocationBasedRecommendedPaths
        userLatitude={latitude}
        userLongitude={longitude}
        maxDistance={selectedDistance}
        title={title}
      />
    </div>
  );
};

export default TopRecommendedPaths;
