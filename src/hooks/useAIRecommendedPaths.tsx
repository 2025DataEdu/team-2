
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealWalkingPath, RealWalkingPathWithDistance, UseAIRecommendedPathsProps } from '@/types/walkingPath';
import { calculateDistance } from '@/utils/distanceCalculation';
import { convertToWalkingPath } from '@/utils/pathConverter';

export const useAIRecommendedPaths = ({ userProfile, userLocation }: UseAIRecommendedPathsProps) => {
  const [recommendedPaths, setRecommendedPaths] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateRecommendations = useCallback(async () => {
    console.log('=== generateRecommendations 함수 실행됨 ===');
    console.log('사용자 위치:', userLocation);
    console.log('사용자 프로필:', userProfile);
    
    setIsLoading(true);
    
    try {
      // 내주변산책로 테이블에서 데이터 가져오기
      const { data: allPaths, error } = await supabase
        .from('내주변산책로')
        .select('*')
        .not('Latitude', 'is', null)
        .not('Longitude', 'is', null)
        .limit(100);

      if (error) {
        console.error('Error fetching paths:', error);
        setIsLoading(false);
        return;
      }

      if (!allPaths || allPaths.length === 0) {
        console.log('산책로 데이터가 없습니다.');
        setRecommendedPaths([]);
        setIsLoading(false);
        return;
      }

      console.log('가져온 전체 산책로 수:', allPaths.length);

      // 사용자 위치가 있다면 거리 계산하여 필터링
      let filteredPaths: RealWalkingPathWithDistance[] = [];
      if (userLocation && userLocation.latitude && userLocation.longitude) {
        console.log('사용자 위치 기반 필터링 시작:', {
          lat: userLocation.latitude,
          lng: userLocation.longitude,
          address: userLocation.address
        });
        
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
            calculatedDistance: Number(distance.toFixed(2))
          } as RealWalkingPathWithDistance;
        }).filter((path): path is RealWalkingPathWithDistance => 
          path !== null && path.calculatedDistance <= 15
        ).sort((a, b) => a.calculatedDistance - b.calculatedDistance);

        console.log('거리순 정렬된 경로 수:', filteredPaths.length);
        console.log('가장 가까운 3개 경로:', filteredPaths.slice(0, 3).map(p => ({
          name: p.CoursName,
          distance: p.calculatedDistance
        })));
      } else {
        console.log('사용자 위치 정보가 없어 기본 경로 사용');
        // 위치 정보가 없으면 기본적으로 처음 몇 개만 사용
        filteredPaths = allPaths.slice(0, 10).map(path => ({
          ...path,
          calculatedDistance: 0
        })) as RealWalkingPathWithDistance[];
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

      console.log('프로필 필터링 후 경로 수:', userPreferredPaths.length);

      // 다양성을 위해 거리별로 분산 선택
      const selectedPaths: RealWalkingPathWithDistance[] = [];
      const nearPaths = userPreferredPaths.filter(p => p.calculatedDistance <= 5);
      const mediumPaths = userPreferredPaths.filter(p => p.calculatedDistance > 5 && p.calculatedDistance <= 10);
      const farPaths = userPreferredPaths.filter(p => p.calculatedDistance > 10);
      
      console.log('거리별 분류:', {
        near: nearPaths.length,
        medium: mediumPaths.length,
        far: farPaths.length
      });
      
      // 가까운 곳에서 1개, 중간 거리에서 1개, 먼 거리에서 1개 선택
      if (nearPaths.length > 0) selectedPaths.push(nearPaths[0]);
      if (mediumPaths.length > 0) selectedPaths.push(mediumPaths[0]);
      if (farPaths.length > 0) selectedPaths.push(farPaths[0]);
      
      // 3개가 안 되면 나머지로 채우기
      while (selectedPaths.length < 3 && selectedPaths.length < userPreferredPaths.length) {
        const remaining = userPreferredPaths.filter(path => 
          !selectedPaths.some(selected => selected.CoursCode === path.CoursCode)
        );
        if (remaining.length > 0) {
          selectedPaths.push(remaining[0]);
        } else {
          break;
        }
      }

      console.log('최종 선택된 경로 수:', selectedPaths.length);

      // 변환하여 최종 추천 경로 생성
      const convertedPaths = selectedPaths.map((path, index) => 
        convertToWalkingPath(path, userProfile, index)
      );

      console.log('=== 새로운 추천 경로 생성 완료 ===');
      console.log('추천 경로 세부사항:', convertedPaths.map(p => ({ 
        name: p.name, 
        distance: p.distance,
        location: userLocation ? `${userLocation.address}` : '위치정보없음'
      })));
      
      setRecommendedPaths(convertedPaths);
    } catch (error) {
      console.error('Error in generateRecommendations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userProfile, userLocation?.latitude, userLocation?.longitude, userLocation?.address]);

  // 위치 정보 변경시 새로운 추천 생성
  useEffect(() => {
    console.log('=== useAIRecommendedPaths: 위치 정보 변경 감지 ===');
    console.log('현재 위치:', {
      latitude: userLocation?.latitude,
      longitude: userLocation?.longitude,
      address: userLocation?.address
    });
    
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      console.log('유효한 위치 정보로 새로운 추천 생성 시작');
      generateRecommendations();
    } else {
      console.log('위치 정보가 유효하지 않아 추천 생성하지 않음');
    }
  }, [userLocation?.latitude, userLocation?.longitude, userLocation?.address, generateRecommendations]);

  return {
    recommendedPaths,
    isLoading,
    generateRecommendations
  };
};
