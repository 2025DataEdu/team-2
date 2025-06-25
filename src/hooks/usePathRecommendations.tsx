
import { useState, useEffect } from 'react';

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
  nearbyMarkets?: string[]; // 전통시장 정보 추가
  latitude?: number; // 위치 정보 추가
  longitude?: number;
}

interface UserProfile {
  age: number;
  fitnessLevel: string;
  preferredDistance: number[];
  healthConditions: string;
  walkingGoal: string;
}

interface UsePathRecommendationsProps {
  userProfile: UserProfile;
  userLocation?: { latitude: number; longitude: number; address: string };
}

export const usePathRecommendations = ({ userProfile, userLocation }: UsePathRecommendationsProps) => {
  const [recommendedPaths, setRecommendedPaths] = useState<WalkingPath[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateRecommendations = () => {
    setIsLoading(true);
    
    // AI 기반 맞춤형 추천 로직 (실제 환경에서는 백엔드 AI 서비스 연동)
    setTimeout(() => {
      const basePaths: Omit<WalkingPath, 'recommendationReason' | 'nearbyFood' | 'nearbyMarkets'>[] = [
        {
          id: '1',
          name: '한강공원 여의도 코스',
          distance: userProfile.preferredDistance[0],
          duration: userProfile.preferredDistance[0] * 15,
          difficulty: userProfile.fitnessLevel === 'beginner' ? 'easy' : 'medium',
          elevation: 5,
          rating: 4.5,
          features: ['강변', '야경', '자전거도로'],
          description: '한강을 따라 걷는 평평한 코스로 초보자에게 적합합니다. 아름다운 강변 풍경을 감상할 수 있습니다.',
          amenities: ['화장실', '편의점', '카페', '주차장'],
          latitude: 37.5219,
          longitude: 126.9245
        },
        {
          id: '2',
          name: '남산 둘레길',
          distance: userProfile.preferredDistance[0] * 1.2,
          duration: userProfile.preferredDistance[0] * 18,
          difficulty: userProfile.fitnessLevel === 'advanced' ? 'medium' : 'hard',
          elevation: 45,
          rating: 4.7,
          features: ['숲길', '역사', '전망대'],
          description: '서울의 중심에서 자연을 만끽할 수 있는 숲길 코스입니다. 약간의 경사가 있어 운동 효과가 좋습니다.',
          amenities: ['화장실', '휴게소', '전망대', '문화시설'],
          latitude: 37.5512,
          longitude: 126.9882
        },
        {
          id: '3',
          name: '청계천 산책로',
          distance: userProfile.preferredDistance[0] * 0.8,
          duration: userProfile.preferredDistance[0] * 12,
          difficulty: 'easy',
          elevation: 0,
          rating: 4.2,
          features: ['도심', '야경', '문화'],
          description: '도심 속 시원한 물길을 따라 걷는 편안한 코스입니다. 접근성이 좋고 다양한 볼거리가 있습니다.',
          amenities: ['화장일', '음료수', '벤치', '조명'],
          latitude: 37.5694,
          longitude: 126.9784
        }
      ];

      // 근처 맛집/디저트 정보 생성
      const foodOptions = {
        '1': ['여의도 파크카페', '한강 브런치', '아이스크림 트럭', '치킨&맥주', '피자헤븐'],
        '2': ['남산골 한옥마을 찻집', '케이크하우스', '전통 팥빙수', '산채정식', '커피 로스터리'],
        '3': ['청계천 떡볶이', '호떡가게', '브런치카페', '김밥천국', '아이스크림바']
      };

      // 근처 전통시장 정보 생성
      const marketOptions = {
        '1': ['여의도시장', '국회의사당 전통시장'],
        '2': ['남대문시장', '명동 전통시장', '회현시장'],
        '3': ['광장시장', '동대문시장', '청계상가']
      };

      // 사용자 프로필에 따른 맞춤형 필터링 및 추천 이유 생성
      let filteredPaths = basePaths.filter(path => {
        if (userProfile.healthConditions.includes('무릎') && path.elevation > 30) return false;
        if (userProfile.fitnessLevel === 'beginner' && path.difficulty === 'hard') return false;
        return true;
      }).map(path => {
        // 추천 이유 생성
        let reason = '';
        
        if (path.id === '1') {
          reason = `${userProfile.fitnessLevel === 'beginner' ? '초보자에게 적합한 평평한 코스' : '적당한 운동 강도'}이며, ${userProfile.walkingGoal === 'stress' ? '강변의 아름다운 풍경으로 스트레스 해소에 효과적' : userProfile.walkingGoal === 'health' ? '규칙적인 걷기 운동으로 건강 증진에 도움' : '쾌적한 환경에서 여유로운 산책 가능'}합니다.`;
        } else if (path.id === '2') {
          reason = `${userProfile.fitnessLevel === 'advanced' ? '고급자에게 적합한 도전적인 코스' : '적당한 경사로 운동 효과가 좋은 코스'}이며, ${userProfile.walkingGoal === 'weight' ? '칼로리 소모량이 높아 체중 관리에 효과적' : userProfile.walkingGoal === 'health' ? '심폐기능 향상에 도움이 되는 코스' : '자연 속에서 힐링할 수 있는 환경'}입니다.`;
        } else {
          reason = `${userProfile.healthConditions ? '건강 상태를 고려한 부담 없는 코스' : '접근성이 좋은 도심 코스'}이며, ${userProfile.walkingGoal === 'leisure' ? '문화와 함께 즐길 수 있는 여가 코스' : userProfile.walkingGoal === 'stress' ? '도심 속 힐링 공간으로 스트레스 해소에 좋은' : '가벼운 운동으로 건강 관리에 적합한'} 코스입니다.`;
        }

        // 위치 기반 추천 이유 추가
        if (userLocation) {
          reason += ` 현재 위치(${userLocation.address})에서 접근하기 좋은 거리에 위치해 있습니다.`;
        }

        return {
          ...path,
          recommendationReason: reason,
          nearbyFood: foodOptions[path.id as keyof typeof foodOptions] || [],
          nearbyMarkets: marketOptions[path.id as keyof typeof marketOptions] || [],
          features: userProfile.walkingGoal === 'stress' 
            ? [...path.features, '힐링'] 
            : userProfile.walkingGoal === 'weight' 
            ? [...path.features, '칼로리소모'] 
            : path.features
        };
      });

      setRecommendedPaths(filteredPaths);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    generateRecommendations();
  }, [userProfile, userLocation]);

  return {
    recommendedPaths,
    isLoading,
    generateRecommendations
  };
};
