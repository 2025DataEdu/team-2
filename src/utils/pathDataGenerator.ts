
import { UserProfile, UserLocation, WalkingPath } from '@/types/walkingPath';

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
  north_seoul: {
    prefix: '서울 북부',
    features: ['북한산', '창경궁', '동대문', '성북구 카페거리'],
    foods: ['이태원 맛집', '혜화 카페', '대학로 맛집', '성북 브런치', '북촌 전통차']
  },
  south_seoul: {
    prefix: '서울 남부',
    features: ['한강공원', '반포대교', '잠실', '코엑스'],
    foods: ['잠실 맛집', '강남 카페', '서초 브런치', '반포 디저트', '송파 치킨']
  },
  default: {
    prefix: '현재 지역',
    features: ['도시 풍경', '공원', '강변', '전통과 현대의 조화'],
    foods: ['동네 맛집', '지역 카페', '전통 디저트', '베이커리', '분식집']
  }
};

export const generateLocationBasedPaths = (
  profile: UserProfile, 
  area: string, 
  location?: UserLocation
): WalkingPath[] => {
  const currentArea = areaData[area] || areaData.default;
  const baseDistance = profile.preferredDistance[0] || 3;
  const timestamp = Date.now();
  const locationInfo = location?.address || currentArea.prefix;

  // default 케이스에서 실제 주소의 첫 번째 단어 사용
  if (area === 'default' && location?.address) {
    currentArea.prefix = location.address.split(' ')[0] || '현재 지역';
  }

  console.log('경로 생성 중:', { area, currentArea, locationInfo, timestamp });

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
      recommendationReason: `${locationInfo}에서 접근이 용이하고, ${profile.age}세 연령대와 ${profile.fitnessLevel} 체력 수준에 적합한 코스입니다.`,
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
      recommendationReason: `도심 속에서 다양한 볼거리와 함께 즐길 수 있어 ${profile.walkingGoal} 목적에 부합하며, ${locationInfo}에서 도보로 쉽게 접근 가능합니다.`,
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
      recommendationReason: `${locationInfo}의 야경 포인트들을 연결한 코스로, 편안한 난이도로 누구나 즐길 수 있습니다.`,
      nearbyFood: currentArea.foods.slice(0, 3)
    }
  ];
};
