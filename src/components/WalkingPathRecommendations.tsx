
import React from 'react';
import PathRecommendationHeader from './PathRecommendationHeader';
import AIAnalysisCard from './AIAnalysisCard';
import PathGrid from './PathGrid';
import RealPathGrid from './RealPathGrid';
import { usePathRecommendations } from '@/hooks/usePathRecommendations';
import { useRealPathData } from '@/hooks/useRealPathData';

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
  userLocation?: { latitude: number; longitude: number; address: string };
}

const WalkingPathRecommendations = ({ userProfile, onPathSelect, userLocation }: WalkingPathRecommendationsProps) => {
  const { recommendedPaths, isLoading, generateRecommendations } = usePathRecommendations({
    userProfile,
    userLocation
  });

  const { paths: realPaths, isLoading: isRealPathsLoading, error: realPathsError } = useRealPathData();

  return (
    <div className="w-full space-y-6">
      <PathRecommendationHeader 
        onRefresh={generateRecommendations}
        isLoading={isLoading}
      />

      <AIAnalysisCard 
        userProfile={userProfile}
        userLocation={userLocation}
      />

      {/* AI 추천 경로 */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-green-700">🤖 AI 맞춤 추천 경로</h3>
        <PathGrid 
          paths={recommendedPaths}
          isLoading={isLoading}
          onPathSelect={onPathSelect}
        />
      </div>

      {/* 실제 산책로 데이터 */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-blue-700">🗺️ 주변 실제 산책로</h3>
        {realPathsError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">데이터를 불러오는 중 오류가 발생했습니다: {realPathsError}</p>
          </div>
        ) : (
          <RealPathGrid 
            paths={realPaths}
            isLoading={isRealPathsLoading}
            onPathSelect={onPathSelect}
          />
        )}
      </div>
    </div>
  );
};

export default WalkingPathRecommendations;
