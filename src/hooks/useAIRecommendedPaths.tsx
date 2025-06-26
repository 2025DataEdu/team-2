
import { useState, useEffect, useCallback } from 'react';

interface UserProfile {
  age: number;
  fitnessLevel: string;
  preferredDistance: number[];
  healthConditions: string;
  walkingGoal: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
  address: string;
}

interface WalkingPath {
  id: string;
  name: string;
  distance: number;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  elevation: number;
  rating: number;
  features: string[];
  description: string;
  amenities: string[];
  recommendationReason: string;
  nearbyFood: string[];
}

interface UseAIRecommendedPathsProps {
  userProfile: UserProfile;
  userLocation?: UserLocation;
}

export const useAIRecommendedPaths = ({ userProfile, userLocation }: UseAIRecommendedPathsProps) => {
  const [recommendedPaths, setRecommendedPaths] = useState<WalkingPath[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // AI 추천 경로 생성 함수
  const generateRecommendations = useCallback(async () => {
    console.log('AI 추천 경로 생성 시작:', { userLocation, userProfile });
    setIsLoading(true);
    
    // 실제 환경에서는 AI API를 호출하겠지만, 여기서는 위치 기반 가상 데이터 생성
    await new Promise(resolve => setTimeout(resolve, 1500));

    const locationArea = getLocationArea(userLocation);
    const paths = generateLocationBasedPaths(userProfile, locationArea, userLocation);
    
    console.log('AI 추천 경로 생성 완료:', {
      location: userLocation,
      area: locationArea,
      pathCount: paths.length,
      pathNames: paths.map(p => p.name)
    });
    
    setRecommendedPaths(paths);
    setIsLoading(false);
  }, [userProfile, userLocation?.latitude, userLocation?.longitude, userLocation?.address]);

  // 위치 정보를 기반으로 지역 판단
  const getLocationArea = (location?: UserLocation) => {
    if (!location) return 'default';
    
    const { latitude, longitude, address } = location;
    
    console.log('지역 판단 중:', { latitude, longitude, address });
    
    // 주소 기반 지역 판단
    if (address.includes('강남') || address.includes('Gangnam')) return 'gangnam';
    if (address.includes('홍대') || address.includes('Hongdae')) return 'hongdae';
    if (address.includes('명동') || address.includes('Myeongdong')) return 'myeongdong';
    if (address.includes('이태원') || address.includes('Itaewon')) return 'itaewon';
    if (address.includes('서초') || address.includes('Seocho')) return 'seocho';
    if (address.includes('마포') || address.includes('Mapo')) return 'mapo';
    if (address.includes('종로') || address.includes('Jongno')) return 'jongno';
    if (address.includes('유성') || address.includes('대전')) return 'daejeon';
    if (address.includes('부산')) return 'busan';
    if (address.includes('대구')) return 'daegu';
    if (address.includes('인천')) return 'incheon';
    
    // 좌표 기반 지역 판단
    if (latitude >= 36.0 && latitude <= 36.7 && longitude >= 127.0 && longitude <= 127.7) {
      return 'daejeon'; // 대전 좌표 범위
    }
    if (latitude >= 37.5 && latitude <= 37.6 && longitude >= 126.9 && longitude <= 127.1) {
      if (latitude > 37.55) return 'north_seoul';
      return 'south_seoul';
    }
    
    return 'default';
  };

  // 위치 기반 AI 추천 경로 생성
  const generateLocationBasedPaths = (profile: UserProfile, area: string, location?: UserLocation): WalkingPath[] => {
    const areaData: { [key: string]: any } = {
      gangnam: {
        prefix: '강남',
        features: ['도시 스카이라인', '쇼핑거리', '카페거리', '현대적 건물'],
        foods: ['강남 맛집거리', '압구정 카페', '청담 디저트', '역삼 치킨', '선릉 브런치']
      },
      hongdae: {
        prefix: '홍대',
        features: ['예술거리', '클럽가', '벽화거리', '젊음의 거리'],
        foods: ['홍대 치킨', '합정 카페', '상수 맛집', '연남 브런치', '홍익 디저트']
      },
      myeongdong: {
        prefix: '명동',
        features: ['쇼핑거리', '관광명소', '전통시장', '역사적 건물'],
        foods: ['명동 맛집', '을지로 카페', '중구 전통음식', '남대문 분식', '명동 디저트']
      },
      daejeon: {
        prefix: '대전',
        features: ['과학기술도시', '엑스포공원', '유성온천', '한밭수목원'],
        foods: ['대전 칼국수', '성심당 빵', '유성 갈비탕', '중앙시장 순대국', '둔산 카페']
      },
      busan: {
        prefix: '부산',
        features: ['해운대 해변', '감천문화마을', '자갈치시장', '태종대'],
        foods: ['부산 밀면', '동래파전', '해운대 회센터', '광안리 카페', '남포동 먹거리']
      },
      default: {
        prefix: location?.address?.split(' ')[0] || '서울',
        features: ['도시 풍경', '공원', '강변', '전통과 현대의 조화'],
        foods: ['동네 맛집', '지역 카페', '전통 디저트', '베이커리', '분식집']
      }
    };

    const currentArea = areaData[area] || areaData.default;
    const baseDistance = profile.preferredDistance[0] || 3;
    const timestamp = Date.now();
    const locationInfo = location?.address || currentArea.prefix;

    console.log('경로 생성 중:', { area, currentArea, locationInfo });

    return [
      {
        id: `ai-${area}-1-${timestamp}`,
        name: `${currentArea.prefix} 힐링 산책로`,
        distance: baseDistance,
        duration: Math.round(baseDistance * 15),
        difficulty: profile.fitnessLevel === 'beginner' ? 'easy' : profile.fitnessLevel === 'advanced' ? 'hard' : 'medium',
        elevation: 15,
        rating: 4.6,
        features: currentArea.features.slice(0, 3),
        description: `${locationInfo} 지역의 특색을 살린 맞춤형 산책 코스입니다. ${profile.walkingGoal === 'health' ? '건강 증진' : profile.walkingGoal === 'stress' ? '스트레스 해소' : '체중 관리'}에 최적화되어 있습니다.`,
        amenities: ['화장실', '카페', '편의점', '주차장'],
        recommendationReason: `현재 위치인 ${locationInfo}에서 접근이 용이하고, ${profile.age}세 연령대와 ${profile.fitnessLevel} 체력 수준에 적합한 코스입니다.`,
        nearbyFood: currentArea.foods
      },
      {
        id: `ai-${area}-2-${timestamp}`,
        name: `${currentArea.prefix} 도심 탐방로`,
        distance: baseDistance + 0.5,
        duration: Math.round((baseDistance + 0.5) * 15),
        difficulty: profile.fitnessLevel === 'beginner' ? 'easy' : 'medium',
        elevation: 25,
        rating: 4.4,
        features: currentArea.features.slice(1, 4),
        description: `${locationInfo} 주변의 도심 명소들을 연결하는 특별한 산책로입니다. 도시의 매력을 만끽하며 걸을 수 있습니다.`,
        amenities: ['화장실', '휴게소', '음수대', '벤치'],
        recommendationReason: `도심 속에서 다양한 볼거리와 함께 즐길 수 있어 ${profile.walkingGoal} 목적에 부합하며, 현재 위치에서 도보로 쉽게 접근 가능합니다.`,
        nearbyFood: currentArea.foods.slice(1)
      },
      {
        id: `ai-${area}-3-${timestamp}`,
        name: `${currentArea.prefix} 야경 산책로`,
        distance: baseDistance - 0.5,
        duration: Math.round((baseDistance - 0.5) * 18),
        difficulty: 'easy',
        elevation: 8,
        rating: 4.8,
        features: [...currentArea.features.slice(0, 2), '야경', '조명'],
        description: `${locationInfo} 지역의 아름다운 야경을 감상할 수 있는 낭만적인 산책 코스입니다. 저녁 시간대에 특히 추천합니다.`,
        amenities: ['조명', '화장실', '카페', '전망대'],
        recommendationReason: `현재 계신 ${locationInfo}의 야경 포인트들을 연결한 코스로, 편안한 난이도로 누구나 즐길 수 있습니다.`,
        nearbyFood: currentArea.foods.slice(0, 3)
      }
    ];
  };

  // 위치 변경 시 자동으로 재생성 - 더 정확한 감지
  useEffect(() => {
    console.log('useEffect 트리거됨:', { 
      hasProfile: !!userProfile, 
      hasLocation: !!userLocation,
      latitude: userLocation?.latitude,
      longitude: userLocation?.longitude,
      address: userLocation?.address
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
