import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Info, Toilet, Car, Coffee, ShoppingCart, Lightbulb, UtensilsCrossed } from 'lucide-react';
import SmallMap from './SmallMap';
import NearbyRestaurants from './NearbyRestaurants';

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

interface RealPathCardProps {
  path: RealWalkingPath;
  onSelect: () => void;
  onCardClick: () => void;
}

const RealPathCard = ({ path, onSelect, onCardClick }: RealPathCardProps) => {
  const getDifficultyColor = (level: string | null) => {
    if (!level) return 'bg-gray-100 text-gray-800';
    const levelLower = level.toLowerCase();
    if (levelLower.includes('쉬움') || levelLower.includes('초급')) return 'bg-green-100 text-green-800';
    if (levelLower.includes('보통') || levelLower.includes('중급')) return 'bg-yellow-100 text-yellow-800';
    if (levelLower.includes('어려움') || levelLower.includes('고급')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getDistance = () => {
    if (path.CoursDetailLength) return `${path.CoursDetailLength.toFixed(1)}km`;
    if (path.CoursLength) return path.CoursLength;
    return '거리 정보 없음';
  };

  const getTime = () => {
    if (path.CoursTime) return path.CoursTime;
    const distance = path.CoursDetailLength || parseFloat(path.CoursLength || '0') || 0;
    return distance > 0 ? `약 ${Math.round(distance * 15)}분` : '시간 정보 없음';
  };

  // 편의시설 파싱 함수
  const getAmenities = () => {
    const amenities = [];
    
    // 화장실 정보
    if (path.Toilet === 'Y' || path.Toilet === '있음' || 
        (path.Option && (path.Option.includes('화장실') || path.Option.includes('공중화장실')))) {
      amenities.push({ icon: Toilet, label: '화장실', color: 'text-blue-600' });
    }
    
    // 주차장 정보
    if (path.Option && (path.Option.includes('주차') || path.Option.includes('주차장') ||
        path.Option.includes('주차시설'))) {
      amenities.push({ icon: Car, label: '주차장', color: 'text-green-600' });
    }
    
    // 편의점 정보
    if (path.Option && (path.Option.includes('편의점') || path.Option.includes('매점') ||
        path.Option.includes('상점'))) {
      amenities.push({ icon: ShoppingCart, label: '편의점', color: 'text-purple-600' });
    }
    
    // 카페/음식점 정보
    if (path.Option && (path.Option.includes('카페') || path.Option.includes('커피') ||
        path.Option.includes('음식점') || path.Option.includes('식당') || 
        path.Option.includes('휴게소'))) {
      amenities.push({ icon: Coffee, label: '카페/음식점', color: 'text-orange-600' });
    }
    
    // ADIT_DC에서도 편의시설 정보 추출
    if (path.ADIT_DC) {
      const description = path.ADIT_DC.toLowerCase();
      
      if (description.includes('화장실') && !amenities.some(a => a.label === '화장실')) {
        amenities.push({ icon: Toilet, label: '화장실', color: 'text-blue-600' });
      }
      
      if ((description.includes('주차') || description.includes('주차장')) && 
          !amenities.some(a => a.label === '주차장')) {
        amenities.push({ icon: Car, label: '주차장', color: 'text-green-600' });
      }
      
      if ((description.includes('편의점') || description.includes('매점')) && 
          !amenities.some(a => a.label === '편의점')) {
        amenities.push({ icon: ShoppingCart, label: '편의점', color: 'text-purple-600' });
      }
      
      if ((description.includes('카페') || description.includes('커피') || 
           description.includes('음식점') || description.includes('식당')) && 
          !amenities.some(a => a.label === '카페/음식점')) {
        amenities.push({ icon: Coffee, label: '카페/음식점', color: 'text-orange-600' });
      }
    }
    
    return amenities;
  };

  // 근처 맛집/디저트 생성 함수
  const getNearbyFood = () => {
    const areaFood: { [key: string]: string[] } = {
      '강남구': ['강남 맛집거리', '압구정 카페', '청담 디저트', '삼성동 브런치', '역삼 치킨'],
      '서초구': ['서초 맛집', '반포 한강 카페', '교대 디저트', '강남역 맛집', '서초동 베이커리'],
      '마포구': ['홍대 맛집', '합정 카페', '상수 디저트', '망원동 맛집', '연남동 브런치'],
      '종로구': ['인사동 전통차', '삼청동 카페', '북촌 디저트', '명동 맛집', '종로 전통음식'],
      '중구': ['명동 맛집', '을지로 카페', '장충동 족발', '신당동 떡볶이', '동대문 야식'],
      '용산구': ['이태원 맛집', '한남동 카페', '용산 디저트', '경리단길 맛집', '해방촌 브런치'],
      '영등포구': ['여의도 맛집', '당산 카페', '영등포 디저트', '문래동 맛집', '신길동 맛집'],
      '송파구': ['잠실 맛집', '석촌호수 카페', '방이동 디저트', '문정동 맛집', '가락동 맛집']
    };
    
    const defaultFood = ['지역 맛집', '동네 카페', '전통 디저트', '베이커리', '분식집'];
    
    if (path.SIGNGU_NM && areaFood[path.SIGNGU_NM]) {
      return areaFood[path.SIGNGU_NM];
    }
    
    return defaultFood;
  };

  // 추천 이유 생성 함수
  const getRecommendationReason = () => {
    const reasons = [];
    
    // 거리 기반 추천
    const distance = path.CoursDetailLength || parseFloat(path.CoursLength || '0') || 0;
    if (distance <= 2) {
      reasons.push('가벼운 산책에 적합한 짧은 거리');
    } else if (distance <= 4) {
      reasons.push('적당한 운동량의 중거리 코스');
    } else {
      reasons.push('충분한 운동 효과를 기대할 수 있는 장거리 코스');
    }
    
    // 난이도 기반 추천
    if (path.CoursLv) {
      const level = path.CoursLv.toLowerCase();
      if (level.includes('쉬움') || level.includes('초급')) {
        reasons.push('초보자도 부담 없이 즐길 수 있는 난이도');
      } else if (level.includes('보통') || level.includes('중급')) {
        reasons.push('적당한 도전과 운동 효과를 제공하는 코스');
      } else if (level.includes('어려움') || level.includes('고급')) {
        reasons.push('도전적인 코스로 높은 운동 효과 기대');
      }
    }
    
    // 편의시설 기반 추천
    if (path.Toilet === 'Y' || path.Toilet === '있음') {
      reasons.push('화장실 등 편의시설이 잘 갖춰진 코스');
    }
    
    // 지역 특성 기반 추천
    if (path.SIGNGU_NM) {
      reasons.push(`${path.SIGNGU_NM} 지역의 대표적인 산책로`);
    }
    
    // 특별한 특징 기반 추천
    if (path.ADIT_DC) {
      const description = path.ADIT_DC.toLowerCase();
      if (description.includes('강') || description.includes('호수')) {
        reasons.push('아름다운 수변 풍경을 감상할 수 있는 코스');
      }
      if (description.includes('숲') || description.includes('나무')) {
        reasons.push('자연 속에서 힐링할 수 있는 숲길 코스');
      }
      if (description.includes('역사') || description.includes('문화')) {
        reasons.push('역사와 문화를 함께 체험할 수 있는 코스');
      }
    }
    
    return reasons.slice(0, 2).join(', ') + '입니다.';
  };

  const handleCardClick = () => {
    onCardClick();
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const amenities = getAmenities();
  const recommendationReason = getRecommendationReason();

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full" onClick={handleCardClick}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">
            {path.CoursName || path.CorusDetailName || '산책로'}
          </CardTitle>
          <Badge variant="outline" className="ml-2 flex-shrink-0">
            실제경로
          </Badge>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {path.CoursLv && (
            <Badge className={getDifficultyColor(path.CoursLv)}>
              {path.CoursLv}
            </Badge>
          )}
          {path.SIGNGU_NM && (
            <Badge variant="outline" className="text-xs">
              {path.SIGNGU_NM}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col h-full">
        <div className="flex-grow">
          {/* 작은 지도 */}
          <div className="mb-4">
            <SmallMap 
              latitude={path.Latitude} 
              longitude={path.Longitude} 
              height="150px"
              className="w-full"
            />
          </div>

          {path.Address && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              📍 {path.Address}
            </p>
          )}

          {/* 추천 이유 섹션 */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-medium text-blue-800 mb-1">💡 추천 이유</div>
                <p className="text-xs text-blue-700 line-clamp-2">{recommendationReason}</p>
              </div>
            </div>
          </div>
          
          {path.ADIT_DC && (
            <p className="text-sm text-gray-700 mb-4 line-clamp-3">
              {path.ADIT_DC}
            </p>
          )}
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-sm">{getDistance()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm">{getTime()}</span>
            </div>
          </div>

          {/* 편의시설 표시 */}
          {amenities.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">편의시설</div>
              <div className="flex gap-2 flex-wrap">
                {amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
                    <amenity.icon className={`h-3 w-3 ${amenity.color}`} />
                    {amenity.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 구글 지도 기반 근처 맛집 & 디저트 (간단 버전) */}
          <div className="mb-4">
            <NearbyRestaurants 
              latitude={path.Latitude} 
              longitude={path.Longitude} 
              title="근처 맛집"
            />
          </div>

          {path.CoursRoute && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Info className="h-4 w-4" />
                경로 정보
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{path.CoursRoute}</p>
            </div>
          )}

          {/* 추가 옵션 정보 표시 */}
          {path.Option && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">추가 정보</div>
              <p className="text-xs text-gray-600 line-clamp-2">{path.Option}</p>
            </div>
          )}
        </div>

        <Button 
          onClick={handleSelectClick}
          className="w-full bg-blue-600 hover:bg-blue-700 mt-auto"
        >
          이 경로 선택하기
        </Button>
      </CardContent>
    </Card>
  );
};

export default RealPathCard;
