
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star } from 'lucide-react';
import { useLocationBasedPaths } from '@/hooks/useLocationBasedPaths';

interface LocationBasedRecommendedPathsProps {
  userLatitude: number;
  userLongitude: number;
  maxDistance: number;
  title?: string;
}

const LocationBasedRecommendedPaths = ({ 
  userLatitude, 
  userLongitude, 
  maxDistance, 
  title = "내 주변 추천 산책로 TOP 3" 
}: LocationBasedRecommendedPathsProps) => {
  const { nearbyPaths, isLoading, error } = useLocationBasedPaths({
    userLatitude,
    userLongitude,
    maxDistance,
    limit: 3
  });

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

  if (!nearbyPaths.length) {
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
        🚶‍♂️ {title} (5km 이내, 가까운 순)
      </h4>
      
      <div className="space-y-3">
        {nearbyPaths.map((path, index) => (
          <Card key={path.CoursCode} className="hover:shadow-md transition-shadow cursor-pointer">
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
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 현재 위치에서 5km 이내, 가까운 순서대로 정렬된 실제 등록 산책로입니다.
        </p>
      </div>
    </div>
  );
};

export default LocationBasedRecommendedPaths;
