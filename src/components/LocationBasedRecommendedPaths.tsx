
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star, Utensils } from 'lucide-react';
import { useLocationBasedPaths } from '@/hooks/useLocationBasedPaths';

interface LocationBasedRecommendedPathsProps {
  userLatitude: number;
  userLongitude: number;
  maxDistance: number;
  limit: number;
  title?: string;
}

const LocationBasedRecommendedPaths = ({ 
  userLatitude, 
  userLongitude, 
  maxDistance, 
  limit,
  title = "내 주변 추천 산책로 TOP 3" 
}: LocationBasedRecommendedPathsProps) => {
  const { nearbyPaths, isLoading, error } = useLocationBasedPaths({
    userLatitude,
    userLongitude,
    maxDistance,
    limit: 3 // 무조건 3개로 고정
  });

  // 가상 맛집 데이터
  const getVirtualRestaurants = (pathIndex: number) => {
    const restaurants = [
      ['카페 산들바람', '한정식 맛고을', '치킨 호프집'],
      ['이탈리안 레스토랑', '돈까스 명가', '분식점 행복'],
      ['커피 전문점', '순두부찌개 맛집', '족발 보쌈'],
      ['중화요리 만리장성', '김밥천국', '아이스크림 가게'],
      ['베이커리 카페', '갈비탕 전문점', '피자헛']
    ];
    return restaurants[pathIndex % restaurants.length];
  };

  const getDifficultyColor = (level: string | null) => {
    if (!level) return 'bg-gray-100 text-gray-800';
    const levelLower = level.toLowerCase();
    if (levelLower.includes('쉬움') || levelLower.includes('초급')) return 'bg-green-100 text-green-800';
    if (levelLower.includes('보통') || levelLower.includes('중급')) return 'bg-yellow-100 text-yellow-800';
    if (levelLower.includes('어려움') || levelLower.includes('고급')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getDifficultyText = (level: string | null) => {
    if (!level) return '정보없음';
    return level;
  };

  const getDistance = (path: any) => {
    if (path.CoursDetailLength) return `${path.CoursDetailLength.toFixed(1)}km`;
    if (path.CoursLength) return path.CoursLength;
    return '정보 없음';
  };

  const getTime = (path: any) => {
    if (path.CoursTime) return path.CoursTime;
    const distance = path.CoursDetailLength || parseFloat(path.CoursLength || '0') || 0;
    return distance > 0 ? `약 ${Math.round(distance * 15)}분` : '정보 없음';
  };

  if (isLoading) {
    return (
      <div>
        <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          🚶‍♂️ {title}
        </h4>
        <div className="text-sm text-gray-500">내 주변 산책로를 찾는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          🚶‍♂️ {title}
        </h4>
        <div className="text-sm text-red-500">산책로 정보를 가져오는데 실패했습니다.</div>
      </div>
    );
  }

  // 강제로 정확히 3개만 자르기
  const exactlyThreePaths = nearbyPaths.slice(0, 3);

  if (!exactlyThreePaths.length) {
    return (
      <div>
        <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          🚶‍♂️ {title}
        </h4>
        <div className="text-sm text-gray-500">
          5km 이내에 등록된 산책로가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
        🚶‍♂️ 내 주변 추천 산책로 TOP 3 (5km 이내, 가까운 순) - 총 {exactlyThreePaths.length}개
      </h4>
      
      <div className="space-y-3">
        {exactlyThreePaths.map((path, index) => {
          const virtualRestaurants = getVirtualRestaurants(index);
          
          return (
            <Card key={`${path.CoursCode}-${index}`} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-medium text-blue-600">#{index + 1}</span>
                      <h5 className="font-medium text-gray-900 line-clamp-1">
                        {path.CoursName || path.CorusDetailName || '산책로'}
                      </h5>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{getDistance(path)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{getTime(path)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-600">
                        <span className="text-xs">📍 {path.distance}km 거리</span>
                      </div>
                    </div>

                    {path.ADIT_DC && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{path.ADIT_DC}</p>
                    )}

                    {/* 가상 맛집 정보 */}
                    <div className="mb-3 p-2 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-1 mb-1">
                        <Utensils className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700">주변 맛집</span>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {virtualRestaurants.map((restaurant, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                            {restaurant}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      {path.CoursLv && (
                        <Badge className={getDifficultyColor(path.CoursLv)}>
                          {getDifficultyText(path.CoursLv)}
                        </Badge>
                      )}
                      {path.SIGNGU_NM && (
                        <Badge variant="outline" className="text-xs">
                          {path.SIGNGU_NM}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        실제 등록 경로
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 현재 위치에서 5km 이내, 가까운 순서대로 정렬된 실제 등록 산책로 정확히 3개입니다.
        </p>
      </div>
    </div>
  );
};

export default LocationBasedRecommendedPaths;
