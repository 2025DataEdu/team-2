import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Info, Toilet, Car, Building, Coffee, ShoppingCart, Lightbulb } from 'lucide-react';
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

interface RealPathDetailModalProps {
  path: RealWalkingPath | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: () => void;
}

const RealPathDetailModal = ({ path, isOpen, onClose, onSelect }: RealPathDetailModalProps) => {
  if (!path) return null;

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
    return '정보 없음';
  };

  const getTime = () => {
    if (path.CoursTime) return path.CoursTime;
    const distance = path.CoursDetailLength || parseFloat(path.CoursLength || '0') || 0;
    return distance > 0 ? `약 ${Math.round(distance * 15)}분` : '정보 없음';
  };

  // 편의시설 파싱 함수
  const getAmenities = () => {
    const amenities = [];
    
    // 화장실 정보
    if (path.Toilet === 'Y' || path.Toilet === '있음' || 
        (path.Option && (path.Option.includes('화장실') || path.Option.includes('공중화장실')))) {
      amenities.push({ icon: Toilet, label: '화장실 이용 가능', color: 'text-blue-600' });
    }
    
    // 주차장 정보
    if (path.Option && (path.Option.includes('주차') || path.Option.includes('주차장') ||
        path.Option.includes('주차시설'))) {
      amenities.push({ icon: Car, label: '주차장 있음', color: 'text-green-600' });
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
      
      if (description.includes('화장실') && !amenities.some(a => a.label.includes('화장실'))) {
        amenities.push({ icon: Toilet, label: '화장실 이용 가능', color: 'text-blue-600' });
      }
      
      if ((description.includes('주차') || description.includes('주차장')) && 
          !amenities.some(a => a.label.includes('주차장'))) {
        amenities.push({ icon: Car, label: '주차장 있음', color: 'text-green-600' });
      }
      
      if ((description.includes('편의점') || description.includes('매점')) && 
          !amenities.some(a => a.label.includes('편의점'))) {
        amenities.push({ icon: ShoppingCart, label: '편의점', color: 'text-purple-600' });
      }
      
      if ((description.includes('카페') || description.includes('커피') || 
           description.includes('음식점') || description.includes('식당')) && 
          !amenities.some(a => a.label.includes('카페'))) {
        amenities.push({ icon: Coffee, label: '카페/음식점', color: 'text-orange-600' });
      }
    }
    
    return amenities;
  };

  // 추천 이유 생성 함수
  const getRecommendationReason = () => {
    const reasons = [];
    
    // 거리 기반 추천
    const distance = path.CoursDetailLength || parseFloat(path.CoursLength || '0') || 0;
    if (distance <= 2) {
      reasons.push('가벼운 산책에 적합한 짧은 거리로 일상적인 운동에 좋습니다');
    } else if (distance <= 4) {
      reasons.push('적당한 운동량의 중거리 코스로 건강 관리에 효과적입니다');
    } else {
      reasons.push('충분한 운동 효과를 기대할 수 있는 장거리 코스로 체력 향상에 도움됩니다');
    }
    
    // 난이도 기반 추천
    if (path.CoursLv) {
      const level = path.CoursLv.toLowerCase();
      if (level.includes('쉬움') || level.includes('초급')) {
        reasons.push('초보자도 부담 없이 즐길 수 있는 평탄한 코스입니다');
      } else if (level.includes('보통') || level.includes('중급')) {
        reasons.push('적당한 도전과 운동 효과를 제공하는 균형 잡힌 코스입니다');
      } else if (level.includes('어려움') || level.includes('고급')) {
        reasons.push('도전적인 코스로 높은 운동 효과와 성취감을 얻을 수 있습니다');
      }
    }
    
    // 편의시설 기반 추천
    if (path.Toilet === 'Y' || path.Toilet === '있음') {
      reasons.push('화장실 등 편의시설이 잘 갖춰져 있어 안심하고 이용할 수 있습니다');
    }
    
    // 지역 특성 기반 추천
    if (path.SIGNGU_NM) {
      reasons.push(`${path.SIGNGU_NM} 지역의 대표적인 산책로로 접근성이 좋습니다`);
    }
    
    // 특별한 특징 기반 추천
    if (path.ADIT_DC) {
      const description = path.ADIT_DC.toLowerCase();
      if (description.includes('강') || description.includes('호수')) {
        reasons.push('아름다운 수변 풍경을 감상하며 힐링할 수 있는 특별한 코스입니다');
      }
      if (description.includes('숲') || description.includes('나무')) {
        reasons.push('자연 속에서 삼림욕과 함께 힐링할 수 있는 숲길 코스입니다');
      }
      if (description.includes('역사') || description.includes('문화')) {
        reasons.push('역사와 문화를 함께 체험할 수 있는 교육적 가치가 높은 코스입니다');
      }
    }
    
    return reasons.slice(0, 3).join('. ') + '.';
  };

  const handleSelect = () => {
    onSelect();
    onClose();
  };

  const amenities = getAmenities();
  const recommendationReason = getRecommendationReason();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl">
              {path.CoursName || path.CorusDetailName || '산책로'}
            </DialogTitle>
            <Badge variant="outline" className="ml-2">
              실제 등록 경로
            </Badge>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
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
            {path.CVNTL_NM && (
              <Badge variant="outline" className="text-xs">
                {path.CVNTL_NM}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 추천 이유 섹션 */}
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-blue-800 mb-2">💡 추천 이유</div>
                <p className="text-sm text-blue-700 leading-relaxed">{recommendationReason}</p>
              </div>
            </div>
          </div>

          {/* 지도 섹션 */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">🗺️ 위치</h4>
            <SmallMap 
              latitude={path.Latitude} 
              longitude={path.Longitude} 
              height="250px"
              className="w-full"
            />
          </div>

          {/* 주소 정보 */}
          {path.Address && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-gray-800 mb-1">위치</div>
                  <p className="text-sm text-gray-600">{path.Address}</p>
                </div>
              </div>
            </div>
          )}

          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">거리</div>
                <div className="font-medium">{getDistance()}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">소요 시간</div>
                <div className="font-medium">{getTime()}</div>
              </div>
            </div>
          </div>

          {/* 코스 설명 */}
          {path.ADIT_DC && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                코스 설명
              </h4>
              <p className="text-gray-700 leading-relaxed">{path.ADIT_DC}</p>
            </div>
          )}

          {/* 경로 정보 */}
          {path.CoursRoute && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">🗺️ 경로 안내</h4>
              <p className="text-gray-700 leading-relaxed">{path.CoursRoute}</p>
            </div>
          )}

          {/* 편의시설 */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">🏢 편의시설</h4>
            <div className="flex gap-2 flex-wrap">
              {amenities.length > 0 ? (
                amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-sm flex items-center gap-2 px-3 py-1">
                    <amenity.icon className={`h-4 w-4 ${amenity.color}`} />
                    {amenity.label}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">편의시설 정보 없음</span>
              )}
            </div>
          </div>

          {/* 구글 지도 기반 근처 맛집 & 디저트 */}
          <NearbyRestaurants title="근처 맛집 & 디저트" />

          {/* 추가 옵션 */}
          {path.Option && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Building className="h-5 w-5 text-purple-600" />
                추가 정보
              </h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-700 text-sm leading-relaxed">{path.Option}</p>
              </div>
            </div>
          )}

          {/* 좌표 정보 */}
          {path.Latitude && path.Longitude && (
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              위도: {path.Latitude.toFixed(6)}, 경도: {path.Longitude.toFixed(6)}
            </div>
          )}

          {/* 선택 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSelect}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              이 경로 선택하기
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RealPathDetailModal;
