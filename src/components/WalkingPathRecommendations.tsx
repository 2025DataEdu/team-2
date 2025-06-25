
import React, { useState, useEffect } from 'react';
import WalkingPathCard from './WalkingPathCard';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

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
}

interface UserProfile {
  age: number;
  fitnessLevel: string;
  preferredDistance: number[];
  healthConditions: string;
  walkingGoal: string;
}

interface WalkingPathRecommendationsProps {
  userProfile: UserProfile;
  onPathSelect: (path: WalkingPath) => void;
}

const WalkingPathRecommendations = ({ userProfile, onPathSelect }: WalkingPathRecommendationsProps) => {
  const [recommendedPaths, setRecommendedPaths] = useState<WalkingPath[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateRecommendations = () => {
    setIsLoading(true);
    
    // AI 기반 맞춤형 추천 로직 (실제 환경에서는 백엔드 AI 서비스 연동)
    setTimeout(() => {
      const basePaths: WalkingPath[] = [
        {
          id: '1',
          name: '한강공원 여의도 코스',
          distance: userProfile.preferredDistance[0],
          duration: Math.round(userProfile.preferredDistance[0] * 15),
          difficulty: userProfile.fitnessLevel === 'beginner' ? 'easy' : 'medium',
          elevation: 5,
          rating: 4.5,
          features: ['강변', '야경', '자전거도로'],
          description: '한강을 따라 걷는 평평한 코스로 초보자에게 적합합니다. 아름다운 강변 풍경을 감상할 수 있습니다.',
          amenities: ['화장실', '편의점', '카페', '주차장']
        },
        {
          id: '2',
          name: '남산 둘레길',
          distance: userProfile.preferredDistance[0] * 1.2,
          duration: Math.round(userProfile.preferredDistance[0] * 18),
          difficulty: userProfile.fitnessLevel === 'advanced' ? 'medium' : 'hard',
          elevation: 45,
          rating: 4.7,
          features: ['숲길', '역사', '전망대'],
          description: '서울의 중심에서 자연을 만끽할 수 있는 숲길 코스입니다. 약간의 경사가 있어 운동 효과가 좋습니다.',
          amenities: ['화장실', '휴게소', '전망대', '문화시설']
        },
        {
          id: '3',
          name: '청계천 산책로',
          distance: userProfile.preferredDistance[0] * 0.8,
          duration: Math.round(userProfile.preferredDistance[0] * 12),
          difficulty: 'easy',
          elevation: 0,
          rating: 4.2,
          features: ['도심', '야경', '문화'],
          description: '도심 속 시원한 물길을 따라 걷는 편안한 코스입니다. 접근성이 좋고 다양한 볼거리가 있습니다.',
          amenities: ['화장실', '음료수', '벤치', '조명']
        }
      ];

      // 사용자 프로필에 따른 맞춤형 필터링
      let filteredPaths = basePaths.filter(path => {
        if (userProfile.healthConditions.includes('무릎') && path.elevation > 30) return false;
        if (userProfile.fitnessLevel === 'beginner' && path.difficulty === 'hard') return false;
        return true;
      });

      // 목표에 따른 추가 정보 제공
      filteredPaths = filteredPaths.map(path => ({
        ...path,
        features: userProfile.walkingGoal === 'stress' 
          ? [...path.features, '힐링'] 
          : userProfile.walkingGoal === 'weight' 
          ? [...path.features, '칼로리소모'] 
          : path.features
      }));

      setRecommendedPaths(filteredPaths);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    generateRecommendations();
  }, [userProfile]);

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          🎯 맞춤형 산책로 추천
        </h2>
        <Button 
          onClick={generateRecommendations} 
          disabled={isLoading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
        <div className="text-sm text-green-800">
          <strong>AI 분석 결과:</strong> {userProfile.fitnessLevel === 'beginner' ? '초급자' : userProfile.fitnessLevel === 'intermediate' ? '중급자' : '고급자'} 수준의 
          {userProfile.preferredDistance[0]}km 코스를 선호하시는 분께 
          {userProfile.walkingGoal === 'health' ? '건강 증진' : 
           userProfile.walkingGoal === 'weight' ? '체중 관리' : 
           userProfile.walkingGoal === 'stress' ? '스트레스 해소' : '여가 활동'} 목적의 
          최적 경로를 추천합니다.
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedPaths.map((path) => (
            <WalkingPathCard 
              key={path.id} 
              path={path} 
              onSelect={onPathSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WalkingPathRecommendations;
