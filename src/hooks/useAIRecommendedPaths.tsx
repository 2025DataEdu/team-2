
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealWalkingPath, UseAIRecommendedPathsProps } from '@/types/walkingPath';
import { calculateDistance } from '@/utils/distanceCalculation';
import { convertToWalkingPath } from '@/utils/pathConverter';

export const useAIRecommendedPaths = ({ userProfile, userLocation }: UseAIRecommendedPathsProps) => {
  const [recommendedPaths, setRecommendedPaths] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateRecommendations = useCallback(async () => {
    console.log('generateRecommendations 함수 실행됨, 위치:', userLocation);
    setIsLoading(true);
    
    try {
      // 내주변산책로 테이블에서 데이터 가져오기
      const { data: allPaths, error } = await supabase
        .from('내주변산책로')
        .select('*')
        .not('Latitude', 'is', null)
        .not('Longitude', 'is', null)
        .limit(50);

      if (error) {
        console.error('Error fetching paths:', error);
        setIsLoading(false);
        return;
      }

      if (!allPaths || allPaths.length === 0) {
        setRecommendedPaths([]);
        setIsLoading(false);
        return;
      }

      // 사용자 위치가 있다면 거리 계산하여 필터링
      let filteredPaths = allPaths;
      if (userLocation) {
        filteredPaths = allPaths.map(path => {
          if (!path.Latitude || !path.Longitude) return null;
          
          const distance = calculateDistance(
            userLocation.latitude, 
            userLocation.longitude, 
            path.Latitude, 
            path.Longitude
          );

          return {
            ...path,
            distance: Number(distance.toFixed(2))
          };
        }).filter((path): path is RealWalkingPath & { distance: number } => 
          path !== null && path.distance <= 10 // 10km 이내
        ).sort((a, b) => a.distance - b.distance);
      }

      // 사용자 프로필에 따른 필터링
      const userPreferredPaths = filteredPaths.filter(path => {
        // 건강 상태 고려
        if (userProfile.healthConditions.includes('무릎') && path.CoursLv?.includes('어려움')) {
          return false;
        }
        
        // 체력 수준 고려
        if (userProfile.fitnessLevel === 'beginner' && path.CoursLv?.includes('어려움')) {
          return false;
        }
        
        return true;
      });

      // 상위 3개만 선택하여 변환
      const selectedPaths = userPreferredPaths.slice(0, 3).map((path, index) => 
        convertToWalkingPath(path, userProfile, index)
      );

      console.log('새로운 추천 경로 생성됨:', selectedPaths.length, '개');
      setRecommendedPaths(selectedPaths);
    } catch (error) {
      console.error('Error in generateRecommendations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userProfile, userLocation]);

  // 초기 로드 시에만 실행
  useEffect(() => {
    console.log('useAIRecommendedPaths 초기 로드');
    generateRecommendations();
  }, [generateRecommendations]);

  return {
    recommendedPaths,
    isLoading,
    generateRecommendations
  };
};
