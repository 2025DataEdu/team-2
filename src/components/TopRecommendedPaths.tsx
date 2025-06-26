
import React from 'react';
import LocationBasedRecommendedPaths from './LocationBasedRecommendedPaths';
import { useLocation } from '@/hooks/useLocation';

interface TopRecommendedPathsProps {
  title?: string;
}

const TopRecommendedPaths = ({ title = "내 주변 추천 산책로 TOP 3" }: TopRecommendedPathsProps) => {
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
      <LocationBasedRecommendedPaths
        userLatitude={latitude}
        userLongitude={longitude}
        maxDistance={5}
        limit={3}
        title={title}
      />
    </div>
  );
};

export default TopRecommendedPaths;
