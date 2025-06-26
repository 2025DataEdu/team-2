
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealWalkingPath {
  CoursCode: string;
  CoursName: string | null;
  CoursDetailLength: number | null;
  CoursLength: string | null;
  CoursTime: string | null;
  CoursLv: string | null;
  Latitude: number | null;
  Longitude: number | null;
  ADIT_DC: string | null;
  Option: string | null;
  Toilet: string | null;
  SIGNGU_NM: string | null;
  CVNTL_NM: string | null;
  Address: string | null;
  CorusDetailName: string | null;
  CoursRoute: string | null;
}

// distance 속성이 추가된 타입 정의
interface RealWalkingPathWithDistance extends RealWalkingPath {
  distance: number;
}

interface UserProfile {
  age: number;
  fitnessLevel: string;
  preferredDistance: number[];
  healthConditions: string;
  walkingGoal: string;
}

interface UseAIRecommendedPathsProps {
  userProfile: UserProfile;
  userLocation?: { latitude: number; longitude: number; address: string };
}

// 두 지점 간의 거리를 계산하는 함수 (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // 지구의 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

export const useAIRecommendedPaths = ({ userProfile, userLocation }: UseAIRecommendedPathsProps) => {
  const [recommendedPaths, setRecommendedPaths] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateRecommendations = async () => {
    setIsLoading(true);
    
    try {
      console.log('🔍 위치 기반 AI 추천 생성 시작:', userLocation);
      
      // 내주변산책로 테이블에서 데이터 가져오기
      const { data: allPaths, error } = await supabase
        .from('내주변산책로')
        .select('*')
        .not('Latitude', 'is', null)
        .not('Longitude', 'is', null)
        .limit(100); // 더 많은 데이터로 확장

      if (error) {
        console.error('❌ 산책로 데이터 조회 오류:', error);
        setIsLoading(false);
        return;
      }

      if (!allPaths || allPaths.length === 0) {
        console.log('⚠️ 조회된 산책로 데이터가 없음');
        setRecommendedPaths([]);
        setIsLoading(false);
        return;
      }

      console.log('📊 총 조회된 산책로 수:', allPaths.length);

      // 사용자 위치가 있다면 거리 계산하여 필터링
      let filteredPaths: RealWalkingPathWithDistance[] = [];
      if (userLocation) {
        console.log('📍 사용자 위치 정보:', userLocation);
        
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
          } as RealWalkingPathWithDistance;
        }).filter((path): path is RealWalkingPathWithDistance => 
          path !== null && path.distance <= 15 // 15km 이내로 확장
        ).sort((a, b) => a.distance - b.distance);

        console.log('🎯 위치 기반 필터링된 산책로 수:', filteredPaths.length);
        console.log('🚶‍♂️ 가장 가까운 3개 경로:', filteredPaths.slice(0, 3).map(p => ({
          name: p.CoursName,
          distance: p.distance,
          area: p.SIGNGU_NM
        })));
      } else {
        // 위치 정보가 없으면 기본 경로들을 사용 (distance 없이)
        filteredPaths = allPaths.slice(0, 20).map(path => ({
          ...path,
          distance: 0
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
        
        // 선호 거리 고려
        const pathDistance = path.CoursDetailLength || parseFloat(path.CoursLength || '0') || 0;
        const preferredMin = Math.min(...userProfile.preferredDistance);
        const preferredMax = Math.max(...userProfile.preferredDistance);
        
        if (pathDistance > 0 && (pathDistance < preferredMin * 0.5 || pathDistance > preferredMax * 2)) {
          return false;
        }
        
        return true;
      });

      console.log('👤 사용자 프로필 기반 필터링된 경로 수:', userPreferredPaths.length);

      // 상위 3개만 선택 (정확히 3개만)
      const selectedPaths = userPreferredPaths.slice(0, 3).map((path, index) => {
        // WalkingPath 인터페이스에 맞게 변환
        const convertedPath = {
          id: path.CoursCode,
          name: path.CoursName || path.CorusDetailName || '산책로',
          distance: path.CoursDetailLength || parseFloat(path.CoursLength || '0') || 2.5,
          duration: parseInt(path.CoursTime?.replace(/[^0-9]/g, '') || '0') || Math.round((path.CoursDetailLength || 2.5) * 15),
          difficulty: getDifficultyFromLevel(path.CoursLv) as 'easy' | 'medium' | 'hard',
          elevation: getElevationFromDifficulty(path.CoursLv),
          rating: 4.0 + Math.random() * 1.0, // 4.0-5.0 랜덤 평점
          features: getFeatures(path),
          description: path.ADIT_DC || `${path.SIGNGU_NM || '지역'}의 아름다운 산책로입니다.`,
          amenities: getAmenities(path),
          recommendationReason: getRecommendationReason(path, userProfile, index, userLocation),
          nearbyFood: getNearbyFood(index),
          realPath: true,
          originalData: path,
          locationDistance: userLocation ? path.distance : undefined
        };

        return convertedPath;
      });

      console.log('✅ 최종 AI 추천 경로 생성 완료:', selectedPaths.length, '개');
      setRecommendedPaths(selectedPaths);
    } catch (error) {
      console.error('❌ AI 추천 생성 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 헬퍼 함수들
  const getDifficultyFromLevel = (level: string | null): string => {
    if (!level) return 'easy';
    const levelLower = level.toLowerCase();
    if (levelLower.includes('쉬움') || levelLower.includes('초급')) return 'easy';
    if (levelLower.includes('보통') || levelLower.includes('중급')) return 'medium';
    if (levelLower.includes('어려움') || levelLower.includes('고급')) return 'hard';
    return 'easy';
  };

  const getElevationFromDifficulty = (level: string | null): number => {
    if (!level) return 0;
    const levelLower = level.toLowerCase();
    if (levelLower.includes('어려움') || levelLower.includes('고급')) return Math.floor(Math.random() * 50) + 30;
    if (levelLower.includes('보통') || levelLower.includes('중급')) return Math.floor(Math.random() * 30) + 10;
    return Math.floor(Math.random() * 15);
  };

  const getFeatures = (path: RealWalkingPathWithDistance): string[] => {
    const features = [];
    if (path.Option?.includes('화장실') || path.Toilet === 'Y') features.push('화장실');
    if (path.SIGNGU_NM) features.push('도시');
    if (path.CoursRoute?.includes('강') || path.CoursName?.includes('강')) features.push('강변');
    if (path.CoursRoute?.includes('산') || path.CoursName?.includes('산')) features.push('산길');
    if (path.CoursRoute?.includes('공원') || path.CoursName?.includes('공원')) features.push('공원');
    
    // 기본 특징 추가
    if (features.length < 2) {
      features.push('산책로', '자연');
    }
    
    return features.slice(0, 4);
  };

  const getAmenities = (path: RealWalkingPathWithDistance): string[] => {
    const amenities = [];
    if (path.Toilet === 'Y') amenities.push('화장실');
    if (path.Option?.includes('주차')) amenities.push('주차장');
    if (path.CVNTL_NM) amenities.push('편의시설');
    
    // 기본 편의시설 추가
    amenities.push('벤치', '안내판');
    
    return amenities.slice(0, 4);
  };

  const getRecommendationReason = (path: RealWalkingPathWithDistance, userProfile: UserProfile, index: number, userLocation?: { latitude: number; longitude: number; address: string }): string => {
    const reasons = [];
    
    // 위치 기반 추천 이유 추가
    if (userLocation && path.distance > 0) {
      reasons.push(`현재 위치에서 ${path.distance}km 거리에 위치한`);
    }
    
    if (userProfile.fitnessLevel === 'beginner') {
      reasons.push('초보자에게 적합한');
    } else if (userProfile.fitnessLevel === 'advanced') {
      reasons.push('숙련자에게 도전적인');
    } else {
      reasons.push('중급자에게 적당한');
    }
    
    if (userProfile.walkingGoal === 'health') {
      reasons.push('건강 증진에 효과적인');
    } else if (userProfile.walkingGoal === 'stress') {
      reasons.push('스트레스 해소에 좋은');
    } else if (userProfile.walkingGoal === 'weight') {
      reasons.push('체중 관리에 도움되는');
    } else {
      reasons.push('여가 활동에 적합한');
    }
    
    reasons.push(`${path.SIGNGU_NM || '지역'} 소재의 실제 등록된 산책로입니다.`);
    
    return reasons.join(' ');
  };

  const getNearbyFood = (index: number): string[] => {
    const foodOptions = [
      ['카페 드롭탑', '한식당 미락', '치킨집 굽네'],
      ['이탈리안 파스타', '돈까스 전문점', '분식 마당'],
      ['커피빈', '순두부찌개', '족발보쌈']
    ];
    return foodOptions[index % foodOptions.length];
  };

  // 위치 정보 변경 시 자동으로 추천 재생성
  useEffect(() => {
    console.log('🔄 위치 또는 프로필 변경 감지, 추천 재생성 중...');
    generateRecommendations();
  }, [
    userProfile.age,
    userProfile.fitnessLevel,
    userProfile.walkingGoal,
    userProfile.healthConditions,
    userLocation?.latitude,
    userLocation?.longitude,
    userLocation?.address
  ]);

  return {
    recommendedPaths,
    isLoading,
    generateRecommendations
  };
};
