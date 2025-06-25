
import React, { useState } from 'react';
import { usePathRecommendations } from '@/hooks/usePathRecommendations';
import { useWalkingPaths } from '@/hooks/useWalkingPaths';
import WalkingPathCard from './WalkingPathCard';
import PathDetailModal from './PathDetailModal';
import PathRecommendationHeader from './PathRecommendationHeader';
import DifficultyFilter from './DifficultyFilter';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface UserProfile {
  age: number;
  fitnessLevel: string;
  preferredDistance: number[];
  healthConditions: string;
  walkingGoal: string;
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
  nearbyMarkets?: string[];
  latitude?: number;
  longitude?: number;
}

interface WalkingPathRecommendationsProps {
  userProfile: UserProfile;
  onPathSelect: (path: WalkingPath) => void;
  userLocation?: { latitude: number; longitude: number; address: string };
}

const WalkingPathRecommendations = ({ userProfile, onPathSelect, userLocation }: WalkingPathRecommendationsProps) => {
  const { recommendedPaths, isLoading } = usePathRecommendations({ userProfile, userLocation });
  const { traditionalMarkets } = useWalkingPaths(userLocation);
  const [selectedPath, setSelectedPath] = useState<WalkingPath | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // 거리 계산 함수
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // 근처 전통시장 찾기
  const findNearbyMarkets = (pathLat: number, pathLng: number, maxDistance = 3) => {
    return traditionalMarkets
      .filter(market => market.경위도X좌표 && market.경위도Y좌표)
      .map(market => {
        const distance = getDistance(
          pathLat, pathLng,
          market.경위도Y좌표!, market.경위도X좌표!
        );
        return { market: market.시장명!, distance };
      })
      .filter(item => item.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
      .map(item => item.market);
  };

  // 전통시장 정보가 포함된 추천 경로
  const enhancedPaths = recommendedPaths.map(path => {
    if (path.latitude && path.longitude) {
      const nearbyMarkets = findNearbyMarkets(path.latitude, path.longitude);
      return { ...path, nearbyMarkets };
    }
    return path;
  });

  const filteredPaths = enhancedPaths.filter(path => {
    if (difficultyFilter === 'all') return true;
    return path.difficulty === difficultyFilter;
  });

  const handleCardClick = (path: WalkingPath) => {
    setSelectedPath(path);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-gray-600">맞춤형 산책로를 추천하는 중...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PathRecommendationHeader />
      
      <DifficultyFilter 
        selectedDifficulty={difficultyFilter}
        onDifficultyChange={setDifficultyFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPaths.map((path) => (
          <WalkingPathCard
            key={path.id}
            path={path}
            onSelect={onPathSelect}
            onCardClick={handleCardClick}
          />
        ))}
      </div>

      <PathDetailModal
        path={selectedPath}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={onPathSelect}
      />
    </div>
  );
};

export default WalkingPathRecommendations;
