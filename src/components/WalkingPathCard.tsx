
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Route, Clock, TrendingUp, Heart, Star, Lightbulb, UtensilsCrossed, Navigation, Building, MapPin } from 'lucide-react';
import SmallMap from './SmallMap';

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

  const originalData = path.originalData;

  // 경로 태그 생성 함수 (지역, 코스 타입, 특성 기반)
  const getPathTags = () => {
    const tags = [];
    
    // 지역 태그 (시군구 정보 활용)
    if (originalData?.SIGNGU_NM) {
      tags.push({
        label: originalData.SIGNGU_NM,
        color: 'bg-blue-100 text-blue-800',
        icon: <MapPin className="h-3 w-3" />
      });
    }
    
    // 코스 타입 태그
    if (originalData?.CoursName) {
      const coursName = originalData.CoursName;
      if (coursName.includes('강변') || coursName.includes('하천')) {
        tags.push({ label: '강변', color: 'bg-cyan-100 text-cyan-800' });
      } else if (coursName.includes('산') || coursName.includes('등산')) {
        tags.push({ label: '산길', color: 'bg-green-100 text-green-800' });
      } else if (coursName.includes('공원')) {
        tags.push({ label: '공원', color: 'bg-emerald-100 text-emerald-800' });
      } else if (coursName.includes('둘레') || coursName.includes('순환')) {
        tags.push({ label: '둘레길', color: 'bg-purple-100 text-purple-800' });
      } else if (coursName.includes('해안') || coursName.includes('바다')) {
        tags.push({ label: '해안', color: 'bg-teal-100 text-teal-800' });
      } else if (coursName.includes('도심') || coursName.includes('시내')) {
        tags.push({ label: '도심', color: 'bg-gray-100 text-gray-800' });
      }
    }
    
    // 코스 레벨 태그
    if (originalData?.CoursLv) {
      tags.push({
        label: `레벨 ${originalData.CoursLv}`,
        color: 'bg-orange-100 text-orange-800'
      });
    }
    
    return tags.slice(0, 3); // 최대 3개까지만 표시
  };

  const pathTags = getPathTags();

  // 경사를 퍼센트로 계산하는 함수
  const getElevationPercentage = () => {
    if (path.elevation <= 0) return 0;
    // 거리 대비 고도차를 퍼센트로 계산 (거리를 미터로 변환)
    const distanceInMeters = path.distance * 1000;
    const percentage = (path.elevation / distanceInMeters) * 100;
    return percentage.toFixed(1);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCardClick}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{path.name}</CardTitle>
            {/* 경로 태그 표시 */}
            <div className="flex gap-1 flex-wrap mt-2">
              {pathTags.map((tag, index) => (
                <Badge key={index} className={`text-xs ${tag.color} flex items-center gap-1`}>
                  {tag.icon}
                  {tag.label}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{path.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge className={getDifficultyColor(path.difficulty)}>
            {getDifficultyText(path.difficulty)}
          </Badge>
          {path.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{path.description}</p>
        
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

        {/* 작은 지도 추가 */}
        {originalData?.Latitude && originalData?.Longitude && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              위치
            </div>
            <SmallMap 
              latitude={originalData.Latitude} 
              longitude={originalData.Longitude} 
              height="120px"
              className="w-full"
            />
          </div>
        )}

        {/* 산책에 필수적인 정보만 표시 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-blue-600" />
            <span className="text-sm">{path.distance.toFixed(1)}km</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-600" />
            <span className="text-sm">{Math.round(path.duration)}분</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-orange-600" />
            <span className="text-sm">경사 {getElevationPercentage()}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-600" />
            <span className="text-sm">{Math.round(path.distance * 50)}kcal</span>
          </div>
        </div>

        {/* 위치 정보 (실제 데이터가 있는 경우) */}
        {originalData?.Address && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Navigation className="h-4 w-4 text-blue-600" />
              위치
            </div>
            <p className="text-sm text-gray-600 line-clamp-1">{originalData.Address}</p>
          </div>
        )}

        {/* 편의시설 (산책에 중요한 것만) */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Building className="h-4 w-4 text-green-600" />
            편의시설
          </div>
          <div className="flex gap-2 flex-wrap">
            {path.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>

        {/* 근처 맛집 정보 */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <UtensilsCrossed className="h-4 w-4 text-orange-600" />
            근처 맛집
          </div>
          <div className="flex gap-2 flex-wrap">
            {path.nearbyFood.slice(0, 2).map((food, index) => (
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
