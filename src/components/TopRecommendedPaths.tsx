
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star } from 'lucide-react';

interface TopRecommendedPathsProps {
  title?: string;
}

const TopRecommendedPaths = ({ title = "추천 산책로 TOP 3" }: TopRecommendedPathsProps) => {
  // 상위 3개 추천 산책로 데이터
  const topPaths = [
    {
      id: '1',
      name: '한강공원 반포 코스',
      distance: 2.5,
      duration: 35,
      difficulty: 'easy',
      rating: 4.8,
      features: ['강변', '야경', '벤치'],
      description: '한강을 따라 걷는 평평한 코스로 야경이 아름답습니다.'
    },
    {
      id: '2', 
      name: '남산 둘레길 1코스',
      distance: 3.2,
      duration: 45,
      difficulty: 'medium',
      rating: 4.6,
      features: ['숲길', '전망대', '역사'],
      description: '서울 시내를 한눈에 볼 수 있는 전망이 좋은 숲길입니다.'
    },
    {
      id: '3',
      name: '청계천 산책로',
      distance: 1.8,
      duration: 25,
      difficulty: 'easy', 
      rating: 4.4,
      features: ['도심', '물길', '조명'],
      description: '도심 속 시원한 물길을 따라 걷는 편안한 코스입니다.'
    }
  ];

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
      default: return '정보없음';
    }
  };

  return (
    <div>
      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
        🚶‍♂️ {title}
      </h4>
      
      <div className="space-y-3">
        {topPaths.map((path, index) => (
          <Card key={path.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-medium text-blue-600">#{index + 1}</span>
                    <h5 className="font-medium text-gray-900">{path.name}</h5>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{path.distance}km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{path.duration}분</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{path.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{path.description}</p>
                  
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={getDifficultyColor(path.difficulty)}>
                      {getDifficultyText(path.difficulty)}
                    </Badge>
                    {path.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 이 추천 산책로들은 사용자 평점과 접근성을 고려하여 선정되었습니다.
        </p>
      </div>
    </div>
  );
};

export default TopRecommendedPaths;
