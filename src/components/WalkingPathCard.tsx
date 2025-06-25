
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, TrendingUp, Heart, Star, Lightbulb, UtensilsCrossed, Navigation, Building, Route } from 'lucide-react';

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
  realPath?: boolean;
  originalData?: any;
}

interface WalkingPathCardProps {
  path: WalkingPath;
  onSelect: (path: WalkingPath) => void;
  onCardClick: (path: WalkingPath) => void;
}

const WalkingPathCard = ({ path, onSelect, onCardClick }: WalkingPathCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '쉬움';
      case 'medium': return '보통';
      case 'hard': return '어려움';
      default: return '보통';
    }
  };

  const handleCardClick = () => {
    onCardClick(path);
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(path);
  };

  // 실제 데이터가 있는 경우 원본 데이터 활용
  const originalData = path.originalData;

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCardClick}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{path.name}</CardTitle>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{path.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge className={getDifficultyColor(path.difficulty)}>
            {getDifficultyText(path.difficulty)}
          </Badge>
          {path.features.map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 mb-4 text-sm line-clamp-3">{path.description}</p>
        
        {/* 추천 이유 섹션 */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-3 border-blue-400">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-blue-800 mb-1">추천 이유</div>
              <p className="text-sm text-blue-700">{path.recommendationReason}</p>
            </div>
          </div>
        </div>

        {/* 실제 산책로 데이터의 모든 정보 표시 */}
        {originalData && (
          <div className="mb-4 space-y-3">
            <div className="text-sm font-medium text-gray-700 mb-2">📋 상세 정보</div>
            
            {/* 기본 산책로 정보 */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {originalData.CoursCode && (
                <div className="flex justify-between">
                  <span className="text-gray-600">코스 코드:</span>
                  <span className="font-medium">{originalData.CoursCode}</span>
                </div>
              )}
              {originalData.CoursName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">코스명:</span>
                  <span className="font-medium">{originalData.CoursName}</span>
                </div>
              )}
              {originalData.CoursLength && (
                <div className="flex justify-between">
                  <span className="text-gray-600">총 거리:</span>
                  <span className="font-medium">{originalData.CoursLength}</span>
                </div>
              )}
              {originalData.CoursTime && (
                <div className="flex justify-between">
                  <span className="text-gray-600">소요시간:</span>
                  <span className="font-medium">{originalData.CoursTime}</span>
                </div>
              )}
              {originalData.CoursLv && (
                <div className="flex justify-between">
                  <span className="text-gray-600">난이도:</span>
                  <span className="font-medium">{originalData.CoursLv}</span>
                </div>
              )}
              {originalData.SIGNGU_NM && (
                <div className="flex justify-between">
                  <span className="text-gray-600">지역:</span>
                  <span className="font-medium">{originalData.SIGNGU_NM}</span>
                </div>
              )}
            </div>

            {/* 위치 정보 */}
            {(originalData.Address || originalData.Latitude) && (
              <div className="border-t pt-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Navigation className="h-4 w-4 text-blue-600" />
                  위치 정보
                </div>
                <div className="space-y-1 text-xs">
                  {originalData.Address && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">주소:</span>
                      <span className="font-medium text-right">{originalData.Address}</span>
                    </div>
                  )}
                  {originalData.Latitude && originalData.Longitude && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">좌표:</span>
                      <span className="font-medium">{originalData.Latitude.toFixed(4)}, {originalData.Longitude.toFixed(4)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 편의시설 정보 */}
            {(originalData.Option || originalData.Toilet || originalData.CVNTL_NM) && (
              <div className="border-t pt-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Building className="h-4 w-4 text-green-600" />
                  편의시설
                </div>
                <div className="space-y-1 text-xs">
                  {originalData.Toilet && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">화장실:</span>
                      <span className="font-medium">{originalData.Toilet === 'Y' ? '있음' : '없음'}</span>
                    </div>
                  )}
                  {originalData.Option && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">기타 옵션:</span>
                      <span className="font-medium text-right">{originalData.Option}</span>
                    </div>
                  )}
                  {originalData.CVNTL_NM && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">편의시설:</span>
                      <span className="font-medium text-right">{originalData.CVNTL_NM}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 코스 상세 정보 */}
            {(originalData.CorusDetailName || originalData.CoursRoute || originalData.ADIT_DC) && (
              <div className="border-t pt-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Route className="h-4 w-4 text-purple-600" />
                  코스 상세
                </div>
                <div className="space-y-1 text-xs">
                  {originalData.CorusDetailName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">상세명:</span>
                      <span className="font-medium text-right">{originalData.CorusDetailName}</span>
                    </div>
                  )}
                  {originalData.CoursRoute && (
                    <div>
                      <span className="text-gray-600">경로:</span>
                      <p className="font-medium text-xs mt-1 text-right">{originalData.CoursRoute}</p>
                    </div>
                  )}
                  {originalData.ADIT_DC && (
                    <div>
                      <span className="text-gray-600">추가 설명:</span>
                      <p className="font-medium text-xs mt-1 text-right">{originalData.ADIT_DC}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* 기본 정보 그리드 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-sm">{path.distance.toFixed(2)}km</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-600" />
            <span className="text-sm">{Math.round(path.duration)}분</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-orange-600" />
            <span className="text-sm">경사 {path.elevation.toFixed(1)}m</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-600" />
            <span className="text-sm">칼로리 {Math.round(path.distance * 50)}kcal</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">주변 편의시설</div>
          <div className="flex gap-2 flex-wrap">
            {path.amenities.map((amenity, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>

        {/* 근처 맛집/디저트 정보 추가 */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <UtensilsCrossed className="h-4 w-4 text-orange-600" />
            근처 맛집 & 디저트
          </div>
          <div className="flex gap-2 flex-wrap">
            {path.nearbyFood.map((food, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                {food}
              </Badge>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleSelectClick}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          이 경로 선택하기
        </Button>
      </CardContent>
    </Card>
  );
};

export default WalkingPathCard;
