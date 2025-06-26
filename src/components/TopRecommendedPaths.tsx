
import React, { useEffect, useState } from 'react';
import LocationBasedRecommendedPaths from './LocationBasedRecommendedPaths';
import { useLocation } from '@/hooks/useLocation';

interface TopRecommendedPathsProps {
  title?: string;
}

const TopRecommendedPaths = ({ title = "내 주변 추천 산책로 TOP 3" }: TopRecommendedPathsProps) => {
  const { latitude, longitude, isLoading: locationLoading, error: locationError } = useLocation();
  const [key, setKey] = useState(0);

  // 위치가 변경될 때마다 컴포넌트 재렌더링 강제
  useEffect(() => {
    if (!locationLoading && latitude && longitude) {
      console.log('TOP 3 추천 - 위치 변경 감지:', { latitude, longitude });
      setKey(prev => prev + 1);
    }
  }, [latitude, longitude, locationLoading]);

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
        key={key}
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
