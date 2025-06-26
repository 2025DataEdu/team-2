import React from 'react';
import PathRecommendationHeader from './PathRecommendationHeader';
import AIAnalysisCard from './AIAnalysisCard';
import AIRecommendedPathGrid from './AIRecommendedPathGrid';
import { useAIRecommendedPaths } from '@/hooks/useAIRecommendedPaths';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { getWalkingSpeed } from '@/utils/exerciseRecommendation';

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
  selectedDifficulties: string[];
}

const WalkingPathRecommendations = ({ userProfile, onPathSelect, userLocation, selectedDifficulties }: WalkingPathRecommendationsProps) => {
  const { recommendedPaths, isLoading, generateRecommendations } = useAIRecommendedPaths({
    userProfile,
    userLocation
  });

  // 건강 프로필 가져오기
  const { healthProfile } = useHealthProfile();

  // 건강정보 기반 걷기 속도 계산
  const walkingSpeed = healthProfile ? getWalkingSpeed(healthProfile) : null;

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

      {/* 건강정보 기반 추천 속도 표시 */}
      {walkingSpeed && (
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
          <div className="text-sm text-green-800">
            <strong>💓 맞춤형 운동 가이드:</strong> {walkingSpeed.intensityKr} 강도로 
            걷기 {walkingSpeed.walkingSpeed}, 조깅 {walkingSpeed.joggingSpeed} 속도를 권장합니다.
            <br />
            <strong>목표 심박수:</strong> {walkingSpeed.heartRateRange.min}-{walkingSpeed.heartRateRange.max} BPM 
            ({walkingSpeed.recommendedPace})
          </div>
        </div>
      )}

      {/* AI 추천 경로 */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-green-700">
          🤖 AI 맞춤 추천 경로
        </h3>
        <AIRecommendedPathGrid 
          paths={recommendedPaths}
          isLoading={isLoading}
          onPathSelect={onPathSelect}
          selectedDifficulties={selectedDifficulties}
          walkingSpeed={walkingSpeed}
        />
      </div>
    </div>
  );
};

export default WalkingPathRecommendations;
