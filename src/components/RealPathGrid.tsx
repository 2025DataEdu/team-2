
import React, { useState } from 'react';
import RealPathCard from './RealPathCard';
import RealPathDetailModal from './RealPathDetailModal';

interface RealWalkingPath {
  CoursCode: string;
  CoursName: string | null;
  CorusDetailName: string | null;
  Address: string | null;
  CoursLength: string | null;
  CoursDetailLength: number | null;
  CoursTime: string | null;
  CoursLv: string | null;
  CoursRoute: string | null;
  Latitude: number | null;
  Longitude: number | null;
  ADIT_DC: string | null;
  Option: string | null;
  Toilet: string | null;
  SIGNGU_NM: string | null;
  CVNTL_NM: string | null;
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

interface RealPathGridProps {
  paths: RealWalkingPath[];
  isLoading: boolean;
  onPathSelect: (path: WalkingPath) => void;
}

const RealPathGrid = ({ paths, isLoading, onPathSelect }: RealPathGridProps) => {
  const [selectedPath, setSelectedPath] = useState<RealWalkingPath | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (path: RealWalkingPath) => {
    setSelectedPath(path);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPath(null);
  };

  // 실제 데이터를 AI 형식으로 변환하는 강화된 함수
  const convertToAIFormat = (realPath: RealWalkingPath): WalkingPath => {
    const distance = realPath.CoursDetailLength || parseFloat(realPath.CoursLength || '0') || 2;
    const timeStr = realPath.CoursTime || '';
    const duration = timeStr.includes('분') ? parseInt(timeStr) : distance * 15;
    
    let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
    if (realPath.CoursLv) {
      const level = realPath.CoursLv.toLowerCase();
      if (level.includes('어려움') || level.includes('고급')) difficulty = 'hard';
      else if (level.includes('보통') || level.includes('중급')) difficulty = 'medium';
    }

    const features = [];
    if (realPath.ADIT_DC?.includes('숲')) features.push('숲길');
    if (realPath.ADIT_DC?.includes('강') || realPath.ADIT_DC?.includes('호수')) features.push('강변');
    if (realPath.Toilet === 'Y' || realPath.Toilet === '있음') features.push('화장실');
    if (realPath.Option?.includes('야경')) features.push('야경');
    if (realPath.ADIT_DC?.includes('역사') || realPath.ADIT_DC?.includes('문화')) features.push('역사');

    const amenities = [];
    if (realPath.Toilet === 'Y' || realPath.Toilet === '있음') amenities.push('화장실');
    if (realPath.Option?.includes('주차')) amenities.push('주차장');
    if (realPath.Option?.includes('편의점')) amenities.push('편의점');
    if (realPath.Option?.includes('카페') || realPath.Option?.includes('음식점')) amenities.push('카페');

    // 강화된 근처 맛집/디저트 생성
    const getNearbyFood = () => {
      const areaFood: { [key: string]: string[] } = {
        '강남구': ['강남 맛집거리', '압구정 로데오 카페', '청담 디저트 명소', '삼성동 브런치 카페', '역삼 치킨 맛집'],
        '서초구': ['서초 맛집', '반포 한강 카페', '교대역 디저트', '강남역 맛집', '서초동 베이커리'],
        '마포구': ['홍대 맛집거리', '합정 카페거리', '상수동 디저트', '망원동 맛집', '연남동 브런치'],
        '종로구': ['인사동 전통차', '삼청동 카페', '북촌 디저트', '명동 맛집', '종로 전통음식'],
        '중구': ['명동 맛집거리', '을지로 카페', '장충동 족발', '신당동 떡볶이', '동대문 야식'],
        '용산구': ['이태원 세계음식', '한남동 카페', '용산 디저트', '경리단길 맛집', '해방촌 브런치'],
        '영등포구': ['여의도 맛집', '당산 카페거리', '영등포 디저트', '문래동 맛집', '신길동 맛집'],
        '송파구': ['잠실 맛집거리', '석촌호수 카페', '방이동 디저트', '문정동 맛집', '가락동 맛집']
      };

      const defaultFood = ['지역 맛집', '동네 카페', '전통 디저트', '베이커리', '분식집'];
      
      if (realPath.SIGNGU_NM && areaFood[realPath.SIGNGU_NM]) {
        return areaFood[realPath.SIGNGU_NM];
      }
      
      return defaultFood;
    };

    // 강화된 추천 이유 생성
    const getRecommendationReason = () => {
      const reasons = [];
      
      // 거리 기반 추천
      if (distance <= 2) {
        reasons.push('가벼운 산책에 적합한 짧은 거리');
      } else if (distance <= 4) {
        reasons.push('적당한 운동량의 중거리 코스');
      } else {
        reasons.push('충분한 운동 효과를 기대할 수 있는 장거리 코스');
      }
      
      // 난이도 기반 추천
      if (realPath.CoursLv) {
        const level = realPath.CoursLv.toLowerCase();
        if (level.includes('쉬움') || level.includes('초급')) {
          reasons.push('초보자도 부담 없이 즐길 수 있는 난이도');
        } else if (level.includes('보통') || level.includes('중급')) {
          reasons.push('적당한 도전과 운동 효과를 제공');
        } else if (level.includes('어려움') || level.includes('고급')) {
          reasons.push('도전적인 코스로 높은 운동 효과');
        }
      }
      
      // 편의시설 기반 추천
      if (realPath.Toilet === 'Y' || realPath.Toilet === '있음') {
        reasons.push('화장실 등 편의시설 완비');
      }
      
      // 지역 특성 기반 추천
      if (realPath.SIGNGU_NM) {
        reasons.push(`${realPath.SIGNGU_NM} 지역의 대표 산책로`);
      }
      
      // 특별한 특징 기반 추천
      if (realPath.ADIT_DC) {
        const description = realPath.ADIT_DC.toLowerCase();
        if (description.includes('강') || description.includes('호수')) {
          reasons.push('아름다운 수변 풍경 감상 가능');
        }
        if (description.includes('숲') || description.includes('나무')) {
          reasons.push('자연 속에서 힐링할 수 있는 숲길');
        }
        if (description.includes('역사') || description.includes('문화')) {
          reasons.push('역사와 문화를 함께 체험');
        }
      }
      
      return reasons.slice(0, 2).join(', ') + '입니다.';
    };

    return {
      id: realPath.CoursCode,
      name: realPath.CoursName || realPath.CorusDetailName || '산책로',
      distance: distance,
      duration: duration,
      difficulty,
      elevation: 10, // 기본값
      rating: 4.2, // 기본값을 좀 더 현실적으로
      features,
      description: realPath.ADIT_DC || realPath.CoursRoute || '아름다운 실제 등록 산책로입니다.',
      amenities,
      recommendationReason: getRecommendationReason(),
      nearbyFood: getNearbyFood()
    };
  };

  const handleSelectPath = (realPath: RealWalkingPath) => {
    const convertedPath = convertToAIFormat(realPath);
    onPathSelect(convertedPath);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-64"></div>
          </div>
        ))}
      </div>
    );
  }

  if (paths.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">주변에 등록된 산책로가 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paths.map((path) => (
          <RealPathCard 
            key={path.CoursCode} 
            path={path} 
            onSelect={() => handleSelectPath(path)}
            onCardClick={() => handleCardClick(path)}
          />
        ))}
      </div>

      <RealPathDetailModal
        path={selectedPath}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSelect={() => selectedPath && handleSelectPath(selectedPath)}
      />
    </>
  );
};

export default RealPathGrid;
