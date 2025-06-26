
import { useState, useEffect, useCallback } from 'react';
import { UserProfile, UserLocation, WalkingPath, UseAIRecommendedPathsProps } from '@/types/walkingPath';
import { getLocationArea } from '@/utils/locationAreaDetector';
import { generateLocationBasedPaths } from '@/utils/pathDataGenerator';

export const useAIRecommendedPaths = ({ userProfile, userLocation }: UseAIRecommendedPathsProps) => {
  const [recommendedPaths, setRecommendedPaths] = useState<WalkingPath[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // AI 추천 경로 생성 함수 - useCallback으로 최적화하고 의존성 배열 명확히 정의
  const generateRecommendations = useCallback(async () => {
    console.log('=== AI 추천 경로 생성 시작 ===', { 
      userLocation, 
      userProfile,
      timestamp: new Date().toISOString()
    });
    
    setIsLoading(true);
    
    // 실제 환경에서는 AI API를 호출하겠지만, 여기서는 위치 기반 가상 데이터 생성
    await new Promise(resolve => setTimeout(resolve, 1500));

    const locationArea = getLocationArea(userLocation);
    const paths = generateLocationBasedPaths(userProfile, locationArea, userLocation);
    
    console.log('=== AI 추천 경로 생성 완료 ===', {
      location: userLocation,
      area: locationArea,
      pathCount: paths.length,
      pathNames: paths.map(p => p.name),
      timestamp: new Date().toISOString()
    });
    
    setRecommendedPaths(paths);
    setIsLoading(false);
  }, [
    userProfile.age,
    userProfile.fitnessLevel,
    userProfile.preferredDistance[0],
    userProfile.healthConditions,
    userProfile.walkingGoal,
    userLocation?.latitude,
    userLocation?.longitude,
    userLocation?.address
  ]);

  // 위치 또는 프로필 변경 시 자동으로 재생성 - 정확한 의존성으로 무한 루프 방지
  useEffect(() => {
    console.log('=== useAIRecommendedPaths useEffect 트리거 ===', { 
      hasProfile: !!userProfile, 
      hasLocation: !!userLocation,
      latitude: userLocation?.latitude,
      longitude: userLocation?.longitude,
      address: userLocation?.address,
      timestamp: new Date().toISOString()
    });
    
    if (userProfile) {
      generateRecommendations();
    }
  }, [generateRecommendations]);

  return {
    recommendedPaths,
    isLoading,
    generateRecommendations
  };
};
